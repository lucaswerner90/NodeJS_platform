"use strict";

const Database=require('../../db/database');
const File=require('../../files/_fileModel');
const DBCommonQueries=require('../../db/queries/user/_common.json');
const ClientMicroservice=require('../../microservices/client');


/**
@class
*/
class User{

  /**
  @constructor
  @param {number} id_usuario - User ID
  @param {object} queries - User's profile queries
  */
  constructor(id_usuario=-1,queries){

    this._id_usuario=parseInt(id_usuario);
    this._microservice_client=new ClientMicroservice();
    this._db_connection=new Database();
    this._file=new File();
    this._profile_queries=queries;
    this._common_queries=DBCommonQueries;

  }




  _logOnDB(){

  }

  /**
  Close the connections associated to the user
  @return {null}
  */
  _close_connections(){
    const _self=this;
    _self._db_connection._close_connection();
    _self._file._close_connection();

  }

  /**
  Returns the role associated to a specific user ID
  @return {Promise}
  */
  _get_type_of_user(){

    const _self=this;

    if(_self._id_usuario===-1) return "Administrador";

    return new Promise((resolve,reject)=>{
      // if(global.CONTROL.users[_self._id_usuario]===undefined){
      _self.get_user_info().then((result)=>{
        _self._microservice_client.send_query(_self._common_queries.GET.type_of_user,{
          id_perfil:result.id_perfil}
        ).then((data)=>{
          resolve(data[0].descripcion);
        })
        .catch((err)=>{
          reject(err);
        });
      })
      .catch((err)=>{
        reject(err);
      });
      // }else{
      //   resolve(global.CONTROL.users[_self._id_usuario].descripcion);
      // }

    });
  }

  /**
  Download the zip file associated to every content
  @param {string} filename - Route of the file to download
  @param {Response} response - The server response to associate the Buffer of the file to download
  */
  download_zip(filename,response){
    const _self=this;
    _self._file.downloadFile(filename,response);
  }


  /**
  Returns the info relative to each user (name,provider,etc...)
  @return {Promise}
  */
  get_user_info(){

    const _self=this;
    return new Promise((resolve,reject)=>{
      _self._microservice_client.send_query(_self._common_queries.GET.user_info,{id_usuario:_self._id_usuario}).then((data)=>{

        resolve(data[0]);
      })
      .catch((err)=>{
        reject(err);
      });

    });
  }

  /**
  Returns the info relative to each user (name,provider,etc...)
  @return {Promise}
  */
  get_catalogo_image(id_contenido){

    const _self=this;
    return new Promise((resolve,reject)=>{
      _self._microservice_client.send_query(_self._common_queries.GET.catalogo_image,{id_contenido}).then((data)=>{
        resolve(data[0]);
      })
      .catch((err)=>{
        reject(err);
      });

    });
  }

