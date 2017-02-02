

const FTP=require('./FTP');


const PATH=require('path');
const fs=require('fs');
const BASE_64_ENCODER = require('base64-stream');


const returnActualDate=()=>{
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
};


// This function creates the date's info to append to the filename
const appendDateToFilename=()=>{
  const fecha=new Date();
  const month=(fecha.getMonth()+1<10)?`0${fecha.getMonth()+1}`:fecha.getMonth()+1;
  const day=(fecha.getDate()+1<10)?`0${fecha.getDate()+1}`:fecha.getDate()+1;
  const hours=(fecha.getHours()+1<10)?`0${fecha.getHours()+1}`:fecha.getHours()+1;
  const minutes=(fecha.getMinutes()<10)?`0${fecha.getMinutes()+1}`:fecha.getMinutes()+1;
  return `${fecha.getFullYear()}_${month}_${day}_${hours}_${minutes}`;
};



// We get the allowed extensions from the config file, depends on which type of file we need to check
const checkFileExtension=(extensions,fileExtension)=>{
  for (let i = 0; i < extensions.length; i++) {
    if(fileExtension.indexOf(extensions[i])>-1){
      return true;
    }
  }
  return false;
};


const fileRoute=(contentType,formFields,uploadDirectory,filename)=>{

  switch (contentType) {
    case "avatar":
      return uploadDirectory+"/"+formFields['id_usuario']+"/avatar"+filename.ext;
    case "zip":
      return uploadDirectory+"/"+formFields["id_proveedor"]+"/"+formFields["id_proyecto"]+"/"+filename.name+filename.ext;
  }
};


// Upload file from user request
const uploadContentFile=(file,formFields,uploadDirectory,extensionsAllowed,avatar=false)=>{
  let newFilename;
  let ruta_file='';
  let readableStream;

  function removeVariables(){
    newFilename=null;
    ruta_file=null;
    readableStream=null;
  }

  return new Promise((resolve,reject)=>{
    if(checkFileExtension(extensionsAllowed,PATH.parse(file.originalFilename).ext)){

      newFilename=PATH.parse(file.originalFilename);
      newFilename.name=appendDateToFilename()+"_"+newFilename.name;



      // If the file is a content, we've to manage it in a different way that if it is an image or something else.
      if(!avatar){

        formFields["fecha_alta"]=returnActualDate();
        formFields["ruta_zip"]=fileRoute("zip",formFields,uploadDirectory,newFilename);
        ruta_file=formFields['ruta_zip'];

      // If it's an avatar we have to set the route properly on it
      }else{
        debugger;
        formFields['urlAvatar']=fileRoute("avatar",formFields,uploadDirectory,newFilename);
        ruta_file=formFields['urlAvatar'];
      }


      // Create the readableStream to upload the file physically
      readableStream = fs.createReadStream(file.path);
      FTP.uploadFile(readableStream,ruta_file).then(()=>{
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
};




const downloadImageInBase64=(filepath)=>{

  return new Promise((resolve,reject)=>{
    FTP.downloadFile(filepath).then((data)=>{

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

};



// Download the file from the FTP server
const downloadFile=(filepath,response)=>{

  FTP.downloadFile(filepath).then((data)=>{

      // Once the transference has finished...
      // We set the appropiate headers to inform the client that it needs to download a file
      filepath=filepath.split("_").splice(5,filepath.split("_").length).join("_");

      response.attachment(filepath);

      // We pipe the file throught the readableStream object to the response
      data.pipe(response);
  })
  .catch((err)=>{
    response.send({error:err});
  });

};




module.exports={
  "downloadFile":downloadFile,
  "downloadImageInBase64":downloadImageInBase64,
  "uploadContentFile":uploadContentFile,
  "returnActualDate":returnActualDate,
  "appendDateToFilename":appendDateToFilename,
  "checkFileExtension":checkFileExtension
};
