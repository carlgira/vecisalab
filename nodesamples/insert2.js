var async = require('async');
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

var doconnect = function(cb) {
  oracledb.getConnection(
    {
      user          : dbConfig.user,
      password      : dbConfig.password,
      connectString : dbConfig.connectString
    },
    cb);
};

var dorelease = function(conn) {
  conn.close(function (err) {
    if (err)
      console.error(err.message);
  });
};

var dodrop = function (conn, cb) {
  conn.execute(
    `BEGIN
       EXECUTE IMMEDIATE 'DROP TABLE test';
       EXCEPTION WHEN OTHERS THEN
       IF SQLCODE <> -942 THEN
         RAISE;
       END IF;
     END;`,
    function(err) {
      if (err) {
        return cb(err, conn);
      } else {
        console.log("Table dropped");
        return cb(null, conn);
      }
    });
};

var docreate = function (conn, cb) {
  conn.execute(
    "CREATE TABLE test (id NUMBER, name VARCHAR2(20))",
    function(err) {
      if (err) {
        return cb(err, conn);
      } else {
        console.log("Table created");
        return cb(null, conn);
      }
    });
};

// Insert with autoCommit enabled
var doinsert_autocommit = function (conn, cb) {
  conn.execute(
    "INSERT INTO test VALUES (:id, :nm)",
    [1, 'Chris'],  // Bind values
    { autoCommit: true},  // Override the default non-autocommit behavior
    function(err, result) {
      if (err) {
        return cb(err, conn);
      } else {
        console.log("Rows inserted: " + result.rowsAffected);  // 1
        return cb(null, conn);
      }
    });
};

// Insert without committing
var doinsert_nocommit = function (conn, cb) {
  conn.execute(
    "INSERT INTO test VALUES (:id, :nm)",
    [2, 'Alison'],  // Bind values
    // { autoCommit: true},  // Since this isn't set, operations using a second connection won't see this row
    function(err, result) {
      if (err) {
        return cb(err, conn);
      } else {
        console.log("Rows inserted: " + result.rowsAffected);  // 1
        return cb(null, conn);
      }
    });
};

// Query on a second connection
var doquery = function (conn, cb) {
  oracledb.getConnection(
    {
      user          : dbConfig.user,
      password      : dbConfig.password,
      connectString : dbConfig.connectString
    },
    function(err, connection2) {
      if (err) {
        console.error(err.message);
        return cb(err, conn);
      }
      connection2.execute(
        "SELECT * FROM test",
        function(err, result) {
          if (err) {
            console.error(err.message);
            return cb(err, conn);
          }

          // This will only show 'Chris' because inserting 'Alison' is not commited by default.
          // Uncomment the autoCommit option above and you will see both rows
          console.log(result.rows);

          connection2.close(
            function(err) {
              if (err) {
                console.error(err.message);
                return cb(err, conn);
              } else
                return cb(null, conn);
            });
        });
    });
};

async.waterfall(
  [
    doconnect,
    dodrop,
    docreate,
    doinsert_autocommit,
    doinsert_nocommit,
    doquery,
    dodrop
  ],
  function (err, conn) {
    if (err) { console.error("In waterfall error cb: ==>", err, "<=="); }
    if (conn)
      dorelease(conn);
  });