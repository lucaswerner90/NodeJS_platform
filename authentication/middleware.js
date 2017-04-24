/** @module authentication/middleware */
/**
Here are implemented the main functions that creates/check the web token used for the user.
*/


const jwt=require('jwt-simple');
const moment=require('moment');
const config=require('./config');



/**
This method check if the user request has the correct authorization header and the correct token
@param {Request} req
@param {Response} res
@param {Function} next
*/
exports.ensureAuthenticated=function(req,res,next){
    if(!req.headers.authorization){

      return res
        .status(200)
        .send(
          {
            status:false,
            message:"Your request has not authorization header"
          }
        );
    }

    const token = req.headers.authorization.split(" ")[1];
    const payload=jwt.decode(token,config.TOKEN_SECRET,config.SECURITY_ALGORITHM);

    if(!payload || payload.exp<=moment().unix()){
      return res
        .status(401)
        .send(
          {
            status:false,
            message:"Token has expired"
          }
        );
    }

    req.user=payload.sub;



  //Si se da el caso de que el usuario está logueado correctamente entonces avanzamos al siguiente manejador de ruta
  next();
};
