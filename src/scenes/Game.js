import Phaser from 'phaser'

import { HEIGHT, WIDTH } from '../main.js'
import Block from '../Block'

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
      ['', '', '', '', '', '', '', '', '', ''],
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

  create = () => {
    const RATIO = HEIGHT / WIDTH
    const SLIM = HEIGHT * RATIO
    const HALF_SLIM = SLIM / 2

    const HALF_HEIGHT = HEIGHT / 2
    this.background = this.add.rectangle(
      HALF_SLIM,
      HALF_HEIGHT,
      SLIM,
      HEIGHT,
      0xffffff
    )

    this.addBlock(0, 0)

    this.timedEvent = this.time.addEvent({
      delay: 500,
      callback: this.tick,
      callbackScope: this,
      loop: true
    })
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
    this.letters.map(letter => letter.move())
  }

  wide = percent => {
    const ratio = WIDTH / HEIGHT

    const height = HEIGHT * percent

    return height * ratio
  }
}
