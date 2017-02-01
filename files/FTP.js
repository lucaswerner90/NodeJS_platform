// This file implements all the methods that are used to connect to a FTP server
'use strict';


// Basic configuration
const CONFIG=require('./config');
const PATH=require('path');
const ftpClient = require('ftp');
const FTP = new ftpClient();



function checkIfDirExists(dir,path=[]){
  for (let i = 0; i < path.length; i++) {
    if(path[i].name===dir){
      return true;
    }
  }
  return false;
}

// Creates a dir specifying the path on the server
function createDir(path){
  return new Promise((resolve,reject)=>{
    FTP.mkdir(path,true,(err)=>{
      if(err){
        reject(err);
      }
      resolve(true);
    });
  });
}



function createFile(path,remotePath){
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


function FTPDisconnect(){
  FTP.end();
  FTP.removeAllListeners();
}



// Download from FTP
exports.downloadFile=function(filePath){

  const rutaFile=filePath;

  // Connect to the FTP server with the CONFIG object setted on the config.json file
  FTP.connect(CONFIG.ftpConnection);

  return new Promise((resolve,reject)=>{

    // Once the connection is established
    FTP.once('greeting', function() {

      // We look for the files/dirs inside the specified filepath
      FTP.list(PATH.dirname(rutaFile),function(err, list) {

        // If there is an error listing on the FTP we reject the promise
        if(err) {
          FTPDisconnect();
          reject(err);
        }

        // If the file does not exists in the FTP we return a message advising it
        if(checkIfDirExists(PATH.basename(rutaFile),list)){

          // If the file exists...
          FTP.get(rutaFile,(err,fileStream)=>{
            if(err) {
              FTPDisconnect();
              reject(err);
            }


            fileStream.once("end",()=>{
              FTPDisconnect();
              console.log(`Fichero ${rutaFile} descargado correctamente`);
            });

            fileStream.once("error",()=>{
              FTPDisconnect();
              reject(`Error transmitting the file...`);
            });

            // We returned a readableStream to pass it to the response
            resolve(fileStream);

          });
        }else{
          reject(`File doesn't exist on the specified path`);
        }
      });


    });

  });
};




// Upload to FTP
exports.uploadFile=function(file,FTPPath){


  FTP.connect(CONFIG.ftpConnection);

  return new Promise(function(resolve,reject){

    // Connect to the FTP server with the CONFIG object setted on the config.json file

    // When the connection is ready....
    FTP.once('ready', function() {
      // First of all we have to list the cwd to check if the user's directory exists.
      FTP.list(function(err, list) {
        // If there is any error firing the ls command
        if (err) {
          reject(err);
        }
        // If the user's directory exists, we only need to upload the file...
        if(checkIfDirExists(PATH.dirname(FTPPath),list)){

          createFile(file,FTPPath).then(()=>{
            FTPDisconnect();
            resolve(true);
          })
          .catch((err)=>{
            FTPDisconnect();
            reject(err);
          });
          // If the user's directory doesn't exist we have to create it first, and upload the file later that.
        }else{
          createDir(PATH.dirname(FTPPath)).then(()=>{
            createFile(file,FTPPath).then(()=>{
              FTPDisconnect();
              resolve(true);
            })
            .catch((err)=>{
              console.log("Error creating file on FTP");
              FTPDisconnect();
              reject(err);
            });
          })
          .catch((err)=>{
            FTPDisconnect();
            reject(err);
          });
        }

      });


    });
    FTP.once('error',(err)=>{
      reject(err);
    });

  });
};
