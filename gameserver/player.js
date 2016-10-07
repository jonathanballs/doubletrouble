"use strict"
var lane = require('./lane')

var NUM_LANES = 2

class Player {
    
    constructor(side) {
        console.log("New player on " + side + " side");
        this.side = side
        this.lanes = Array(NUM_LANES).fill().map((_, i) => {
            return new lane(i)
        })
    }
}

module.exports = Player;

