import Phaser from 'phaser'

import { HEIGHT, WIDTH } from '../main.js'
import Square from '../Square'

export default class HelloWorldScene extends Phaser.Scene {
  constructor () {
    super('hello-world')

    this.state = [
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '']
    ]

    this.letters = []
  }

  preload = () => {
  }

  addLetter = (x, y, letter) => {
    const square = new Square(this, x, y, letter)

    this.letters.push(square)
  }

  create = () => {
    this.addLetter(0, 0, 'A')
    this.addLetter(9, 5, 'B')

    this.timedEvent = this.time.addEvent({
      delay: 500,
      callback: this.tick,
      callbackScope: this,
      loop: true
    })
  }

  down = (row, square, rowIndex, columnIndex) => {
    const nextRowIndex = rowIndex + 1
    const nextRow = this.state[nextRowIndex]
    if (!nextRow) return nextRow

    const next = nextRow[columnIndex]

    if (next === '') {
      square.y = nextRowIndex
    }
  }

  each = (callback) => {
    this.state.forEach((row, rowIndex) => {
      row.forEach((square, columnIndex) => {
        if (square) {
          callback(row, square, rowIndex, columnIndex)
        }
      })
    })
  }

  high = percent => HEIGHT * percent

  move = (row, square, rowIndex, columnIndex) => {
    square.move()
  }

  tick = () => {
    this.each(this.down)

    this.each(this.move)
  }

  update () {
  }

  wide = percent => HEIGHT * percent * WIDTH / HEIGHT
}
