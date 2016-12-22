/*
CORE.JS
This file contains the main operations that DB has to do.
*/
'use strict';


const mysql = require('mysql');
const CONFIGURATION_DB  = require('./config.json');

let connection = null;


const replaceVariablesOnQuery=function (query,obj){
  for(let prop in obj) {
    query=(!obj[prop])?query:query.split(`[${prop}]`).join(`"${obj[prop]}"`);
  }
  return query;
};

/*
THIS METHOD CREATE A NEW CONNECTION TO THE DB
*/
exports.startConnection=()=>{
  if(!connection){
    connection = mysql.createPool(CONFIGURATION_DB);
  }
};



/*
THIS METHOD FINISH A NEW CONNECTION TO THE DB
*/
exports.finishConnection=()=>{
  connection.end();
};



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
      console.log('Query: '+query);
      dbConnection.query(query, function(err, rows) {

        // In case of error
        if(err) reject(err);

        // And done with the connection.
        dbConnection.release();
        // Don't use the connection here, it has been returned to the pool.!!!!!!
        resolve(rows);
      });
    });
  });

};
