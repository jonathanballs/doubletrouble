"use strict"
var _ = require('underscore')
var Player = require('./player')


var detectUnitCollisions = function(lanes, callback){
    if (lanes[0].units.length == 0 || lanes[1].units.length == 0) { return false }
    else {
        // select most progressed unit from each lane
        var u1 = _.max(lanes[0].units, (unit) => { return unit.progress })
        var u2 = _.max(lanes[1].units, (unit) => { return unit.progress })
        // compute combined progress to detect collision (current progress + speed)
        if (u1.progress + u1.speed + u2.progress + u2.speed >= 100) {
            console.log('Colision on lanes ' + lanes[0].num + ' ' + lanes[1].num) 
            u1.moving = false
            u2.moving = false
            return (u1.progress + u2.progress / 2)
        } else { return false }
    } 
}

class Game {

    constructor(id) {
        this.id = id
    }

    setPlayerLeft(playerLeft) {
        this.playerLeft = playerLeft
    }
    setPlayerRight(playerRight) {
        this.playerRight = playerRight
    }
    players() {
        return [this.playerLeft, this.playerRight]
    }

    // this part handles interaction with the game
    tick() {
        console.log(detectUnitCollisions([this.playerLeft.lanes[0], this.playerRight.lanes[0]]))
        this.players().forEach((player) => {
            player.moveUnits() 
            player.getPaid()
        })
    }

}

module.exports = Game;

