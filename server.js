var config = require('./config');
var express = require('express');
var Canvas = require('canvas');

var fs = require('fs');
var L = require('leaflet-headless');
var leafletImage = require('leaflet-image');

var app = express();

// create an element for the map.
var element = document.createElement('div');
element.id = 'map';
document.body.appendChild(element);
var map = L.map('map').setView([0, 0], 2);
var mapbox = 'http://api.tiles.mapbox.com/v4/' + config.mapbox.account + '/{z}/{x}/{y}.png?access_token=' + config.mapbox.access_token;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res) {
    var fileName = 'index.html';
    var options = {
        root: __dirname + '/public/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        } else {
            console.log('Sent:', fileName);
        }
    });
});

app.get('/map.png', function(req, res) {
    var z = 100;
    var x = 222;
    var y = 333;
    var canvas = new Canvas(256, 256)
    var context = canvas.getContext('2d');
    var stream;

    res.setHeader("Cache-Control", "max-age=31556926");

    context.beginPath();
    context.rect(0, 0, 256, 256);

    context.lineWidth = 7;
    context.strokeStyle = 'red';
    context.stroke();

    var stream = canvas.createPNGStream();

    res.type("png");
    stream.pipe(res);
});

app.get('/leaflet.png', function(req, res) {

    L.tileLayer(mapbox, {}).addTo(map);

    leafletImage(map, function (err, canvas) {
        var stream = canvas.createPNGStream();
        res.type("png");
        stream.pipe(res);
    });


});

app.listen(config.web.port, function(err) {
    if (err) throw err
    console.log('Listening on ' + config.web.port + '...');
});
