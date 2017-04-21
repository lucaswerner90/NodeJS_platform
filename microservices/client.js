const seneca=require('seneca');
const CONFIG_MICRO=require('./config.json');


class ClientMicroservice{
  constructor(){
    this._login_client=seneca().client(CONFIG_MICRO.login_microservice);
    this._file_client=seneca().client(CONFIG_MICRO.filehandler_microservice);
    this._db_client=seneca().client(CONFIG_MICRO.db_microservice);
    this._email_client=seneca().client(CONFIG_MICRO.email_microservice);
  }


  send_email(data){
    const _self=this;
    return new Promise((resolve, reject)=> {
      _self._email_client.act({ role: 'email', cmd: 'send', data:data},(error,result)=>{
        if(error) reject(error);
        resolve(result.answer);
      });
    });
  }

  send_query(query="",obj={}){
    const _self=this;
    return new Promise((resolve, reject)=> {
      _self._db_client.act({ role: 'db', cmd: 'send_query', query:query,obj:obj},(error,result)=>{
        if(error) reject(error);
        resolve(result.answer);
      });
    });
  }


  login_user({body}){
    const _self=this;
    return new Promise((resolve, reject)=> {
      _self._login_client.act({ role: 'authentication', cmd: 'login', data:body},(error,result)=>{
        if(error) reject(error);
        resolve(result.answer);
      });
    });
  }


  download_file(filepath,response){
    const _self=this;
    return new Promise((resolve, reject)=> {
      _self._file_client.act({ role: 'ftp', cmd: 'download',
      filepath:filepath,response:response},(error,result)=>{
        if(error) reject(error);
        resolve(result.answer);
      });
    });
  }


  upload_file(form){
    const _self=this;
    return new Promise((resolve, reject)=> {
      _self._file_client.act({ role: 'ftp', cmd: 'upload', data:form},(error,result)=>{
        if(error) reject(error);
        resolve(result.answer);
      });
    });
  }


}


module.exports=ClientMicroservice;
