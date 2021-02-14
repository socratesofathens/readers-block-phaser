import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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
  scene: [HelloWorldScene]
}

export default new Phaser.Game(config)
