import Shuffler from "./Shuffler.js"
import Popup from "./Popup.js"
import LeaderboardPopup from "./LeaderboardPopup.js"

export default class Board {
    constructor() {
        this.container = document.getElementById("boardContainer")
        this.size = this.container.clientHeight
        this.shuffler = new Shuffler(this)
        this.cookieExpireTime = new Date()
        this.cookieExpireTime.setTime(this.cookieExpireTime.getTime() + 365 * 24 * 60 * 60 * 1000)
        this.cookieExpireTime = this.cookieExpireTime.toUTCString()
    }

    get pieceWidth() {
        return this.size / this.cols
    }

    get pieceHeight() {
        return this.size / this.rows
    }

    set imgNumber(number = 1) {
        if (this.image === undefined) return
        this.container.innerHTML = ""
        this.image.src = './img/' + number + '.jpg'
        this.sourceImageFragmentHeight = this.image.naturalHeight / this.rows
        this.sourceImageFragmentWidth = this.image.naturalWidth / this.cols
    }

    newSize(cols, rows) {
        this.cols = parseInt(cols)
        this.rows = parseInt(rows)
        this.createImage()
        this.shuffler.stop()
    }

    createImage() {
        this.fragments = Array.from(Array(this.cols), () => new Array(this.rows))
        this.fragmentsDefaultPositions = Array.from(Array(this.cols), () => new Array(this.rows))
        this.image = new Image()
        this.image.onload = () => {
            for (let y = 0; y < this.rows; y++)
                for (let x = 0; x < this.cols; x++)
                    new BoardFramgent(x, y, this)
            this.fragments[this.cols - 1][this.rows - 1].remove()
            this.emptyFragment = {
                x: (this.cols - 1),
                y: (this.rows - 1)
            }
            this.shuffler.shuffle()

        }
    }

    get movableFragments() {
        const e = this.emptyFragment
        let movables = []
        if (e.x + 1 < this.cols)
            movables.push(this.fragments[e.x + 1][e.y])
        if (e.x - 1 >= 0)
            movables.push(this.fragments[e.x - 1][e.y])
        if (e.y + 1 < this.rows)
            movables.push(this.fragments[e.x][e.y + 1])
        if (e.y - 1 >= 0)
            movables.push(this.fragments[e.x][e.y - 1])
        return movables
    }
    doesPlayerWon() {
        for (let x = 0; x < this.cols; x++)
            for (let y = 0; y < this.rows; y++)
                if (this.fragments[x][y] != this.fragmentsDefaultPositions[x][y])
                    return false
        return true
    }

    playerWon() {
        this.stopTime()
        this.blocked = true
        let leaderboard = this.readFromCookie()
        let popup
        if (leaderboard.length >= 10 && this.time >= new Date(Math.max.apply(null, leaderboard.map(a => new Date(a.time))))) {
            popup = new Popup(this.time, 1)
            document.body.prepend(popup)
        } else {
            popup = new Popup(this.time)
            document.body.prepend(popup)
            popup.addEventListener("save", (e) => {
                this.enteredName = e.detail
                let leaderboard = this.readFromCookie()
                leaderboard.push({ name: this.enteredName, time: this.time })
                if (leaderboard.length > 10)
                    leaderboard = this.removeBiggestTime(leaderboard)
                leaderboard = leaderboard.sort((a, b) => new Date(a.time) - new Date(b.time))
                this.saveToCookie(leaderboard)
            })
        }
        popup.addEventListener("leaderboard", () => {
            const leaderboardPopup = new LeaderboardPopup(this.readFromCookie(), this.rows)
            document.body.prepend(leaderboardPopup)
        })
    }
    readFromCookie() {
        return JSON.parse(this.getCookie("leaderboard" + this.rows) || "[]")
    }
    saveToCookie(leaderboard) {
        document.cookie = "leaderboard" + this.rows + " = " + encodeURIComponent(JSON.stringify(leaderboard)) + "; expires=" + this.cookieExpireTime
    }
    getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
        if (match) return decodeURIComponent(match[2])
    }

    removeBiggestTime(leaderboard) {
        // const maxValue = Math.max(...leaderboard.map(a => a.time))
        const maxValue = Math.max.apply(null, leaderboard.map(a => new Date(a.time)))
        for (let i = 0; i < leaderboard.length - 1; i++) {
            if (Date.parse(leaderboard[i].time) == maxValue) {
                console.log("usuwam najwiekszy", maxValue)
                leaderboard.splice(i, 1);
            }
        }
        return leaderboard;
    }
    startGame() {
        this.blocked = false
        this.startTime = new Date(Date.now())
        this.msInterval = null
        this.updateTime()
        this.sInterval = setInterval(() => {
            clearInterval(this.msInterval)
            this.updateTime()
        }, 1000)
    }
    updateTime() {
        this.time = new Date(Date.now() - this.startTime)
        const h = ('0' + (this.time.getHours() - 1)).slice(-2)
        const m = ('0' + this.time.getMinutes()).slice(-2)
        const s = ('0' + this.time.getSeconds()).slice(-2)
        document.getElementById("h1").src = this.path(h[0])
        document.getElementById("h2").src = this.path(h[1])
        document.getElementById("m1").src = this.path(m[0])
        document.getElementById("m2").src = this.path(m[1])
        document.getElementById("s1").src = this.path(s[0])
        document.getElementById("s2").src = this.path(s[1])
        this.msInterval = setInterval(() => {
            this.time = new Date(Date.now() - this.startTime)
            const ms = ('00' + this.time.getMilliseconds()).slice(-3)
            document.getElementById("ms1").src = this.path(ms[0])
            document.getElementById("ms2").src = this.path(ms[1])
            document.getElementById("ms3").src = this.path(ms[2])
        }, 1)
    }
    stopTime() {
        clearInterval(this.msInterval)
        clearInterval(this.sInterval)
    }
    resetTime() {
        document.getElementById("h1").src = this.path(0)
        document.getElementById("h2").src = this.path(0)
        document.getElementById("m1").src = this.path(0)
        document.getElementById("m2").src = this.path(0)
        document.getElementById("s1").src = this.path(0)
        document.getElementById("s2").src = this.path(0)
        document.getElementById("ms1").src = this.path(0)
        document.getElementById("ms2").src = this.path(0)
        document.getElementById("ms3").src = this.path(0)
    }
    path(path) {
        return './img/c' + path + '.gif'
    }
}

