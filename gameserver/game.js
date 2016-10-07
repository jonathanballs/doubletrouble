"use strict"
var Player = require('./player')

class Game {
    
    constructor(challenger) {
        console.log("New game");
        this.challenger = challenger
        console.log(this)
    }

    addOpponent(opponent) {
        this.opponent = opponent
    }
}

module.exports = Game;

