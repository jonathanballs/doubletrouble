"use strict"

class Unit {

    constructor() {
        this.progress = this.getUnitTypeStart()
        this.speed = this.getUnitTypeSpeed()
        this.moving = this.getUnitTypeMovingStatus()
        this.type = this.getUnitType()
        this.damage = this.getUnitTypeDamage()
        this.health = this.getUnitTypeHealth() 
    }

    move(delta) {
        // progress by delta per second now
        if (this.moving) { this.progress += this.speed / global.CONF.TICKS_PER_SECOND }
    }

    takeDamage(d) {
        this.health -= d
    }
}

module.exports = Unit;