class BoardFramgent {
    constructor(x, y, board) {
        this.x = x
        this.y = y
        this.board = board
        this.create()
        this.setImage(this.canvas.getContext('2d'))
        this.addToBoard()
        this.addListener()
    }

    create() {
        this.canvas = document.createElement('canvas')
        this.canvas.style.width = this.board.pieceWidth + "px"
        this.canvas.style.height = this.board.pieceHeight + "px"
        this.canvas.style.left = this.x * this.board.pieceWidth + "px"
        this.canvas.style.top = this.y * this.board.pieceHeight + "px"
    }

    setImage(context) {
        context.drawImage(
            this.board.image,
            this.x * this.board.sourceImageFragmentWidth,
            this.y * this.board.sourceImageFragmentHeight,
            this.board.sourceImageFragmentWidth,
            this.board.sourceImageFragmentHeight,
            0,
            0,
            this.canvas.width,
            this.canvas.height)
    }

    addToBoard() {
        this.board.fragments[this.x][this.y] = this
        this.board.fragmentsDefaultPositions[this.x][this.y] = this
        this.board.container.append(this.canvas)
    }

    remove() {
        this.canvas.remove()
    }

    addListener() {
        this.canvas.addEventListener("click", () => {
            if (this.board.moving) return
            if (this.board.blocked) return
            if (this.isMovable())
                this.move()
            if (this.board.doesPlayerWon())
                this.board.playerWon()
        })
    }



    isMovable() {
        if (Math.abs(this.board.emptyFragment.x - this.x) == 1
            && this.board.emptyFragment.y == this.y)
            return true
        if (Math.abs(this.board.emptyFragment.y - this.y) == 1
            && this.board.emptyFragment.x == this.x)
            return true
        return false
    }

    move(stepsCount = 20) {
        const emptyX = this.x
        const emptyY = this.y
        const toAddX = (this.board.emptyFragment.x - this.x) * this.board.pieceWidth
        const toAddY = (this.board.emptyFragment.y - this.y) * this.board.pieceHeight


        if (!stepsCount) {
            this.canvas.style.left = parseFloat(this.canvas.style.left, 10) + toAddX + "px"
            this.canvas.style.top = parseFloat(this.canvas.style.top, 10) + toAddY + "px"
        } else {
            let pos = 0
            this.board.moving = true
            let interval = setInterval(() => {
                this.canvas.style.left = parseFloat(this.canvas.style.left, 10) + toAddX / stepsCount + "px"
                this.canvas.style.top = parseFloat(this.canvas.style.top, 10) + toAddY / stepsCount + "px"
                if (pos >= stepsCount - 1) {
                    clearInterval(interval)
                    this.board.moving = false
                }
                pos++
            }, 1)
        }

        let temp = this.board.fragments[this.x][this.y]
        this.board.fragments[this.x][this.y] = this.board.fragments[this.board.emptyFragment.x][this.board.emptyFragment.y]
        this.board.fragments[this.board.emptyFragment.x][this.board.emptyFragment.y] = temp

        this.x = this.board.emptyFragment.x
        this.y = this.board.emptyFragment.y
        this.board.emptyFragment = { x: emptyX, y: emptyY }
        this.board.movableFragments
    }

}