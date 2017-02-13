'use strict';
const multiparty=require('multiparty');
const DB=require('../db/coreFunctions');
const DBCourseQueries=require('../db/queries/course.json');
const FILE=require('./fileFunctions');
const FTP=require('./FTP');
const CONFIG=require('./config.json');
const modifyInfoUser=require('../users/_common/modify');
const getInfoUser=require('../users/_common/get');
const insertInfo=require('../users/_common/insert');


// Varibales that manage the data of the form
let formFields={};


// Needed to create the File router
const express=require('express');

const router=express.Router();


/********************************************************************************************************************/
/********************************************************************************************************************/
const updateContentInDB=(camposFormulario,updateFile=false)=>{


  function removeVariables(){
    camposFormulario=null;
  }

  return new Promise((resolve,reject)=>{
    DB.sendQuery((updateFile)?DBCourseQueries.UPDATE.content:DBCourseQueries.UPDATE.contentNoFile,camposFormulario).then(()=>{

      DB.sendQuery(DBCourseQueries.UPDATE.tableOfCompatibilities,
      {
        multiple_insert_query:DB.createCompatibilityTableForInsertCourseQuery(camposFormulario.multiple_insert_query,camposFormulario.id_contenido,camposFormulario.id_usuario).multiple_insert_query,
        id_contenido:camposFormulario.id_contenido
      }).then(()=>{
        removeVariables();
        resolve({status:true});
      })
      .catch((err)=>{
        removeVariables();
        reject(err);
      });

    }).catch((err)=>{
      removeVariables();
      reject(err);
    });
  });



};
/********************************************************************************************************************/

const insertNewContentToDB=(form,camposFormulario)=>{

  function removeVariables(){
    form.removeAllListeners();
    form=null;
    camposFormulario=null;
  }
  return new Promise(function(resolve, reject) {
    DB.sendQuery(DBCourseQueries.INSERT.content,camposFormulario).then((row)=>{

      // After insert the basic info about the content we need to populate the relations
      camposFormulario["id_contenido"]=row.insertId;

      // So we send the query for that, managing both the success and the fail option.
      DB.sendQuery(DBCourseQueries.INSERT.contentRelation,camposFormulario).then(()=>{

        DB.sendQuery(DBCourseQueries.INSERT.tableOfCompatibilities,
          {
            multiple_insert_query:DB.createCompatibilityTableForInsertCourseQuery(camposFormulario.multiple_insert_query,camposFormulario.id_contenido,camposFormulario.id_usuario).multiple_insert_query
          }).then(()=>{
          removeVariables();
          resolve({status:true});
        })
        .catch((err)=>{
          removeVariables();
          reject(err);
        });

      }).catch((err)=>{
        removeVariables();
        reject(err);
      });

    }).catch((err)=>{
      removeVariables();
      reject(err);
    });
  });

};

/********************************************************************************************************************/
/********************************************************************************************************************/

router.get('/download/filepath=:filepath',(req,res)=>{
  // The filepath param has to be passed after it had been encoded through the encodeURIComponent
  FILE.downloadFile(req.params.filepath,res);
});

/********************************************************************************************************************/
/*
We have to receive a file field in our request object where we can get
the information of the file.
*/
// TODO: Reestructurar las diferentes funciones para los diferentes tipos de usuarios.
router.post('/intern/create/course',(req,res)=>{
  let form = new multiparty.Form();
  formFields={};

  form.once("error",()=>{
    console.log("Error on parse form...");
    form.removeAllListeners();
    form=null;
    formFields=null;
    return res.status(200).json({status:false});
  });

  // Once the form is parsed, we call the "close" function to send back the response
  form.once("close",()=>{
    formFields["multiple_insert_query"]=eval("["+ formFields.tableTechnologies +"]");
    FILE.uploadContentFile(formFields['file_to_upload'],formFields,CONFIG.fileUpload.directory,CONFIG.fileUpload.extensionsAllowed).then(()=>{
      insertNewContentToDB(form,formFields).then(()=>{


        FTP.extractZIP(formFields['file_to_upload'],formFields['ruta_zip']).then(()=>{
          console.log("ZIP EXTRACTED CORRECTLY....");
          DB.recordOnLog("course.upload",{
            id_usuario:formFields.id_usuario,
            id_contenido:formFields.id_contenido
          });
        })
        .catch((err)=>{
          console.error("*****  ERROR EXTRACTING ZIP  *****");
          console.error(err);
        });

        form.removeAllListeners();
        return res.send({status:true});

      })
      .catch((err)=>{
        return res.send({error:err});
      });
    })
    .catch((err)=>{
      return res.status(200).send({error:err});
    });

  });

  form.on("file",(name,file)=>{
    if(name==='screenshot'){
        formFields['screenshot']=file;
    }else{
      formFields['file_to_upload']=file;
    }

  });

  form.on("field",(name,value)=>{
    formFields[name]=value;
  });


  form.parse(req);



});

/********************************************************************************************************************/
router.post('/intern/modify/course',(req,res)=>{

  let form = new multiparty.Form();
  formFields={};

  form.once("error",()=>{
    console.log("Error on parse form...");
    form=null;
    formFields=null;
    return res.status(200).json({status:false});
  });


  // Once the form is parsed, we call the "close" function to send back the response
  form.once("close",()=>{

    formFields["fecha_alta"]=FILE.returnActualDate();
    formFields["multiple_insert_query"]=eval("["+ formFields.tableTechnologies +"]");
    // Si le pasamos el fichero para subir, el proceso es el mismo que el de creacion, pero haciendo update en vez de insert en la base de datos
    if(formFields['file_to_upload']){
      FILE.uploadContentFile(formFields['file_to_upload'],formFields,CONFIG.fileUpload.directory,CONFIG.fileUpload.extensionsAllowed).then(()=>{
        updateContentInDB(formFields,true).then(()=>{

          FTP.extractZIP(formFields['file_to_upload'],formFields['ruta_zip']).then(()=>{
            console.log("ZIP EXTRACTED CORRECTLY....");

          })
          .catch((err)=>{
            console.error("*****  ERROR EXTRACTING ZIP  *****");
            console.error(err);
          })


          DB.recordOnLog("course.modify",
          {
            id_usuario:formFields.id_usuario,
            ic_contenido:formFields.id_contenido
          });
          return res.status(200).send({status:true});
        })
        .catch((err)=>{
          return res.status(200).send({error:err});
        });
      })
      .catch((err)=>{
        return res.status(200).send({error:err});
      });
    }else{

      // Si no le pasamos un fichero, tenemos que mantener la misma ruta del zip que ya hay hasta el momento
      updateContentInDB(formFields).then(()=>{
        return res.status(200).send({status:true});
      })
      .catch((err)=>{
        return res.status(200).send({error:err});
      });
    }
  });


  form.on("file",(name,file)=>{
    if(name==='screenshot'){
        formFields['screenshot']=file;
    }else{
      formFields['file_to_upload']=file;
    }

  });

  form.on("field",(name,value)=>{
    formFields[name]=value;
  });


  form.parse(req);



});

/********************************************************************************************************************/


router.use('/insert',insertInfo);
router.use('/modify',modifyInfoUser);
router.use('/get',getInfoUser);
/********************************************************************************************************************/
/********************************************************************************************************************/

module.exports=router;
/********************************************************************************************************************/
