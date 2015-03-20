var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// For json encoded post requests, which I use:
app.use(bodyParser.json());
// Required for Twilio:
app.use(bodyParser.urlencoded({
    extended: true
}));
var fs = require('fs');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;

// All of my static web pages are in the public folder
app.use(express.static('public'));

// Kiosk button handler:
app.post('/kioskBackEnd', function(req, res) {
    var personalDataFolder = process.env.HOME + '/.arlobot/';
    var statusFolder = personalDataFolder + 'status/';
    var quietFile = statusFolder + 'bequiet';
    var stopFile = statusFolder + 'webStopRequested';
    var returnKioskStatus = function() {
        var amQuiet = false;
        var amStopped = false;
        fs.readFile(stopFile, function(err) {
            if (err) {
                amStopped = false;
            } else {
                amStopped = true;
            }
            fs.readFile(quietFile, function(err) {
                if (err) {
                    amQuiet = false;
                } else {
                    amQuiet = true;
                }
                var response = "{ \"QUIET\": " + amQuiet + ", \"STOP\": " + amStopped + " }";
                res.send(response);
            });
        });
    };
    if (req.body.PLEASE) {
        //TODO: This does NOT create world writable folders. :(
        mkdirp(statusFolder, 0777, function(err) {
            if (err) {
                res.send("{\"STATUS\": \"ERROR\" }");
                console.log("Could not create " + statusFolder);
            } else {
                if (req.body.PLEASE === 'talk') {
                    fs.unlink(quietFile, returnKioskStatus);
                } else if (req.body.PLEASE === 'beQuiet') {
                    fs.writeFile(quietFile, 'quiet\n', returnKioskStatus);
                } else if (req.body.PLEASE === 'stop') {
                    fs.writeFile(stopFile, 'STOP\n', returnKioskStatus);
                } else if (req.body.PLEASE === 'go') {
                    fs.unlink(stopFile, returnKioskStatus);
                }
            }
        });
    } else {
        // If the requset was empty return status.
        returnKioskStatus();
    }
});

// Twilio SMS Receiver:
app.post('/receivemessage', function(req, res) {
    // If you want a text response:
    //var twiml = '<?xml version="1.0" encoding="UTF-8" ?><Response><Message>Got it!</Message></Response>';
    // Otherwise, just tell Twilio we got it:
    var twiml = '<?xml version="1.0" encoding="UTF-8" ?><Response></Response>';
    res.send(twiml, {
        'Content-Type': 'text/xml'
    }, 200);
    //console.log("Body: " + req.body.Body);
    //console.log("From: " + req.body.From);
    var command = './runROSthings.sh ' + req.body.Body + ' ' + req.body.From;
    var ROScommand = exec(command);
    ROScommand.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });

    ROScommand.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });

    ROScommand.on('close', function(code) {
        console.log('child process exited with code ' + code);
    });
    ROScommand.on('error', function(err) {
        console.log('child process error' + err);
    });
});

app.get('/startROS', function(req, res) {
    var command = './runROSthings.sh ' + req.body.Body + ' ' + req.body.From;
    var ROScommand = exec(command);
    ROScommand.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });

    ROScommand.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });

    ROScommand.on('close', function(code) {
        console.log('child process exited with code ' + code);
    });
    ROScommand.on('error', function(err) {
        console.log('child process error' + err);
    });
//<!DOCTYPE html>
//<html lang="en">
//<head>
//<title>Starting ROS . . .</title>
//<meta charset="utf-8">
//</head>
//<body>
//<?php
//if (file_exists('arloweb.ini')) {
//$ini_array = parse_ini_file("arloweb.ini");
//#print_r($ini_array);
//#echo("{$ini_array['scriptFolder']}<br/>");
//#echo("{$ini_array['rosUser']}<br/>");*/
//shell_exec("nohup {$ini_array['scriptFolder']}/stubStarter.sh {$ini_array['scriptFolder']} {$ini_array['rosUser']} &");
//echo 'Starting ROS';
//} else {
//echo 'ERROR: arloweb.ini not found . . . ';
//echo '<script>window.location.href = "./missingConfig.html";</script>';
//}
//?>
//</body>
//</html>

});

var webServer = app.listen(8080);

//var server = app.listen(8080, function() {
//var host = server.address().address;
//var port = server.address().port;
//console.log('Example app listening at http://%s:%s', host, port);
//});
