const spawn = require('child_process').spawn;

class ServerStart {


  constructor() {
  }


  runAllServices(){
    const _self=this;
    _self._startProcess('./server.js');
  }



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

new ServerStart().runAllServices();
