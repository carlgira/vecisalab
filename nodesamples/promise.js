var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

oracledb.getConnection(
  {
    user          : dbConfig.user,
    password      : dbConfig.password,
    connectString : dbConfig.connectString
  })
  .then(function(conn) {
    return conn.execute(
      `SELECT department_id, department_name
       FROM departments
       WHERE manager_id = 100`
    )
      .then(function(result) {
        console.log(result.rows);
        return conn.close();
      })
      .catch(function(err) {
        console.error(err);
        return conn.close();
      });
  })
  .catch(function(err) {
    console.error(err);
  });