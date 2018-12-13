# vecisalab

![logocorte](https://github.com/javiermugueta/vecisalab/blob/master/logo_veci_h_sin_claim.png)

## Tienes Docker desktop instalado?

Para mac: https://store.docker.com/editions/community/docker-ce-desktop-mac

Para windows: https://store.docker.com/editions/community/docker-ce-desktop-windows

## Ejemplos en node utilizando node-oracledb
Estan configurados para utilizar el esquema HR de la bbdd de demo

Se conectan a la BBDD por el puerto 1521 de la IP pública del nodo 1 del RAC. Esto está así por tratarse de un laboratorio, obviamente, en condiciones de producción esto se hace de otra manera (ver los ejercicios con kubernetes que permiten entender el concepto)

Los ejecutamos desde un contenedor que tiene instalado node10 y oracleinstantclient18, de esta menera no tienes que instalarte nada en local

### cómo obtener listado del contenido de los ejercicios
docker run -it javiermugueta/ecivecilab ls nodesamples

### cómo realizar un test de connexion a la bbdd
docker run -it javiermugueta/ecivecilab node nodesamples/testconn.js

### ejemplo de soda en node.js
SODA permite trabajar con JSON de manera fascilísima. Aqui un ejemplo en node, más adelante lo probaremos con más detalle mediasnte REST, no te lo pierdas!

Este ejemplo crea un documento JSON y luego hace una query por un atributo del mismo, cuantas más veces lo ejecutes más líneas devuelve la query ya que siempre inserta el mismo contenido

docker run -it javiermugueta/ecivecilab node nodesamples/sodahr.js

### promises
Una promise permite ejecución asíncroma de una sentencia

docker run -it javiermugueta/ecivecilab node nodesamples/promise.js

### otros ejercicios
Entra en la shell del contenedor (docker run -it javiermugueta/ecivecilab) y añade cualquier ejemplo, puedes utilizar este enlace: https://github.com/oracle/node-oracledb/tree/master/examples
El editor es vi, pero puedes instalar cualquier cosa con yum install xxxx, recuerda que si sales del contenedor perderás los cambios ya que no estás ejecutándolo con persistencia

## apificación del esquema hr mediante node y express: ejecución en la máquina local
Se trata de una aplicación node.js con express que utiliza oraclenode-db para apificar la tabla employees del esquema hr. No necesitas hacer esto para apificar la BBDD (lo puedes hacer con ORDS) pero puede que en algún caso te interese.

Pasamos datos de conexión al contenedor mediante variables de entorno

export HR_USER=HR

export HR_PASSWORD=loqueyotediga (la pasword la sabe el instructor)

export HR_CONNECTIONSTRING="(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=130.61.52.57)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=jsonpdb.dnslabel1.skynet.oraclevcn.com)))"

ejecutamos el contenedor exportando el puerto 3000

docker run -it -e HR_USER -e HR_PASSWORD -e HR_CONNECTIONSTRING -p 3000:3000 javiermugueta/ecivecilab node myserver/index.js

Prueba en el navegador: 

http://127.0.0.1:3000/api/employees

http://127.0.0.1:3000/api/employees/171

Echa un vistazo al código https://github.com/javiermugueta/vecisalab/tree/master/myserver

## apificación del esquema hr mediante node y express: desplegado en kubernetes cluster
En este caso desplegamos la aplicación anterior en kubernetes, con lo cual la hacemos "enterprise". Queremos hacer notar que en este caso la conexión entre la aplicación y la bbdd es a través de la IP de scan del rac (que, obviamente,  no es pública). La cadena de conexión está en una variable de entorno que se pasa en el deployment mediante el fichero de despliegue eciveci.yaml

Más tarde hablaremos de poner un API Platform por delante de una capa de microservicios

NOTA: La aplicación ya está desplegada, te explicamos los pasos por si quieres entenderlos

Primero, almacenamos la password de HR en un secret para no exponerla en el yaml del despliegue:

NOTA: Recuerda que javiermugueta/ocloudshell es un contenedor que tiene instalados los clientes del cloud para facilitarte la vida

docker run -it javiermugueta/ocloudshell kubectl create secret generic hrpassword --type=string --from-literal=password=(lapasswordlasabeelinstructor)

Ahora creamos el despliegue:

docker run -it javiermugueta/ocloudshell kubectl apply -f https://github.com/javiermugueta/vecisalab/blob/master/k8s/eciveci.yaml

Comprobamos si se ha creado el pod:

docker run -it javiermugueta/ocloudshell kubectl get po

Comprobamos si se ha creado el servicio eciveci:

docker run -it javiermugueta/ocloudshell kubectl get svc

(toma nota de la ip del servicio eciveci)

prueba: http://130.61.15.199:3000/api/employees/174

# despliegue de ords en k8s
Se trata de desplegar ORDS en kubernetes como capa de acceso a la BBDD mediante REST. Esto permite exponer la BBDD en REST en un cluster de k8s con pods stateless replicados n veces (alta disponibilidad), en este caso hemos configurado tres replicas

NOTA: La aplicación ya está desplegada, te explicamos los pasos por si quieres entenderlos

Primero el secret:

docker run -it javiermugueta/ocloudshell kubectl create secret generic ordspassword --type=string --from-literal=password=(lapasswordlasabeelinstructor)

El deployment:

docker run -it javiermugueta/ocloudshell kubectl apply -f https://raw.githubusercontent.com/javiermugueta/vecisalab/master/k8s/ordscontainer.yaml

Comprobaciones:

docker run -it javiermugueta/ocloudshell kubectl get po

docker run -it javiermugueta/ocloudshell kubectl get svc

(toma nota de la ip del servicio)

prueba: http://130.61.70.73:8080/ords/hr/soda/latest

Como ves, tenemos acceso desde "internet" a la capa de servicios, por que la hemos expuesto en kubernetes mediante un loadbalancer que apunta a todas las réplicas del container (que estén vivas). Si colocamos delante de kubernetes un API Platform podremos gobernar las APIs (eso podría ser materia de otro lab)

## ejemplos soda a través de ORDS
Ahora que tenemos ORDS desplegado en kubernetes, podemos realizar ejercicios de SODA mediante REST, verás qué fácil:

Vamos a trabajar con una colección que llamaremos myJSONDATA, pero puedes poner lo que quieras, se creará con el nombre que pongas. Si te conectas a la bbdd verás una tabla con el nombre de la colección. El instructor te puede mostrar los objetos que se crean bajo el esquema HR.

### create collection
curl -i -X PUT http://130.61.70.73:8080/ords/hr/soda/latest/myJSONDATA

### insert record
Download this data: https://raw.githubusercontent.com/javiermugueta/vecisalab/master/sodarestsamples/po.json and save it as po.json

curl -X POST --data-binary @po.json -H "Content-Type: application/json" "http://130.61.70.73:8080/ords/hr/soda/latest/myJSONDATA"

### bulk insert
Download this data: https://raw.githubusercontent.com/javiermugueta/vecisalab/master/sodarestsamples/POList.json and save it as POlist.json

curl -X POST --data-binary @POlist.json -H "Content-Type: application/json" http://130.61.70.73:8080/ords/hr/soda/latest/myJSONDATA?action=insert

### get record by id
Get the ID of an existing record and put it as the parameter such as the example below

curl -X GET http://130.61.70.73:8080/ords/hr/soda/latest/myJSONDATA?id=puthereanid

### query records
curl -X POST --data-binary '{"PONumber":"10"}' -H "Content-Type: application/json" "http://130.61.70.73:8080/ords/hr/soda/latest/myJSONDATA?action=query"

### update records
Get the ID of an existing record and put it as the parameter in the url such as the example below

curl -i -X PUT --data-binary '{"Requestor" : "Kevin Feeney", "User" : "KFEENEY_updated"}' -H "Content-Type: application/json" "http://130.61.70.73:8080/ords/hr/soda/latest/myJSONDATA/puthereanid"

Get the record by ID again and check thst the attribute User changed to KFEENEY_updated

### list records

(Click directly in the link and will be shown in you browser)

curl -X GET "http://130.61.70.73:8080/ords/hr/soda/latest/myJSONDATA?fields=all&limit=10"

### delete record by id
Get the ID of an existing record and put it as the parameter such as the example below

curl -i -X DELETE http://130.61.70.73:8080/ords/hr/soda/latest/myJSONDATA?id=puthereanid

### delete the collection
curl -i -X DELETE http://130.61.70.73:8080/ords/hr/soda/latest/myJSONDATA

# nosql
Vamos a utilizar el sdk del simulador, primero clona (o si no tienes git descarga el zip) de este repo: 

git clone https://github.com/javiermugueta/oracle-nosql-cloud-sdk-18.298

En una shell ponte en el directorio:

cd oracle-nosql-cloud-sdk-18.298

Arranca el simulador y espera a que aparezca "Oracle NoSQL Cloud Simulator is ready" así:

./runCloudSim -root midemorepo

Abre otra shell y compila los ejemplos:

examples/java/buildExamples

Ejecuta algun ejemplo:

examples/java/runExample BasicTableExample

examples/java/runExample IndexExample

examples/java/runExample IndexExample ExampleaccessTokenProvider

examples/java/runExample DeleteExample

Echa un vistazo al código fuente

# FIN

That's all folks!

# doco

Some useful links

## node-oracledb on github
(http://oracle.github.io/node-oracledb/)

https://github.com/oracle/node-oracledb

## SODA REST
https://docs.oracle.com/cd/E56351_01/doc.30/e58123/rest.htm#ADRST107

## SODA Java
https://docs.oracle.com/cd/E56351_01/doc.30/e58124/soda_for_java.htm#ADSDA107

## SODA Whitepaper
https://www.oracle.com/technetwork/database/appdev-with-soda-2606220.pdf

## Recommended blog
https://jsao.io

## Oracle db samples on github
https://github.com/oracle/oracle-db-examples

# helpers

Comandos para arrancar y parar máquinas de la infra cloud que estamos utilizando en este lab

## start/stop database
### start

clu1cn1:

docker run -it javiermugueta/ocloudshell oci db node start --db-node-id ocid1.dbnode.oc1.eu-frankfurt-1.abtheljt7h64echvzjs53udlkly6diycycoji3ddrudwqurroweysdbunpla

clu1cn2:

docker run -it javiermugueta/ocloudshell oci db node start --db-node-id ocid1.dbnode.oc1.eu-frankfurt-1.abtheljtl2x2h5jevbnfmltocm5jthcjknptmlc4cn7jespdbzsaf4deieia

### stop

docker run -it javiermugueta/ocloudshell oci db node stop --db-node-id ocid1.dbnode.oc1.eu-frankfurt-1.abtheljtl2x2h5jevbnfmltocm5jthcjknptmlc4cn7jespdbzsaf4deieia

docker run -it javiermugueta/ocloudshell oci db node stop --db-node-id ocid1.dbnode.oc1.eu-frankfurt-1.abtheljt7h64echvzjs53udlkly6diycycoji3ddrudwqurroweysdbunpla

## start/stop computo de k8s
### start

docker run -it javiermugueta/ocloudshell oci compute instance action --instance-id ocid1.instance.oc1.eu-frankfurt-1.abtheljtbocj2w4qywieacalgsortabg4kep77lplqfwfmlup77725rvsjxa --action start

docker run -it javiermugueta/ocloudshell oci compute instance action --instance-id ocid1.instance.oc1.eu-frankfurt-1.abtheljtjhyzku2ujwmgitfoycrryy52u7rgh6e27hxhgnejp53wbijvt34a --action start

### stop

docker run -it javiermugueta/ocloudshell oci compute instance action --instance-id ocid1.instance.oc1.eu-frankfurt-1.abtheljtbocj2w4qywieacalgsortabg4kep77lplqfwfmlup77725rvsjxa --action stop

docker run -it javiermugueta/ocloudshell oci compute instance action --instance-id ocid1.instance.oc1.eu-frankfurt-1.abtheljtjhyzku2ujwmgitfoycrryy52u7rgh6e27hxhgnejp53wbijvt34a --action stop
