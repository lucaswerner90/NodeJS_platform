'use strict';
const CONFIG_MICRO = require('./config.json');
const seneca = require('seneca')();
const Database = require('../db/database');


/**
 * 
 * 
 * @class DatabaseMicroservice
 * @desc Creates an instance of DatabaseMicroservice.
 */
class DatabaseMicroservice {

  constructor() {
    console.log("[RUNNING] Database microservice");
    this._db = new Database();

    seneca.add('role:db,cmd:send_query', (parameters, result) => {
        this._db.sendQuery(parameters.query, parameters.obj).then((data) => {
            result(null, {
              answer: data
            });
          })
          .catch((err) => {
            result(null, {
              error: "[DatabaseMicroserviceError]: " + err
            });
          });
      })
      .listen(CONFIG_MICRO.db_microservice);
  }
}

new DatabaseMicroservice();
