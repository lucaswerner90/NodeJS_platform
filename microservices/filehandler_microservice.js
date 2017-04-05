// 'use strict';
// const CONFIG_MICRO=require('./config.json');
// const seneca=require('seneca')();
// const File=require('../files/_fileModel');
//
// class FileHandlerMicroservice{
//
//   constructor () {
//     console.log("[RUNNING] Files Handling microservice");
//
//
//     this._file=new File();
//
//     seneca.add('role:ftp,cmd:upload',(parameters,result)=>{
//       this.upload_file(parameters.data).then((data)=>{
//         result( null, {answer:data} );
//       })
//       .catch((err)=>{
//         result( null, {error:err} );
//       });
//     })
//     .add('role:ftp,cmd:download',(parameters,result)=>{
//       this.download_file(parameters).then((data)=>{
//         result( null, {answer:data} );
//       })
//       .catch((err)=>{
//         result( null, {error:err} );
//       });
//     })
//
//     .listen(CONFIG_MICRO.filehandler_microservice);
//   }
//
//
//   upload_file(parameters,result){
//     const _self=this;
//     _self._file.uploadContentFile(parameters.file,parameters.formFields,parameters.uploadDirectory,parameters.extensionsAllowed,parameters.avatar).then((data)=>{
//       result( null, {answer:data} );
//     })
//     .catch((err)=>{
//       result( null, {error:err} );
//     });
//   }
//
//
//   download_file(parameters,result){
//     const _self=this;
//     _self._file.downloadFile(parameters.data.filepath,parameters.data.response).then((data)=>{
//       result( null, {answer:data} );
//     })
//     .catch((err)=>{
//       result( null, {error:err} );
//     });
//   }
//
// }
//
// //new FileHandlerMicroservice();
