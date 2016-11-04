var jwt=require('jwt-simple');
var moment=require('moment');
var config=require('./config');


// Simulamos una consulta a la bbdd
var usuariosPlataforma=require('./ficheroPruebaUsuarios.json');




// Function that creates a token that the user will keep and send to the platform to check
// if is logued or not
function createToken(id){
  var payload={
    sub:id,
    iat:moment().unix(),
    exp:moment().add(30,"minutes").unix()
  };

  return jwt.encode(payload,config.TOKEN_SECRET,config.SECURITY_ALGORITHM);
}





// Function that looks for an existing user inside the system based on the parameters specified
function existeUsuario(params){
  for (let i = 0; i < usuariosPlataforma.length; i++) {
    if(params.email===usuariosPlataforma[i].email && params.password===usuariosPlataforma[i].password ){
      return usuariosPlataforma[i];
    }
  }
  return false;
}

// Function that creates and insert a new user inside the platform
function crearUsuario(params){
  usuariosPlataforma[usuariosPlataforma.length]={
    "id":usuariosPlataforma.length,
    "email":params.email,
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
  console.log("Aca se hace el login del usuario");



  // Si el usuario se encuentra dentro del sistema de la base de datos entonces
  // devolvemos el token que usará para mantener la sesion en la plataforma
  if(existeUsuario(req.body)){
    return res
      .status(200)
      .send({token:createToken(Math.random())});

  // Si no se encuentra registrado en la base de datos se le devuelve un codigo 401
  // indicando que no esta autorizado y el token como null.
  }else{
    return res
      .status(401)
      .send({token:null});
  }
}
