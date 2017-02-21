const PATH=require('path');
const fs=require('fs');
const BASE_64_ENCODER = require('base64-stream');
const FTP=require('./_ftpModel');
const CONFIG=require('./config.json');


class File{


  constructor(){
    this._ftp=new FTP();
    this._config=CONFIG;
  }

  _close_connection(){
    const _self=this;
    _self._ftp._close_connection();
  }

  _returnActualDate(){
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }


  _appendDateToFilename(){
    const fecha=new Date();
    const month=(fecha.getMonth()+1<10)?`0${fecha.getMonth()+1}`:fecha.getMonth()+1;
    const day=(fecha.getDate()+1<10)?`0${fecha.getDate()+1}`:fecha.getDate()+1;
    const hours=(fecha.getHours()+1<10)?`0${fecha.getHours()+1}`:fecha.getHours()+1;
    const minutes=(fecha.getMinutes()<10)?`0${fecha.getMinutes()+1}`:fecha.getMinutes()+1;
    const seconds=(fecha.getSeconds()<10)?`0${fecha.getSeconds()+1}`:fecha.getSeconds()+1;
    return `${fecha.getFullYear()}_${month}_${day}_${hours}_${minutes}_${seconds}`;
  }


  _checkFileExtension(extensions,fileExtension){
    for (let i = 0; i < extensions.length; i++) {
      if(fileExtension.indexOf(extensions[i])>-1){
        return true;
      }
    }
    return false;
  }


  _fileRoute(contentType,formFields,uploadDirectory,filename){
    switch (contentType) {
      case "avatar":
        return uploadDirectory+"/"+formFields['carpeta_proveedor']+formFields["id_usuario"]+"/avatar"+filename.ext;
      case "zip":
        return uploadDirectory+"/"+formFields["carpeta_proveedor"]+"/"+filename.name+"/"+filename.name+filename.ext;
    }
  }



  uploadContentFile(file,formFields,uploadDirectory,extensionsAllowed,avatar=false){

    const _self=this;

    let newFilename;
    let ruta_file='';
    let readableStream;

    function removeVariables(){
      newFilename=null;
      ruta_file=null;
      readableStream=null;
    }

    return new Promise((resolve,reject)=>{
      if(_self._checkFileExtension(extensionsAllowed,PATH.parse(file.originalFilename).ext)){

        newFilename=PATH.parse(file.originalFilename);


        // If the file is a content, we've to manage it in a different way that if it is an image or something else.
        if(!avatar){

          formFields["fecha_alta"]=_self._returnActualDate();
          formFields["ruta_zip"]=_self._fileRoute("zip",formFields,uploadDirectory,newFilename);
          ruta_file=formFields['ruta_zip'];

        // If it's an avatar we have to set the route properly on it
        }else{
          formFields['urlAvatar']=_self._fileRoute("avatar",formFields,uploadDirectory,newFilename);
          ruta_file=formFields['urlAvatar'];
        }


        // Create the readableStream to upload the file physically
        readableStream = fs.createReadStream(file.path);
        _self._ftp.uploadFile(readableStream,ruta_file).then(()=>{
          removeVariables();
          resolve(true);
        })
        .catch((err)=>{
          removeVariables();
          reject(err);
        });
      }else{
        removeVariables();
        reject({error:"No file extension allowed"});
      }
    });
  }

  _downloadImageInBase64(filepath){
    const _self=this;

    return new Promise((resolve,reject)=>{
      _self._ftp.downloadFile(filepath).then((data)=>{

          let imageData=`data:image/${PATH.parse(filepath).ext.slice(1)};base64,`;

          data.pipe(BASE_64_ENCODER.encode()).on("data",(buf)=>{
            imageData+=buf;
          })
          .once("error",(err)=>{
            reject(err);
          })
          .once("end",()=>{
            resolve(imageData);
          });

      })
      .catch((err)=>{
        reject(err);
      });
    });

  }


  downloadFile(filepath,response){
    const _self=this;
    _self._ftp.downloadFile(filepath).then((data)=>{

        // Once the transference has finished...
        // We set the appropiate headers to inform the client that it needs to download a file
        filepath=filepath.split("_").splice(5,filepath.split("_").length).join("_");

        response.attachment(filepath);

        // We pipe the file throught the readableStream object to the response
        data.pipe(response).on("end",function(){
          _self._ftp._FTPDisconnect();
        });
    })
    .catch((err)=>{
      response.send(err);
    });

  }




}


module.exports=File;
