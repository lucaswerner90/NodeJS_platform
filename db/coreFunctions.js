/*
CORE.JS
This file contains the main operations that DB has to do.
*/
"use strict";


let mysql = require('mysql');
let CONFIGURATION_DB  = require('./config.json');

let connection = null;

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

function replaceVariablesOnQuery(query,obj){
  let finalQuery=query;
  for(let prop in obj) {
    finalQuery=finalQuery.replace(`[${prop}]`,`"${obj[prop].toString()}"`);
  }
  return finalQuery;
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
exports.sendQuery=(query,object)=>{
  return new Promise(function(resolve,reject){

    // Use the connection
    connection.getConnection(function(err, dbConnection) {

      // In case of error
      if(err) reject(err);

      query=replaceVariablesOnQuery(query,object);
      console.log("Query: "+query);
      dbConnection.query(query, function(err, rows) {
        // And done with the connection.
        dbConnection.release();
        // Don't use the connection here, it has been returned to the pool.!!!!!!
        // eventosDB.emit("queryCompleted");
        console.log('Query received!');
        resolve(rows);
      });
    });
  });

}
