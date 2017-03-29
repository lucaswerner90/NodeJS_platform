const seneca=require('seneca')();

class ClientMicroservice{
  constructor(){
    this._client=seneca.client();
  }

  login_user(req){
    const _self=this;
    return new Promise(function(resolve, reject) {
      _self._client.act({ role: 'authentication', cmd: 'login', data:req.body},(error,result)=>{
        if(error) reject(error);
        resolve(result.answer);
      });
    });


  }


}


module.exports=ClientMicroservice;
