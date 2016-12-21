// This file implements all the methods that are used to connect to a FTP server
"use strict";
// Basic configuration
const CONFIG=require('./config');
const ftpClient = require('ftp');
const FTP = new ftpClient();



const checkIfDirExists=function (dir,path=[]){
  for (let i = 0; i < path.length; i++) {
    if(path[i].name===dir) return true;
  }
  return false;
}

// Creates a dir specifying the path on the server
const createDir=function (path){
  return new Promise((resolve,reject)=>{
    FTP.mkdir(path,true,(err)=>{
      console.log("Creating the dir..."+path);
      if(err){
        console.log("Error creating the dir on createDir()");
        reject(err);
      }
      resolve(true);
    });
  });
}


const createFile=function (path,remotePath){
  return new Promise((resolve,reject)=>{
    FTP.put(path, remotePath, function(err) {
      if (err){
        console.log(err);
        reject(err);
      } else{
        resolve(true);
      }
    });
  });
}


// Download from FTP
exports.downloadFile=(file)=>{

  // Connect to the FTP server with the CONFIG object setted on the config.json file
  FTP.connect(CONFIG.ftpConnection);

  return new Promise((resolve,reject)=>{
    FTP.once('ready', function() {
      FTP.list(CONFIG.ftpConnection.uploadsDirectory,function(err, list) {

      });


    });
  });
}
// Upload to FTP
exports.uploadFile=(file,remotePath)=>{

  let pruebaDirUser="otraPruebaDeUsuario";
  let FTPPath=CONFIG.ftpConnection.uploadsDirectory+pruebaDirUser+"/"+remotePath;

  // Connect to the FTP server with the CONFIG object setted on the config.json file
  FTP.connect(CONFIG.ftpConnection);

  return new Promise((resolve,reject)=>{
    // When the connection is ready....
    FTP.once('ready', function() {
        // First of all we have to list the cwd to check if the user's directory exists.
        FTP.list(function(err, list) {
          // If there is any error firing the ls command
          if (err) reject(err);

          // If the user's directory exists, we only need to upload the file...
          if(checkIfDirExists(pruebaDirUser,list)){
            console.log("Directory exists..");
            console.log(FTPPath);
            createFile(file,FTPPath).then(()=>{
              FTP.end();

              resolve(true);
            })
            .catch((err)=>{
              FTP.end();
              reject(err);
            });
            // If the user's directory doesn't exist we have to create it first, and upload the file later that.
          }else{
            createDir(CONFIG.ftpConnection.uploadsDirectory+pruebaDirUser).then(()=>{
              console.log("File: "+file);
              console.log("FTPPath: "+FTPPath);
              createFile(file,FTPPath).then(()=>{
                console.log("Created file on FTP");
                FTP.end();
                resolve(true);
              })
              .catch((err)=>{
                console.log("Error creating file on FTP");
                FTP.end();
                reject(err);
              });
            })
            .catch((err)=>{
              FTP.end();
              reject(err);
            })
          }

        });


    });

  });
}
