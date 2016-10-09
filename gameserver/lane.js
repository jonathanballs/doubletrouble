"use strict"
var _ = require('underscore')
var Unit = require('./unit')

class Lane {

    constructor(lane_num, villagers) {
        this.num = lane_num
        this.units = []
        this.health = 10
        this.villagers = villagers 
    }

    addUnit(unit) {
        this.units.push(unit)
    }

    killUnits() {
        this.units = _.filter(this.units, (unit) => { return unit.health > 0 })
    }

    takeDamage(d) {
        var initVillagers = this.villagers
        if(this.villagers > 0)
        {
            this.villagers -= d
            if(this.villagers < 0)
            {
                this.villagers = 0
                takeDamage(d - initVillagers)
            }
        }else{
            this.health -= d
        }
    }
}

module.exports = Lane;
