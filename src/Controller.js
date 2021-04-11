export default class Controller {
  constructor (scene) {
    this.scene = scene
    this.keys = {}
  }

  down = (key) => {
    return this.scene.keys[key].isDown
  }

  now = (key) => {
    const now = Date.now()

    return this.keys[key] === now
  }

  since = (key, minimum = 100, debug) => {
    const now = Date.now()
    const difference = now - this.keys[key]

    if (debug) {
      console.log('difference test:', difference)
    }

    return difference >= minimum
  }

  use = (key, debug) => {
    const keys = this.keys[key]
    if (!keys) return false

    const now = this.now(key)
    if (now) return true

    const since = this.since(key, 100, debug)

    if (debug) {
      console.log('since test:', since)
    }

    if (since) {
      this.keys[key] = now
    }

    return since
  }

  watch = (key) => {
    const down = this.down(key)

    if (!down) {
      this.keys[key] = null
    } else if (!this.keys[key]) {
      this.keys[key] = Date.now()
    }
  }

  update () {
    const keys = ['a', 's', 'd']
    keys.forEach(this.watch)

    if (this.use('a')) {
      this.scene.spawned?.left()
    }

    if (this.use('d')) {
      this.scene.spawned?.right()
    }

    if (this.use('s')) {
      this.scene.spawned?.down()
    }
  }
}
