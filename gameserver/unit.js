"use strict"

class Unit {

    constructor() {
        this.progress = this.getUnitTypeStart()
        this.speed = this.getUnitTypeSpeed()
    }

    move(delta) {
        this.progress += this.speed
    }
}

module.exports = Unit;

