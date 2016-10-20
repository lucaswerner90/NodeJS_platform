/*
  MAIN FILE NODE SERVER
*/

// Declare of the express's app
var express=require('express');
var app=express();



// Inclusion of third-party middlewares
var bodyParser=require('body-parser');
var urlEncodedParser=bodyParser.json();
var middleware = require('./middleware');

// Inclusion of the routes
var authentication=require('./routes/authentication');


app.get("/",function(req,res,next){
  res.send("Bienvenido al servidor de nodeJS de TED");
});

app.use(authentication);
app.use(bodyParser.urlencoded({ extended: true }));



// Manejo de los errores 404
app.use(function(req, res, next) {
  res.redirect("/404");
});




app.listen(3000);
