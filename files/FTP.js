// This file implements all the methods that are used to connect to a FTP server

// Basic configuration
const config=require('./config.json');
const FTPS = require("ftps");

var ftp = new FTPS(config);
// Connect to FTP
exports.connect=()=>{
  console.log("Connecting to FTP...");

}
// Download from FTP
exports.downloadFile=(file)=>{

}
// Upload to FTP
exports.uploadFile=(file)=>{

}
