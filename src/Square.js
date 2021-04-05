export default class Square {
  constructor (scene, block, x, y, letter) {
    this.scene = scene
    this.block = block
    this.x = x
    this.y = y
    this.letter = letter

    this.scene.letters.push(this)

    this.size = 1 / this.scene.state.length
    this.halfSize = this.size / 2

    this.centerX = this.center(this.x)

    this.centerY = this.center(this.y)

    this.height = this.scene.high(this.size)

    this.box = this
      .scene
      .addRectangle({
        x: this.centerX,
        y: this.centerY,
        height: this.size,
        width: this.size,
        color: 0x000000
      })

    const fontSize = this.size * 0.75

    this.text = this
      .scene
      .addText({
        x: this.centerX,
        y: this.centerY,
        string: this.letter,
        style: { fontSize }
      })
    this.text.setOrigin(0.5)

    this.set(this)
  }

  align (index) {
    const edge = this.size * index
    const center = this.halfSize + edge
    const real = this.scene.high(center)

    return real
  }

  center (index) {
    const edge = this.size * index
    const center = this.halfSize + edge

    return center
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
