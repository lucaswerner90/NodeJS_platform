'use strict';
const ClientMicroservice=require('../microservices/client');
const client=new ClientMicroservice();

exports.emailLogin=function(req,res){

  client.login_user(req).then((data)=>{
    res.send(data);
  }).catch((error)=>{
    res.send(error);
  });

};
