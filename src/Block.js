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

    return this.rotate(rotator)
  }

  counter () {
    const rotator = point => {
      const x = point.y
      const y = -point.x

      return { x, y }
    }

    return this.rotate(rotator)
  }

  down () {
    const blocked = this.cartesian({ y: 1 })

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

  cartesian ({ x = 0, y = 0 }) {
    const mover = square => {
      const point = { x: square.x + x, y: square.y + y }

      return point
    }

    return this.move(mover)
  }

  isEmpty ({ x, y }) {
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

  move (mover) {
    const points = this.squares.map(mover)

    const blocked = points.find(point => {
      const empty = this.isEmpty(point)

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
    return this.cartesian({ x: -1 })
  }

  right () {
    return this.cartesian({ x: 1 })
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

    return this.move(move)
  }
}
