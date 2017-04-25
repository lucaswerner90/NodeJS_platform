'use strict';
const CONFIG_MICRO=require('./config.json');
const jwt=require('jwt-simple');
const moment=require('moment');
const User=require('../users/_common/user');
const config=require('../authentication/config');
const seneca=require('seneca')();


class LoginMicroservice{

  constructor () {
    console.log("[RUNNING] Login microservice");

    const _self=this;
    seneca.add('role:authentication,cmd:login',function (parameters,result){
      _self.logUser(parameters.data).then((data)=>{
        result( null, {answer:data} );
      })
      .catch((err)=>{
        console.error(`[LOGIN MICROSERVICE 1] ${err}`);
        result( null, {error:err} );
      });
    })
    .listen(CONFIG_MICRO.login_microservice);
  }

  sendLogin(parameters,result){
    const _self=this;
    _self.logUser(parameters.data).then((data)=>{
      result( null, {answer:data} );
    })
    .catch((err)=>{
      console.error(`[LOGIN MICROSERVICE 2] ${err}`);
      result( null, {error:err} );
    });
  }


  createToken(id){
    var payload={
      sub:id,
      iat:moment().unix(),
      exp:moment().add(30,"days").unix()
    };

    return jwt.encode(payload,config.TOKEN_SECRET,config.SECURITY_ALGORITHM);
  }

  existeUsuario(params){
    return new Promise(function(resolve, reject) {
      let user=new User();
      user.get_login_info(params).then((data)=>{
        user._db_connection._connection.destroy();
        user=null;
        resolve(data);
      })
      .catch((err)=>{
        console.error(`[LOGIN MICROSERVICE 3] ${err}`);
        reject(err);
      });
    });
  }


  logUser(datos){
    const _self=this;
    return new Promise(function(resolve, reject) {
      _self.existeUsuario(datos).then((data)=>{
        // Si el usuario se encuentra dentro del sistema de la base de datos entonces
        // devolvemos el token que usará para mantener la sesion en la plataforma
        data.token=_self.createToken(Math.random());

        resolve(data);
      })
      .catch((err)=>{
        // Si no se encuentra registrado en la base de datos se le devuelve un codigo 401
        // indicando que no esta autorizado y el token como null.
        reject(err);
      });
    });
  }

}

new LoginMicroservice();
