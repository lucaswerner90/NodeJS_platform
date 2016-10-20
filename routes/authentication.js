var express=require('express');

// Inclusion of third-party middlewares
var bodyParser=require('body-parser');
var urlEncodedParser=bodyParser.json();
var auth=require('../auth');
var middleware=require('../middleware');

// Creacion de un router para la aplicacion
var router = express.Router();

router.post('/auth/signup',urlEncodedParser, auth.emailSignup);
router.post('/auth/login',urlEncodedParser, auth.emailLogin);



// Ruta solo accesible si estás autenticado
router.get('/private',middleware.ensureAuthenticated, function(req, res) {
  res.send("Authenticated");
} );




// Export the router object to use in the app
module.exports=router;
