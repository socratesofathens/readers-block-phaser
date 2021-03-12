import pos from 'pos'

import json from './words.json'

export default class Reader {
  constructor (scene) {
    this.scene = scene

    this.lexer = new pos.Lexer()
    this.tagger = new pos.Tagger()

    this.words = json
    this.minimum = 4
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
    const result = {}

    row.find((square, index) => {
      const isLetter = this.isLetter(square)
      if (!isLetter) return false

      const rowSlice = row.slice(index)

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
      const wordIndex = indexes
        .find(index => {
          const tokenSlice = tokenString
            .slice(0, index)

          const read = this
            .scene
            .words
            .includes(tokenSlice)
          if (read) {
            return false
          }

          const tag = this.tag(tokenSlice)

          result.string = tokenSlice

          return tag
        })
      const foundWord = wordIndex > 0

      if (!foundWord) return false

      const squares = token
        .slice(0, wordIndex)

      result.square = square
      result.index = index
      result.squares = squares

      return true
    })

    if (result.squares) {
      this.scene.words.push(result.string)
      result.squares.forEach(square => square.leave())
    }
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
    this.scene.state.find(this.line)
  }

  string = (token) => {
    const word = []
    const words = []

    token.forEach(square => {
      word.push(square)
      // console.log('letter word test:', word)

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
