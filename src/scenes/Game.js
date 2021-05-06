import Phaser from 'phaser'

import Block from '../Block'
import Controller from '../Controller'
import { HEIGHT, WIDTH } from '../main'
import List from '../List'
import Reader from '../Reader'

export default class HelloWorldScene extends Phaser.Scene {
  constructor () {
    super('hello-world')

    this.rowCount = 20
    this.columnCount = 13

    this.state = this.array(
      this.rowCount,
      this.array(this.columnCount, '')
    )

    this.blocks = []
    this.letters = []
    this.words = []

    this.controller = new Controller(this)
    this.reader = new Reader(this)
  }

  preload = () => {
  }

  addBlock = (x, y) => {
    const block = new Block(
      this, x, y, ['K', 'I', 'C', 'K'], 'L'
    )

    this.blocks.push(block)

    return block
  }

  addRectangle = ({ x, y, height, width, color }) => {
    const realX = this.high(x)
    const realY = this.high(y)
    const realHeight = this.high(height)
    const realWidth = this.high(width)

    const rectangle = this.add.rectangle(
      realX, realY, realHeight, realWidth, color
    )

    return rectangle
  }

  addText = ({ x, y, string, style }) => {
    const realX = this.high(x)
    const realY = this.high(y)

    style = style || {}

    if (style.fontSize) {
      style.fontSize = this.high(style.fontSize)
    }

    const text = this.add.text(
      realX, realY, string, style
    )

    return text
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

    this.wind()

    this.keys = this
      .input
      .keyboard
      .addKeys(this.controller.string)

    this.list = new List(this, 0.75, 0.03)
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
    this.spawned = this.addBlock(6, 1)
  }

  tick = () => {
    this.spawned?.down()

    this.reader.state()
  }

  update () {
    this.controller.update()

    this.letters = this.letters.filter(letter => {
      const found = this.state.find(row => {
        return row
          .find(square => square === letter)
      })

      if (!found) letter.destroy()

      return found
    })

    this.letters.map(letter => letter.move())
    this.list.update()
  }

  wide = percent => {
    const ratio = WIDTH / HEIGHT

    const height = HEIGHT * percent

    return height * ratio
  }

  wind () {
    this.timedEvent = this.time.addEvent({
      delay: 500,
      callback: this.tick,
      callbackScope: this,
      loop: true
    })
  }
}
