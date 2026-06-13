import Phaser from "phaser";
import ScrollScene from "./scenes/ScrollScene.js";
import { GAME_SIZE, PHYSICS } from "./constants/game.js";

// 解説: main.html
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_SIZE.width,
  height: GAME_SIZE.height,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: PHYSICS.gravity,
        debug: PHYSICS.debug
    }
  },
  input: {
    keyboard: true
  },
  scene: ScrollScene,
};

new Phaser.Game(config);
