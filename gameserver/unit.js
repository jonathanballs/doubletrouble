"use strict"

class Unit {

    constructor() {
        this.progress = this.getUnitTypeStart()
        this.speed = this.getUnitTypeSpeed()
        this.moving = this.getUnitTypeMovingStatus()
        this.type = this.getUnitType()
    }

    move(delta) {
        // progress by delta per second now
        if (this.moving) { this.progress += this.speed / global.CONF.TICKS_PER_SECOND }
    }
}

module.exports = Unit;

