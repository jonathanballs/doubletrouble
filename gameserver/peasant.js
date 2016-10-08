"use strict"
var Unit = require('./unit')

class Peasant extends Unit {

    getUnitTypeSpeed() { return 5 }
    getUnitTypeDamage() { return 1 }
    getUnitTypeMovingStatus() { return true }
    getUnitTypeStart() { return 0 }
    getUnitTypeCost() { return 3 }
}

module.exports = Peasant
