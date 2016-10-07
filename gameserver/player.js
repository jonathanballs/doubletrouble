"use strict"
var lane = require('./lane')

var NUM_LANES = 2

class Player {
    
    constructor(side, name, id) {
        console.log("New player on " + side + " side")
        this.side = side
        this.name = name
        this.id = id
        this.lanes = Array(NUM_LANES).fill().map((_, i) => {
            return new lane(i)
        })
        console.log(this)
    }

    spawnUnit(lane) {
        console.log("Spawning unit for " + this.side + " player")
        this.lanes[lane].addUnit()
        console.log(this)
    }
}

module.exports = Player;

