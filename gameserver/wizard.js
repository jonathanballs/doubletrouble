"use strict"
var Unit = require('./unit')

class Wizard extends Unit {

    getUnitTypeSpeed() { return global.CONF.WIZARD_SPEED }
    getUnitTypeDamage() { return global.CONF.WIZARD_DAMAGE }
    getUnitTypeMovingStatus() { return true }
    getUnitTypeStart() { return global.CONF.WIZARD_START }
    getUnitTypeCost() { return global.CONF.WIZARD_COST }
    getUnitType() { return 'wizard' }
}

module.exports = Wizard
