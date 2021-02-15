export default class Square {
  constructor (scene, x, y, letter) {
    this.scene = scene
    this.x = x
    this.y = y
    this.letter = letter

    this.size = 1 / this.scene.state.length
    this.halfSize = this.size / 2

    this.wideX = this.set(this.x)

    this.highY = this.set(this.y)

    this.height = this.scene.high(this.size)

    this.box = this
      .scene
      .add
      .rectangle(
        this.wideX,
        this.highY,
        this.height,
        this.height,
        0x000000
      )

    const fontSize = this.size * 0.75
    this.fontSize = this.scene.high(fontSize)

    this.text = this
      .scene
      .add
      .text(this.wideX, this.highY, this.letter, {
        fontSize: this.fontSize
      })
    this.text.setOrigin(0.5)

    this.move()
  }

  set (index) {
    const edge = this.size * index
    const center = this.halfSize + edge
    const high = this.scene.high(center)

    return high
  }

  move () {
    this.wideX = this.set(this.x)
    this.highY = this.set(this.y)

    this.box.x = this.wideX
    this.box.y = this.highY

    this.text.x = this.wideX
    this.text.y = this.highY

    this.scene.state[this.y][this.x] = this
  }

  down () {
    this.y = this.y + 1
    this.move()
  }
}
