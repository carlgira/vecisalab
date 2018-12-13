// as of today this sample can't run on mac because instant client 18 is not available
const oracledb = require('oracledb');
var dbconfig = require('./dbconfig.js');

oracledb.autoCommit = true;

(async function() {
  let conn;

  try {
    conn = await oracledb.getConnection(dbconfig);
    console.log('Connected to database...');

    console.log('Create a new (or open an existing) document collection');
    let sd = conn.getSodaDatabase();
    let collectionName = 'collection-soda';
    let myCollection = await sd.createCollection(collectionName);

    myDoc = sd.createDocument({name: "pedro", city: "vallecas"}); 
    newDoc = await myCollection.insertOneAndGet(myDoc);
    console.log("The key of the new document is: ", newDoc.key); 

    console.log('Print names of people living in vallecas');
    let filterSpec = { "city": "vallecas" };
    let myDocuments = await myCollection.find().filter(filterSpec).getDocuments();
    myDocuments.forEach(function(element) {
      let content = element.getContent();
      console.log(content.name, ' lives in vallecas.');
    });
  } catch(err) {
    console.log('Error in processing:\n', err);
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch(err) {
        console.log('Error in closing connection:\n', err);
      }
    }
  }
})();