var express = require('express');
var Canvas = require('canvas');
var app = express();

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

app.listen(process.env.PORT || 8000, function(err) {
    if (err) throw err
    console.log('Listening on 8000...');
});
