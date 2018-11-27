var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var Gpio = require('onoff').Gpio;
var isOnline = require("is-online");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 1112;
var router = express.Router();
var gpio26 = new Gpio(26, 'out');
var gpio20 = new Gpio(20, 'out');

app.use(cors());
app.use('/api', router);
app.listen(port);
gpio_onoff(null, 26, 1);
gpio_onoff(null, 20, 0);

console.log('Audio Client API is runnning at ' + port);

function gpio_onoff(res, pin, val){
    if(pin === 26){
        gpio26.write(val, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                gpio26.read((err, value) => { // Asynchronous read
                if (err) {
                    console.log(err);
                    if(res != null)
                        res.send(false);
                }
                else if (value === val)
                {
                    if(res != null)
                        res.send(true);
                }                
                else 
                {
                    if(res != null)
                        res.send(false);
                }
            });
            }
        });
    }
    else{
        console.log("set gpio20 to " + val);
        gpio20.write(val, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                gpio26.read((err, value) => { // Asynchronous read
                    if (err) {
                        console.log(err);
                    }
                    else console.log("gpio20 set to " + val);
                });
            }
        });
    }
}

router.use(function (req, res, next) {
    router.route('/on').get(function (req, res) {
        gpio_onoff(res, 26, 0);
    });

    router.route('/off').get(function (req, res) {
        gpio_onoff(res, 26, 1);
    });

    router.route('/isonline').get(function (req, res) {
        isOnline({
                timeout: 5000,
                version: "v4"
            }).then(online => {
                if(online){
                    console.log("Internet connected.")
                    gpio_onoff(null, 20, 1);
                }else{
                    console.log("No Internet.")
                    gpio_onoff(null, 20, 0);
                }
        });
    });
    next(); // make sure we go to the next routes and don't stop here
});

