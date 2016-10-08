"use strict"
var _ = require('underscore')

module.exports = class Manager {
    constructor() {
        console.log("Game Running")
        this.games = new Array()
        this.active = true
        console.log(this.games)
    }

    tick(self) {
        self.games.forEach((game) => {
            game.tick()
        })
        //console.log(self.games)
    }

    play() {
        setInterval(this.tick, 1000 * (1 / global.CONF.TICKS_PER_SECOND), this)
        return
    }

    addGame(game) {
        this.games.push(game)
    }

    getGame(gameId) {
       for(var i = 0; i<this.games.length; i++) {
           if (this.games[i].id == gameId) {
               return this.games[i];
            }
       }
       return null;
    }
}

