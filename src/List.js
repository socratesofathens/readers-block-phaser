export default class List {
  constructor (scene, x, y) {
    this.scene = scene
    this.x = x
    this.y = y

    this.string = 'abc'
    this.text = this.scene.addText({
      x: this.x,
      y: this.y,
      string: this.string,
      style: { fontSize: 0.03, color: 'black' }
    })

    console.log('this.text.x test:', this.text.color)
  }

  update () {
    this.string = this.scene.words.join('\n')
    this.text.setText(this.string)
  }
}
