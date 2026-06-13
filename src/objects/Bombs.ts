import Phaser from "phaser";
import { ASSET_KEYS, BOMB, GAME_SIZE } from "../constants/game.js";
import type { ArcadeSprite } from "../types/arcade.js";

// 解説: Bombs.html
export class Bombs {
  readonly group: Phaser.Physics.Arcade.Group;

  constructor(private readonly scene: Phaser.Scene) {
    this.group = scene.physics.add.group();
  }

  spawnFromPlayer(player: ArcadeSprite): ArcadeSprite {
    const x = player.x < GAME_SIZE.width / 2
      ? Phaser.Math.Between(GAME_SIZE.width / 2, GAME_SIZE.width)
      : Phaser.Math.Between(0, GAME_SIZE.width / 2);

    return this.spawn(x, BOMB.startY);
  }

  spawn(x: number, y: number): ArcadeSprite {
    const bomb = this.group.create(x, y, ASSET_KEYS.bomb) as ArcadeSprite;

    bomb.setBounce(BOMB.bounce);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(BOMB.minVelocityX, BOMB.maxVelocityX), BOMB.velocityY);
    return bomb;
  }
}
