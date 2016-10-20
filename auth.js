var service=require("./services");

exports.emailSignup=function(req,res){
  console.log("Aca se hace el registro de usuario");
}

exports.emailLogin=function(req,res){
  console.log("Aca se hace el login del usuario");
  var usuarioPrueba={
    "id":1,
    "email":"prueba@telefonicaed.com",
    "password":"pruebapass"
  }
  if(req.body.email===usuarioPrueba.email){
    console.log("blablabla");
  }
  return res
    .status(200)
    .send({token:service.createToken(usuarioPrueba)});
}
