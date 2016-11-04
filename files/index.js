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
let options=require('./config.json');
let client = require('scp2');

let uploadFile=require('./uploadFile');

// Needed to create the File router
let express=require('express');
let routerFile=express.Router();



/*
We have to receive a file field in our request object where we can get
the information of the file.
*/
routerFile.post('upload',(req,res)=>{
  uploadFile.moveFileToServer();
})
// client.scp('file.txt',options, (err) => {
//
// });




module.exports=routerFile;
