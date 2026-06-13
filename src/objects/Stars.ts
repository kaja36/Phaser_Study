import Phaser from "phaser";
import { ASSET_KEYS, STAR_FIELD } from "../constants/game.js";
import type { ArcadeSprite } from "../types/arcade.js";

// 解説: Stars.html
export class Stars {
  readonly group: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene) {
    this.group = scene.physics.add.group({
      key: ASSET_KEYS.star,
      repeat: STAR_FIELD.repeat,
      setXY: { x: STAR_FIELD.startX, y: STAR_FIELD.startY, stepX: STAR_FIELD.stepX },
    });

    this.group.getChildren().forEach((child) => {
      const star = child as ArcadeSprite;
      star.setBounceY(Phaser.Math.FloatBetween(STAR_FIELD.minBounceY, STAR_FIELD.maxBounceY));
    });
  }

  collect(star: ArcadeSprite): void {
    star.disableBody(true, true);
  }

  hasActiveStars(): boolean {
    return this.group.countActive(true) > 0;
  }

  reset(): void {
    this.group.getChildren().forEach((child) => {
      const star = child as ArcadeSprite;
      star.enableBody(true, star.x, STAR_FIELD.startY, true, true);
    });
  }
}
