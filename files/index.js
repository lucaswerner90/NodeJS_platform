/*
THIS FILE CONTROLLS THE FILEUPLOAD AND FTP FUNCTIONALITIES OF THE SERVER
*/

/*

Example of options configuration

{
"host":"",
"username":"",
"password":"",
"path": ""
}
*/
"use strict";
let path = require('path');

let ftp=require('./FTP');
let uploadFile=require('./uploadFile');
let multiparty=require('multiparty');
let form = new multiparty.Form();

// Varibales that manage the data of the form
let formFields={};
let formFiles={};

// Needed to create the File router
const express=require('express');
let routerFile=express.Router();

function parseForm(req){

  formFields,formFiles={};
  form.parse(req, function(err, fields, files) {



    for (let field in fields) {
      formFields[field]=fields[field][0];
      console.log(formFields);
    }
    for (let file in files) {
      console.log(files[file][0]);
    }

  });
}

/*
We have to receive a file field in our request object where we can get
the information of the file.
*/
routerFile.post('/upload',(req,res)=>{
  parseForm(req);
  return res.status(200).send({message:'Form parsed correctly'});


});





module.exports=routerFile;
