import Square from './Square'

export default class Block {
  constructor (scene, x, y, letters, shape) {
    this.scene = scene
    this.x = x
    this.y = y
    this.letters = letters
    this.shape = shape

    this.positions = [
      { x: this.x, y: this.y },
      { x: this.x + 1, y: this.y },
      { x: this.x + 2, y: this.y },
      { x: this.x + 2, y: this.y + 1 }
    ]

    this.squares = letters.map((letter, index) => {
      const position = this.positions[index]

      const square = new Square(
        this.scene, position.x, position.y, letter
      )

      return square
    })
  }

  down () {
    const blocked = this
      .squares
      .find(square => this.getBelow(square))

    if (blocked) return blocked

    this.squares.forEach(square => square.down())
  }

  isOutside (square) {
    const inside = this
      .squares
      .find(inside => inside === square)

    return !inside
  }

  getBelow = (above) => {
    const below = above.y + 1

    const row = this.scene.state[below]
    if (!row) return true

    const square = row[above.x]
    if (!square) return square

    const outside = this.isOutside(square)

    return outside
  }

  getRight = (port) => {
    const row = this.scene.state[port.y]
    if (!row) return true

    const starboard = port.x + 1
    const square = row[starboard]
    if (square === '') return square
    if (!square) return true

    const outside = this.isOutside(square)

    return outside
  }

  right () {
    const blocked = this
      .squares
      .find(square => this.getRight(square))

    console.log('blocked test:', blocked)

    if (blocked) return blocked

    this.squares.forEach(square => square.right())
  }
}
