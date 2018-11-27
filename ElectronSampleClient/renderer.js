// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
/*
const Gpio = require('onoff').Gpio; 
const gpio26 = new Gpio(26, 'out');

function onoffGpio()
{
    try{
       // document.querySelector('#currentActionEd').
    }
    catch(err){
        alert(err);
    }
}

function setGPIO() {
  //alert('test_gpio');
  try{
    //gpio26 = new Gpio(26, 'out');
    gpio26.writeSync(1); 
    }
    catch(err){
        alert(err);
    }
}
function resetGPIO() {
    //alert('reset');
    try{
    gpio26.writeSync(0);
    //gpio26.unexport();
    }
    catch(err){
        alert(err);
    }
}
document.querySelector('#currentActionEd').addEventListener('change', onoffGpio);

//document.querySelector('#currentActionEd').childNodes.item(1).addEventListener('selected', resetGPIO);
document.querySelector('#btnSetEd').addEventListener('click', setGPIO);
document.querySelector('#btnResetEd').addEventListener('click', resetGPIO);
*/