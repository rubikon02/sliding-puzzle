export default class Popup extends HTMLElement {
    constructor(time = "[solveTime]", skipSave = false) {
        super()
        this.skipSave = skipSave
        const hours = ('0' + (time.getHours() - 1)).slice(-2)
        const minutes = ('0' + time.getMinutes()).slice(-2)
        const seconds = ('0' + time.getSeconds()).slice(-2)
        const milliseconds = ('00' + time.getMilliseconds()).slice(-3)
        this.message = "Puzzle solved. Your time is: " + hours + ":" + minutes + ":" + seconds + "." + milliseconds
    }

    connectedCallback() {
        let parser = new DOMParser()
        let popupString = '\
        <div id="gameEndPopup">\
            <div class="content">\
                <div class="text flex-vertical">\
                    <span>'+ this.message + '</span>\
                    <div>\
                        <label>Enter your name: </label>\
                        <input type="text" id="name">\
                    </div>\
                </div>\
                <div class="buttons">\
                    <button id="save">Save</button>\
                </div>\
            </div>\
        </div>'
        let html = parser.parseFromString(popupString, 'text/html')
        this.prepend(html.body.firstChild);
        if (this.skipSave)
            this.changeContent()
        else {
            this.input = this.querySelector("#name")
            this.input.focus()
            this.saveButton = this.querySelector("#save")
            this.saveButton.addEventListener("click", () => {
                this.changeContent()
                this.dispatchEvent(new CustomEvent('save', { detail: this.input.value || "anonymous" }))
            })
        }

    }

    changeContent() {
        const popup = document.getElementById("gameEndPopup")
        popup.innerHTML = '\
        <div id="gameEndPopup">\
            <div class="content">\
                <div class="text">\
                    <span>'+ this.message + '</span>\
                </div>\
                <div class="buttons">\
                    <button id="close">Close</button>\
                    <button id="leaderboard">Leaderboard</button>\
                </div>\
            </div>\
        </div>'
        this.closeButton = this.querySelector("#close")
        this.leaderboardButton = this.querySelector("#leaderboard")
        this.closeButton.addEventListener("click", () => this.remove())
        this.leaderboardButton.addEventListener("click", () => this.dispatchEvent(new Event('leaderboard')))
    }
}

customElements.define("pop-up", Popup)