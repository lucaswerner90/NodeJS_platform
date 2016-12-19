/*
THIS FILE CONTROLLS THE FILEUPLOAD AND FTP FUNCTIONALITIES OF THE SERVER
*/

/*

var fs = require('fs');
var readableStream = fs.createReadStream('file1.txt');
var writableStream = fs.createWriteStream('file2.txt');

readableStream.pipe(writableStream);

*/
"use strict";
let path = require('path');
let fs=require('fs');
let ftp=require('./FTP');
let uploadFile=require('./uploadFile');
let multiparty=require('multiparty');
const CONFIG=require('./config');

// Varibales that manage the data of the form
let formFields={};
let formFiles={};


// Needed to create the File router
const express=require('express');
let routerFile=express.Router();


/*
We have to receive a file field in our request object where we can get
the information of the file.
*/
routerFile.post('/upload',(req,res)=>{
  let form = new multiparty.Form();
  let writableStream;
  console.time("Subida de fichero");


  form.on("error",(err)=>{
    console.log("Error on parse form...");
    console.log(err);
    return res.status(200).json({status:false});
  })
  // Once the form is parsed, we call the "close" function to send back the response
  form.on("close",()=>{
    form=null;

    writableStream.on("finish",()=>{
      console.log("Escritura del fichero correcta");
      console.timeEnd("Subida de fichero");
      writableStream=null;
      console.log(formFields);
      return res.status(200).json({status:true});
    });

  });


  form.on("file",(name,file)=>{
    console.log("Fichero recibido....");
    /*
    Example of what file variable contains:
    { fieldName: 'file',
    originalFilename: 'fim_1.mp3',
    path: '/var/folders/sj/fxs1vfbj0y5bfqy_bzc45lkh0000gn/T/lCVD6gnH4mTM9CLERgkhi9ar.mp3',
    headers:
    { 'content-disposition': 'form-data; name="file"; filename="fim_1.mp3"',
    'content-type': 'audio/mp3' },
    size: 26875 }
    */
    let readableStream = fs.createReadStream(file.path);
    writableStream = fs.createWriteStream(`${CONFIG.fileUpload.directory}/${file.originalFilename}`);
    readableStream.pipe(writableStream);
  });

  form.on("field",(name,value)=>{
    console.log("Field received..."+name);
    formFields[name]=value;
  });


  form.parse(req);



});





module.exports=routerFile;
