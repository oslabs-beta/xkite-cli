# xkite-cli ![version](https://img.shields.io/badge/version-1.0.5-blue.svg) ![license](https://img.shields.io/badge/license-MIT-blue.svg)

<div align="center">
    <a href="https://xkite.io/">
        <img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social" />
    </a>
</div>

Command Line Interface for xkite, a Kafka Integrated Testing Environment. Another tool in the xkite library to give the user flexibility and control over their Kafka ecosystem.

- Easy to use Command Line Interface (CLI) to interact with the xkite-core library. It’s a simple alternative to the full xkite GUI, meant to provide users with the ability to automate their testing using scripts.
- Configure a custom docker ecosystem using command line inputs or a <code>config.json</code> file, deploy, pause/ unpause, shutdown, and remove containers and volumes.
- Download the docker ecosystem configuration (package.zip) containing the docker-compose.yml file and dependencies in order to deploy their ecosystem on a cloud instance/remote server by simply running docker-compose up.
- Acts as a remote client to interface with the xkite GUI server. The user can perform all the aforementioned functions provided remotely on the xkite GUI server by providing the URL as a configuration input.
- More granular control over which docker images they choose to deploy (something that is not configurable currently with the xkite GUI).

# Dependencies

- Latest stable versions of Node.js and NPM installed
- Latest stable version of <a href="https://docs.docker.com/compose/install/">docker-compose</a> installed.
- Clone repository: <code>git clone https://github.com/oslabs-beta/xkite-cli.git</code>
- Install dependencies: Run <code>npm install</code> inside the project folder

# Quickstart

To install the <code>xkite-cli</code> into your environment just simply run the following command:

```sh
  $ npx create-xkite-cli <directory-name>
```

After the installation is complete, you will be able to run <code>xkite-cli</code> as follows:

```sh
  $ xkite-cli
```

# How It Works

The xkite-cli interfaces with the xkite-core library allowing the user to configure a YAML file, managing docker containers (configure, run, pause, and shutdown), interfacing with remote xkite servers, and providing configuration settings for users to easily connect to their Kafka instances for development purposes.

To learn more about xkite-core please follow the link: <a href="https://github.com/oslabs-beta/xkite-core">xkite-core library</a>

# xkite-cli Options

Click to expand details.

</details>

<details><summary><b>-h | --help</b></summary>

Displays all the valid options for xkite-cli utility.

```sh
$ xkite-cli --help
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Usage: xkite-cli [options]

CLI for xkite, an Apache Kafka Prototype and Test Tool

Options:
  -V, --version                                                                   output the version number
  -s, --server <server:port>                                                      connect to an xkite server: i.e xkite-cli -s http://localhost:3000
  -i, --input <value>                                                             Input configuration file for xkite
  -b, --broker <# of brokers> <# of replicas> <port1,...,portn> <1 = enable jmx>  Kafka broker setup (default to 1 if not chosen)
  -z, --zookeeper <# of zookeepers> <port1,...,portn>                             Zookeeper setup (default to 1 if not chosen)
  -db, --database <type: ksql | postgresql> <port>                                Creates Source Database (default none if not chosen)
  -sk, --sink <type: jupyter | spark> <port>                                      Creates Sink at specified port (default none if not chosen)
  -gr, --grafana <port>                                                           Creates Grafana instance at specified port (default none if not chosen
  -pr, --prometheus <port> <scrape_interval> <evaluation_interval>                Creates Prometheus instance at specified port with settings for scrape and eval interval (in seconds)
  -r --run                                                                        Runs configured docker instances
  -p --pause                                                                      Pauses active docker instances
  -q --quit                                                                       Shuts down all docker instances and removes associated container/volumes
  -h, --help                                                                      display help for command
```

</details>

<details><summary><b>-V | --version</b></summary>

Displays the version of xkite-cli utility.

```sh
$ xkite-cli -V
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

1.0.5
```

</details>

