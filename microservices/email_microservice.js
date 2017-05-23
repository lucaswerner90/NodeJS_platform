'use strict';
const CONFIG_MICRO = require('./config.json');
const seneca = require('seneca')();
const EmailSender = require('../email/email_sender');

class EmailMicroservice {

  constructor() {
    console.log("[RUNNING] Email microservice");
    this._email = new EmailSender();
    seneca.add('role:email,cmd:send', (parameters, result) => {
        this._email.send_email(parameters.data.type, parameters.data.datos_curso).then((data) => {
            result(null, {
              answer: data
            });
          })
          .catch((err) => {
            result(null, {
              error: err
            });
          });
      })
      .listen(CONFIG_MICRO.email_microservice);
  }
}

new EmailMicroservice();
