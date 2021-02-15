import Phaser from 'phaser'

import { HEIGHT, WIDTH } from '../main.js'
import Block from '../Block'

export default class HelloWorldScene extends Phaser.Scene {
  constructor () {
    super('hello-world')

    this.rowCount = 20
    this.columnCount = 12

    this.state = this.array(
      this.rowCount,
      this.array(this.columnCount, '')
    )

    this.blocks = []
    this.letters = []
  }

  preload = () => {
  }

  addBlock = (x, y) => {
    const block = new Block(
      this, x, y, ['A', 'B', 'C', 'D'], 'L'
    )

    this.blocks.push(block)
  }

  array = (length, value) => Array
    .from({ length }, () => value)

  create = () => {
    const rowHeight = HEIGHT / this.rowCount
    const width = this.columnCount * rowHeight

    const halfWidth = width / 2
    const HALF_HEIGHT = HEIGHT / 2

    this.background = this.add.rectangle(
      halfWidth,
      HALF_HEIGHT,
      width,
      HEIGHT,
      0xffffff
    )

    this.addBlock(4, 0)

    this.timedEvent = this.time.addEvent({
      delay: 500,
      callback: this.tick,
      callbackScope: this,
      loop: true
    })

    this.keys = this
      .input
      .keyboard
      .addKeys('s,a,d')
  }

  each = (callback) => {
    this.state.forEach((row, rowIndex) => {
      row.forEach((square, columnIndex) => {
        if (square) {
          callback(
            row, square, rowIndex, columnIndex
          )
        }
      })
    })
  }

  high = percent => HEIGHT * percent

  tick = () => {
    this.blocks.map(block => block.down())
  }

  update () {
    if (this.keys.a.isDown) {
      this.blocks.map(block => block.left())
    }

    if (this.keys.d.isDown) {
      this.blocks.map(block => block.right())
    }

    if (this.keys.s.isDown) {
      this.blocks.map(block => block.down())
    }

    this.letters.map(letter => letter.move())
  }

  wide = percent => {
    const ratio = WIDTH / HEIGHT

    const height = HEIGHT * percent

    return height * ratio
  }
}
