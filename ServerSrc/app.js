var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var BinaryServer = require('binaryjs').BinaryServer;
//var Speaker = require('speaker');
//var Speaker = require('audio-speaker/stream');

var indexRouter = require('./routes/index');
var streamRouter = require('./routes/stream');
var usersRouter = require('./routes/users');

writableWavMicStream = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/stream', streamRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Audio Server
/*
Code Reference: 
https://subvisual.co/blog/posts/39-tutorial-html-audio-capture-streaming-to-node-js-no-browser-extensions/
https://github.com/gabrielpoca/browser-pcm-stream

//https://www.npmjs.com/package/speaker
https://www.npmjs.com/package/audio-speaker

http://www.jingpingji.com/blog/2015/8/4/transferring-sound-data-with-binaryjs-and-buffering-for-smooth-playbac

https://github.com/binaryjs/binaryjs/tree/master/dist

https://www.npmjs.com/package/gpio
*/

var binaryserver = new BinaryServer({port: 9002, path: '/streamaudio'});

binaryserver.on('connection', function(client){
  console.log('Binary Server connection started');

  client.on('stream', function(stream, meta) {
    console.log('>>>Incoming audio stream');

    // broadcast to all other clients
    for(var id in binaryserver.clients){
      if(binaryserver.clients.hasOwnProperty(id)){
        var otherClient = binaryserver.clients[id];
        if(otherClient != client){
          var send = otherClient.createStream(meta);
          stream.pipe(send);
        } // if (otherClient...
      } // if (binaryserver...
    } // for (var id in ...

    stream.on('end', function() {
      console.log('||| Audio stream ended');
    });
    
  }); //client.on
}); //binaryserver.on


module.exports = app;
