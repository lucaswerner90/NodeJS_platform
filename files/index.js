/*
THIS FILE CONTROLLS THE FILEUPLOAD AND FTP FUNCTIONALITIES OF THE SERVER
*/


"use strict";
const fs=require('fs');
const ftp=require('./FTP');
const multiparty=require('multiparty');
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




  form.once("error",(err)=>{
    console.log("Error on parse form...");
    console.log(err);
    return res.status(200).json({status:false});
  });

  // Once the form is parsed, we call the "close" function to send back the response
  form.once("close",()=>{
    form=null;
  });


  form.on("file",(name,file)=>{
    /*
    Example of what file variable contains:
    {
      fieldName: 'file',
      originalFilename: 'fim_1.mp3',
      path: '/var/folders/sj/fxs1vfbj0y5bfqy_bzc45lkh0000gn/T/lCVD6gnH4mTM9CLERgkhi9ar.mp3',
      headers:
        {
          'content-disposition': 'form-data; name="file"; filename="fim_1.mp3"',
          'content-type': 'audio/mp3'
        },
        size: 26875
    }
    */
    if(file.originalFilename.split(".").indexOf("zip")>-1){
      let readableStream = fs.createReadStream(file.path);
      ftp.uploadFile(readableStream,file.originalFilename).then(()=>{
        console.log("Escritura del fichero correcta");
        readableStream=null;
        return res.status(200).json({status:true});
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
