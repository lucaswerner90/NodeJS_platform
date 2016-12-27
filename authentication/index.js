var express=require('express');

// Inclusion of third-party middlewares
var AUTHENTICATE_CORE=require('./coreFunctions');

// Creacion de un router para la aplicacion
var authorizationRouter = express.Router();





// Logging or signup operation had been sent to server
authorizationRouter.post('/signup', AUTHENTICATE_CORE.emailSignup);
authorizationRouter.post('/login', AUTHENTICATE_CORE.emailLogin);





// Export the authorizationRouter object to use in the app
module.exports=authorizationRouter;
