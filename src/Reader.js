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

  isLong = string => string.length >= this.minimum

  line = row => {
    const tokens = this.tokenize(row)
    if (tokens.length) {
      console.log('tokens test:', tokens)
    }

    const matrix = tokens.map(this.token)
    if (matrix.length) {
      console.log('matrix test:', matrix)
    }

    const words = matrix.reduce(
      (words, results) => {
        results.forEach(result => {
          words = [...words, ...result.words]
        })

        return words
      },
      []
    )
    if (words.length) {
      console.log('words test:', words)

      words.forEach(word => {
        word.squares.forEach(square => {
          square.leave()
        })
      })
    }
  }

  reduce = (result, square) => {
    if (square) {
      result.token.push(square)
    } else {
      if (this.isLong(result.token)) {
        const tokenized = {
          squares: result.token,
          string: this.stringify(result.token)
        }
        result.tokens.push(tokenized)
      }

      result.token = []
    }

    return result
  }

  state () {
    this.scene.state.map(this.line)
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
