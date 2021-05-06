import Square from './Square'

export default class Block {
  constructor (scene, x, y, letters, shape) {
    this.scene = scene
    this.x = x
    this.y = y
    this.letters = letters
    this.shape = shape
    this.angle = 0

    this.positions = [
      { x: this.x - 1, y: this.y - 1 },
      { x: this.x - 1, y: this.y },
      { x: this.x, y: this.y },
      { x: this.x + 1, y: this.y }
    ]

    const full = this.positions.find(position => {
      const now = this
        .scene
        .check(position.x, position.y)

      return now
    })

    this.squares = letters.map((letter, index) => {
      const position = this.positions[index]

      const square = new Square(
        this.scene,
        this,
        position.x,
        position.y,
        letter
      )

      return square
    })

    this.center = this.squares[2]

    if (full) {
      console.log('Game over!')
      this.squares = []
    }
  }

  clock () {
    const rotator = point => {
      const x = -point.y
      const y = point.x

      return { x, y }
    }

    this.rotate(rotator)
  }

  counter () {
    const rotator = point => {
      const x = point.y
      const y = -point.x

      return { x, y }
    }

    this.rotate(rotator)
  }

  down () {
    const mover = this.getMover('y', 1)

    const blocked = this.move(mover)

    if (blocked) {
      this.scene.spawn()
    }

    return blocked
  }

  drop () {
    let blocked = false

    while (!blocked) {
      blocked = this.down()
    }
  }

  isEmpty (x, y) {
    const row = this.scene.state[y]
    if (!row) return row

    const square = row[x]
    if (square === '') return true
    if (!square) return false

    const outside = this.isOutside(square)

    return !outside
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

  getLeft = square => this.getX(square, -1)

  getRight = square => this.getX(square, 1)

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

  move (mover) {
    const points = this.squares.map(mover)

    const blocked = points.find(point => {
      const { x, y } = point

      const empty = this.isEmpty(x, y)

      return !empty
    })

    if (blocked) {
      return true
    }

    points.forEach((point, index) => {
      const square = this.squares[index]

      square.place(point)
    })
  }

  left () {
    const mover = this.getMover('x', -1)

    this.move(mover)
  }

  right () {
    const mover = this.getMover('x', 1)

    this.move(mover)
  }

  rotate (rotator) {
    const move = square => {
      const oldX = square.x - this.center.x
      const oldY = square.y - this.center.y

      const point = { x: oldX, y: oldY }

      const { x: newX, y: newY } = rotator(point)

      const x = this.center.x + newX
      const y = this.center.y + newY

      return { x, y }
    }

    this.move(move)
  }

  getMover (property, modifier) {
    const mover = square => {
      const { x, y } = square
      const point = { x, y }

      const value = point[property]
      const modified = value + modifier
      point[property] = modified

      return point
    }

    return mover
  }
}
