"use strict"
var _ = require('underscore')
var Unit = require('./unit')

class Lane {

    constructor(lane_num) {
        this.num = lane_num
        this.units = []
        this.health = 10
    }

    addUnit(unit) {
        this.units.push(unit)
    }

    killUnits() {
        this.units = _.filter(this.units, (unit) => { return unit.health > 0 })
    }

    takeDamage(d) {
        this.health -= d
    }
}

module.exports = Lane;
