

const FTP=require('./FTP');
const PATH=require('path');
const CONFIG=require('./config.json');
const fs=require('fs');


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


// Upload file from user request
const uploadContentFile=(file,formFields,res,uploadDirectory)=>{
  if(checkFileExtension(CONFIG.fileUpload.extensionsAllowed,PATH.parse(file.originalFilename).ext)){

    // We assign the path where the file will be located on the FTP server
    /*
    path.parse('/home/user/dir/file.txt')
    // Returns:
    // {
    //    root : "/",
    //    dir : "/home/user/dir",
    //    base : "file.txt",
    //    ext : ".txt",
    //    name : "file"
    // }
    */
    let newFilename=PATH.parse(file.originalFilename);
    newFilename.name=appendDateToFilename()+"_"+newFilename.name;

    formFields["ruta_zip"]=uploadDirectory+"/"+formFields["id_proveedor"]+"/"+formFields["id_proyecto"]+"/"+newFilename.name+newFilename.ext;


    formFields["fecha_alta"]=returnActualDate();


    // Create the readableStream to upload the file physically
    let readableStream = fs.createReadStream(file.path);
    FTP.uploadFile(readableStream,formFields["ruta_zip"]).then(()=>{
      readableStream=null;
    })
    .catch((err)=>{
      readableStream=null;
      return res.status(200).json({error:err});
    });
  }else{
    return res.status(200).json({error:"No file extension allowed"});
  }
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
  "uploadContentFile":uploadContentFile,
  "appendDateToFilename":appendDateToFilename,
  "checkFileExtension":checkFileExtension
};