<details><summary><b>-s | --server server:port </b></summary>

Connect to a remote xkite instance such as xkite-GUI.

```sh
$ xkite-cli -s http://localhost:3000
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

 Kite remote server state = Connected
```

</details>

<details><summary><b>-i | --input < cfg.json > </b></summary>

Configure a local instance of Kite using the input cfg.json. Note: an example file can be found under the reference directory.

Click to expand details.

<details><summary><b>cfg.json Format </b></summary>
Not all fields are required, those that are not are tagged as optional below. The user may choose to not inlude the optional fields for their application's needs. For more details on the KiteConfig format please see the <a href="https://github.com/oslabs-beta/xkite-core">xkite-core library</a>.

```
{
  "kafka": {
    "brokers": {
      "size": 2,
      "id": [101, 102], //optional - broker id
      "replicas": 2, //optional - number of replicas
      "ports": { //optional
        "brokers": [9092, 9093], // optional - external broker ports
        "metrics": 29092, // optional - confluent metric interface on docker net
        "jmx": [9991, 9992]; // optional - broker interface with jmx on docker net
      };
    };
    "zookeepers": {
      "size": 1;
      "ports": { //optional
        "peer": { //optional
          //does not need to be configurable, docker net only
          "internal": 2888, //optional
          "external": 3888, //optional
        };
        "client": [2181], //optional - external interface with zookeeper
      };
    };
    "jmx": { //optional
      "ports": [5566, 5567], //optional - external host port to interface with port
    };
    "spring": { //optional
      "port": 8080; //optional - external host port to interface with 8080
    };
  },
  "db": { // optional
    "name": "ksql", // either "ksql" or "postgres"
    "port": 8088, //optional - external port
    "postgresql": { // optional
      "username": "ADMIN",
      "password": "ADMIN",
      "dbname": "xkiteDB",
    };
    "ksql": { // optional
      "schema_port": 8180, //optional
    };
    "kafkaconnect": { //optional
      "port": 9000,
    };
  },
  "sink": { //optional
    "name": "spark", // either 'jupyter' | 'spark';
    "port": 9191, //optional - external webgui interface port
    "rpc_port": 7077, //optional
    "kafkaconnect": { //optional
      "port": 9001, // optional
    };
  },
  "grafana": { //optional
    "port": 3050, //optional
  },
  "prometheus": { //optional
    "port": 9090, //optional
    "scrape_interval": 10, //optional - seconds
    "evaluation_interval": 5, //optional - seconds
  },
}
```

</details>

<b>Example:</b>

```sh
$ xkite-cli -i reference/cfg.json
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Configuring docker instances...
creating Kite Config yml...
creating zookeepers...
creating brokers...
yaml configuration complete...
```

</details>

<details><summary><b>-r | --run </b></summary>

Deploys or unpauses the configured xkite instance depending on the Kite state. If the configuration is pointing to a remote server instance of xkite, it will be run on the remote server.

<details><summary><b>Example of deploying --></b></summary>

```sh
$ xkite-cli -r
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Deploying docker instances...
deploying docker containers...
Building with native build. Learn about native build in Compose here: https://docs.docker.com/go/compose-native-build/
Creating network "download_default" with the default driver
Creating volume "download_jupyterhub_data" with local driver
Creating volume "download_dashboards" with local driver
Creating volume "download_provisioning" with local driver
Creating volume "download_postgresql" with local driver
Creating postgresql ...
Creating prometheus ...
Creating zookeeper2 ...
Creating spark      ...
Creating zookeeper1 ...
Creating spark      ... done
Creating prometheus ... done
Creating grafana    ...
Creating postgresql ... done
Creating zookeeper2 ... done
Creating zookeeper1 ... done
Creating kafka2     ...
Creating kafka1     ...
Creating grafana    ... done
Creating kafka1     ... done
Creating jmx-kafka1 ...
Creating kafka2     ... done
Creating spring     ...
Creating kafka_connect_sink ...
Creating kafka_connect_src  ...
Creating jmx-kafka2         ...
Creating jmx-kafka2         ... done
Creating spring             ... done
Creating jmx-kafka1         ... done
Creating kafka_connect_sink ... done
Creating kafka_connect_src  ... done
$
```

