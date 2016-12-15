/*
  CORE.JS
  This file contains the main operations that DB has to do.
*/
"use strict";


let mysql = require('mysql');
let CONFIGURATION_DB  = require('./config.json');

let connection = null;
let EventEmitter = require('events').EventEmitter;
exports.eventosDB = new EventEmitter();

/*
  THIS METHOD CREATE A NEW CONNECTION TO THE DB
*/
exports.startConnection=()=>{
  if(!connection){
    connection = mysql.createPool(CONFIGURATION_DB);
  }
  // connection.connect((err)=> {
  //   if (err) {
  //     console.error('error connecting: ' + err.stack);
  //     return;
  //   }
  //
  //   console.log('connected as id ' + connection.threadId);
  // });
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
  connection.getConnection(function(err, dbConnection) {
    // Use the connection
    dbConnection.query( query, function(err, rows) {
      // And done with the connection.
      dbConnection.release();
      // eventosDB.emit("queryCompleted");
      console.log(rows[0]);
      return rows;
      // Don't use the connection here, it has been returned to the pool.
    });
});
}
