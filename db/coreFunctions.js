/*
  CORE.JS
  This file contains the main operations that DB has to do.
*/



let mysql = require('mysql');
let CONFIGURATION_DB  = require('./config.json');

let connection = null;



/*
  THIS METHOD CREATE A NEW CONNECTION TO THE DB
*/
exports.startConnection=()=>{
  if(!connection){
    connection = mysql.createConnection(CONFIGURATION_DB);
  }
  connection.connect((err)=> {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('connected as id ' + connection.threadId);
  });
}


/*
  THIS METHOD FINISH A NEW CONNECTION TO THE DB
*/
exports.finishConnection=()=>{
  connection.end();
}




/*
  THIS METHOD SENDS A QUERY TO THE DB
*/
exports.sendQuery=(query)=>{
  connection.query(query, (err, rows, fields)=> {
    if (err) throw err;
    return rows;
  });
}
