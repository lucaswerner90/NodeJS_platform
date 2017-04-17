const spawn = require('child_process').spawn;

/**
Class used to init the server as a microservice itself
*/
class ServerStart {

  /**
  @constructor
  */
  constructor() {
  }

  /**
  Method that runs our server as a microservice
  */
  runAllServices(){
    const _self=this;
    _self._startProcess('./server.js');
  }


  /**
  @param {String} file - Route to the file that we want to instantiate as a separate service.
  */
  _startProcess(file){
    let bat = spawn('node',[file]);

    const _self=this;
    bat.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    bat.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    bat.once('exit', (code) => {
      if(code===1){
        bat.removeAllListeners();
        bat=null;
        _self._startProcess(file);
      }
    });
  }
}
/**
Line that runs the object {ServerStart} 
*/
new ServerStart().runAllServices();
