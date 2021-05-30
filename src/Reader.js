import pos from 'pos'

import json from './words.json'

export default class Reader {
  constructor (scene) {
    this.scene = scene

    this.checkIndex = 0
    this.tokenIndex = 0
    this.tokenIndexes = []
    this.token = []
    this.lexer = new pos.Lexer()
    this.tagger = new pos.Tagger()

    this.words = json
  }

  checkSquare (index) {
    const squares = this.token.slice(0, this.tokenIndex)

    squares.forEach(square => {
      square.box.setFillStyle(0x0000ff)
    })

    const string = this.stringify(squares)
    const read = this.scene.words.includes(string)
    if (read) {
      return false
    }

    const tag = this.tag(string)

    if (tag) {
      console.log('string test:', string)
      this.scene.words.push(string)

      squares.forEach(square => square.leave())

      this.scan()

      return true
    }
  }

  checkToken () {
    // TODO use isthisa to check if tokenIndex exists
    this.tokenIndex = this.tokenIndexes[this.checkIndex]

    const checked = this.checkSquare()

    this.checkIndex = this.checkIndex + 1

    return checked
  }

  getToken (index) {
    const rowSlice = this.row.slice(index)

    const spaceIndex = rowSlice
      .findIndex(square => !this.isLetter(square))
    const foundSpace = spaceIndex > 0

    const token = foundSpace
      ? rowSlice.slice(0, spaceIndex)
      : rowSlice

    return token
  }

  isLetter = square => {
    if (!square) return false

    const spawned = square.block === this.scene.spawned

    if (spawned) return false

    return true
  }

  isLong = string => {
    return string.length >= this.minimum
  }

  line = row => {
    this.row = row

    const found = this.row.find((square, column) => {
      const isLetter = this.isLetter(square)
      if (!isLetter) return false

      this.setToken(column)

      const found = this.checkToken()

      return found
    })

    return found
  }

  reduce = (result, square) => {
    if (square) {
      result.push(square)
    } else {
      const tokenized = {
        squares: result.token,
        string: this.stringify(result.token)
      }
      result.tokens.push(tokenized)

      result.token = []
    }

    return result
  }

  scan () {
    console.log('scan test:')
    this.scene.state.find(this.line)
  }

  setToken (column) {
    this.token = this.getToken(column)
    this.tokenIndexes = Object
      .keys(this.token)
      .reverse()
      .map(string => parseInt(string) + 1)
  }

  string = (token) => {
    const word = []
    const words = []

    token.forEach(square => {
      word.push(square)

      if (this.isLong(word)) {
        const string = this.stringify(word)

        const tag = this.tag(string)

        const squares = [...word]
        const result = { string, tag, squares }

        if (tag) words.push(result)
      }
    })

    return words
  }

  stringify = (token) => {
    const letters = token.reduce((letters, square) => {
      letters.push(square.letter)

      return letters
    }, [])

    return letters.join('')
  }

  tag = word => {
    const lower = word.toLowerCase()
    const includes = this.words[lower]
    if (!includes) return includes

    const lexed = this.lexer.lex(word)
    const [[, type]] = this.tagger.tag(lexed)

    return { word, type }
  }

  token = token => {
    const results = []

    const copy = [...token.squares]
    while (this.isLong(copy)) {
      const words = this.string(copy)
      const squares = [...copy]
      const string = this.stringify(squares)

      const result = { squares, string, words }
      results.push(result)

      copy.shift()
    }

    return results
  }

  tokenize = (row) => {
    const result = { tokens: [], token: [] }
    const reduced = row
      .reduce(this.reduce, result)

    return reduced.tokens
  }
}
