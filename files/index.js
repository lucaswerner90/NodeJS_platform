'use strict';
const multiparty=require('multiparty');
const DB=require('../db/coreFunctions');
const DBCourseQueries=require('../db/queries/course.json');
const FILE=require('./fileFunctions');
const CONFIG=require('./config.json');
const modifyInfoUser=require('../users/modify');
const getInfoUser=require('../users/get');


// Varibales that manage the data of the form
let formFields={};


// Needed to create the File router
const express=require('express');

const router=express.Router();


const insertNewContentToDB=(form,camposFormulario,response)=>{

  function removeVariables(){
    form=null;
    camposFormulario=null;
  }
  DB.sendQuery(DBCourseQueries.INSERT.content,camposFormulario).then((row)=>{

    // After insert the basic info about the content we need to populate the relations
    camposFormulario["id_contenido"]=row.insertId;

    // So we send the query for that, managing both the success and the fail option.
    DB.sendQuery(DBCourseQueries.INSERT.contentRelation,camposFormulario).then(()=>{
      removeVariables();
      return response.status(200).json({status:true});
    }).catch((err)=>{
      removeVariables();
      return response.status(200).json({error:err});
    });

  }).catch((err)=>{
    removeVariables();
    return response.status(200).json({error:err});
  });
};



router.get('/download/filepath=:filepath',(req,res)=>{
  // The filepath param has to be passed after it had been encoded through the encodeURIComponent
  FILE.downloadFile(req.params.filepath,res);
});


/*
We have to receive a file field in our request object where we can get
the information of the file.
*/
router.post('/intern/create/course',(req,res)=>{

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
    insertNewContentToDB(form,formFields,res);
  });

  form.once("file",(name,file)=>{
    FILE.uploadContentFile(file,formFields,res,CONFIG.fileUpload.directory,CONFIG.fileUpload.extensionsAllowed);
  });

  form.on("field",(name,value)=>{
    console.log(name+"      "+value);
    formFields[name]=value;
  });


  form.parse(req);



});




router.use('/modify',modifyInfoUser);
router.use('/get',getInfoUser);


module.exports=router;
