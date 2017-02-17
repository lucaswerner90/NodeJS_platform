'use strict';
const jwt=require('jwt-simple');
const moment=require('moment');
const config=require('./config');

const Database=require('../db/database');

const User=require('../users/_common/user');

const File = require('../files/_fileModel');

let DDBB=new Database();
// Function that creates a token that the user will keep and send to the platform to check
// if is logued or not
function createToken(id){
  var payload={
    sub:id,
    iat:moment().unix(),
    exp:moment().add(30,"days").unix()
  };

  return jwt.encode(payload,config.TOKEN_SECRET,config.SECURITY_ALGORITHM);
}





// Function that looks for an existing user inside the system based on the parameters specified
function existeUsuario(params){
  return new Promise(function(resolve, reject) {
    let user=new User();
    user.get_login_info(params).then((data)=>{

      user._db_connection._connection.end();
      user=null;
      resolve(data);
    })
    .catch((err)=>{
      reject(err);
    });
  });



}

exports.emailLogin=function(req,res){

  existeUsuario(req.body).then((data)=>{
    // Si el usuario se encuentra dentro del sistema de la base de datos entonces
    // devolvemos el token que usará para mantener la sesion en la plataforma
    data.token=createToken(Math.random());


    // Record the user's login
    DDBB._log_actions("user.login",
    {
      id_usuario:data.userInfo.id_usuario,
      id_contenido:'0',
      fecha_modificacion:new Date().toISOString().slice(0, 19).replace('T', ' ')
    });



    return res
    .status(200)
    .send(data);
  })
  .catch((err)=>{
    // Si no se encuentra registrado en la base de datos se le devuelve un codigo 401
    // indicando que no esta autorizado y el token como null.
    console.error(err);
    res.status(401)
    .send({userInfo:null,token:null});
  });

};
