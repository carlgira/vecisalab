const oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

function getEmployee(empid) {
  return new Promise(async function(resolve, reject) {
    let conn;

    try {
      conn = await oracledb.getConnection({
        user          : dbConfig.user,
        password      : dbConfig.password,
        connectString : dbConfig.connectString
    });

      let result = await conn.execute(
        `SELECT * FROM customers WHERE cust_id = ` + empid 
      );
      resolve(result.rows);

    } catch (err) { // catches errors in getConnection and the query
      reject(err);
    } finally {
      if (conn) {   // the conn assignment worked, must release
        try {
          await conn.release();
        } catch (e) {
          console.error(e);
        }
      }
    }
  });
}

async function run() {
  try {
    let res = await getEmployee(1010);
    console.log(res);
  } catch (err) {
    console.error(err);
  }
}

run();