  /***
  Returns basic info of the user to be used once the user is already logged
  @param {object} params - Contains the user_id that comes from the form
  @return {Promise}
  */
  get_login_info(params){
    let _self=this;
    return new Promise(function(resolve, reject) {

      _self._microservice_client.send_query(_self._common_queries.GET.login_info,params).then((rows)=>{
        if(rows.length===0){
          // Si no se encuentra registrado en la base de datos se le devuelve un codigo 401
          // indicando que no esta autorizado y el token como null.
          reject({token:null});
        }else{
          rows[0].imgAvatar=rows[0].urlAvatar;
          rows[0].urlAvatar=undefined;
          resolve({userInfo:rows[0]});

        }
      });
    });

  }
  /**
  Returns the extended content info that is used on the edit content page
  @param {number} id_contenido - ID of the content
  @return {Promise}
  */
  get_content_by_id(id_contenido){
    const _self=this;
    return new Promise((resolve,reject)=>{
      let arrayPromises=[];
      arrayPromises.push(_self._microservice_client.send_query(_self._common_queries.GET.content_id,{id_contenido:id_contenido}));
      arrayPromises.push(_self._microservice_client.send_query(_self._common_queries.GET.tableOfCompatibilities,{id_contenido:id_contenido}));
      arrayPromises.push(_self._microservice_client.send_query(_self._common_queries.GET.content_platforms,{id_contenido:id_contenido}));
      arrayPromises.push(_self._microservice_client.send_query(_self._common_queries.GET.content_servers,{id_contenido:id_contenido}));
      arrayPromises.push(_self._microservice_client.send_query(_self._common_queries.GET.content_recursos,{id_contenido:id_contenido}));
      arrayPromises.push(_self._microservice_client.send_query(_self._common_queries.GET.content_categorias_subcategorias,{id_contenido:id_contenido}));
      arrayPromises.push(_self._microservice_client.send_query(_self._common_queries.GET.content_licencias,{id_contenido:id_contenido}));


      Promise.all(arrayPromises).then((values)=>{
        const content=values[0][0];
        content.compatibilities_table=values[1];
        content.platforms=values[2];
        content.servidores_contenidos=values[3];
        content.recursos=values[4];
        content.categorias=values[5];
        Object.assign(content,values[6][0]);

        if(content.catalogo_TED=="1"){
          _self.get_catalogo_image(content.id_contenido).then((imagen)=>{
            content.url_image=imagen.url_image;
            resolve(content);
          });
        }else{
          resolve(content);
        }

      }).catch((error)=>{
        reject(error);
      });

    });
  }

  /**
  Returns all the contents associated to a provider
  @return {Promise}
  */
  get_contents(){
    const _self=this;
    return new Promise((resolve,reject)=>{
      //Object.keys(global.CONTROL.users[_self._id_usuario]).length===0
      _self.get_user_info().then((result)=>{
        _self._microservice_client.send_query(_self._profile_queries.GET.contents_proveedor,result).then((data)=>{
          resolve(data);
        });

      })
      .catch((err)=>{
        reject(err);
      });
    });


  }


  /**
  Check if one course is completely certified
  @param {Form} form - Form that contains the info of the content to be checked
  @return {Promise}
  */
  _check_course_certified(valores){
    const VALOR_CERTIFICADO=4;
    
    if(valores && valores.length){
      for (let i = 0; i < valores.length; i++) {
        if(valores[i].id_valor!==VALOR_CERTIFICADO){
          return false;
        }
      }
    }else{
      return false;
    }
    return true;
  }

  /**
  Returns all the contents associated to the catalog
  @return {Promise} The data of the courses that are part of the Catalogo's section
  */
  get_catalogo(){
    const _self=this;
    return new Promise(function(resolve, reject) {
      _self._microservice_client.send_query(_self._common_queries.GET.content_catalogo).then((data)=>{
        resolve(data);
      })
      .catch((error)=>{
        reject(error);
      });
    });
  }


  /**
  Loads all the generic info relative to the application
  @return {Promise}
  */
  get_platform_generic_info(){
    const _self=this;
    return new Promise((resolve,reject)=>{
      _self._microservice_client.send_query(_self._profile_queries.GET.generic_information,null).then((data)=>{

        let generic_info={
          platforms:data[0],
          evaluationSystems:data[1],
          contentTypes:data[2],
          states:data[3],
          tabla_compatibilidades:data[4],
          educationLevels:data[5],
          exploitedRights:data[6],
          tipoProveedores:data[7],
          proyectos:data[8],
          idiomas:data[9],
          puntos_control:data[10],
          valores_certificacion:data[11],
          tecnologias:data[12],
          tipo_desarrollo:data[13],
          servidores_contenidos:data[14],
          proveedores:data[15],
          categorias:data[16],
          habilidades:data[17],
          recursos:data[18]
        };
        let arrayPromisesSubcategories=[];
        for (let i = 0; i < generic_info.categorias.length; i++) {
          arrayPromisesSubcategories[i]=_self._microservice_client.send_query(_self._common_queries.GET.subcategorias,generic_info.categorias[i]);
        }
        Promise.all(arrayPromisesSubcategories).then((values)=>{
          for (let i = 0; i < generic_info.categorias.length; i++) {
            generic_info.categorias[i].subcategorias=values[i];
          }
          _self._close_connections();
          resolve(generic_info);
        })
        .catch((err)=>{
          reject(err);
        });

      })
      .catch((err)=>{
        reject(err);
      });
    });
  }


