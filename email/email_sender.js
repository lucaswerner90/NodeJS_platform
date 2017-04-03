const CONFIG=require('./config.json');
const nodemailer=require('nodemailer');
const fs=require('fs');

class EmailSender{
  constructor(){
    this._smtpTransport = nodemailer.createTransport(CONFIG.BASIC_CONF.server_IP);
    this.mail_options=CONFIG.MAIL_INFO;
  }

  _config_template(id="new_course"){
    for (let i = 0; i < CONFIG.TEMPLATES_CONF.length; i++) {
      let template=CONFIG.TEMPLATES_CONF[i];
      if(template.id===id) return template;
    }
    return;
  }

  send_email(type="new_course"){
    const _self=this;
    const template=_self._config_template(type);
    _self.mail_options.subject=template.subject;
    _self.mail_options.html=fs.createReadStream(__dirname+template.folder_template+'/mail.html');
    return new Promise(function(resolve, reject) {
      _self._smtpTransport.sendMail(_self.mail_options, function(error, response){
        if(error){
          reject(error);
        }else{
          resolve("Email sended...."+response.message);
        }
      });
    });

  }
}

module.exports=EmailSender;