</details>

<details><summary><b>Example of unpausing --></b></summary>

```sh
$ xkite-cli -r
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Unpausing all docker instances...
Unpausing postgresql ...
Unpausing postgresql ... done
Unpausing kafka_connect_src ...
Unpausing kafka_connect_src ... done
Unpausing kafka_connect_sink ...
Unpausing kafka_connect_sink ... done
Unpausing spark ...
Unpausing spark ... done
Unpausing prometheus ...
Unpausing prometheus ... done
Unpausing grafana ...
Unpausing grafana ... done
Unpausing zookeeper1 ...
Unpausing zookeeper1 ... done
Unpausing zookeeper2 ...
Unpausing zookeeper2 ... done
Unpausing kafka1 ...
Unpausing kafka1 ... done
Unpausing jmx-kafka1 ...
Unpausing jmx-kafka1 ... done
Unpausing kafka2 ...
Unpausing kafka2 ... done
Unpausing jmx-kafka2 ...
Unpausing jmx-kafka2 ... done
Unpausing spring ...
Unpausing spring ... done
$
```

</details>

</details>

<details><summary><b>-p | --pause </b></summary>

Deploys or unpauses the configured xkite instance depending on the Kite state. If the configuration is pointing to a remote server instance of xkite, it will be run on the remote server.

<b>Example of pausing</b>

```sh
$ xkite-cli -p
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Pausing all docker instances...
Pausing postgresql ...
Pausing postgresql ... done
Pausing kafka_connect_src ...
Pausing kafka_connect_src ... done
Pausing kafka_connect_sink ...
Pausing kafka_connect_sink ... done
Pausing spark ...
Pausing spark ... done
Pausing prometheus ...
Pausing prometheus ... done
Pausing grafana ...
Pausing grafana ... done
Pausing zookeeper1 ...
Pausing zookeeper1 ... done
Pausing zookeeper2 ...
Pausing zookeeper2 ... done
Pausing kafka1 ...
Pausing kafka1 ... done
Pausing jmx-kafka1 ...
Pausing jmx-kafka1 ... done
Pausing kafka2 ...
Pausing kafka2 ... done
Pausing jmx-kafka2 ...
Pausing jmx-kafka2 ... done
Pausing spring ...
Pausing spring ... done
$
```

</details>

<details><summary><b>-q | --quit</b></summary>

Shuts down any running xkite instances and removes all the associated container and volumes. If the configuration is pointing to a remote server instance of xkite, it will be run on the remote server.

```sh
$ xkite-cli -q
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Shutting down docker instances and removing volumes...
Stopping spring             ...
Stopping jmx-kafka2         ...
Stopping kafka_connect_src  ...
Stopping kafka_connect_sink ...
Stopping jmx-kafka1         ...
Stopping kafka2             ...
Stopping kafka1             ...
Stopping grafana            ...
Stopping prometheus         ...
Stopping zookeeper1         ...
Stopping spark              ...
Stopping zookeeper2         ...
Stopping postgresql         ...
Stopping grafana            ... done
Stopping postgresql         ... done
Stopping spring             ... done
Stopping prometheus         ... done
Stopping jmx-kafka2         ... done
Stopping jmx-kafka1         ... done
Stopping kafka_connect_sink ... done
Stopping kafka_connect_src  ... done
Stopping kafka2             ... done
Stopping spark              ... done
Stopping kafka1             ... done
Stopping zookeeper2         ... done
Stopping zookeeper1         ... done
Removing spring             ...
Removing jmx-kafka2         ...
Removing kafka_connect_src  ...
Removing kafka_connect_sink ...
Removing jmx-kafka1         ...
Removing kafka2             ...
Removing kafka1             ...
Removing grafana            ...
Removing prometheus         ...
Removing zookeeper1         ...
Removing spark              ...
Removing zookeeper2         ...
Removing postgresql         ...
Removing jmx-kafka1         ... done
Removing jmx-kafka2         ... done
Removing spark              ... done
Removing grafana            ... done
Removing spring             ... done
Removing kafka2             ... done
Removing prometheus         ... done
Removing kafka_connect_src  ... done
Removing kafka1             ... done
Removing kafka_connect_sink ... done
Removing postgresql         ... done
Removing zookeeper2         ... done
Removing zookeeper1         ... done
Removing network download_default
Removing volume download_jupyterhub_data
Removing volume download_dashboards
Removing volume download_provisioning
Removing volume download_postgresql
$
```

