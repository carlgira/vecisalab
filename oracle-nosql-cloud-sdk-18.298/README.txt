A README file for the Oracle NoSQL Database Cloud SDK.

* The THIRDPARTY.txt file contains the third party notices and licenses.
* The SAMPLELICENSE.txt file contains the UPL license for
  the Oracle examples under <install>/examples/*.  The following
  libraries in this download are Oracle libraries and are under the
  OTN developer license, as per the download:

   je.jar
   cloudsim.jar
   kvstore.jar
   httpproxy.jar
   nettyserver.jar
   nosqlutil.jar

This document describes:
1) how to start an Oracle NoSQL Cloud Simulator instance
2) how to build applications and and run bundled example programs

Troubleshooting information is at the end of this file.

Usage Guidelines

- These instructions assume that the current directory is the root
directory of the archive (the directory that contains this file).

- Oracle NoSQL Cloud Simulator is a utility that enables developers to
  execute applications developed with the APIs that will be delivered
  with the Oracle NoSQL Database Cloud. This utility gives developers
  the ability to test applications without actually connecting to the
  Oracle NoSQL Database Cloud.

- To properly develop an application, an appropriate client driver is
  needed. With the initial release of Oracle NoSQL Database Cloud, a
  Java client driver will be available with other language drivers
  planned for the future. The Oracle NoSQL Cloud Java Driver can be
  downloaded separately from OTN.

- Oracle NoSQL Cloud Simulator cannot be used to store any production
  data.

- Oracle NoSQL Cloud Simulator runs on your local computer and has
  been tested on the following operating systems:

    1) Windows 7 and above
    2) Oracle Linux
    3) Mac OS

- The examples are for convenience to help provide an overview of the
  API.

- Support for Oracle NoSQL Cloud Simulator and the examples are
  provided over the forum. Questions should be posted at:

   https://community.oracle.com/community/database/nosql_database

  and/or email  to:

    oraclenosql-info_ww@oracle.com

  with Oracle NoSQL Cloud Simulator in the subject line.

- Small shell scripts are provided as a convenience to run Oracle
  NoSQL Cloud Simulator and to build and run example programs that use
  the Oracle NoSQL Cloud Java SDK. These scripts specify an included
  logging configuration file. By default, there is no logging.

- Edit the file, logging.properties, to enable the level of logging
  desired.

Requirements:

- We recommend that you use Java 10.

- At least 5GB of free disk on the volume containing the root
  directory.

- For Java examples, the Oracle NoSQL Cloud Java Driver bundle must be
  downloaded and its .../lib directory added to your CLASSPATH.

1. Start the Oracle NoSQL Cloud Simulator. The only required option is
   "-root" which defines the store's directory. If this directory does
   not already exist, it will be created. If there is an existing
   store present in that directory, it will be used.

   $ ./runCloudSim -root <path-to-a-rootdir>

   This call creates an instance of Oracle NoSQL Cloud Simulator and
   starts a cloud proxy in the same process using the default ports
   for the store and HTTP proxy. The proxy listens for cloud driver
   requests on an HTTP port.

   There are additional options that can be used to control the cloud
   sim instance.

   Options and default values:
   
      -host (default: localhost): allows control over the database
       host used

      -storePort (default: 5000): allows control over the database
       port used

      -httpPort (default: 8080): allows control over the HTTP port
       used

      -throttle (default: false): enables throttling based on declared
       throughput

      -verbose (default: false): adds verbosity to output. If set to
       true throttling exceptions will be thrown if throughput is
       exceeded.

   To see the usage message:

   $ ./runCloudSim -?

   Oracle NoSQL Cloud Simulator can be put in the background using:
   $  ./runCloudSim -root <path-to-a-rootdir> &

   The Oracle NoSQL Cloud Simulator instance can be stopped using ^C or
   otherwise killing the process.

2. To build and run Java examples

   Copy the lib folder from the Java Driver Bundle to the java
   directory under the SDK parent directory.

   On Linux machines

      cp -r oracle-nosql-cloud-java-driver-XX.XXX/lib oracle-nosql-cloud-sdk-XX.XXX/java

   To build all examples

      $ examples/java/buildExamples

   To run an example

      $ examples/java/runExample <example> [-host <hostname>] [-httpPort <port>]

   For example,

      $ examples/java/runExample BasicTableExample

   Note that the runExample script will use the local
   logging.properties file for logging configuration. By default
   logging is off and can be enabled by modifying the levels for
   oracle.nosql and/or io.netty.

   There are 4 examples included with this download in the
   examples/java directory.

      a. BasicTableExample.java - Program that shows how to Create a
      table insert and retrieve using GET and Query records and delete
      table.

      b. DeleteExample.java - Program that shows how to delete a
      single row and delete multiple rows in a table.

      c. IndexExample.java - Program that shows how to create an index
      on a column in the table and retrieve from an index.

      d. ExampleAccessTokenProvider.java - Program that shows use of
      tenant id.

3. To run the examples against the Oracle NoSQL Database Cloud service
please refer to the Authentication and Authorization FAQ.

4. Javadoc for applications is included with this archive and is in
the java/javadoc directory.

Troubleshooting

1. Failure to start the Oracle NoSQL Cloud Simulator server.

  a) failed to start KVLite. This might occur if there is a process
  using the default port 5000. In this case use a different port using
  -storePort <port>

  b) failed to start the proxy. This might occur if there is a process
  using the default port of 8080. In this case use the -httpPort
  <port> flag to use a non-default port. This also means specifying
  -httpPort <port> when calling the example classes which have a
  hard-coded default of 8080.

2. Example class fails to contact proxy. This probably means that the
Oracle NoSQL Cloud Simulator server isn't running, or is running using
a different HTTP port. These need to match.

3. To run Oracle NoSQL Cloud Simulator or the example program with
logging, edit logging.properties to set the desired level of logging
and re-run the scripts.

4. If you have questions regarding the API for Oracle NoSQL Cloud
Simulator, please send an email to oraclenosql-info_ww@oracle.com with
Oracle NoSQL Cloud Simulator in the subject line, and someone will get
back to you as soon as possible.
