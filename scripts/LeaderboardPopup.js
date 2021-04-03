export default class LeaderboardPopup extends HTMLElement {
    constructor(leaderboard = "[leaderboard]", size) {
        super()
        this.leaderboard = leaderboard
        this.size = size
    }

    connectedCallback() {
        this.createPopup()
        this.addListeners()
    }

    createPopup() {
        let parser = new DOMParser()
        let popupString = '\
        <div id="gameEndPopup">\
            <div class="content">\
                <div class="flex-vertical">\
                    <h1>Leaderboard - Top 10</h1>\
                    <h2>Size: '+ this.size + 'x' + this.size + '</h2>\
                    <ul>'
        for (let user of this.leaderboard) {
            popupString += "<li>" + this.getLine(user) + "</li>"
        }
        popupString += '\
                    </ul>\
                </div>\
                <div class="buttons">\
                    <button id="close">Close</button>\
                </div>\
            </div>\
        </div>'
        let html = parser.parseFromString(popupString, 'text/html')
        this.prepend(html.body.firstChild);
    }

    getLine(user) {
        let time = new Date(user.time)
        const hours = ('0' + (time.getHours() - 1)).slice(-2)
        const minutes = ('0' + time.getMinutes()).slice(-2)
        const seconds = ('0' + time.getSeconds()).slice(-2)
        const milliseconds = ('00' + time.getMilliseconds()).slice(-3)
        return user.name + " - " + hours + ":" + minutes + ":" + seconds + "." + milliseconds
    }

    addListeners() {
        this.closeButton = this.querySelector("#close")
        this.closeButton.addEventListener("click", () => this.remove())
    }
}

customElements.define("leaderboard-pop-up", LeaderboardPopup)