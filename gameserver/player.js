"use strict"
var lane = require('./lane')
var units = require('./unit_list')

var NUM_LANES = 2

class Player {

    constructor(game, name, id) {
        this.game = game
        this.name = name
        this.id = id
        this.health = 100
        this.lanes = Array(NUM_LANES).fill().map((_, i) => {
            return new lane(i)
        })
    }

    spawnUnit(lane, type) {
        this.lanes[lane].addUnit(new units[type]())
    }

    takeDamage(damage) {
        this.health -= damage
    }

    moveUnits() {
        this.lanes.forEach((lane) => {
            lane.units.forEach((unit) => {
                unit.move()
            })
        })
    }
}

module.exports = Player;

