const mysql = require('mysql');
const CONFIGURATION_DB  = require('./config.json');
const LOG_QUERIES=require('./queries/log.json');



class Database{


  constructor(){
    this._configuration=CONFIGURATION_DB;
    this._connection = mysql.createConnection(this._configuration);
    this._log_queries=LOG_QUERIES;


    this._connection.once("error",function(error){
        console.error(error);
    });

  }

  _close_connection(){
    const _self=this;
    _self._connection.destroy();
  }

  _log_actions(action,obj){

    const _self=this;

    let action_sentence=action.split(".");
    let sql_sentence=_self._log_queries[action_sentence[0]][action_sentence[1]];
    obj.id_contenido=(obj.id_contenido)?obj.id_contenido:0;
    sql_sentence=_self._replace_variables_on_query(sql_sentence,obj);
    _self.sendQuery(sql_sentence,obj).then(()=>{
      console.info(`* LOGGED CORRECTLY ${action} *`);
    })
    .catch((err)=>{
      console.error(`* ERROR ON LOG * \n PROBLEM TO EXECUTE THE LOG SENTENCE ${err}`);
    });
  }



  _create_search_query(query,obj){
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


  _replace_variables_on_query(queries,obj){
    let query_parsed=[];
    queries=queries.toString().split(";");
    for (let i = 0; i < queries.length; i++) {
      let query=queries[i];
      for(const prop in obj) {
        if (obj.hasOwnProperty(prop)){
          query=(!obj[prop])?query:query.split(`[${prop}]`).join((isNaN(obj[prop]) && prop!=="multiple_insert_query")?`"${obj[prop]}"`:`${obj[prop]}`);
        }
      }
      query_parsed.push(query);
    }
    return query_parsed.join(";");
  }


  createCompatibilityTableForInsertCourseQuery(obj,id_contenido,id_usuario){
    let finalQuery="";
    for (let i = 0; i < obj.length; i++) {
      // id_contenido,id_usuario,id_punto_control,id_tc,valor,fecha_validacion_proveedor,fecha_validacion_CQA
      if(i>0) finalQuery+=`, `;

      finalQuery+=`(${id_contenido},${parseInt(id_usuario)},${parseInt(obj[i].id_punto_control)},${parseInt(obj[i].id_tc)},${parseInt(obj[i].id_valor)})`;
    }
    return {multiple_insert_query:finalQuery};
  }

  _createInsertContentPlatform(obj,id_contenido,id_pais){
    let finalQuery="";
    for (let i = 0; i < obj.length; i++) {
      // id_contenido,id_usuario,id_punto_control,id_tc,valor,fecha_validacion_proveedor,fecha_validacion_CQA
      if(i>0) finalQuery+=`, `;

      // finalQuery+=`(${parseInt(id_contenido)},${parseInt(obj[i])},${parseInt(obj[i].id_pais)})`;
      finalQuery+=`(${parseInt(id_contenido)},${parseInt(obj[i])},${parseInt(id_pais)})`;
    }
    return {multiple_insert_query:finalQuery};
  }




  finishConnection(){
    this._connection.end();
  }


  sendQuery(query,object={}){

    const _self=this;

    return new Promise(function(resolve,reject){


      if(!query){
        resolve(true);
      }

      query=_self._replace_variables_on_query(query,object);


      // Use the connection
      _self._connection.query(query, function(err, rows) {

        // In case of error
        if(err){
          reject(err);
        }

        // Don't use the connection here, it has been returned to the pool.!!!!!!
        resolve(rows);
      });
    });

  }

  recordOnLog(action,obj){
    // Record the user's login
    this._log_actions(action,
      {
        id_usuario:obj.id_usuario,
        id_contenido:obj.id_contenido,
        fecha_modificacion:new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
    }


  insert_new_content(camposFormulario,user_queries){

      const _self=this;

      return new Promise((resolve,reject)=>{

        _self.sendQuery(user_queries.INSERT.content,camposFormulario).then((row)=>{

          // After insert the basic info about the content we need to populate the relations
          camposFormulario["id_contenido"]=row.insertId;


          let additional_queries=[];

          // additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.tableOfCompatibilities,
          //   {
          //   multiple_insert_query:_self.createCompatibilityTableForInsertCourseQuery(camposFormulario.multiple_insert_query,camposFormulario.id_contenido,camposFormulario.id_usuario).multiple_insert_query,
          //   id_contenido:camposFormulario.id_contenido,
          //   id_usuario:camposFormulario.id_usuario
          // }));



          additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.content_technology,
          {
            id_contenido:camposFormulario.id_contenido,
            id_tecnologia:camposFormulario.id_tecnologia
          }));

          if(camposFormulario.table_platforms.length){
            additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.content_platform,
            _self._createInsertContentPlatform(camposFormulario.table_platforms,camposFormulario.id_contenido,camposFormulario.id_pais)));
          }

          if(camposFormulario['id_proyecto']){
            additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.contentRelation,camposFormulario));
          }
          if(camposFormulario['url_image']){
            additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.screenshot,camposFormulario));
          }


