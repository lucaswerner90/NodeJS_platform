// Needed to create the Modify information router
const express=require('express');

const router=express.Router();
const multiparty=require('multiparty');


const FILE_FUNCTIONS = require('../files/fileFunctions');

const FILE_CONFIG= require('../files/config.json');
const DB=require('../db/coreFunctions');
const DBUserQueries=require('../db/queries/user.json');

const recordOnLog=function(action,id_usuario){
  // Record the user's login
  DB.logActions(action,
  {
    id_usuario:id_usuario,
    id_contenido:'0',
    fecha_modificacion:new Date().toISOString().slice(0, 19).replace('T', ' ')
  });
};

router.post('/personal_info',(req,res)=>{
  /*
  UPDATE usuarios SET Nombre=[nombre],Apellidos=[apellidos],email=[email] WHERE id_usuario=[id_usuario]
  */
  DB.sendQuery(DBUserQueries.UPDATE.personalInfo,req.body).then(()=>{

    recordOnLog("user.modify_info",req.body.id_usuario);

    res.send({status:true});
  })
  .catch((err)=>{
    res.send({error:err});
  });
});



router.post('/change_password',(req,res)=>{
  /*
  UPDATE usuarios SET password=[password] WHERE id_usuario=[id_usuario]
  */
  DB.sendQuery(DBUserQueries.UPDATE.password,req.body).then(()=>{

    recordOnLog("user.modify_password",req.body.id_usuario);

    res.send({status:true});
  })
  .catch((err)=>{
    res.send({error:err});
  });
});


router.post('/avatar',(req,res)=>{
  let formData={};
  let form = new multiparty.Form();
  let fieldFile='';

  // This function is usefull to clear data from local variables.
  function deleteReferences(){
    formData=null;
    fieldFile=null;
    form.removeAllListeners();
    form=null;

  }


  // We do the parse of the form.
  // This form needs a user_id and an image file only.

  form.once("error",(err)=>{
    deleteReferences();
    res.send({error:err});
  });



  form.once("close",()=>{
    FILE_FUNCTIONS.uploadContentFile(formData[fieldFile],formData,FILE_CONFIG.avatarUpload.directory,FILE_CONFIG.avatarUpload.extensionsAllowed,true);
    DB.sendQuery(DBUserQueries.UPDATE.avatar,formData).then(()=>{
      deleteReferences();

      recordOnLog("user.modify_avatar",formData["id_usuario"]);

      res.send({status:true});
    })
    .catch((err)=>{
      deleteReferences();
      res.send({error:err});
    });
  });

  form.once("field",(name,value)=>{
    formData[name]=value;
  });

  form.once("file",(name,file)=>{
    fieldFile=name;
    formData[fieldFile]=file;
  });

  form.parse(req);
});





module.exports=router;
