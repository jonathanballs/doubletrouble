"use strict"

class Unit {

    constructor() {
        this.progress = this.getUnitTypeStart()
        this.speed = this.getUnitTypeSpeed()
        this.moving = this.getUnitTypeMovingStatus()
        this.type = this.getUnitType()
    }

    move(delta) {
        if (this.moving) { this.progress += this.speed }
    }
}

module.exports = Unit;

