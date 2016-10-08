"use strict"
var Unit = require('./unit')

class Lane {

    constructor(lane_num) {
        this.num = lane_num
        this.units = []
    }

    addUnit(unit) {
        this.units.push(unit)
    }
}

module.exports = Lane;
