/*  =====> slideshow.js  */

class Slide {
  constructor(element) {
    this.position = 0
    this.el = element
  }

  slide() {
    this.makeActive(2)
    let reducer = this.getReducer()
    if (this.position === 0) {
      this.position = -reducer
      this.el.style.transform = `translateX(${this.position}px)`
      this.makeActive(3)
    } else if (this.position === -reducer) {
      this.position = reducer
      this.el.style.transform = `translateX(${this.position}px)`
      this.makeActive(1)
    } else {
      this.position = 0
      this.el.style.transform = `translateX(${this.position}px)`
      this.makeActive(2)
    }
  }

  // get value to move the x axis of each image
  getReducer() {
    return document.querySelector(".slideshow").offsetWidth > 600 ? 620 : 320
  }

  makeActive(selected_number) {
    const numbers = [1, 2, 3]
    numbers.forEach((num) => {
      document.getElementById(`indicator-${num}`).style.transform = `scale(${
        num === selected_number ? "1.5, 1.5" : "1, 1"
      })`
    })
  }
}

class Slideshow {
  constructor() {
    this.slides = document.querySelectorAll(".slideshow img")
  }

  loop() {
    this.slides.forEach((el) => {
      const slide = new Slide(el)
      setInterval(() => {
        slide.slide()
      }, 3000)
    })
  }

  watchResize() {
    window.addEventListener(
      "resize",

      () =>
        this.slides.forEach((el) => {
          const slide = new Slide(el)
          slide.slide()
        }),
      true
    )
  }
}

const slideshow = new Slideshow()
slideshow.loop()
slideshow.watchResize()
