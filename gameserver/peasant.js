"use strict"
var Unit = require('./unit')

var Peasant = Unit => class extends Unit {
    static START = 0
    static SPEED = 0.2
    static DAMAGE = 1
}
