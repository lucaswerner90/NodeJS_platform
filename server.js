/*
  MAIN FILE NODE SERVER
*/
'use strict';
// Declare of the express's app
const express = require('express');
const app=express();
const CONFIG_SERVER=require('./CONFIG_SERVER.json');
const PORT = process.env.PORT || CONFIG_SERVER.PORT;
// Inclusion of third-party middlewares
const BODY_PARSER=require('body-parser');
/*
  HERE IS WHERE WE CHARGE THE ROUTES THAT WE WILL USE IN THE SERVER APP
*/
// Inclusion of the routes
const authentication=require('./authentication/index');

// Route related with the DB manage

// Route related with the files functionality
const user=require('./users/index');


// Disable this to try function among the authentication - for develop purposes
const middlewareAuthentication=require('./authentication/middleware');


const microservices=require('./microservices/index');

microservices.runAllServices();


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


app.use(BODY_PARSER.urlencoded({
  extended: true,
  parameterLimit: 10000,
  limit: 1024 * 1024 * 500})
);


app.use(BODY_PARSER.json({limit: '500mb'}));


// app.use(express.static('public'));
for (let i = 0; i < CONFIG_SERVER.STATIC_ROUTES.length; i++) {
  app.use(CONFIG_SERVER.STATIC_ROUTES[i],express.static(CONFIG_SERVER.STATIC_DIR));
}



app.use('/api/auth',BODY_PARSER.json({extended:true}),authentication);
app.use('/api/user',middlewareAuthentication.ensureAuthenticated,user);



// Manejo de los errores 404
app.use((req, res, next)=> {
  res.status(404).send();
});




module.exports=app.listen(PORT);
