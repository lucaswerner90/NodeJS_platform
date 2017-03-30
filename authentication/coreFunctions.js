'use strict';
const ClientMicroservice=require('../microservices/client');
// let DDBB=new Database();
// Function that creates a token that the user will keep and send to the platform to check
// if is logued or not
// function createToken(id){
//   var payload={
//     sub:id,
//     iat:moment().unix(),
//     exp:moment().add(30,"days").unix()
//   };
//
//   return jwt.encode(payload,config.TOKEN_SECRET,config.SECURITY_ALGORITHM);
// }





// Function that looks for an existing user inside the system based on the parameters specified
// function existeUsuario(params){
//   return new Promise(function(resolve, reject) {
//     let user=new User();
//     user.get_login_info(params).then((data)=>{
//       user._close_connections();
//       resolve(data);
//     })
//     .catch((err)=>{
//       reject(err);
//     });
//   });
//
//
//
// }

exports.emailLogin=function(req,res){
  const client=new ClientMicroservice();
  // client.download_file('./Educaterra/CursoElPradoMiradaX_HTML_20161117184403/CursoElPradoMiradaX_HTML_20161117184403.zip',res).then((data)=>{
  //   console.log("Everything works fine!");
  // })
  // .catch((error)=>{
  //   console.error(error);
  // });
  client.login_user(req).then((data)=>{
    res.send(data);
  }).catch((error)=>{
    res.send(error);
  });




  // existeUsuario(req.body).then((data)=>{
  //   // Si el usuario se encuentra dentro del sistema de la base de datos entonces
  //   // devolvemos el token que usará para mantener la sesion en la plataforma
  //   data.token=createToken(Math.random());
  //
  //
  //
  //   return res
  //   .status(200)
  //   .send(data);
  // })
  // .catch((err)=>{
  //   // Si no se encuentra registrado en la base de datos se le devuelve un codigo 401
  //   // indicando que no esta autorizado y el token como null.
  //   console.error(err);
  //   res.status(401)
  //   .send({userInfo:null,token:null});
  // });

};
