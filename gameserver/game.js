"use strict"
var _ = require('underscore')
var Player = require('./player')


var detectUnitCollisions = function(lanes, callback){
    if (lanes[0].units.length != 0 && lanes[1].units.length != 0) {
        // select most progressed unit from each lane
        var u1 = _.max(lanes[0].units, (unit) => { return unit.progress })
        var u2 = _.max(lanes[1].units, (unit) => { return unit.progress })
        // compute combined progress to detect collision (current progress + speed)
        if (u1.progress + u1.speed + u2.progress + u2.speed >= global.CONF.LENGTH_LANES) {
            u1.moving = false
            u2.moving = false
            var collisionPoint = (u1.progress + global.CONF.LENGTH_LANES - u2.progress) / 2
            u1.progress = collisionPoint
            u2.progress = global.CONF.LENGTH_LANES - collisionPoint
        }
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
        var players_arr = []
        if (this.playerLeft) { players_arr.push(this.playerLeft) }
        if (this.playerRight) { players_arr.push(this.playerRight) }
        return players_arr
    }

    // this part handles interaction with the game
    tick() {
        var players = this.players()
//        players.forEach((player) => {
//            player.lanes.forEach((lane, i) => {
//                detectUnitCollisions([players[0].lanes[i],players[1].lanes[i]])
//            })
//        })
        players.forEach((player) => {
            player.moveUnits() 
            player.getPaid()
        })
    }

}

module.exports = Game;

