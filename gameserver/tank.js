"use strict"
var Unit = require('./unit')

class Tank extends Unit {

    getUnitTypeSpeed() { return global.CONF.TANK_SPEED }
    getUnitTypeDamage() { return global.CONF.TANK_DAMAGE }
    getUnitTypeMovingStatus() { return true }
    getUnitTypeStart() { return global.CONF.TANK_START }
    getUnitTypeCost() { return global.CONF.TANK_COST }
    getUnitTypeHealth() { return global.CONF.TANK_HEALTH }
    getUnitType() { return 'tank' }
}

module.exports = Tank
