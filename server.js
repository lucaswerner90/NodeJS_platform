/*
  MAIN FILE NODE SERVER
*/
"use strict";
// Declare of the express's app
const express = require('express');
const app=express();


// Inclusion of third-party middlewares
let BODY_PARSER=require('body-parser');

/*
  HERE IS WHERE WE CHARGE THE ROUTES THAT WE WILL USE IN THE SERVER APP
*/
// Inclusion of the routes
let authentication=require('./authentication/index');

// Route related with the DB manage
let bbdd=require('./db/index');

// Route related with the files functionality
let files=require('./files/index');



/*
  EXAMPLE TEST
*/
// app.get("/",function(req,res,next){
//   res.send("Bienvenido al servidor de nodeJS de TED");
// })

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



// Disable this to try function among the authentication - for develop purposes
let middlewareAuthentication=require('./authentication/middleware');




app.use('/auth',BODY_PARSER.json({extended:true}),authentication);
app.use('/bbdd',middlewareAuthentication.ensureAuthenticated,BODY_PARSER.json({extended:true}),bbdd);
app.use('/file',middlewareAuthentication.ensureAuthenticated,files);




// Manejo de los errores 404
app.use((req, res, next)=> {
  console.log("404 error");
  res.send({status:404});
});




app.listen(5000);
