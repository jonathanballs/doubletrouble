"use strict"
var Unit = require('./unit')

class Knight extends Unit {

    getUnitTypeSpeed() { return global.CONF.KNIGHT_SPEED }
    getUnitTypeDamage() { return global.CONF.KNIGHT_DAMAGE }
    getUnitTypeMovingStatus() { return true }
    getUnitTypeStart() { return global.CONF.KNIGHT_START }
    getUnitTypeCost() { return global.CONF.KNIGHT_COST }
}

module.exports = Knight
