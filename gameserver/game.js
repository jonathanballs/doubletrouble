"use strict"
var Player = require('./player')

class Game {
    
    constructor(id, challenger) {
        console.log("New game");
        this.id = id
        this.challenger = challenger
        console.log(this)
    }

    setPlayerLeft(playerLeft) {
        this.playerLeft = playerLeft
    }
    setPlayerRight(playerRight) {
        this.playerRight = playerRight
    }

}

module.exports = Game;

