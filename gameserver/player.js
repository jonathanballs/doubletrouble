"use strict"
var lane = require('./lane')

var NUM_LANES = 2

class Player {
    
    constructor(side, name, id) {
        this.side = side
        this.name = name
        this.id = id
        this.lanes = Array(NUM_LANES).fill().map((_, i) => {
            return new lane(i)
        })
    }

    spawnUnit(lane) {
        this.lanes[lane].addUnit()
    }
}

module.exports = Player;

