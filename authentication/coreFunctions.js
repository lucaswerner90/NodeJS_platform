'use strict';
const jwt=require('jwt-simple');
const moment=require('moment');
const config=require('./config');

const DDBB=require('../db/coreFunctions');
const USER_QUERIES=require('../db/queries/user.json');

const FILE_FUNCTIONS = require('../files/fileFunctions');


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
  return new Promise(function(resolve,reject){
    DDBB.sendQuery(USER_QUERIES.GET.user,params).then((rows)=>{
      if(rows.length===0){
        console.log("No se encuentra el usuario¿?¿?¿?¿?");
        // Si no se encuentra registrado en la base de datos se le devuelve un codigo 401
        // indicando que no esta autorizado y el token como null.
        reject({token:null});
      }else{
        if(rows[0].urlAvatar!==null){
          FILE_FUNCTIONS.downloadImageInBase64(rows[0].urlAvatar).then((data)=>{
            rows[0].imgAvatar=data;
            resolve({userInfo:rows[0]});
          })
          .catch((err)=>{
            reject(err);
          });
        }else{
          // Si el usuario se encuentra dentro del sistema de la base de datos entonces
          // devolvemos el token que usará para mantener la sesion en la plataforma
          resolve({userInfo:rows[0]});
        }



      }
    });
  });


}

exports.emailLogin=function(req,res){

  existeUsuario(req.body).then((data)=>{
    // Si el usuario se encuentra dentro del sistema de la base de datos entonces
    // devolvemos el token que usará para mantener la sesion en la plataforma
    console.log("User logged correctly");
    data.token=createToken(Math.random());
    return res
    .status(200)
    .send(data);
  })
  .catch((err)=>{
    // Si no se encuentra registrado en la base de datos se le devuelve un codigo 401
    // indicando que no esta autorizado y el token como null.
    console.log("coreFunctions Error "+err);
    res.status(401)
    .send({userInfo:null,token:null});
  });

};
