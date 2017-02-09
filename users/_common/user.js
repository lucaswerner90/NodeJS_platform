"use strict";


const DB=require('../../db/coreFunctions');
const multiparty=require('multiparty');
const FILE_FUNCTIONS = require('../../files/fileFunctions');
const FILE_CONFIG= require('../../files/config.json');
const DBCommonQueries=require('../../db/queries/user/_common.json');
const DBCourseQueries=require('../../db/queries/course.json');


class User{


  constructor(id_usuario=-1){
    this._id_usuario=id_usuario;
  }

  _logOnDB(action){
    DB.recordOnLog(action,{
      id_usuario:this._id_usuario
    });
  }

  _get_type_of_user(){
    let _self=this;
    return new Promise((resolve,reject)=>{
      _self.get_user_info().then((result)=>{
        DB.sendQuery(DBCommonQueries.GET.type_of_user,{
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
    FILE_FUNCTIONS.downloadFile(filename,response);
  }

  search_course(fields){

    return new Promise((resolve,reject)=>{
      DB.sendQuery(DBCommonQueries.GET.search,fields,true).then((data)=>{
        resolve(data);
      })
      .catch((err)=>{
        reject(err);
      });
    });
  }


  get_user_info(){

    let _self=this;
    return new Promise((resolve,reject)=>{
      DB.sendQuery(DBCommonQueries.GET.user_info,{id_usuario:_self._id_usuario}).then((data)=>{
        resolve(data[0]);
      })
      .catch((err)=>{
        reject(err);
      });
    });
  }



  get_contents(){
    let _self=this;
    return new Promise((resolve,reject)=>{
      _self.get_user_info().then((result)=>{

        DB.sendQuery(DBCommonQueries.GET.contents_proveedor,result).then((data)=>{

          let arrayPromises=[];
          for (let i = 0; i < data.length; i++) {
            arrayPromises[i]=DB.sendQuery(DBCourseQueries.GET.tableOfCompatibilities,data[i]);
          }

          Promise.all(arrayPromises).then((values)=>{
            for (let i = 0; i < data.length; i++) {
              data[i].compatibilities_table=values[i];
            }
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
    return new Promise((resolve,reject)=>{
      DB.sendQuery(DBCommonQueries.GET.generic_information,null).then((data)=>{
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
          tipo_desarrollo:data[13]
        });
      })
      .catch((err)=>{
        reject(err);
      });
    });
  }



  get_avatar(filename){
    return new Promise((resolve,reject)=>{
      FILE_FUNCTIONS.downloadImageInBase64(filename).then((data)=>{
        resolve(data);
      })
      .catch((err)=>{
        reject(err);
      });
    });

  }


  modify_avatar(request){
    let _self=this;
    let formData={};
    let form = new multiparty.Form();
    let fieldFile='';

    return new Promise((resolve,reject)=>{

      form.once("error",(err)=>{
        reject(err);
      });
      form.once("field",(name,value)=>{
        formData[name]=value;
      });

      form.once("file",(name,file)=>{
        fieldFile=name;
        formData[fieldFile]=file;
      });

      form.once("close",()=>{



        FILE_FUNCTIONS.uploadContentFile(formData[fieldFile],formData,FILE_CONFIG.avatarUpload.directory,FILE_CONFIG.avatarUpload.extensionsAllowed,true);
        DB.sendQuery(DBCommonQueries.UPDATE.avatar,formData).then(()=>{

          _self._id_usuario=formData.id_usuario;
          this._logOnDB("user.modify_avatar");
          form.removeAllListeners();

          resolve(true);
        })
        .catch((err)=>{
          reject(err);
        });
      });

      form.parse(request);
    });
  }

  modify_personal_info(request){


    return new Promise((resolve,reject)=>{
      DB.sendQuery(DBCommonQueries.UPDATE.personalInfo,request.body).then(()=>{

        this._logOnDB("user.modify_info");

        resolve(true);
      })
      .catch((err)=>{
        reject(err);
      });
    });
  }


  modify_password(fields){

    return new Promise((resolve,reject)=>{
      DB.sendQuery(DBCommonQueries.UPDATE.password,fields).then(()=>{

        this._logOnDB("user.modify_password");
        resolve(true);
      })
      .catch((err)=>{
        reject(err);
      });
    });
  }



}



module.exports=User;
