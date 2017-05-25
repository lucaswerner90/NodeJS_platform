/*
  MAIN FILE NODE SERVER
*/
'use strict';
// Declare of the express's app

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const express = require('express');


/**********************************/

const compression = require('compression');
const app = express();
const CONFIG_SERVER = require('./CONFIG_SERVER.json');
const PORT = process.env.PORT || CONFIG_SERVER.PORT;
// Inclusion of third-party middlewares
const BODY_PARSER = require('body-parser');
/*
  HERE IS WHERE WE CHARGE THE ROUTES THAT WE WILL USE IN THE SERVER APP
*/
// Inclusion of the routes
const authentication = require('./authentication/index');

// Route related with the DB manage

// Route related with the files functionality
const user = require('./users/index');


// Disable this to try function among the authentication - for develop purposes
const middlewareAuthentication = require('./authentication/middleware');


const microservices = require('./microservices/index');






app.use(compression({ level: 9}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  next();
});


app.use(BODY_PARSER.urlencoded({
  extended: true,
  parameterLimit: 10000,
  limit: 1024 * 1024 * 500
}));


app.use(BODY_PARSER.json({
  limit: '500mb'
}));


// app.use(express.static('public'));
// maxAge defined by static files:
// const maxage_cache=86400*24*7;
const maxage_cache = 0;

for (let i = 0; i < CONFIG_SERVER.STATIC_ROUTES.length; i++) {
  app.use(CONFIG_SERVER.STATIC_ROUTES[i], express.static(CONFIG_SERVER.STATIC_DIR, {
    maxage: maxage_cache
  }));
}



app.use('/api/auth', BODY_PARSER.json({
  extended: true
}), authentication);
app.use('/api/user', middlewareAuthentication.ensureAuthenticated, user);



// Manejo de los errores 404
app.use((req, res, next) => {
  res.status(404).send();
});

app.use(function (error, req, res, next) {
  if (!error) {
    next();
  } else {
    console.error(error.stack);
    res.send(500);
  }
});

//For test purposes
if (!module.parent) {
  app.listen(PORT);
}

if (process.env.NODE_ENV === 'test') {
  module.exports = app;
} else {
  microservices.runAllServices();
}
