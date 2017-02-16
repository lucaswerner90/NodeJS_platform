// This file implements all the methods that are used to connect to a FTP server
'use strict';


// Basic configuration
const CONFIG=require('./config');
const PATH=require('path');
const FTP_CLIENT = require('ftp');
const FTP = new FTP_CLIENT();
const unzip=require('unzip');
const fs=require('fs');

const appendDateToFilename=()=>{
  const fecha=new Date();
  const month=(fecha.getMonth()+1<10)?`0${fecha.getMonth()+1}`:fecha.getMonth()+1;
  const day=(fecha.getDate()+1<10)?`0${fecha.getDate()}`:fecha.getDate();
  const hours=(fecha.getHours()+1<10)?`0${fecha.getHours()+1}`:fecha.getHours()+1;
  const minutes=(fecha.getMinutes()<10)?`0${fecha.getMinutes()+1}`:fecha.getMinutes()+1;
  return `${fecha.getFullYear()}_${month}_${day}_${hours}_${minutes}`;
};





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
      console.info("DIR..... "+path);
      resolve(true);
    });
  });
}


function extractZIP(path,remotePath){
  return new Promise((resolve,reject)=>{





    let uploadPipe=fs.createReadStream(path.path).pipe(unzip.Parse());
    let arrayDirectories=[];
    let arrayFiles=[];
    let directory="";
    let type="";
    let filename="";


    uploadPipe.once("error",function(err){
      reject(err);
    });

    const pathToFTP=PATH.dirname(remotePath)+"/";

    uploadPipe.on("entry",function (entry) {
      type = entry.type; // 'Directory' or 'File'
      filename=entry.path;
      filename.replace(" ","\s");

      if(type==='Directory'){
        directory=pathToFTP+filename;
        directory.replace(" ","\s");
        arrayDirectories.push(createDir(directory));
      }else{
        arrayFiles.push(filename);
      }
      entry.autodrain();
    });


    uploadPipe.on("close",function(){
        Promise.all(arrayDirectories).then(()=>{
          setTimeout(()=>{

            let arrayFilesPromises=[];
            for (let i = 0; i < arrayFiles.length; i++) {
              arrayFilesPromises.push(createFile(arrayFiles[i],pathToFTP+arrayFiles[i]));
            }
            Promise.all(arrayFilesPromises).then(()=>{
              uploadPipe.removeAllListeners();
              FTPDisconnect();
              resolve(true);
            })
            .catch((err)=>{
              uploadPipe.removeAllListeners();
              FTPDisconnect();
              reject(err);
            });
          },3000);



        })
        .catch((err)=>{
          uploadPipe.removeAllListeners();
          FTPDisconnect();
          reject(err);
        });






    });
  });


}

function createFile(path,remotePath){
  return new Promise((resolve,reject)=>{
    FTP.put(path, remotePath,function(err) {
      console.info("File..... "+remotePath);
      if (err){
        console.error(err+"       remote_path: "+remotePath);
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


function renameFolder(oldPath,newPath){
  return new Promise((resolve,reject)=>{
      FTP.rename(oldPath,newPath,(err)=>{
        if(err){
          reject(err);
        }
        resolve(true);
      });
  });

}

// Download from FTP
function downloadFile(filePath){

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
}




// Upload to FTP
function uploadFile(file,FTPPath){


  FTP.connect(CONFIG.ftpConnection);

  return new Promise(function(resolve,reject){

    // Connect to the FTP server with the CONFIG object setted on the config.json file

    // When the connection is ready....
    FTP.once('ready', function() {
      // First of all we have to list the cwd to check if the user's directory exists.
      FTP.list(PATH.dirname(PATH.dirname(FTPPath)),function(err, list) {
        // If there is any error firing the ls command
        if (err) {
          list=[];
        }
        // If the user's directory exists, we only need to upload the file...
        if(checkIfDirExists(PATH.parse(FTPPath).name,list)){
          const newDirname=PATH.dirname(PATH.dirname(FTPPath))+"/"+"_backup_"+appendDateToFilename()+"_"+PATH.parse(FTPPath).name;
          renameFolder(PATH.parse(FTPPath).dir,newDirname).then(()=>{
            console.log("Renamed...."+PATH.parse(FTPPath).dir+"  to  "+newDirname);
            createDir(PATH.dirname(FTPPath)).then(()=>{
              createFile(file,FTPPath).then(()=>{
                resolve(true);
              })
              .catch((err)=>{
                console.log("Error creating file on FTP");
                FTPDisconnect();
                reject(err);
              });
            });
          })
          .catch((err)=>{
            FTPDisconnect();
            reject(err);
          });

          // If the user's directory doesn't exist we have to create it first, and upload the file later that.
        }else{
          createDir(PATH.dirname(FTPPath)).then(()=>{
            createFile(file,FTPPath).then(()=>{
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
}


module.exports={
  "uploadFile":uploadFile,
  "downloadFile":downloadFile,
  "extractZIP":extractZIP
};
