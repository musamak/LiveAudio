(function($) {
  $(document).ready(function() {
    var soundController = {};
    var currentLocation = window.location;
    var host = 'ws://'+currentLocation.hostname+':9002/streamaudio';
    var client = new BinaryClient(host);
    var audioContext = window.AudioContext || window.webkitAudioContext;

    soundController.speakerContext = new audioContext();

client.on('stream', function (stream) {
  soundController.nextTime = 0;
  var init = false;
  var audioCache = [];

  $.get( "http://localhost:1112/api/on", function( data ) {
    //alert( data ); //true
  });
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
    setTimeout(
      function() 
      {        
        $.get( "http://localhost:1112/api/off", function( data ) {
          //alert( data ); //true
        });
        console.log('||| End of Audio Stream');   
      }, 15000);  //default=5000ms (5sec) 
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

  //Keep tiggering client side to check the connectivity 
  //for Client Display LED (Blue) 
  /*setTimeout(
    function() 
    {        
      $.get( "http://localhost:1112/api/isonline", function( data ) {
        //alert( data ); //true
      });
    }, 15000); 
*/
  });
})(jQuery)

