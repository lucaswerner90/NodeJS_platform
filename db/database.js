const mysql = require('mysql');
const CONFIGURATION_DB  = require('./config.json');
const LOG_QUERIES=require('./queries/log.json');

class Database{


  constructor(){
    this._configuration=CONFIGURATION_DB;
    this._connection = mysql.createPool(this._configuration);
    this._log_queries=LOG_QUERIES;
  }

  _logActions(action,obj){

    const _self=this;

    let action_sentence=action.split(".");
    let sql_sentence=_self._log_queries[action_sentence[0]][action_sentence[1]];
    sql_sentence=_self._replaceVariablesOnQuery(sql_sentence,obj);
    _self._sendQuery(sql_sentence,obj).then(()=>{
      console.info(`* LOGGED CORRECTLY ${action} *`);
    })
    .catch((err)=>{
      console.error(`* ERROR ON LOG * \n PROBLEM TO EXECUTE THE LOG SENTENCE ${err}`);
    });
  }



  _createSearchQuery(query,obj){
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
  }

  _replaceVariablesOnQuery(query,obj){
    for(const prop in obj) {
      if (obj.hasOwnProperty(prop)){
        query=(!obj[prop])?query:query.split(`[${prop}]`).join((isNaN(obj[prop]) && prop!=="multiple_insert_query")?`"${obj[prop]}"`:`${obj[prop]}`);
      }

    }
    return query;
  }

  _createCompatibilityTableForInsertCourseQuery(obj,id_contenido,id_usuario){
    let finalQuery="";
    for (let i = 0; i < obj.length; i++) {
      // id_contenido,id_usuario,id_punto_control,id_tc,valor,fecha_validacion_proveedor,fecha_validacion_CQA
      if(i>0) finalQuery+=`, `;

        finalQuery+=`(${id_contenido},${parseInt(id_usuario)},${parseInt(obj[i].id_punto_control)},${parseInt(obj[i].id_tc)},${parseInt(obj[i].id_valor)})`;
    }
    return {multiple_insert_query:finalQuery};
  }


  finishConnection(){
    this._connection.end();
  }

  sendQuery(query,object,search_content=false){

    const _self=this;

    return new Promise(function(resolve,reject){
      // Use the connection
      _self._connection.getConnection(function(err, db_connection) {

        // In case of error
        if(err || !db_connection){
          reject(err || 'Impossible to connect to the database at this moment...');
        }
        if(search_content){
          query=_self._replaceVariablesOnQuery(query,object);
          query=_self._createSearchQuery(query,object);
        }else{
          query=_self._replaceVariablesOnQuery(query,object);
        }
        db_connection.query(query, function(err, rows) {

          // In case of error
          if(err){
            reject(err);
          }

          // And done with the connection.
          db_connection.release();

          // Don't use the connection here, it has been returned to the pool.!!!!!!
          resolve(rows);
        });
      });
    });

  }

  recordOnLog(action,obj){
    // Record the user's login
    this._logActions(action,
    {
      id_usuario:obj.id_usuario,
      id_contenido:obj.id_contenido,
      fecha_modificacion:new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
  }

}


module.exports=Database;
