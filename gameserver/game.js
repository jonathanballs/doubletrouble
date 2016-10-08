"use strict"
var _ = require('underscore')
var Player = require('./player')


var calculateDamages = function(u1, u2){
    u1.takeDamage(u2.damage)
    u2.takeDamage(u1.damage)
}

var detectUnitCollisions = function(lanes){
    if (lanes[0].units.length != 0 && lanes[1].units.length != 0) {
        // select most progressed unit from each lane
        var u1 = _.max(lanes[0].units, (unit) => { return unit.progress })
        var u2 = _.max(lanes[1].units, (unit) => { return unit.progress })
        // compute combined progress to detect collision (current progress + speed)
        if (u1.progress + (u1.speed/global.CONF.TICKS_PER_SECOND) + u2.progress + (u2.speed/global.CONF.TICKS_PER_SECOND) >= global.CONF.LENGTH_LANES) {
            u1.moving = false
            u2.moving = false
            var collisionPoint = (u1.progress + global.CONF.LENGTH_LANES - u2.progress) / 2
            u1.progress = collisionPoint
            u2.progress = global.CONF.LENGTH_LANES - collisionPoint
            calculateDamages(u1,u2)
        }
    } 
}

var detectHouseCollisions = function(lanes){
    if (lanes[0].units.length != 0 || lanes[1].units.length != 0) {
        // select most progressed unit from each lane
        var u1 = _.max(lanes[0].units, (unit) => { return unit.progress })
        var u2 = _.max(lanes[1].units, (unit) => { return unit.progress })
        var l1 = lanes[0]
        var l2 = lanes[1]
        // compute combined progress to detect collision (current progress + speed)
        if (u1.progress + u1.speed >= global.CONF.LENGTH_LANES) {
            u1.moving = false
            u1.progress = 100
            calculateDamages(u1,l2)
        }
        if (u2.progress + u2.speed >= global.CONF.LENGTH_LANES) {
            u2.moving = false
            u2.progress = 100
            calculateDamages(u2,l1)
        }
        console.log(l1)
        console.log(l2)
    } 
}

class Game {

    constructor(id) {
        this.id = id
        this.active = true
    }

    getState() {
        var obj = {
            id: this.id,
        }
        if (this.playerLeft) Object.assign(obj, { playerLeft: this.playerLeft.getState() })
        if (this.playerRight) Object.assign(obj, { playerRight: this.playerRight.getState() })
        return obj;
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
        if (players.length != 2) { return }
        players.forEach((player) => {
            player.lanes.forEach((lane, i) => {
                detectUnitCollisions([players[0].lanes[i],players[1].lanes[i]])
                detectHouseCollisions([players[0].lanes[i],players[1].lanes[i]])
                lane.killUnits()
                if (lane.health <= 0) {
                    lane.active = false
                    // kill the person here
                }
            })
            players.forEach((player) => {
                player.moveUnits() 
                player.getPaid()
            })
        })
    }

}

module.exports = Game;

