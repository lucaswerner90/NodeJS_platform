const seneca=require('seneca');
const CONFIG_MICRO=require('./config.json');


class ClientMicroservice{
  constructor(){
    this._login_client=seneca().client(CONFIG_MICRO.login_microservice);
    this._file_client=seneca().client(CONFIG_MICRO.filehandler_microservice);
  }

  login_user(req){
    const _self=this;
    return new Promise(function(resolve, reject) {
      _self._login_client.act({ role: 'authentication', cmd: 'login', data:req.body},(error,result)=>{
        if(error) reject(error);
        resolve(result.answer);
      });
    });
  }

  download_file(filepath,response){
    const _self=this;
    return new Promise(function(resolve, reject) {
      _self._file_client.act({ role: 'ftp', cmd: 'download',
      filepath:filepath,response:response},(error,result)=>{
        if(error) reject(error);
        resolve(result.answer);
      });
    });
  }

  upload_file(form){
    const _self=this;
    return new Promise(function(resolve, reject) {
      _self._file_client.act({ role: 'ftp', cmd: 'upload', data:form},(error,result)=>{
        if(error) reject(error);
        resolve(result.answer);
      });
    });
  }


}


module.exports=ClientMicroservice;
