"use strict"
var Unit = require('./unit')

class Peasant extends Unit {

    getUnitTypeSpeed() { return global.CONF.PEASANT_SPEED }
    getUnitTypeDamage() { return global.CONF.PEASANT_DAMAGE }
    getUnitTypeMovingStatus() { return true }
    getUnitTypeStart() { return global.CONF.PEASANT_START }
    getUnitTypeCost() { return global.CONF.PEASANT_COST }
}

module.exports = Peasant
