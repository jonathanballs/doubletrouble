"use strict"

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
        console.log(self.games)
    }

    play() {
        setInterval(this.tick, 1000 * (1 / global.CONF.TICKS_PER_SECOND), this)
        return
    }
    addGame(game) {
        this.games.push(game)
    }

}
