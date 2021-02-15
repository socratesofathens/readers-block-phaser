import Square from './Square'

export default class Block {
  constructor (scene, x, y, letters, shape) {
    this.scene = scene
    this.x = x
    this.y = y
    this.letters = letters
    this.shape = shape

    this.positions = [
      { x: this.x - 1, y: this.y },
      { x: this.x, y: this.y },
      { x: this.x + 1, y: this.y },
      { x: this.x + 1, y: this.y + 1 }
    ]

    this.squares = letters
      .map((letter, index) => {
        const position = this.positions[index]

        const square = new Square(
          this.scene,
          position.x,
          position.y,
          letter
        )

        return square
      })
  }

  down () {
    this.move(
      this.getBelow, square => square.down()
    )
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

  getLeft = (square) => this.getX(square, -1)

  getRight = (square) => this.getX(square, 1)

  getX = (near, direction) => {
    const row = this.scene.state[near.y]
    if (!row) return true

    const far = near.x + direction
    const square = row[far]
    if (square === '') return square
    if (!square) return true

    const outside = this.isOutside(square)

    return outside
  }

  move (checker, mover) {
    const blocked = this.squares.find(checker)
    if (blocked) return blocked

    this.squares.forEach(mover)
  }

  left () {
    this.move(
      this.getLeft, square => square.left()
    )
  }

  right () {
    this.move(
      this.getRight, square => square.right()
    )
  }
}
