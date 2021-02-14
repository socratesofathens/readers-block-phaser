export default class Square {
  constructor (scene, x, y, letter) {
    this.scene = scene
    this.x = x
    this.y = y
    this.letter = letter

    this.size = 0.1

    this.wideX = this.set(this.x)

    this.highY = this.set(this.y)

    this.height = this.scene.high(0.1)

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

    this.fontSize = this.scene.high(0.075)

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
    const center = 0.05 + edge
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
