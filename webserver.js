var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var fs = require('fs');
var mkdirp = require('mkdirp');

// All of my static web pages are in the public folder
app.use(express.static('public'));
//app.get('/', function (req, res) {
//res.send('Hello World!');
//});
app.post('/kioskBackEnd', function(req, res) {
    var personalDataFolder = process.env.HOME + '/.arlobot/';
    var statusFolder = personalDataFolder + 'status/';
    var quietFile = statusFolder + 'bequiet';
    var stopFile = statusFolder + 'webStopRequested';
    var returnKioskStatus = function(err) {
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
        mkdirp(statusFolder, 0777, function(err) {
            if (err) {
                res.send("ERROR");
                console.log("Could not create " + statusFolder);
            } else {
                var returnText = function(err) {
                    // Return json style response.
                    if (err) {
                        res.send("{ \"STATUS\": \"ERROR\" }");
                    } else {
                        res.send("{ \"STATUS\": \"SUCCESS\" }");
                    }
                };
                if (req.body.PLEASE === 'talk') {
                    fs.unlink(quietFile, returnText(err));
                } else if (req.body.PLEASE === 'beQuiet') {
                    fs.writeFile(quietFile, 'quiet\n', returnText(err));
                } else if (req.body.PLEASE === 'stop') {
                    fs.writeFile(stopFile, 'STOP\n', returnText(err));
                } else if (req.body.PLEASE === 'go') {
                    fs.unlink(stopFile, returnText(err));
                }
            }
        });
    } else {
        // If the requset was empty return status.
        returnKioskStatus();
    }
    /*
    if ( $_POST["PLEASE"] === 'beQuiet') {
        $myfile = fopen($quietFile, "w") or die("Unable to open file!");
        $txt = "quiet\n";
        fwrite($myfile, $txt);
        fclose($myfile);
        chmod($quietFile, 0666);
    } elseif ( $_POST["PLEASE"] === 'talk') {
        unlink($quietFile);
    } elseif ( $_POST["PLEASE"] === 'stop') {
        $myfile = fopen($stopFile, "w") or die("Unable to open file!");
        $txt = "STOP\n";
        fwrite($myfile, $txt);
        fclose($myfile);
        chmod($stopFile, 0666);
    } elseif ( $_POST["PLEASE"] === 'go') {
        unlink($stopFile);
    }
}
$amQuiet = (file_exists($quietFile)) ? 'true' : 'false';
$amStopped = (file_exists($stopFile)) ? 'true' : 'false';
*/
});

var webServer = app.listen(8080);

//var server = app.listen(8080, function() {
//var host = server.address().address;
//var port = server.address().port;
//console.log('Example app listening at http://%s:%s', host, port);
//});
