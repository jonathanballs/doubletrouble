"use strict"
var Player = require('./player')

class Game {
    
    constructor(id) {
        this.id = id
    }

    setPlayerLeft(playerLeft) {
        this.playerLeft = playerLeft
    }
    setPlayerRight(playerRight) {
        this.playerRight = playerRight
    }

}

module.exports = Game;

