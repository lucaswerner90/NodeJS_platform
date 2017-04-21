/** @module authentication/coreFunctions */
'use strict';
/**
Import of the client part of the microservice which calls the microservices of the server
*/
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
