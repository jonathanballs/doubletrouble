"use strict"
var Unit = require('./unit')

class Worker extends Unit {

    getUnitTypeSpeed() { return global.CONF.WORKER_SPEED }
    getUnitTypeDamage() { return global.CONF.WORKER_DAMAGE }
    getUnitTypeMovingStatus() { return true }
    getUnitTypeStart() { return global.CONF.WORKER_START }
    getUnitTypeCost() { return global.CONF.WORKER_COST }
    getUnitTypeHealth() { return global.CONF.WORKER_HEALTH }
    getUnitType() { return 'worker' }
}

module.exports = Worker
