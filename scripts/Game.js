import Slider from "./Slider.js"
import Board from "./Board.js"

export default class Game {
    constructor() {
        this.slider = new Slider()
        this.board = new Board()
        this.getButtons()
    }
    getButtons() {
        const buttons = document.querySelectorAll("#buttons > button")
        for (const button of buttons) {
            button.addEventListener("click", (e) => {
                this.board.stopTime()
                this.board.resetTime()
                this.startGame(e.target.value)
            })
        }
    }
    startGame(size) {
        this.board.newSize(size, size)
        this.board.imgNumber = this.slider.selectedImage
    }
}