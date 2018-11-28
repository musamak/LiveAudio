
var soundController = {};

soundController.recording = false;

$('#recButton').addClass("notRec");

$('#recButton').click(function(){
	if($('#recButton').hasClass('notRec')){
		$('#recButton').removeClass("notRec");
		$('#recButton').addClass("Rec");
		soundController.startRecording();
	}
	else{
		$('#recButton').removeClass("Rec");
		$('#recButton').addClass("notRec");
    soundController.stopRecording();
    setTimeout(
      function() 
      {
        location.reload();
      }, 5000);  //default=5000ms (5sec) adjust the value in milliseconds to reintalize the recorded file.
	}
});	

(function(window) {
  var currentLocation = window.location;
  var host = 'ws://'+currentLocation.hostname+':9002/streamaudio';
  
  var client = new BinaryClient(host);  
  
  var audioContext = window.AudioContext || window.webkitAudioContext;
  
  navigator.mediaDevices = navigator.mediaDevices || 
     ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
       getUserMedia: function(c) {
         return new Promise(function(y, n) {
           (navigator.mozGetUserMedia ||
            navigator.webkitGetUserMedia).call(navigator, c, y, n);
         });
       }
  } : null);
  
  if (!navigator.mediaDevices) {
    console.log("getUserMedia() not supported.");
  }
  
  soundController.device = navigator.mediaDevices.getUserMedia({ audio: true, 
    video: false });
  
  soundController.device.then(function (stream) {
    var context = new audioContext();
    var audioInput = context.createMediaStreamSource(stream);
    var bufferSize = 2048;
    // create a javascript node
    soundController.recorder = context.createScriptProcessor(bufferSize, 1, 1);
    // specify the processing function
    soundController.recorder.onaudioprocess = soundController.recorderProcess;
    // connect stream to our recorder
    audioInput.connect(soundController.recorder);
    // connect our recorder to the previous destination
    soundController.recorder.connect(context.destination);
  });
  
  soundController.device.catch(function (err) {
    console.log("The following error occured: " + err.name);
  });
  
  function convertFloat32ToInt16(buffer) {
    l = buffer.length;
    buf = new Int16Array(l);
    while (l--) {
      buf[l] = Math.min(1, buffer[l])*0x7FFF;
    }
    return buf.buffer;
  }
  
  soundController.recorderProcess = function (e) {
    var left = e.inputBuffer.getChannelData(0);
    if (soundController.recording === true) {
      // var chunk = convertFloat32ToInt16(left);
      var chunk = left;
      console.dir(chunk);
      soundController.stream.write(chunk);
    }
  };
  
  soundController.startRecording = function () {
  
    if (soundController.recording === false) {
      console.log('>>> Start Recording');
  
      //open binary stream
      soundController.stream = client.createStream({data: 'audio'});
      soundController.recording = true;
    }
  
  };
  
  soundController.stopRecording = function () {
    
    if (soundController.recording === true) {
      console.log('||| Stop Recording');
  
      soundController.recording = false;
  
      //close binary stream
      soundController.stream.end();
    }
  };
})(this);