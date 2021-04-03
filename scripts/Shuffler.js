export default class Shuffler {

    constructor(board) {
        this.board = board
    }

    shuffle() {
        let i = 0
        this.interval = setInterval(() => {
            const rand = Math.floor(Math.random() * this.board.movableFragments.length)
            this.board.movableFragments[rand].move(0)
            if (++i >= this.stepsCount) {
                this.board.startGame()
                clearInterval(this.interval)
            }
        }, 1000 / this.stepsCount);
    }

    get stepsCount() {
        switch (this.board.cols * this.board.rows) {
            case 9:
                return 100
            case 16:
                return 200
            case 25:
                return 300
            case 36:
                return 500
        }
    }

    stop() {
        clearInterval(this.interval)
    }

    isOdd() {
        return this.board.size % 2
    }
}