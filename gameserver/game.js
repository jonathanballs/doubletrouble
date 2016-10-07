"use strict"
var Player = require('./player')

class Game {
    
    constructor(id, challenger) {
        console.log("New game");
        this.id = id
        this.challenger = challenger
        console.log(this)
    }

    setOpponent(opponent) {
        this.opponent = opponent
    }
}

module.exports = Game;

