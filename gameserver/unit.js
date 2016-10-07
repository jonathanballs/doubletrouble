"use strict"

class Unit {

    constructor() {
        this.progress = this.START
    }

    move(delta) {
        this.progress = this.progress + SPEED
    }
}

module.exports = Unit;

