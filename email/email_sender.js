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


  replace_variables(html="",info_content){
    const email_info=["titulo_curso","num_certificados","num_contenidos","horas_formacion","ruta_ejecucion"];
    for (let i = 0; i < email_info.length; i++) {
      html=html.split("{"+email_info[i]+"}").join(info_content[email_info[i]]);
    }
    return html;
  }



  send_email(type="new_course",info={}){
    const _self=this;
    const template=_self._config_template(type);
    _self.mail_options.subject=template.subject;
    let index_content="";
    return new Promise(function(resolve, reject) {

      _self.mail_options.html=fs.createReadStream(__dirname+template.folder_template+'/mail.html');

      _self.mail_options.html.on('data', (chunk) => {
        index_content+=chunk.toString();
      });
      _self.mail_options.html.on('end', () => {
          console.log("Titulo del curso: "+info.toString());
          _self.mail_options.html=_self.replace_variables(index_content,{
            titulo_curso:info.titulo,
            num_certificados:"56",
            num_contenidos:"110",
            horas_formacion:"255",
            ruta_ejecucion:info.rutaEjecucion
          });
          _self._smtpTransport.sendMail(_self.mail_options, function(error, response){
              if(error){
                reject(error);
              }else{
                resolve("Email sended...."+response.message);
              }
          });



      });


    });
  }



}

module.exports=EmailSender;
