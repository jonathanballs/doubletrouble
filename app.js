"use strict";

global.CONF = require('./configs')
console.log("Double Trouble v0.0.1 running");

var gameport        = process.env.PORT || 4004,
    app             = require('express')(),
    server          = require('http').Server(app),
    io              = require('socket.io')(server),
    colors          = require('colors/safe'),
    _               = require('underscore'),
    Game            = require('./gameserver/game.js'),
    Player          = require('./gameserver/player.js'),
    verbose         = false,
    update_delta    = 30, //ms
    ids_given       = 0,
    games           = []; // No players playing no games

function printGameStatus(game){
    console.log(colors.green('=============================='))
    console.dir(game)
    console.log(colors.green('=============================='))
}

// testing the game
function test() {
    var testGame = new Game('testGameId')
    testGame.setPlayerLeft(new Player(testGame, 'player1','p1id'))
    testGame.setPlayerRight(new Player(testGame, 'player2','p2id'))
    testGame.playerLeft.spawnUnit(0,'peasant')
    testGame.playerRight.spawnUnit(0,'knight')
    printGameStatus(testGame.playerLeft.lanes[0])
    printGameStatus(testGame.playerRight.lanes[0])
    testGame.tick()
    testGame.tick()
    testGame.tick()
    testGame.tick()
    testGame.tick()
    printGameStatus(testGame)
    printGameStatus(testGame.playerLeft.lanes[0])
    printGameStatus(testGame.playerRight.lanes[0])
    testGame.tick()
    testGame.tick()
    testGame.tick()
    testGame.tick()
    testGame.tick()
    printGameStatus(testGame)
    testGame.playerLeft.spawnUnit(0,'knight')
    testGame.playerRight.spawnUnit(0,'peasant')
    printGameStatus(testGame.playerLeft.lanes[0])
    printGameStatus(testGame.playerRight.lanes[0])
    testGame.tick()
    testGame.tick()
    testGame.tick()
    testGame.tick()
    testGame.tick()
    printGameStatus(testGame)
    printGameStatus(testGame.playerLeft.lanes[0])
    printGameStatus(testGame.playerRight.lanes[0])
    testGame.tick()
    testGame.tick()
    testGame.tick()
    testGame.tick()
    testGame.tick()
    printGameStatus(testGame)
    printGameStatus(testGame.playerLeft.lanes[0])
    printGameStatus(testGame.playerRight.lanes[0])
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


function getGameByCode(gameCode) {
    gameCode = gameCode.toUpperCase();
    console.log(games);
    return _.find(games, (game) => { return game.id == gameCode });
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

    // User requests to create a game
    socket.on('createGame', function(data) {
        var gameCode = generateGameCode();
        var game = new Game(gameCode);
        var player = new Player(game, data.playerName, socket.user_id);
        game.setPlayerLeft(player);
        games.push(game);
        console.log("sending gameCode " + gameCode);
        socket.emit('newGameCode', gameCode);
    });

    // Player requests to join a game
    socket.on('joinGame', function(data) {
        var player = new Player(game, data.playerName, socket.user_id);
        var game = getGameByCode(data.gameCode);
        if (game == null) {
            socket.emit("gameJoin", {game: null});
        }
        else {
            game.setPlayerRight(player);
            socket.player = player;
            console.log("Player joined");
            //socket.emit("gameJoin", {game: game});
        }
    });

    // Assign them a unique ID.
    socket.emit( 'userid', { id: socket.userid } );
    console.log('Player ' + socket.userid + ' connected.');

    // Handle the user disconnecting.
    socket.on('disconnect', function() {
        console.log('Player ' + socket.userid + ' disconnected');
    });
});

