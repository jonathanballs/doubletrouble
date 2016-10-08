"use strict";

global.CONF = require('./configs')
console.log(global.CONF)
console.log("Double Trouble v0.0.1 running");

var gameport        = process.env.PORT || 4004,
    app             = require('express')(),
    server          = require('http').Server(app),
    io              = require('socket.io')(server),
    GameManager     = require('./gameserver/manager.js'),
    Game            = require('./gameserver/game.js'),
    Player          = require('./gameserver/player.js'),
    gameManager     = new GameManager(),
    verbose         = false,
    update_delta    = 30, //ms
    ids_given       = 0;

// Play
gameManager.play()

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


function generateGameCode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for( var i=0; i < 5; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    // If the game code is already in use then generate a new one
    if (gameManager.getGame(text)) {
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
        var game = new Game(gameCode);
        var player = new Player(game.id, data.playerName, socket.user_id, socket, 'Left');
        game.setPlayerLeft(player);
        gameManager.addGame(game);
        console.log(game);
        console.log(gameManager.getGame(game.id));
        console.log("sending gameCode " + gameCode);
        socket.emit('newGameCode', gameCode);
    });

    // Player requests to join a game
    socket.on('joinGame', function(data) {
        var game = gameManager.getGame(data.gameCode);
        console.log(game);
        if (game == null) {
            socket.emit("gameJoin", {game: null});
        }
        else {
            var player = new Player(data.gameCode, data.playerName, socket.user_id, socket, 'Right');
            game.setPlayerRight(player);
            socket.player = player;
            console.log("Player joined");
            console.log(game);
            socket.emit("gameJoin", {game: game.getState()});
            game.playerLeft.socket.player = player;
            var opp = game.playerLeft.socket;
            opp.emit("gameJoin", {game: game.getState()});
        }
    });

    // Assign them a unique ID.
    socket.emit( 'userid', { id: socket.userid } );
    console.log('Player ' + socket.userid + ' connected.');

    // Handle the user disconnecting.
    socket.on('disconnect', function() {
        console.log('Player ' + socket.userid + ' disconnected');
    });

    // Handle all the game input
    socket.on('spawn', function(options) {
        var player = socket.player.getState()
        var game = gameManager.getGame(player.gameId)
        game["player"+player.side].spawnUnit(options.lane, options.type)
    })

    // update gamestate periodically
    function updateGameState(socket) {
        if (socket.player) socket.emit('gamestate', { gamestate: gameManager.getGame(socket.player.getState().gameId).getState() } )
    }
    setInterval(updateGameState, 1000 / global.CONF.STATE_UPDATES_PER_SECOND, socket)

});

