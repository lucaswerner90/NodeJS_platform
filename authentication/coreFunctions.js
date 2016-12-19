"use strict";
let jwt=require('jwt-simple');
let moment=require('moment');
let config=require('./config');

let DDBB=require('../db/coreFunctions');
let USER_QUERIES=require('../db/queries/user.json');
// Simulamos una consulta a la bbdd
var usuariosPlataforma=require('./ficheroPruebaUsuarios.json');




// Function that creates a token that the user will keep and send to the platform to check
// if is logued or not
function createToken(id){
  var payload={
    sub:id,
    iat:moment().unix(),
    exp:moment().add(30,"hours").unix()
  };

  return jwt.encode(payload,config.TOKEN_SECRET,config.SECURITY_ALGORITHM);
}





// Function that looks for an existing user inside the system based on the parameters specified
function existeUsuario(params){



}

// Function that creates and insert a new user inside the platform
function crearUsuario(params){
  usuariosPlataforma[usuariosPlataforma.length]={
    "id":usuariosPlataforma.length,
    "username":params.username,
    "password":params.password
  }
}



exports.emailSignup=function(req,res){
  console.log("Aca se hace el registro de usuario");

  // Si el usuario no existe lo creamos
  if(!existeUsuario(req.body)){
    crearUsuario(req.body);
    res.send({'status':true});

    // Si existe devolvemos un error y un mensaje indicandolo
  }else{
    res.send(
      {
        'status':false,
        'error':'User already exists in the platform'
      }
    );
  }
}

exports.emailLogin=function(req,res){
  console.log('-------------------------------------');
  console.log("LOGIN function");




  DDBB.sendQuery(USER_QUERIES.getUser,req.body).then((rows)=>{

    // Si no se encuentra registrado en la base de datos se le devuelve un codigo 401
    // indicando que no esta autorizado y el token como null.
    if(rows.length===0){
      console.log("User not exists");
      res.status(401)
      .send({token:null});
    }else{

      // Si el usuario se encuentra dentro del sistema de la base de datos entonces
      // devolvemos el token que usará para mantener la sesion en la plataforma
      console.log("User logged");
      return res
      .status(200)
      .send({userInfo:rows[0],token:createToken(Math.random())});
    }
  })
  .catch((err)=>{
    return null;
  });

}
