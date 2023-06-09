#! /usr/bin/env node

const { Command } = require('commander');
const figlet = require('figlet');
const fs = require('fs');
const path = require('path');
const { Kite } = require('xkite-core');
const { default_ports } = require('xkite-core');
const pjson = require('../package.json');

import type {
  KiteConfig,
  KiteState,
  MAX_NUMBER_OF_BROKERS,
  MAX_NUMBER_OF_ZOOKEEPERS,
} from 'xkite-core';

const program = new Command();

// ASCII ART
console.log(figlet.textSync('xkite'));

program
  .version(pjson.version)
  .description('CLI for xkite, an Apache Kafka Prototype and Test Tool')
  .option(
    '-s, --server <server:port>',
    'connect to an xkite server: i.e xkite-cli -s http://localhost:3000'
  ) //
  .option('-i, --input <value>', 'Input configuration file for xkite') // file
  .option(
    '-b, --broker <# of brokers> <# of replicas> <port1,...,portn> <1 = enable jmx>',
    'Kafka broker setup (default to 1 if not chosen)'
  )
  .option(
    '-z, --zookeeper <# of zookeepers> <port1,...,portn>',
    'Zookeeper setup (default to 1 if not chosen)'
  )
  .option(
    '-db, --database <type: ksql | postgresql> <port>',
    'Creates Source Database (default none if not chosen)'
  )
  .option(
    '-sk, --sink <type: jupyter | spark> <port>',
    'Creates Sink at specified port (default none if not chosen)'
  )
  .option(
    '-gr, --grafana <port>',
    'Creates Grafana instance at specified port (default none if not chosen'
  )
  .option(
    '-pr, --prometheus <port> <scrape_interval> <evaluation_interval>',
    'Creates Prometheus instance at specified port with settings for scrape and eval interval (in seconds)'
  )
  .option(
    '-o, --output <value>',
    'Output directory for package.zip for current configuration'
  ) //default to current dir
  .option('-r --run ', 'Runs configured docker instances') // either deploy or unpause
  .option('-p --pause ', 'Pauses active docker instances')
  .option(
    '-q --quit ',
    'Shuts down all docker instances and removes associated container/volumes'
  )
  .parse(process.argv);

const options = program.opts();

// Option functions
let config: KiteConfig;
const selectedPorts = new Set<number>();
function readInputFile(filepath: string) {
  try {
    const file = fs.readFileSync(filepath, 'utf-8');
    config = JSON.parse(file) as KiteConfig;
  } catch (error) {
    console.error('Error occurred while reading input file!', error);
  }
}

function configureBrokers(n: string, r: string, ports: string, jmxEn?: string) {
  try {
    if (n === undefined) throw TypeError('missing');
    let brokerPorts: number[];
    if (ports.search(',') >= 0)
      brokerPorts = ports.split(',').map((p) => Number(p));
    else brokerPorts = [Number(ports)];
    const nBrokers = Number(n);
    const max: MAX_NUMBER_OF_BROKERS = 50;
    if (nBrokers > max)
      throw TypeError(`Number of Brokers (${nBrokers}) exceeds ${max}`);
    const nReplicas = Number(r) <= nBrokers ? Number(r) : nBrokers;

    let newCfg: KiteConfig = {
      kafka: {
        brokers: {
          size: nBrokers,
          replicas: nReplicas ?? nBrokers,
          ports: {
            brokers: brokerPorts,
          },
        },
        zookeepers: {
          //default
          size: 1,
          ports: {
            client: [default_ports.zookeeper.client.external],
          },
        },
      },
    };
    if (jmxEn === '1') configureJMX();

    config = Object.assign({}, config, newCfg);
  } catch (error) {
    console.error('Error while configuring brokers for kite!', error);
  }
}

