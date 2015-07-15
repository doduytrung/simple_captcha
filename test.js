var express = require('express');
var bodyParser = require('body-parser');
//var engines = require('consolidate');
var app = express();
 
var https = require('https');
 
app.use(bodyParser.json());
//app.engine('html', engines.hogan);
//app.engine('html', engines.swig);
//app.set('view engine','html');
app.set('view engine', 'jade');


 
app.get('/', function(req, res) {
        res.render('form');
});
 
app.post('/register', function(req, res) {
	console.log('Checking.....');
	console.log(req.body["recaptcha"]);
        verifyRecaptcha(req.body["recaptcha"], function(success) {
                if (success) {
                        res.end(JSON.stringify({ registeredSuccessfully: true }));
                        // TODO: do registration using params in req.body
                } else {
                        res.end(JSON.stringify({ registeredSuccessfully: false, reason: "Captcha failed, try again." }));
                        // TODO: take them back to the previous page
                        // and for the love of everyone, restore their inputs
                }
        });
});
 
app.listen(8000);
 
var SECRET = "6LduawUTAAAAAKpHmOsNXyhawl09PcH3iVJPhUzV";
 
// Helper function to make API call to recatpcha and check response
function verifyRecaptcha(key, callback) {
        https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET + "&response=" + key, function(res) {
                var data = "";
                res.on('data', function (chunk) {
                        data += chunk.toString();
                });
                res.on('end', function() {
                        try {
                                var parsedData = JSON.parse(data);
                                console.log(parsedData);
                                callback(parsedData.success);
                        } catch (e) {
                                callback(false);
                        }
                });
        });
}