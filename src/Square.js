export default class Square {
  constructor (scene, x, y, letter) {
    this.scene = scene
    this.x = x
    this.y = y
    this.letter = letter

    this.scene.letters.push(this)

    this.size = 1 / this.scene.state.length
    this.halfSize = this.size / 2

    this.realX = this.align(this.x)

    this.realY = this.align(this.y)

    this.height = this.scene.high(this.size)

    this.box = this
      .scene
      .add
      .rectangle(
        this.realX,
        this.realY,
        this.height,
        this.height,
        0x000000
      )

    const fontSize = this.size * 0.75
    this.fontSize = this.scene.high(fontSize)

    this.text = this
      .scene
      .add
      .text(this.realX, this.realY, this.letter, {
        fontSize: this.fontSize
      })
    this.text.setOrigin(0.5)

    this.set(this)
  }

  align (index) {
    const edge = this.size * index
    const center = this.halfSize + edge
    const high = this.scene.high(center)

    return high
  }

  destroy () {
    this.box.destroy()

    this.text.destroy()
  }

  leave (debug) {
    if (debug) console.log('leave test:', this)
    this.scene.each((square) => {
      const equal = square === this

      if (equal) return ''
      return square
    })
  }

  moveComponent (component) {
    component.x = this.realX
    component.y = this.realY
    this.box.y = this.realY

    this.text.x = this.realX
    this.text.y = this.realY
  }

  move () {
    this.realX = this.align(this.x)
    this.realY = this.align(this.y)

    this.moveComponent(this.box)
    this.moveComponent(this.text)
  }

  set (value) {
    this.scene.state[this.y][this.x] = value

    // console.log('this.scene.state test:', this.scene.state)

    // debugger
  }

  down () {
    this.leave()
    this.y = this.y + 1
    this.set(this)
  }

  left () {
    this.leave()
    this.x = this.x - 1
    this.set(this)
  }

  right () {
    this.leave()
    this.x = this.x + 1
    this.set(this)
  }
}
