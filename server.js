/*
  MAIN FILE NODE SERVER
*/
'use strict';
// Declare of the express's app

process.env.NODE_ENV = 'production';
// process.env.NODE_ENV = process.env.NODE_ENV || 'production';




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






/**
 * @description Executes the NodeJS app on multiple cores
 */
function multiClusterServer() {

  const cluster = require('cluster');

  // const numCPUs = 1;
  const numCPUs = require('os').cpus().length;

  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);


    console.log(`${numCPUs} CORES AVAILABLE`);
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      // for (let i = 0; i < 1; i++) {
      cluster.fork();
    }

    cluster.on('exit', function (worker, code, signal) {
      console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
      console.log('Starting a new worker');
      cluster.fork();
    });
  } else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    //For test purposes
    if (!module.parent) {
      app.listen(PORT);
    }

    if (process.env.NODE_ENV === 'test') {
      module.exports = app;
    } else {
      microservices.runAllServices();
    }


    process.on('uncaughtException', function (err) {
      console.log("uncaughtException:  " + err);
    });

  }

}









app.use(compression({
  level: 9
}));

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


const maxage_cache = 86400 * 24 * 7;

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



//Break!!!!!!!!!!!!!!!
multiClusterServer();
