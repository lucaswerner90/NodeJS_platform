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


// Needed to create the File router
const express=require('express');
let routerFile=express.Router();



/*
We have to receive a file field in our request object where we can get
the information of the file.
*/
routerFile.post('/upload',(req,res)=>{
  form.parse(req, function(err, fields, files) {
    // fields fields fields
    console.log(fields);
    console.log(files);
  });


});





module.exports=routerFile;
