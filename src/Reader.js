import pos from 'pos'

import json from './words.json'

export default class Reader {
  constructor (scene) {
    this.scene = scene

    this.lexer = new pos.Lexer()
    this.tagger = new pos.Tagger()

    this.words = json
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
    const foundSquare = row.find((square, columnIndex) => {
      const isLetter = this.isLetter(square)
      if (!isLetter) return false

      const rowSlice = row.slice(columnIndex)

      const spaceIndex = rowSlice
        .findIndex(square => !this.isLetter(square))
      const foundSpace = spaceIndex > 0

      const token = foundSpace
        ? rowSlice.slice(0, spaceIndex)
        : rowSlice

      const tokenString = this
        .stringify(token)

      const indexes = Object
        .keys(tokenString)
        .reverse()
      const wordIndex = indexes.find(index => {
        const integer = parseInt(index)
        const indexOne = integer + 1
        const stringSlice = tokenString.slice(0, indexOne)
        const tokenSlice = token.slice(0, indexOne)

        tokenSlice.forEach(letter => {
          letter.box.setFillStyle('0x0000ff')
        })

        const read = this
          .scene
          .words
          .includes(stringSlice)
        if (read) {
          return false
        }

        const tag = this.tag(stringSlice)

        if (tag) {
          this.scene.words.push(stringSlice)

          const squares = token.slice(0, indexOne)
          squares.forEach(square => square.leave())
        }

        return tag
      })

      return wordIndex
    })

    return foundSquare
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

  state () {
    let read = true
    while (read) {
      read = this.scene.state.find(this.line)
    }

    return read
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
    const letters = token
      .reduce((letters, square) => {
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
