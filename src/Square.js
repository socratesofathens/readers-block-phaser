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

    this.set()
  }

  align (index) {
    const edge = this.size * index
    const center = this.halfSize + edge
    const high = this.scene.high(center)

    return high
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

  set () {
    this.scene.state[this.y][this.x] = this
  }

  down () {
    this.y = this.y + 1
    this.set()
  }

  left () {
    this.x = this.x - 1
    this.set()
  }

  right () {
    this.x = this.x + 1
    this.set()
  }
}