function configureJMX(ports?: string) {
  try {
    if (config === undefined || config.kafka === undefined)
      configureBrokers('2', '2', '9092,9093');
    const newCfg: KiteConfig = {
      ...config,
      kafka: {
        ...config.kafka,
        jmx: {
          ports: new Array(config.kafka.brokers.size).fill(
            default_ports.jmx.external
          ),
        },
      },
    };
    config = Object.assign({}, config, newCfg);
  } catch (error) {
    console.error('Error while configuring JMX for kite!', error);
  }
}

function configureZookeepers(n: string, ports?: string) {
  try {
    if (n === undefined) throw TypeError('missing');
    let zkPorts: number[] | undefined;
    if (ports !== undefined) {
      if (ports.search(',') >= 0)
        zkPorts = ports.split(',').map((p) => Number(p));
      else zkPorts = [Number(ports)];
    }
    const nZk = Number(n);
    const max: MAX_NUMBER_OF_ZOOKEEPERS = 1000;
    if (nZk > max) throw TypeError(`Number of Brokers (${nZk}) exceeds ${max}`);
    if (config === undefined || config.kafka === undefined)
      configureBrokers('2', '2', '9092,9093');
    const newCfg = {
      ...config,
      kafka: {
        ...config.kafka,
        zookeepers: {
          ...config.kafka.zookeepers,
          size: nZk,
          ports: {
            client:
              zkPorts ??
              new Array(nZk).fill(default_ports.zookeeper.client.external),
          },
        },
      },
    };
    config = Object.assign({}, config, newCfg);
  } catch (error) {
    console.error('Error while configuring zookeeper for kite!', error);
  }
}

function configureDB(name: string, port?: string) {
  try {
    if (name === undefined) throw TypeError('missing');
    if (config === undefined || config.kafka === undefined)
      configureBrokers('2', '2', '9092,9093');
    config = {
      ...config,
      db: {
        ...config.db,
        name: name === 'ksql' ? name : 'postgresql',
        port:
          name === 'ksql'
            ? port !== undefined
              ? Number(port)
              : default_ports.ksql.external
            : port !== undefined
            ? Number(port)
            : default_ports.postgresql.external,
        kafkaconnect: {
          port: default_ports.kafkaconnect_src.external,
        },
      },
    };
  } catch (error) {
    console.error('Error while configuring db for kite!', error);
  }
}

function configureSink(name: string, port?: string) {
  try {
    if (name === undefined) throw TypeError('missing');
    if (config === undefined || config.kafka === undefined)
      configureBrokers('2', '2', '9092,9093');

    config = {
      ...config,
      sink: {
        ...config.sink,
        name: name === 'spark' ? name : 'jupyter',
        port:
          name === 'spark'
            ? port !== undefined
              ? Number(port)
              : default_ports.spark.webui.external
            : port !== undefined
            ? Number(port)
            : default_ports.jupyter.external,
        kafkaconnect: {
          port: default_ports.kafkaconnect_sink.external,
        },
      },
    };
  } catch (error) {
    console.error('Error while configuring db for kite!', error);
  }
}

function configureGrafana(port?: string) {
  try {
    if (config === undefined || config.prometheus === undefined)
      configurePrometheus();
    config = {
      ...config,
      grafana: {
        ...config.grafana,
        port:
          port !== undefined ? Number(port) : default_ports.grafana.external,
      },
    };
  } catch (error) {
    console.error('Error while configuring grafana for kite!', error);
  }
}

function configureSpring(port?: string) {
  try {
    if (config === undefined || config.kafka === undefined)
      configureBrokers('2', '2', '9092,9093', '1');
    config = {
      ...config,
      kafka: {
        ...config.kafka,
        spring: {
          port:
            port !== undefined ? Number(port) : default_ports.spring.external,
        },
      },
    };
  } catch (error) {
    console.error('Error while configuring spring for kite!', error);
  }
}

