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
    games           = []; // No players playing no games

var playerLeft          = new Player('left') 
var playerRight         = new Player('right') 
playerRight.spawnUnit(0)
playerRight.spawnUnit(1)
playerLeft.spawnUnit(0)
playerLeft.spawnUnit(1)


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


function getGameByCode(gameCode) {
    games.forEach(function(game) {
        if (game.code == gameCode) {
            return game;
        }
    });
    return null;
}

function generateGameCode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for( var i=0; i < 5; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    // If the game code is already in use then generate a new one
    if (getGameByCode(text)) {
        text = generateGameCode();
    }
    return text;
}


// Client connection algo
io.on('connection', function(socket) {
    socket.userid = ids_given++;

    // User requests to join a game
    socket.on('createGame', function(data) {
        var gameCode = generateGameCode();
        var player = new Player(data.playerName, socket.user_id);
        var game = new Game(gameCode, player);
        games.push(game);
    });

    // Player requests to join a game
    socket.on('joinGame', function(data) {
        var player = new Player(data.playerName, socket.user_id);
        var game = getGameByCode(data.gameCode);
        game.setOpponent(player);
        socket.player = player;
    });

    // Assign them a unique ID.
    socket.emit( 'userid', { id: socket.userid } );
    console.log('Player ' + socket.userid + ' connected.');

    // Handle the user disconnecting.
    socket.on('disconnect', function() {
        console.log('Player ' + socket.userid + ' disconnected');
    });
});