          additional_queries=additional_queries.join(" ");

          _self.sendQuery(additional_queries).then(()=>{
            resolve(true);
          })
          .catch((error)=>{
            reject(error);
          });
        }).catch((err)=>{
          reject(err);
        });
      });
    }

      update_content(user_queries,camposFormulario,update_file=false){

        const _self=this;

        return new Promise(function(resolve, reject) {

          let additional_queries=[];
          additional_queries.push(_self._replace_variables_on_query((update_file)?user_queries.UPDATE.content:user_queries.UPDATE.contentNoFile,camposFormulario));
          additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.contentRelation,{id_contenido:camposFormulario.id_contenido,id_proyecto:camposFormulario.id_proyecto}));

          if(camposFormulario.table_platforms.length>0){
            additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.content_platform,
            {
              id_contenido:camposFormulario.id_contenido,
              multiple_insert_query:_self._createInsertContentPlatform(camposFormulario.table_platforms,camposFormulario.id_contenido,camposFormulario.id_pais).multiple_insert_query
            }));
          }


          additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.content_technology,
          {
            id_contenido:camposFormulario.id_contenido,
            id_tecnologia:camposFormulario.id_tecnologia
          }));

          if(camposFormulario['screenshot']){
            additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.screenshot,camposFormulario));

          }
          additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.tableOfCompatibilities+user_queries.INSERT.tableOfCompatibilities,{
            multiple_insert_query:_self.createCompatibilityTableForInsertCourseQuery(camposFormulario.multiple_insert_query,camposFormulario.id_contenido,camposFormulario.id_usuario).multiple_insert_query, id_contenido:camposFormulario.id_contenido}));


          if(camposFormulario['id_proyecto']){
            additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.contentRelation,camposFormulario));
          }

          additional_queries=additional_queries.join(" ");


          _self.sendQuery(additional_queries).then(()=>{
            resolve(true);
          })
          .catch((error)=>{
            reject(error);
          });
          // _self.sendQuery((update_file)?user_queries.UPDATE.content:user_queries.UPDATE.contentNoFile,camposFormulario).then(()=>{
            // _self.sendQuery(user_queries.UPDATE.contentRelation,{id_contenido:camposFormulario.id_contenido,id_proyecto:camposFormulario.id_proyecto}).then(()=>{
              // _self.sendQuery(user_queries.UPDATE.tableOfCompatibilities,{id_contenido:camposFormulario.id_contenido})
              // .then(()=>{

                // _self.sendQuery(user_queries.UPDATE.content_platform+user_queries.INSERT.content_platform,{
                //   id_contenido:camposFormulario.id_contenido,
                //   multiple_insert_query:_self._createInsertContentPlatform(camposFormulario.table_platforms,camposFormulario.id_contenido,camposFormulario.id_pais).multiple_insert_query
                // }
                // ).then(()=>{
                //
                // })
                // .catch(()=>{
                //
                // });

                // Update of the content's assigned technology
                // _self.sendQuery(
                //   user_queries.UPDATE.content_technology,
                //   {
                //     id_contenido:camposFormulario.id_contenido,
                //     id_tecnologia:camposFormulario.id_tecnologia
                // })
                // .then(()=>{
                //
                // })
                // .catch((err)=>{
                //   reject(err);
                // });

                // if(camposFormulario['screenshot']){
                //   _self.sendQuery(user_queries.UPDATE.screenshot,camposFormulario).then(()=>{
                //   }).catch((err)=>{
                //     console.error("user_queries.UPDATE.screenshot: "+err);
                //   });
                // }
                // _self.sendQuery(user_queries.UPDATE.tableOfCompatibilities+user_queries.INSERT.tableOfCompatibilities,{
                //   multiple_insert_query:_self.createCompatibilityTableForInsertCourseQuery(camposFormulario.multiple_insert_query,camposFormulario.id_contenido,camposFormulario.id_usuario).multiple_insert_query, id_contenido:camposFormulario.id_contenido}).then(()=>{
                //     if(camposFormulario['id_proyecto']){
                //
                //       _self.sendQuery(user_queries.UPDATE.contentRelation,camposFormulario).then(()=>{
                //         resolve(true);
                //       }).catch((err)=>{
                //         console.error("user_queries.INSERT.contentRelation: "+err);
                //       });
                //     }else{
                //       resolve(true);
                //     }
                //   })
                //   .catch((err)=>{
                //     console.error("user_queries.INSERT.tableOfCompatibilities: "+err);
                //   });

                // })
                // .catch((err)=>{
                //   console.error("user_queries.UPDATE.tableOfCompatibilities: "+err);
                // });
            // })
            // .catch((err)=>{
            //   reject(err);
            // });



            // }).catch((err)=>{
            //   reject(err);
            // });
          });

        }



      }


      module.exports=Database;
