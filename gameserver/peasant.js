"use strict"
var Unit = require('./unit')

class Peasant extends Unit {

    getSpeed() { return 5 }
    getDamage() { return 1 }
    getStart() { return 0 }
}

module.exports = Peasant
