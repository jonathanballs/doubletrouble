"use strict";

console.log("basically running");


var gameport        = process.env.PORT || 4004,
    app             = require('express')(),
    server          = require('http').Server(app),
    io              = require('socket.io')(server),
    verbose         = false,
    update_delta    = 30; //ms

// Process command line arguments;
process.argv.forEach(function (val, index, array) {
    if (val == "-noZombies") {
        createZombies = false;
    }
});

// Start server.
server.listen(gameport);
console.log(':: Listening on port ' + gameport);


// Serve 'index.html' at the root.
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

// Serve static files
app.get('/static/*', function(req, res, next) {
    var file = req.params[0];

    if(verbose) console.log('\t :: Express :: file requested : ' + file);

    res.sendfile(__dirname + '/static/' + file);
});
