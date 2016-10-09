"use strict"
var lane = require('./lane')
var units = require('./unit_list')

class Player {

    getState() {
        return {
            gameId: this.gameId,
            side: this.side,
            name: this.name,
            health: this.health,
            income: this.income,
            villagers: this.villagers,
            money: this.money,
            lanes: this.lanes
        }
    }

    constructor(gameId, name, id, socket, side) {
        this.gameId = gameId
        this.name = name
        this.side = side
        this.id = id
        this.socket = socket
        this.health = 100
        this.income = global.CONF.PLAYER_INCOME 
        this.villagers = [1,1] 
        this.money = global.CONF.PLAYER_START_MONEY
        this.lanes = Array(global.CONF.NUM_LANES).fill().map((_, i) => {
            return new lane(i)
        })
    }

    spawnUnit(lane, type) {
        console.log('SPAWNING ' + type)
        var unit = new units[type]()
        var unitCost = unit.getUnitTypeCost()
        if (unitCost <= this.money) {
            this.money -= unitCost
            if(type != 'worker')
            {
                this.lanes[lane].addUnit(new units[type]())
            }else{
                this.villagers[lane]++;
            }
         } else { console.log('insufficient funds') }
    }

    takeDamage(damage) {
        this.health -= damage
    }

    moveUnits() {
        this.lanes.forEach((lane) => {
            lane.units.forEach((unit) => {
                unit.move()
            })
        })
    }

    getPaid() {
        // income per second using ticks per second
        this.money += this.income*(this.villagers[0]+this.villagers[1]) / global.CONF.TICKS_PER_SECOND
    }
}

module.exports = Player;

