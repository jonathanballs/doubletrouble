"use strict"
var Unit = require('./unit')

class Lane {

    constructor(lane_num) {
        console.log("New Lane")
        this.num = lane_num
        this.units = []
        console.log(this)
    }

    addUnit() {
        this.units.push(new Unit())
    }
}

module.exports = Lane;
