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
        console.log(self.games[0].playerLeft.lanes[0])
        console.log(self.games[0].playerRight.lanes[0])
    }

    play() {
        setInterval(this.tick, 1000 * (1 / global.CONF.TICKS_PER_SECOND), this)
        return
    }

    addGame(game) {
        this.games.push(game)
    }

    getGame(gameId) {
        _.find(this.games, (game) => { return game.id == gameId })
    }

}
