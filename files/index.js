/*
THIS FILE CONTROLLS THE FILEUPLOAD AND FTP FUNCTIONALITIES OF THE SERVER
*/


'use strict';
const PATH=require('path');
const fs=require('fs');
const ftp=require('./FTP');
const multiparty=require('multiparty');
const CONFIG=require('./config.json');
const DB=require('../db/coreFunctions');
const DBCourseQueries=require('../db/queries/course.json');
// Varibales that manage the data of the form
let formFields={};


// Needed to create the File router
const express=require('express');

const routerFile=express.Router();


// This function creates the date's info to append to the filename
const appendDate=function(){
  let fecha=new Date();
  let month=(fecha.getMonth()+1<10)?`0${fecha.getMonth()+1}`:fecha.getMonth()+1;
  return `${fecha.getFullYear()}_${month}_${fecha.getDate()}_${fecha.getHours()}_${fecha.getMinutes()}`;
};



routerFile.get('/download/filepath=:filepath',(req,res)=>{
  // The filepath param has to be passed after it had been encoded through the encodeURIComponent
  ftp.downloadFile(req.params.filepath).then((data)=>{

    // Once the transference has finished...
    // We set the appropiate headers to inform the client that it needs to download a file
    res.attachment(req.params.filepath);

    // We pipe the file throught the readableStream object to the response
    data.pipe(res);


  })
  .catch((err)=>{
    res.send({error:err});
  });
});





/*
We have to receive a file field in our request object where we can get
the information of the file.
*/
routerFile.post('/upload',(req,res)=>{

  let form = new multiparty.Form();
  formFields={};


  form.once("error",(err)=>{
    console.log("Error on parse form...");
    console.log(err);
    form=null;
    formFields=null;
    return res.status(200).json({status:false});
  });

  // Once the form is parsed, we call the "close" function to send back the response
  form.once("close",()=>{

    /*
    INSERT INTO catalogo_contenidos.contenidos (id_proveedor, titulo, descripcion, ruta_zip, id_tipo_contenido, duracion, id_sistema_evaluacion,id_estado) VALUES ([id_proveedor], [titulo], [descripcion], [ruta_zip], [id_tipo_contenido], [duracion], [id_sistema_evaluacion],[id_estado]);
    */
    DB.sendQuery(DBCourseQueries.insertContent,formFields).then((row)=>{

      // After insert the basic info about the content we need to populate the relations
      formFields["id_contenido"]=row.insertId;

      // So we send the query for that, managing both the success and the fail option.
      DB.sendQuery(DBCourseQueries.insertContentRelation,formFields).then(()=>{
        form=null;
        formFields=null;
        return res.status(200).json({status:true});
      }).catch((err)=>{
        form=null;
        formFields=null;
        return res.status(200).json({error:err});
      });

    }).catch((err)=>{
      form=null;
      formFields=null;
      return res.status(200).json({error:err});
    });

  });



  form.once("file",(name,file)=>{
    if(file.originalFilename.split(".").indexOf(CONFIG.fileUpload.extensionsAllowed[0])>-1){

      // We assign the path where the file will be located on the FTP server
      /*
      path.parse('/home/user/dir/file.txt')
      // Returns:
      // {
      //    root : "/",
      //    dir : "/home/user/dir",
      //    base : "file.txt",
      //    ext : ".txt",
      //    name : "file"
      // }
      */
      let newFilename=PATH.parse(file.originalFilename);
      newFilename.name=appendDate()+"_"+newFilename.name;
      formFields["ruta_zip"]=formFields["id_proveedor"]+"/"+formFields["id_proyecto"]+"/"+newFilename.name+newFilename.ext;

      // Create the readableStream to upload the file physically
      let readableStream = fs.createReadStream(file.path);
      ftp.uploadFile(readableStream,formFields["ruta_zip"]).then(()=>{
        readableStream=null;
      })
      .catch((err)=>{
        readableStream=null;
        return res.status(200).json({error:err});
      });
    }else{
      return res.status(200).json({error:"No file extension allowed"});
    }
  });



  form.on("field",(name,value)=>{
    formFields[name]=value;
  });


  form.parse(req);



});





module.exports=routerFile;
