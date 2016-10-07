"use strict";

console.log("Double Trouble v0.0.1 running");

var gameport        = process.env.PORT || 4004,
    app             = require('express')(),
    server          = require('http').Server(app),
    io              = require('socket.io')(server),
    Game            = require('./gameserver/game.js'),
    Player          = require('./gameserver/player.js'),
    verbose         = false,
    update_delta    = 30, //ms
    ids_given       = 0,
    players         = [],
    games           = []; // No players playing no games

var playerLeft          = new Player('left') 
var playerRight         = new Player('right') 


// Start server.
server.listen(gameport);
console.log(':: Listening on port ' + gameport);


// Serve 'index.html' at the root and serve static files at /static/
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/static/*', function(req, res, next) {
    var file = req.params[0];

    if(verbose) console.log('\t :: Express :: file requested : ' + file);

    res.sendFile(__dirname + '/static/' + file);
});


// Client connection algo
io.on('connection', function(socket) {
    socket.userid = ids_given++;
    socket.score = 0;

    // Assign them a unique ID.
    socket.emit( 'userid', { id: socket.userid } );
    console.log('Player ' + socket.userid + ' connected.');

    // Handle the user disconnecting.
    socket.on('disconnect', function() {
        var num_users = collect_userstates().length;
        if (!num_users && zombies.length) {
            zombies = [];
            console.log('No users present. Deleting all zombies');
        }

        console.log('Player ' + socket.userid + ' disconnected');
    });
});


