"use strict"
var Unit = require('./unit')

class Soldier extends Unit {

    getUnitTypeSpeed() { return global.CONF.SOLDIER_SPEED }
    getUnitTypeDamage() { return global.CONF.SOLDIER_DAMAGE }
    getUnitTypeMovingStatus() { return true }
    getUnitTypeStart() { return global.CONF.SOLDIER_START }
    getUnitTypeCost() { return global.CONF.SOLDIER_COST }
    getUnitTypeHealth() { return global.CONF.SOLDIER_HEALTH }
    getUnitType() { return 'soldier' }
}

module.exports = Soldier
