module.exports = {
    user          : process.env.NODE_ORACLEDB_USER || "hr",
    password      : process.env.NODE_ORACLEDB_PASSWORD || "AaZZ0r_cle#2",
    connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=130.61.52.57)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=jsonpdb.dnslabel1.skynet.oraclevcn.com)))",
    externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
  };