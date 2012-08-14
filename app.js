"use strict";

var express = require('express')
  , socketIO = require('socket.io')
  , routes = require('./routes')
  , port = process.env.PORT || 8080

var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false, pretty: true });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure(function() {
  //Setup Socket.IO
  var io = socketIO.listen(app);

  io.configure(function() {
    // turn off the ridiculous amount of default logging
    io.set('log level', 1);
    var transports = [
      'websocket',
      'xhr-polling',
      'jsonp-polling',
      'htmlfile'
    ];
    io.set('transports', transports);

    // minify and compress the client script
    io.set('browser client minification', true);
    io.set('browser client gzip', true);
  });

  app.io = io;

  io.sockets.on('connection', function(socket) {
    socket.on('share', function(data) {
      io.sockets.emit('new doc', data);
    });
  });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.set('view options', { layout: false, pretty: false, cache: true });
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(port, function() {
  console.log("Server listening on port %d in %s mode", port, app.settings.env);
});
