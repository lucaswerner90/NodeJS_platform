/*
CORE.JS
This file contains the main operations that DB has to do.
*/
'use strict';


const mysql = require('mysql');
const CONFIGURATION_DB  = require('./config.json');
const LOG_QUERIES=require('./queries/log.json');

let connection = null;


const recordOnLog=function(action,obj){
  // Record the user's login
  logActions(action,
  {
    id_usuario:obj.id_usuario,
    id_contenido:obj.id_contenido,
    fecha_modificacion:new Date().toISOString().slice(0, 19).replace('T', ' ')
  });
};

const createSearchQuery=function(query,obj){
  let index=0;
  let searchQuery="";
  for(const prop in obj) {
    if(prop!=='id_usuario'){
      index++;
      if (index>1) {
          searchQuery+=" AND ";
      }
      searchQuery+=`${prop} LIKE "%${obj[prop]}%"`;
    }


  }
  searchQuery+=';';
  searchQuery=query.split(`[search_query]`).join(searchQuery);

  return searchQuery;

};


const replaceVariablesOnQuery=function (query,obj){
  for(const prop in obj) {
    if (obj.hasOwnProperty(prop)){
      query=(!obj[prop])?query:query.split(`[${prop}]`).join((isNaN(obj[prop]) && prop!=="multiple_insert_query")?`"${obj[prop]}"`:`${obj[prop]}`);
    }

  }
  return query;
};


function logActions(action,obj){
  let action_sentence=action.split(".");
  let sql_sentence=LOG_QUERIES[action_sentence[0]][action_sentence[1]];
  sql_sentence=replaceVariablesOnQuery(sql_sentence,obj);
  sendQuery(sql_sentence,obj).then(()=>{
    console.info(`* LOGGED CORRECTLY ${action} *`);
  })
  .catch((err)=>{
    console.error(`* ERROR ON LOG * \n PROBLEM TO EXECUTE THE LOG SENTENCE ${err}`);
  });
}


function createCompatibilityTableForInsertCourseQuery(obj,id_contenido,id_usuario){
  let finalQuery="";
  for (let i = 0; i < obj.length; i++) {
    // id_contenido,id_usuario,id_punto_control,id_tc,valor,fecha_validacion_proveedor,fecha_validacion_CQA
    if(i>0) finalQuery+=`, `;

      finalQuery+=`(${id_contenido},${parseInt(id_usuario)},${parseInt(obj[i].id_punto_control)},${parseInt(obj[i].id_tc)},${parseInt(obj[i].id_valor)})`;
  }
  return {multiple_insert_query:finalQuery};
}


/*
THIS METHOD CREATE A NEW CONNECTION TO THE DB
*/
function startConnection(){
  if(!connection){
    connection = mysql.createPool(CONFIGURATION_DB);
  }
}



/*
THIS METHOD FINISH A NEW CONNECTION TO THE DB
*/
function finishConnection(){
  connection.end();
}



/*
THIS METHOD SENDS A QUERY TO THE DB
*/
function sendQuery(query,object,searchContent=false){
  return new Promise(function(resolve,reject){
    startConnection();
    // Use the connection
    connection.getConnection(function(err, dbConnection) {

      // In case of error
      if(err || !dbConnection){
        reject(err || 'Impossible to connect to the database at this moment...');
      }
      if(searchContent){
        query=replaceVariablesOnQuery(query,object);
        query=createSearchQuery(query,object);
      }else{
        query=replaceVariablesOnQuery(query,object);
      }
      dbConnection.query(query, function(err, rows) {

        // In case of error
        if(err){
          reject(err);
        }

        // And done with the connection.
        dbConnection.release();

        // Don't use the connection here, it has been returned to the pool.!!!!!!
        resolve(rows);
      });
    });
  });

}



module.exports={
  "sendQuery":sendQuery,
  "finishConnection":finishConnection,
  "startConnection":startConnection,
  "createCompatibilityTableForInsertCourseQuery":createCompatibilityTableForInsertCourseQuery,
  "logActions":logActions,
  "recordOnLog":recordOnLog
};
