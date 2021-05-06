export default class Controller {
  constructor (scene) {
    this.scene = scene

    this.nows = {
      e: () => this.scene.spawned?.clock(),
      q: () => this.scene.spawned?.counter(),
      w: () => this.scene.spawned?.drop()
    }

    this.uses = {
      s: () => this.scene.spawned?.down(),
      a: () => this.scene.spawned?.left(),
      d: () => this.scene.spawned?.right()
    }

    this.nowKeys = Object.keys(this.nows)
    this.useKeys = Object.keys(this.uses)
    const keyArray = [...this.nowKeys, ...this.useKeys]
    const keySet = new Set(keyArray)
    this.codes = [...keySet]
    this.string = this.codes.join(',')

    this.keys = {}
  }

  check = ({ keys, checker, callbacks }) => {
    keys.forEach(key => {
      const checked = checker(key)

      if (checked) {
        const callback = callbacks[key]

        callback()
      }
    })
  }

  down = (key) => {
    return this.scene.keys[key].isDown
  }

  now = (key) => {
    const now = Date.now()

    return this.keys[key] === now
  }

  since = ({ key, minimum = 100, debug }) => {
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

    const since = this.since({ key, debug })

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
    this.codes.forEach(this.watch)

    this.check({
      keys: this.nowKeys,
      checker: this.now,
      callbacks: this.nows
    })

    this.check({
      keys: this.useKeys,
      checker: this.use,
      callbacks: this.uses
    })
  }
}