</details>

<details><summary><b>-o | --output < directory_path > </b></summary>

Provides the package.zip file containing the configuration needed to deploy the docker ecosystem on a cloud or external server instance. If the configuration is pointing to a remote server instance of xkite, it will be retrieved from the remote server.

```sh
$ xkite-cli -o .
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Getting package build zip...
$ ls package.zip  -lth
-rw-rw-r-- 1 user user 69M Mar 15 13:47 package.zip
$ unzip -l package.zip
Archive:  package.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
        0  2023-03-15 13:47   config/
    10605  2023-03-15 13:47   config/cfg.json
     8736  2023-03-15 13:47   docker-compose.yml
        0  2023-03-15 13:47   grafana/
        0  2023-03-15 13:47   grafana/dashboards/
   117425  2023-03-15 13:47   grafana/dashboards/kafka-metrics_rev4.json
        0  2023-03-15 13:47   grafana/provisioning/
        0  2023-03-15 13:47   grafana/provisioning/dashboards/
      869  2023-03-15 13:47   grafana/provisioning/dashboards/metrics.yaml
        0  2023-03-15 13:47   grafana/provisioning/datasources/
     1532  2023-03-15 13:47   grafana/provisioning/datasources/datasource.yaml
        0  2023-03-15 13:47   jmx/
        0  2023-03-15 13:47   jmx/exporter/
    24808  2023-03-15 13:47   jmx/exporter/template.yml
    15914  2023-03-15 13:47   jmx/jmxConfigKafka1.yml
    15914  2023-03-15 13:47   jmx/jmxConfigKafka2.yml
        0  2023-03-15 13:47   kafkaconnect/
      152  2023-03-15 13:47   kafkaconnect/Dockerfile
      540  2023-03-15 13:47   kafkaconnect/README.md
        0  2023-03-15 13:47   ksql/
     2534  2023-03-15 13:47   ksql/testscript.sql
        0  2023-03-15 13:47   postgresql/
     1338  2023-03-15 13:47   postgresql/init.sql
        0  2023-03-15 13:47   prometheus/
      227  2023-03-15 13:47   prometheus/prometheus.yml
        0  2023-03-15 13:47   spring/
 75383987  2023-03-15 13:47   spring/app.jar
      755  2023-03-15 13:47   spring/application.yml
---------                     -------
 75585336                     28 files
```

</details>

<details><summary><b>-b | --broker <# of brokers> <# of replicas> < port1,...,portn > < 1 = enable jmx ></b></summary>

Creates a configuration of Kafka brokers as defined in the the input arguments. If no zookeeper configuration is added, it will default to only one zookeeper container. See example below:

```sh
$ xkite-cli -b 2 2 9092,9093
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Configuring docker instances...
creating Kite Config yml...
creating zookeepers...
creating brokers...
yaml configuration complete...
$ xkite-cli -r
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Deploying docker instances...
deploying docker containers...
Building with native build. Learn about native build in Compose here: https://docs.docker.com/go/compose-native-build/
Creating network "download_default" with the default driver
Creating volume "download_jupyterhub_data" with local driver
Creating volume "download_dashboards" with local driver
Creating volume "download_provisioning" with local driver
Creating zookeeper1 ...
Creating zookeeper1 ... done
Creating kafka2     ...
Creating kafka1     ...
Creating kafka2     ... done
Creating kafka1     ... done
docker deployment successful

```

