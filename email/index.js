const NODE_MAILER=require('nodemailer');
const EMAIL_CONFIG=require('./config.json');

// Needed to create the File router
const express=require('express');

let pruebaEmail=express.Router();

let smtpTransport = NODE_MAILER.createTransport(EMAIL_CONFIG.EMAIL_OPTIONS);

function sendEmail(){
  smtpTransport.sendMail(EMAIL_CONFIG.EMAIL_FIELDS, function(error, response){
    if(error){
      console.log(error);
    }else{
      console.log('Email sended....');
      console.log(response);
    }
  });
}

pruebaEmail.get('/email',function(req,res){
  sendEmail();
  return res.send({status:"Todo bien??"});
});



module.exports=pruebaEmail;
