"use strict"
var Player = require('./player')

class Game {
    
    constructor() {
        console.log("New game");
        players = {
            left: new Player('leftplayer','p1'),
            right: new Player('leftplayer','p2')
        }
        console.log(this)
    }
}

module.exports = Game;

