
  
(function($) {
    $(document).ready(function() {
  var soundController = {};
  const host = 'ws://itfa.ddns.net:9002/streamaudio';
  const remote = require('electron').remote;
  const BinaryClient = remote.require('binaryjs').BinaryClient;
  const client = new BinaryClient(host);
  const Gpio = remote.require('onoff').Gpio;
  const gpio26 = new Gpio(26, 'out');
  var audioContext = window.AudioContext || window.webkitAudioContext;
  
  soundController.speakerContext = new audioContext();
  
  client.on('stream', function (stream) {
    soundController.nextTime = 0;
    var init = false;
    var audioCache = [];
    
    $("#currentActionEd").val('opt1');
    gpio26.writeSync(1); //switch on amplifier
    console.log('>>> Receiving Audio Stream');
  
    stream.on('data', function (data) {
      var array = new Float32Array(data);
      var buffer = soundController.speakerContext.createBuffer(1, 2048, 44100);
      buffer.copyToChannel(array, 0);
  
      audioCache.push(buffer);
      // make sure we put at least 5 chunks in the buffer before starting
      if ((init === true) || ((init === false) && (audioCache.length > 5))) { 
          init = true;
          soundController.playCache(audioCache);
      }
    });
  
    stream.on('end', function () {
      $("#currentActionEd").val('opt2');
      gpio26.writeSync(0); //switch off amplifier
      console.log('||| End of Audio Stream');    
    });
  
  });
  
  soundController.playCache = function (cache) {
    while (cache.length) {
      var buffer = cache.shift();
      var source    = soundController.speakerContext.createBufferSource();
      source.buffer = buffer;
      source.connect(soundController.speakerContext.destination);
      if (soundController.nextTime == 0) {
          // add a delay of 0.05 seconds
          soundController.nextTime = soundController.speakerContext.currentTime + 0.05;  
      }
      source.start(soundController.nextTime);
      // schedule buffers to be played consecutively
      soundController.nextTime+=source.buffer.duration;  
    }
  };

 });
})(jQuery)