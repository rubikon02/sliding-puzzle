export default class Slider {
    constructor() {
        this.getHtmlElements()
        this.step = sliderInner.offsetWidth
        this.transitionLength = 0.4
        this.moving = false
        this.setMargin()
        this.cloneFirstAndLast()
        this.addNextListener()
        this.addPrevListener()
        this.selectedImage = 1
    }

    // get selectedImage() {
    //     return -parseFloat(this.sliderInner.style.marginLeft, 10) / this.step
    // }


    getHtmlElements() {
        this.next = document.getElementById("next")
        this.prev = document.getElementById("prev")
        this.sliderInner = document.getElementById("sliderInner")
        this.slides = document.getElementsByClassName("slide")
    }

    setMargin() {
        this.sliderInner.style.marginLeft = -this.step + "px"
        setTimeout(() => {
            this.sliderInner.style.transition = "margin " + this.transitionLength + "s"
        }, 1)
    }

    cloneFirstAndLast() {
        this.sliderInner.append(this.slides[0].cloneNode(true))
        this.sliderInner.prepend(this.slides[this.slides.length - 2].cloneNode(true))
    }

    addNextListener() {
        next.addEventListener("click", () => {
            if (this.moving) return
            this.moving = true
            this.selectedImage++
            if (this.selectedImage >= this.slides.length - 1)
                this.selectedImage = 1
            this.makeStep(-this.step)
            if (this.sliderInner.style.marginLeft == -(this.slides.length - 1) * this.step + "px")
                this.moveToOtherEnd(-this.step)
            else
                this.moving = false
        })
    }

    addPrevListener() {
        prev.addEventListener("click", () => {
            if (this.moving) return
            this.moving = true
            this.selectedImage--
            if (this.selectedImage <= 0)
                this.selectedImage = this.slides.length - 2
            this.makeStep(this.step)
            if (this.sliderInner.style.marginLeft == "0px")
                this.moveToOtherEnd(-(this.slides.length - 2) * this.step)
            else
                this.moving = false
        })
    }

    moveToOtherEnd(step) {
        setTimeout(() => {
            this.sliderInner.classList.add("notransition")
            this.sliderInner.style.marginLeft = step + "px"
            setTimeout(() => {
                this.sliderInner.classList.remove("notransition")
                this.moving = false
            }, 50)
        }, this.transitionLength * 1000)
    }

    makeStep(step) {
        this.sliderInner.style.marginLeft = parseFloat(this.sliderInner.style.marginLeft, 10) + step + "px"
    }
}