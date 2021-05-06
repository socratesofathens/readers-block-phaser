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

  getPoints (mover) {
    const points = this.squares.map(mover)

    return points
  }

  isBlocked (points) {
    const blocked = points.find(point => {
      const empty = this.isEmpty(point)

      return !empty
    })

    return blocked
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
    const points = this.getPoints(mover)

    const blocked = this.isBlocked(points)
    if (blocked) return true

    this.place(points)
  }

  left () {
    return this.cartesian({ x: -1 })
  }

  place (points) {
    this.scene.timedEvent.remove()

    points.forEach((point, index) => {
      const square = this.squares[index]

      square.place(point)
    })

    this.scene.wind()
  }

  right () {
    return this.cartesian({ x: 1 })
  }

  rotate (rotator) {
    const mover = square => {
      const oldX = square.x - this.center.x
      const oldY = square.y - this.center.y

      const point = { x: oldX, y: oldY }

      const { x: newX, y: newY } = rotator(point)

      const x = this.center.x + newX
      const y = this.center.y + newY

      return { x, y }
    }

    const center = this.getPoints(mover)
    const blocked = this.isBlocked(center)
    if (!blocked) return this.place(center)

    const right = this.slide(center, { x: 1 })
    if (right) return this.place(right)

    const left = this.slide(center, { x: -1 })
    if (left) return this.place(left)
  }

  slide = (points, { x = 0, y = 0 }) => {
    const moves = points.map(point => {
      const moved = { x: point.x + x, y: point.y + y }

      return moved
    })

    const blocked = this.isBlocked(moves)
    if (blocked) return false

    return moves
  }
}
