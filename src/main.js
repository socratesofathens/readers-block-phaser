import Phaser from 'phaser'

import Game from './scenes/Game'

export const WIDTH = 1600
export const HEIGHT = 900

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [Game],
  backgroundColor: '#999999'
}

export default new Phaser.Game(config)
