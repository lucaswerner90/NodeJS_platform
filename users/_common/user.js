"use strict";


const Database=require('../../db/database');
const File=require('../../files/_fileModel');
const DBCommonQueries=require('../../db/queries/user/_common.json');


class User{


  constructor(id_usuario=-1,queries){
    this._id_usuario=parseInt(id_usuario);
    this._db_connection=new Database();
    this._file=new File();

    this._profile_queries=queries;
    this._common_queries=DBCommonQueries;
  }


  _logOnDB(action){
    this._db_connection.recordOnLog(action,{
      id_usuario:this._id_usuario
    });
  }


  _close_connections(){
    const _self=this;
    _self._db_connection._close_connection();
    _self._file._close_connection();

  }
  _get_type_of_user(){

    const _self=this;

    if(_self._id_usuario===-1) return "Administrador";

    return new Promise((resolve,reject)=>{
      _self.get_user_info().then((result)=>{
        _self._db_connection.sendQuery(_self._common_queries.GET.type_of_user,{
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
    });
  }

  download_zip(filename,response){
    const _self=this;
    _self._file.downloadFile(filename,response);
  }

  search_course(fields){
    const _self=this;

    return new Promise((resolve,reject)=>{
      _self._db_connection.sendQuery(_self._common_queries.GET.search,fields,true).then((data)=>{
        let arrayPromises=[];
        for (let i = 0; i < data.length; i++) {
          arrayPromises[i]=_self._db_connection.sendQuery(_self._common_queries.GET.tableOfCompatibilities,data[i]);
        }

        Promise.all(arrayPromises).then((values)=>{
          for (let i = 0; i < data.length; i++) {
            data[i].compatibilities_table=values[i];
          }
          _self._close_connections();
          resolve(data);
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


  get_user_info(){

    const _self=this;
    return new Promise((resolve,reject)=>{
      _self._db_connection.sendQuery(_self._common_queries.GET.user_info,{id_usuario:_self._id_usuario}).then((data)=>{
        resolve(data[0]);
      })
      .catch((err)=>{
        reject(err);
      });
    });
  }

  get_login_info(params){
    const _self=this;
    return new Promise(function(resolve, reject) {

      _self._db_connection.sendQuery(_self._common_queries.GET.login_info,params).then((rows)=>{

        if(rows.length===0){
          // Si no se encuentra registrado en la base de datos se le devuelve un codigo 401
          // indicando que no esta autorizado y el token como null.
          reject({token:null});
        }else{
          if(rows[0].urlAvatar!==null){
            _self._file._downloadImageInBase64(rows[0].urlAvatar).then((data)=>{
              rows[0].imgAvatar=data;
              resolve({userInfo:rows[0]});

            })
            .catch((err)=>{
              reject(err);
            });
          }else{
            // Si el usuario se encuentra dentro del sistema de la base de datos entonces
            // devolvemos el token que usará para mantener la sesion en la plataforma
            resolve({userInfo:rows[0]});
          }

        }
      });
    });

  }

  get_contents(){
    const _self=this;
    return new Promise((resolve,reject)=>{
      _self.get_user_info().then((result)=>{

        _self._db_connection.sendQuery(_self._common_queries.GET.contents_proveedor,result).then((data)=>{

          let arrayPromises=[];
          for (let i = 0; i < data.length; i++) {
            arrayPromises[i]=_self._db_connection.sendQuery(_self._common_queries.GET.tableOfCompatibilities,data[i]);
          }

          Promise.all(arrayPromises).then((values)=>{
            for (let i = 0; i < data.length; i++) {
              data[i].compatibilities_table=values[i];
            }
            _self._close_connections();
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          });
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


  get_platform_generic_info(){
    const _self=this;
    return new Promise((resolve,reject)=>{
      _self._db_connection.sendQuery(_self._common_queries.GET.generic_information,null).then((data)=>{
        _self._close_connections();
        resolve({
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
          servidores_contenidos:data[14]
        });
      })
      .catch((err)=>{
        reject(err);
      });
    });
  }



  get_avatar(filename){
    const _self=this;
    return new Promise((resolve,reject)=>{
      _self._file.downloadImageInBase64(filename).then((data)=>{
        _self._close_connections();
        resolve(data);
      })
      .catch((err)=>{
        reject(err);
      });
    });

  }


  modify_avatar(form,file){

    const _self=this;

    return new Promise((resolve,reject)=>{


      _self._file.uploadContentFile(file,form,_self._file._config.avatarUpload.directory,_self._file._config.avatarUpload.extensionsAllowed,true);
      _self._db_connection.sendQuery(_self._common_queries.UPDATE.avatar,form).then(()=>{

        _self._id_usuario=form.id_usuario;
        _self._logOnDB("user.modify_avatar");
        _self._close_connections();
        resolve(true);
      })
      .catch((err)=>{
        reject(err);
      });
    });
  }



  modify_personal_info(form){
    const _self=this;

    return new Promise((resolve,reject)=>{
      _self._db_connection.sendQuery(_self._common_queries.UPDATE.personalInfo,form).then(()=>{

        _self._logOnDB("user.modify_info");
        _self._close_connections();
        resolve(true);
      })
      .catch((err)=>{
        reject(err);
      });
    });
  }


  modify_password(fields){

    const _self=this;

    return new Promise((resolve,reject)=>{
      _self._db_connection.sendQuery(_self._common_queries.UPDATE.password,fields).then(()=>{

        _self._logOnDB("user.modify_password");
        _self._close_connections();
        resolve(true);
      })
      .catch((err)=>{
        reject(err);
      });
    });
  }


  create_course(form){

    const _self=this;

    return new Promise((resolve,reject)=>{

      form["multiple_insert_query"]=eval("["+ form.tableTechnologies +"]");
      debugger;
      form['url_image'];
      _self._db_connection.sendQuery(_self._common_queries.GET.info_proveedor,form).then((data)=>{


        form['carpeta_proveedor']=data[0].carpeta_proveedor;


        _self._file.uploadContentFile(form['file_to_upload'],form,_self._file._config.fileUpload.directory,_self._file._config.fileUpload.extensionsAllowed).then(()=>{


          _self._db_connection.insert_new_content(form,_self._profile_queries).then(()=>{

            _self._file._ftp.extractZIP(form['file_to_upload'],form['ruta_zip']).then(()=>{
              console.log("ZIP EXTRACTED CORRECTLY....");
              _self._db_connection.recordOnLog("course.upload",{
                id_usuario:_self._id_usuario,
                id_contenido:form.id_contenido
              });
              _self._close_connections();
            })
            .catch((err)=>{
              console.error("*****  ERROR EXTRACTING ZIP  *****");
              console.error(err);
              reject(err);
            });

            resolve(true);

          })
          .catch((err)=>{
            reject(err);
          });
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



  modify_course(form){

    const _self=this;

    return new Promise((resolve,reject)=>{
      // Once the form is parsed, we call the "close" function to send back the response

      form["fecha_alta"]=_self._file._returnActualDate();
      form["multiple_insert_query"]=eval("["+ form.tableTechnologies +"]");
      // Si le pasamos el fichero para subir, el proceso es el mismo que el de creacion, pero haciendo update en vez de insert en la base de datos
      if(form['file_to_upload']){
        _self._file.uploadContentFile(form['file_to_upload'],form,_self._file._config.fileUpload.directory,_self._file._config.fileUpload.extensionsAllowed).then(()=>{
          _self._db_connection.update_content(_self._profile_queries,form,true).then(()=>{

            _self._file._ftp.extractZIP(form['file_to_upload'],form['ruta_zip']).then(()=>{
              console.log("ZIP EXTRACTED CORRECTLY....");
              _self._close_connections();
            })
            .catch((err)=>{
              console.error("*****  ERROR EXTRACTING ZIP  *****");
              console.error(err);
            });
            _self._db_connection.recordOnLog("course.modify",
            {
              id_usuario:form.id_usuario,
              id_contenido:form.id_contenido
            });
            resolve(true);

          })
          .catch((err)=>{
            reject(err);
          });
        })
        .catch((err)=>{
          reject(err);
        });
      }else{
        // Si no le pasamos un fichero, tenemos que mantener la misma ruta del zip que ya hay hasta el momento
        _self._db_connection.update_content(_self._profile_queries,form).then(()=>{

          _self._db_connection.recordOnLog("course.modify",
          {
            id_usuario:form.id_usuario,
            id_contenido:form.id_contenido
          });


          resolve(true);
        })
        .catch((err)=>{
          reject(err);
        });
      }

    });

  }


  //END OF THE USER CLASS --> DONT TOUCH THE BRACKET
}



module.exports=User;