</details>

<details><summary><b>-z | --zookeeper <# of zookeepers> < port1,...,portn ></b></summary>

Creates a configuration of Kafka Zookeepers as defined in the the input arguments. If no broker configuration is added, it will default to using two broker containers. See example below:

```sh
$ xkite-cli -z 2 2181,2182
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Configuring docker instances...
creating Kite Config yml...
creating zookeepers...
creating brokers...
yaml configuration complete...
$ xkite-cli -r
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Deploying docker instances...
deploying docker containers...
Building with native build. Learn about native build in Compose here: https://docs.docker.com/go/compose-native-build/
Creating network "download_default" with the default driver
Creating volume "download_jupyterhub_data" with local driver
Creating volume "download_dashboards" with local driver
Creating volume "download_provisioning" with local driver
Creating zookeeper1 ...
Creating zookeeper1 ... done
Creating zookeeper1 ... done
Creating zookeeper2 ... done
Creating kafka2     ...
Creating kafka1     ...
Creating kafka2     ... done
Creating kafka1     ... done
docker deployment successful

```

</details>

<details><summary><b>-z | --zookeeper <# of zookeepers> < port1,...,portn ></b></summary>

Creates a configuration of Kafka Zookeepers as defined in the the input arguments. If no broker configuration is added, it will default to using two broker containers. See example below:

```sh
$ xkite-cli -z 2 2181,2182
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Configuring docker instances...
creating Kite Config yml...
creating zookeepers...
creating brokers...
yaml configuration complete...
$ xkite-cli -r
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Deploying docker instances...
deploying docker containers...
Building with native build. Learn about native build in Compose here: https://docs.docker.com/go/compose-native-build/
Creating network "download_default" with the default driver
Creating volume "download_jupyterhub_data" with local driver
Creating volume "download_dashboards" with local driver
Creating volume "download_provisioning" with local driver
Creating zookeeper1 ...
Creating zookeeper1 ... done
Creating zookeeper1 ... done
Creating zookeeper2 ... done
Creating kafka2     ...
Creating kafka1     ...
Creating kafka2     ... done
Creating kafka1     ... done
docker deployment successful

```

</details>

<details><summary><b>-sk | --sink < type: jupyter | spark > < port > </b></summary>

Creates a configuration with the sink provided. The sink can be either 'jupyter' or 'spark' at this time. If no Broker or Zookeepers are defined in the the input arguments. A default or two brokers and one zookeeper containers will be used. See example below:

```sh
$ xkite-cli -sk jupyter
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Configuring docker instances...
creating Kite Config yml...
creating zookeepers...
creating brokers...
yaml configuration complete...
$ xkite-cli -r
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Deploying docker instances...
deploying docker containers...
Building with native build. Learn about native build in Compose here: https://docs.docker.com/go/compose-native-build/
Creating network "download_default" with the default driver
Creating volume "download_jupyterhub_data" with local driver
Creating volume "download_dashboards" with local driver
Creating volume "download_provisioning" with local driver
Pulling jupyter (jupyterhub/jupyterhub:)...
latest: Pulling from jupyterhub/jupyterhub
Digest: sha256:0d20df5083b3bc200c143fa1cef61fd11a103f1e8f5324a6c34bc77b97a22bba
Status: Downloaded newer image for jupyterhub/jupyterhub:latest
Creating zookeeper1 ...
Creating jupyter    ...
Creating jupyter    ... done
Creating zookeeper1 ... done
Creating kafka1     ...
Creating kafka2     ...
Creating kafka2     ... done
Creating kafka1     ... done
Creating kafka_connect_sink ...
Creating kafka_connect_sink ... done
docker deployment successful
```

