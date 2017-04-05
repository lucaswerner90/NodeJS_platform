'use strict';
const ClientMicroservice=require('../microservices/client');


exports.emailLogin=function(req,res){
  let client=new ClientMicroservice();
  client.login_user(req).then((data)=>{
    client=null;
    res.send(data);
  }).catch((error)=>{
    res.send(error);
  });

};
