"use strict";

global.CONF = require('./configs')
console.log("Double Trouble v0.0.1 running");

var gameport        = process.env.PORT || 4004,
    app             = require('express')(),
    server          = require('http').Server(app),
    io              = require('socket.io')(server),
    colors          = require('colors/safe'),
    _               = require('underscore'),
    GameManager     = require('./gameserver/manager.js'),
    Game            = require('./gameserver/game.js'),
    Player          = require('./gameserver/player.js'),
    gameManager     = new GameManager(),
    verbose         = false,
    update_delta    = 30, //ms
    ids_given       = 0;

function printGameStatus(game){
    console.log(colors.green('=============================='))
    console.dir(game)
    console.log(colors.green('=============================='))
}

function test() {
    // testing the game
    var testGameManager = new GameManager()
    var testGame = new Game('testGameId')
    testGameManager.play()
    testGameManager.addGame(testGame)
    testGame.setPlayerLeft(new Player(testGame, 'player1','p1id'))
    testGame.setPlayerRight(new Player(testGame, 'player2','p2id'))
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    sleep(1000).then(() => {
        testGame.playerLeft.spawnUnit(0,'worker')
    });
    sleep(2000).then(() => {
        testGame.playerRight.spawnUnit(0,'worker')
    });
    sleep(8000).then(() => {
        testGame.playerRight.spawnUnit(0,'soldier')
    });
    sleep(5000).then(() => {
        testGame.playerRight.spawnUnit(0,'soldier')
    });
}
//test();

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

    // User requests to create a game
    socket.on('createGame', function(data) {
        var gameCode = generateGameCode();
        var game = new Game(gameCode);
        var player = new Player(game.id, data.playerName, socket.user_id);
        game.setPlayerLeft(player);
        gameManager.addGame(game);
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
            var player = new Player(data.gameCode, data.playerName, socket.user_id);
            game.setPlayerRight(player);
            socket.player = player;
            console.log("Player joined");
            console.log(game);
            socket.emit("gameJoin", {game: game});
        }
    });

    // Assign them a unique ID.
    socket.emit( 'userid', { id: socket.userid } );
    console.log('Player ' + socket.userid + ' connected.');

    // Handle the user disconnecting.
    socket.on('disconnect', function() {
        console.log('Player ' + socket.userid + ' disconnected');
    });

    // update gamestate periodically
    function updateGameState(socket) {
        if (this.player)
            socket.emit('gamestate', { gamestate: gameManager.getGame(socket.player.gameId) } )
    }
    setInterval(updateGameState, 1000 / 5, socket)

});

