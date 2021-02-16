import Phaser from 'phaser'

import { HEIGHT, WIDTH } from '../main.js'
import Block from '../Block'

export default class HelloWorldScene extends Phaser.Scene {
  constructor () {
    super('hello-world')

    this.rowCount = 5
    this.columnCount = 5

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

    return block
  }

  array = (length, value) => {
    const copyValue = () => {
      return this.copy(value)
    }

    return Array.from({ length }, copyValue)
  }

  check = (x, y) => this.state[y][x]

  copy (value) {
    const string = JSON.stringify(value)
    const parsed = JSON.parse(string)

    return parsed
  }

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

    this.spawn()

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
    const newState = this
      .state
      .map((row, rowIndex) => row.map(
        (square, columnIndex) => callback(
          square, row, rowIndex, columnIndex
        )
      ))

    this.state = newState
  }

  high = percent => HEIGHT * percent

  spawn () {
    this.spawned = this.addBlock(1, 0)
  }

  tick = () => {
    this.spawned?.down()
  }

  update () {
    if (this.keys.a.isDown) {
      this.spawned?.left()
    }

    if (this.keys.d.isDown) {
      this.spawned?.right()
    }

    if (this.keys.s.isDown) {
      this.spawned?.down()
    }

    this.letters.map(letter => letter.move())
  }

  wide = percent => {
    const ratio = WIDTH / HEIGHT

    const height = HEIGHT * percent

    return height * ratio
  }
}
