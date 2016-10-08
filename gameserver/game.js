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
    players() {
        return [this.playerLeft, this.playerRight]
    }

    // this part handles interaction with the game
    tick() {
        this.players().forEach((player) => {
            player.moveUnits() 
        })
    }

}

module.exports = Game;