  /**
  Returns the user's avatar using base64 codification
  @param {string} filename - Route of the avatar on the FTP
  @return {Promise}
  */
  get_avatar(filename){
    const _self=this;
    return new Promise((resolve,reject)=>{
      _self._file.downloadImageInBase64(filename).then((data)=>{
        resolve(data);
      })
      .catch((err)=>{
        reject(err);
      });
    });

  }

  /**
  Method used to modify the user avatar
  @param {Form} form - Form that contains all the user info
  @param {File} file - File to be upload
  @return {Promise}
  */
  modify_avatar(form){

    const _self=this;

    return new Promise((resolve,reject)=>{
      _self._microservice_client.send_query(_self._common_queries.UPDATE.avatar,form).then(()=>{
        _self._id_usuario=form.id_usuario;
        _self._logOnDB("user.modify_avatar");
        resolve(true);
      })
      .catch((error)=>{
        reject(error);
      });

    });
  }


  /**
  Method used to modify the personal info of the user
  @param {object} form - Form that contains all the user info
  @return {Promise}
  */
  modify_personal_info(form){
    const _self=this;

    return new Promise((resolve,reject)=>{
      _self._microservice_client.send_query(_self._common_queries.UPDATE.personalInfo,form).then(()=>{

        _self._logOnDB("user.modify_info");
        resolve(true);
      })
      .catch((err)=>{
        reject(err);
      });
    });
  }

  /**
  Method used to modify the password of the user
  @param {object} fields - Form that contains all the user info
  @return {Promise}
  */
  modify_password(fields){

    const _self=this;

    return new Promise((resolve,reject)=>{
      _self._microservice_client.send_query(_self._common_queries.UPDATE.password,fields).then(()=>{

        _self._logOnDB("user.modify_password");
        resolve(true);
      })
      .catch((err)=>{
        reject(err);
      });
    });
  }

  /**
  Method used to parse the form used to create/modify a course
  @param {object} formulario - Form that contains all the content info
  @return {object}
  */
  
  _parseCourseForm(formulario){

    const _self=this;
    formulario["multiple_insert_query"]=eval("["+ formulario.tableTechnologies +"]");
    formulario["table_platforms"]=eval("["+ formulario.tablePlatforms +"]");
    formulario["servidores_contenidos"]=formulario['tableServCont']?eval("["+formulario['tableServCont']+"]"):eval("[]");
    formulario["recursos"]=eval("["+formulario["tableRecursos"]+"]");
    formulario["categorias"]=eval(formulario["categorias"]) ? eval(formulario["categorias"]) : [];
    formulario["fecha_alta"] = _self._file._returnActualDate();
    formulario["notas"] = (formulario["notas"]) ? formulario["notas"] : "Por defecto";
    formulario["indice_contenidos"] = (formulario["indice_contenidos"]) ? formulario["indice_contenidos"] : "Por defecto";
    formulario["notas_produccion"] = (formulario["notas_produccion"]) ? formulario["notas_produccion"] : "Por defecto";
    formulario["participantes"] = (formulario["participantes"]) ? formulario["participantes"] : "Por defecto";
    formulario["notas_contenidos"] = (formulario["notas_contenidos"]) ? formulario["notas_contenidos"] : "Por defecto";
    
    return formulario;
  }
  /**
  IMPORTANT! This method creates a new course on the platform.
  @param {Form} form - Form that contains all the info of the new course, among the
  @return {Promise}
  */
  create_course(form){

    const _self=this;
    return new Promise((resolve,reject)=>{

      form=_self._parseCourseForm(form);


      _self._microservice_client.send_query(_self._common_queries.GET.info_proveedor,form).then((data)=>{

        form['carpeta_proveedor']=data[0].carpeta_proveedor;
        _self._file.uploadContentFile(form['file_to_upload'],form,_self._file._config.fileUpload.directory,_self._file._config.fileUpload.extensionsAllowed).then(()=>{
          _self._db_connection.insert_new_content(form,_self._profile_queries).then(()=>{

            _self._file._ftp.extractZIP(form['file_to_upload'],form['ruta_descompresion']).then((data)=>{
              if(data){
                form['rutaEjecucion']=data;


                _self._microservice_client.send_query(_self._profile_queries.UPDATE.rutaEjecucion,{
                  rutaEjecucion:form['rutaEjecucion'],
                  id_contenido:form['id_contenido']
                }).then(()=>{
                  _self._microservice_client.send_email({type:"new_course",datos_curso:form}).then(()=>{
                    
                  });

                });

              }else{
                _self._microservice_client.send_email({type:"new_course",datos_curso:form}).then(()=>{

                });
              }
            });
            resolve(true);
          }).catch((error)=>{
            console.log(error);
            reject(error);
          });
        });
      });


    });
  }