function configurePrometheus(port?: string, _scrape?: string, _eval?: string) {
  try {
    if (config === undefined || config.kafka === undefined) {
      configureBrokers('2', '2', '9092,9093', '1');
    }
    if (config.kafka.jmx === undefined) {
      configureJMX();
    }
    configureSpring();
    config = {
      ...config,
      prometheus: {
        ...config.prometheus,
        port:
          port !== undefined ? Number(port) : default_ports.prometheus.external,
        scrape_interval: _scrape !== undefined ? Number(_scrape) : 10,
        evaluation_interval: _eval !== undefined ? Number(_eval) : 5,
      },
    };
  } catch (error) {
    console.error('Error while configuring grafana for kite!', error);
  }
}

async function connect(server: string) {
  try {
    await Kite.configure(server);
  } catch (error) {
    console.error('Error while configuring kite!', error);
  }
}

async function configure() {
  try {
    if (config === undefined)
      console.log('No configuration provided, using default');
    await Kite.configure(config);
  } catch (error) {
    console.error('Error while configuring kite!', error);
  }
}

async function output(filepath?: string) {
  try {
    const pkg = await Kite.getPackageBuild();
    if (filepath !== undefined)
      fs.writeFileSync(
        path.resolve(filepath, 'package.zip'),
        Buffer.from(pkg.fileStream)
      );
    else
      fs.writeFileSync(
        path.resolve(__dirname, 'package.zip'),
        Buffer.from(pkg.fileStream)
      );
    // }
  } catch (error) {
    console.error('Error while writing package.zip from kite!', error);
  }
}

async function run() {
  try {
    if (((await Kite.getKiteState()) as KiteState) === 'Paused')
      await Kite.unpause();
    else await Kite.deploy();
  } catch (error) {
    console.error('Error while running kite!', error);
  }
}

async function pause() {
  try {
    await Kite.pause();
  } catch (error) {
    console.error('Error while running kite!', error);
  }
}

async function quit() {
  try {
    await Kite.shutdown();
  } catch (error) {
    console.error('Error while running kite!', error);
  }
}

async function main() {
  if (options.server) {
    await connect(options.server);
    console.log(`Kite remote server state = ${Kite.getKiteServerState()}`);
  }
  if (options.input) {
    // using a file + cmd line
    readInputFile(options.input);
    configOptions();
    await configure();
  } else if (configOptions()) {
    //cmd line configuration
    await configure();
  }
  // can only run one of the following at a time
  if (options.quit) {
    await quit();
  } else if (options.run) {
    await run();
  } else if (options.pause) {
    await pause();
  }
  if (options.output) {
    await output(options.output);
  }
}

function findOptions(str: string, longStr: string) {
  let startIdx = -1;
  let endIdx = -1;
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === str || process.argv[i] === longStr) {
      let j = i + 1;
      startIdx = j;
      endIdx = j;
      while (j < process.argv.length && process.argv[j].search('-') !== 0) {
        endIdx = ++j;
      }
      break;
    }
  }
  return process.argv.slice(startIdx, endIdx);
}

function configOptions(): boolean {
  let configure = false;
  if (options.broker) {
    configure = true;
    const args = findOptions('-b', '--broker');
    // console.log(args);
    configureBrokers(args[0], args[1], args[2], args[3]);
  }
  if (options.zookeeper) {
    configure = true;
    const args = findOptions('-z', '--zookeeper');
    // console.log(args);
    configureZookeepers(args[0], args[1]);
  }
  if (options.database) {
    configure = true;
    const args = findOptions('-db', '--database');
    // console.log(args);
    configureDB(args[0], args[1]);
  }
  if (options.sink) {
    configure = true;
    const args = findOptions('-sk', '--sink');
    // console.log(args);
    configureSink(args[0], args[1]);
  }
  if (options.grafana) {
    configure = true;
    const args = findOptions('-gr', '--grafana');
    // console.log(args);
    configureGrafana(args[0]);
  }
  if (options.prometheus) {
    configure = true;
    const args = findOptions('-pr', '--prometheus');
    // console.log(args);
    configurePrometheus(args[0], args[1], args[2]);
  }

  return configure;
}

main();
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
