const NODE_MAILER=require('nodemailer');
const EMAIL_CONFIG=require('./config.json');
const SMTP_TRANSPORT = require('nodemailer-smtp-transport');


EMAIL_CONFIG.EMAIL_OPTIONS.text='Prueba de contenido de texto del email';

var transporter = NODE_MAILER.createTransport(SMTP_TRANSPORT(EMAIL_CONFIG.SERVER_OPTIONS));


exports.sendEmail=function(){
  transporter.sendMail(EMAIL_CONFIG, function(error, info){
      if(error){
          console.log(error);
      }else{
          console.log('Message sent: ' + info.response);
      };
  });
}