  modify_course(form){

    const _self=this;

    return new Promise((resolve,reject)=>{
      // Once the form is parsed, we call the "close" function to send back the response

      form["fecha_alta"]=_self._file._returnActualDate();
      form["multiple_insert_query"]=eval("["+ form.tableTechnologies +"]");
      form["table_platforms"]=eval("["+ form.tablePlatforms +"]");
      form["servidores_contenidos"]=form['tableServCont']?eval("["+form['tableServCont']+"]"):eval("[]");
      form["recursos"]=eval("["+form["tableRecursos"]+"]");
      form["categorias"]=eval(form["categorias"]) ? eval(form["categorias"]) : [];


      _self._microservice_client.send_query(_self._common_queries.GET.info_proveedor,form).then((data)=>{
        form["carpeta_proveedor"]=data[0].carpeta_proveedor;
        // Si le pasamos el fichero para subir, el proceso es el mismo que el de creacion, pero haciendo update en vez de insert en la base de datos
        _self.get_content_by_id(form["id_contenido"]).then((content)=>{


          if(form['file_to_upload']){
            _self._file.uploadContentFile(form['file_to_upload'],form,_self._file._config.fileUpload.directory,_self._file._config.fileUpload.extensionsAllowed).then(()=>{
              _self._db_connection.update_content(content,_self._profile_queries,form,true).then(()=>{



                _self._file._ftp.extractZIP(form['file_to_upload'],form['ruta_descompresion']).then((data)=>{
                  if(data){
                    form['rutaEjecucion']=data;
                    _self._microservice_client.send_query(_self._profile_queries.UPDATE.rutaEjecucion,{
                      rutaEjecucion:form['rutaEjecucion'],
                      id_contenido:form['id_contenido']
                    }).then(()=>{


                      _self._microservice_client.send_email({type:"uploaded_course",datos_curso:form});

                      if(!_self._check_course_certified(content["compatibilities_table"]) &&
                      _self._check_course_certified(form["multiple_insert_query"])){
                        console.log("[EMAIL] Se ha certificado el curso correctamente....mandando email");
                        _self._microservice_client.send_email({type:"course_certified",datos_curso:form});
                      }

                      _self._close_connections();

                    })
                    .catch((err)=>{
                      console.log(err);
                    });
                  }

                });
                resolve(true);
              });

            })
            .catch((err)=>{
              reject(err);
            });
          }else{
            // Si no le pasamos un fichero, tenemos que mantener la misma ruta del zip que ya hay hasta el momento
            _self._db_connection.update_content(content,_self._profile_queries,form).then(()=>{

              if(!_self._check_course_certified(content["compatibilities_table"]) &&
              _self._check_course_certified(form["multiple_insert_query"])){
                console.log("[EMAIL] Se ha certificado el curso correctamente....mandando email");
                _self._microservice_client.send_email({type:"course_certified",datos_curso:form});
              }

              _self._close_connections();
              resolve(true);
            })
            .catch((err)=>{
              reject(err);
            });
          }
        })
        .catch((error)=>{
          reject(error);
        });

      })
      .catch((err)=>{
        reject(err);
      });


    });

  }


  //END OF THE USER CLASS --> DONT TOUCH THE BRACKET
}
module.exports=User;