</details>

<details><summary><b>-db | --database < type: ksql | postgresql > < port > </b></summary>

Creates a configuration with the database source provided. The souce can be either 'ksql' or 'postgresql' at this time. If no Broker or Zookeepers are defined in the the input arguments. A default or two brokers and one zookeeper containers will be used. See example below:

```sh
$ xkite-cli -db ksql
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Configuring docker instances...
creating Kite Config yml...
creating zookeepers...
creating brokers...
yaml configuration complete...
$ xkite-cli -r
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Deploying docker instances...
deploying docker containers...
Building with native build. Learn about native build in Compose here: https://docs.docker.com/go/compose-native-build/
Creating network "download_default" with the default driver
Creating volume "download_jupyterhub_data" with local driver
Creating volume "download_dashboards" with local driver
Creating volume "download_provisioning" with local driver
Pulling ksql (confluentinc/ksqldb-server:)...
latest: Pulling from confluentinc/ksqldb-server

```

</details>

<details><summary><b>-gr | --grafana < port > </b></summary>

Creates a configuration with a grafana container at external port provided. If no Broker or Zookeepers are defined in the the input arguments it will use two brokers, one zookeeper, a prometheus, a spring and a JMX instances for the configuration. See example below:

```sh
$ xkite-cli -gr 3050
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Configuring docker instances...
creating Kite Config yml...
creating zookeepers...
creating brokers...
yaml configuration complete...
$ xkite-cli -r
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Deploying docker instances...
deploying docker containers...
Building with native build. Learn about native build in Compose here: https://docs.docker.com/go/compose-native-build/
Creating network "download_default" with the default driver
Creating volume "download_jupyterhub_data" with local driver
Creating volume "download_dashboards" with local driver
Creating volume "download_provisioning" with local driver
Creating prometheus ...
Creating zookeeper1 ...
Creating prometheus ... done
Creating grafana    ...
Creating zookeeper1 ... done
Creating kafka1     ...
Creating kafka2     ...
Creating grafana    ... done
Creating kafka2     ... done
Creating kafka1     ... done
Creating jmx-kafka2 ...
Creating jmx-kafka1 ...
Creating spring     ...
Creating jmx-kafka2 ... done
Creating spring     ... done
Creating jmx-kafka1 ... done
docker deployment successful
```

</details>

<details><summary><b>-pr, --prometheus < port > < scrape_interval > < evaluation_interval ></b></summary>

Creates a configuration with a prometheus container at external port provided and with scrape/evaluation interval settings. If no interval settings are provide, then defaults will be used. If no Broker or Zookeepers are defined in the the input arguments it will use two brokers, one zookeeper, a spring and a JMX instances for the configuration. See example below:

```sh
$ xkite-cli -pr 9099 20 10
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Configuring docker instances...
creating Kite Config yml...
creating zookeepers...
creating brokers...
yaml configuration complete...
$ xkite-cli -r
       _    _ _
 __  _| | _(_) |_ ___
 \ \/ / |/ / | __/ _ \
  >  <|   <| | ||  __/
 /_/\_\_|\_\_|\__\___|

Deploying docker instances...
deploying docker containers...
Building with native build. Learn about native build in Compose here: https://docs.docker.com/go/compose-native-build/
Creating network "download_default" with the default driver
Creating volume "download_jupyterhub_data" with local driver
Creating volume "download_dashboards" with local driver
Creating volume "download_provisioning" with local driver
Creating zookeeper1 ...
Creating prometheus ...
Creating prometheus ... done
Creating zookeeper1 ... done
Creating kafka2     ...
Creating kafka1     ...
Creating kafka2     ... done
Creating kafka1     ... done
Creating jmx-kafka2 ...
Creating spring     ...
Creating jmx-kafka1 ...
Creating jmx-kafka2 ... done
Creating jmx-kafka1 ... done
Creating spring     ... done
```

</details>
