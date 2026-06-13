import Phaser from "phaser";
import { ASSET_KEYS, PLATFORM_LAYOUT } from "../constants/game.js";

// 解説: Platforms.html
export class Platforms {
  readonly group: Phaser.Physics.Arcade.StaticGroup;

  constructor(scene: Phaser.Scene) {
    this.group = scene.physics.add.staticGroup();

    PLATFORM_LAYOUT.forEach((platform) => {
      const body = this.group.create(platform.x, platform.y, ASSET_KEYS.ground);

      // scale指定時はrefreshBodyを呼ばないと当たり判定が元サイズのまま
      if ("scale" in platform) {
        body.setScale(platform.scale).refreshBody();
      }
    });
  }
}
