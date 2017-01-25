// Needed to create the Modify information router
const express=require('express');

const router=express.Router();
const multiparty=require('multiparty');


const FILE_FUNCTIONS = require('../files/fileFunctions');

const FILE_CONFIG= require('../files/config.json');
const DB=require('../db/coreFunctions');
const DBUserQueries=require('../db/queries/user.json');




router.post('/personal_info',(req,res)=>{
  /*
  UPDATE usuarios SET Nombre=[nombre],Apellidos=[apellidos],email=[email] WHERE id_usuario=[id_usuario]
  */
  DB.sendQuery(DBUserQueries.UPDATE.personalInfo,req.body).then(()=>{
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
    form=null;
    fieldFile=null;
  }


  // We do the parse of the form.
  // This form needs a user_id and an image file only.

  form.once("error",(err)=>{
    deleteReferences();
    res.send({error:err});
  });



  form.once("close",()=>{
    console.log(formData);
    FILE_FUNCTIONS.uploadContentFile(formData[fieldFile],formData,res,FILE_CONFIG.avatarUpload.directory,FILE_CONFIG.avatarUpload.extensionsAllowed,true);

    DB.sendQuery(DBUserQueries.UPDATE.avatar,formData).then(()=>{
      deleteReferences();
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
