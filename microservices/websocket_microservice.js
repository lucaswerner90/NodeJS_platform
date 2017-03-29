'use strict';

class WebsocketMicroservice {
  constructor(app) {
    this.HTTPServer = require('http').Server(app);
    this.io = require('socket.io')(this.HTTPServer);
  }
}


new WebsocketMicroservice();
