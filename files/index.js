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
let formidable = require('formidable');
let path = require('path');


let options=require('./config.json');

let uploadFile=require('./uploadFile');
let emailSender=require('../email/index');



// Needed to create the File router
const express=require('express');
let routerFile=express.Router();



/*
We have to receive a file field in our request object where we can get
the information of the file.
*/
routerFile.post('/upload',(req,res)=>{
  console.log("Request received...FILE/UPLOAD");
  console.log(req.body);
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '/uploads');

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);



  res.send(req.body);
});





module.exports=routerFile;
