"use strict"
var Unit = require('./unit')

class Knight extends Unit {

    getUnitTypeSpeed() { return 9 }
    getUnitTypeDamage() { return 2 }
    getUnitTypeMovingStatus() { return true }
    getUnitTypeStart() { return 3 }
    getUnitTypeCost() { return 7 }
}

module.exports = Knight
