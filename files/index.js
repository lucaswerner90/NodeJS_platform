/*
THIS FILE CONTROLLS THE FILEUPLOAD AND FTP FUNCTIONALITIES OF THE SERVER
*/


'use strict';
const fs=require('fs');
const ftp=require('./FTP');
const multiparty=require('multiparty');
const CONFIG=require('./config.json');

// Varibales that manage the data of the form
let formFields={};


// Needed to create the File router
const express=require('express');

const routerFile=express.Router();



routerFile.get('/download/filepath=:filepath',(req,res)=>{
  // The filepath param has to be passed after it had been encoded through the encodeURIComponent
  ftp.downloadFile(req.params.filepath).then((data)=>{

    // In case of error during the transference we've to inform it to the client
    data.once("error",(err)=>{
      ftp.disconnect();
      res.send({error:err});
    });

    // Once the transference has finished...
    data.once("end",()=>{
      ftp.disconnect();
      console.log(`Fichero ${req.params.filepath} descargado correctamente`);
    });

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
    return res.status(200).json({status:false});
  });

  // Once the form is parsed, we call the "close" function to send back the response
  form.once("close",()=>{
    form=null;
    formFields=null;
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

if(file.originalFilename.split(".").indexOf(CONFIG.fileUpload.extensionsAllowed[0])>-1){
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
