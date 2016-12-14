var express=require('express');

// Inclusion of third-party middlewares
var bodyParser=require('body-parser');
var urlEncodedParser=bodyParser.json({extended:true});
var AUTHENTICATE_CORE=require('./coreFunctions');

// Creacion de un router para la aplicacion
var authorizationRouter = express.Router();





// Logging or signup operation had been sent to server
authorizationRouter.post('/signup',urlEncodedParser, AUTHENTICATE_CORE.emailSignup);
authorizationRouter.post('/login',urlEncodedParser, AUTHENTICATE_CORE.emailLogin);


// Ruta solo accesible si estás autenticado
// authorizationRouter.all('[!/login,!/signup]',middleware.ensureAuthenticated);





// Export the authorizationRouter object to use in the app
module.exports=authorizationRouter;
