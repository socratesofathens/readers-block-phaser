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

  getBelow = (above) => {
    console.log('above test:', above)
    const below = above.y + 1

    console.log('below test:', below)

    const row = this.scene.state[below]
    if (!row) return true

    const square = row[above.x]
    if (!square) return square

    console.log('square test:', square)

    const inside = this.squares.find(inside => {
      return inside === square
    })

    console.log('inside test:', inside)

    const opposite = !inside

    console.log('opposite test:', opposite)

    return opposite
  }

  down () {
    const blocked = this.squares.find(square => {
      const below = this.getBelow(square)
      console.log('above below test:', below)

      const bool = !!below
      console.log('bool test:', bool)

      return bool
    })

    console.log('blocked test:', blocked)

    if (blocked) return blocked

    this.squares.map(square => square.down())

    console.log('down test!')
  }
}
