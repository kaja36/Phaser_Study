import Phaser from "phaser";
import { ANIMATION_KEYS, ASSET_KEYS, PLAYER } from "../constants/game.js";
import type { ArcadeSprite } from "../types/arcade.js";

// 解説: Player.html
export class Player {
  readonly sprite: ArcadeSprite;

  constructor(private readonly scene: Phaser.Scene, x: number, y: number) {
    this.createAnimations();

    this.sprite = scene.physics.add.sprite(x, y, ASSET_KEYS.dude);
    this.sprite.setBounce(PLAYER.bounce);
    this.sprite.setCollideWorldBounds(true);
  }

  update(cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys): void {
    if (cursorKeys.left.isDown) {
      this.sprite.setVelocityX(-PLAYER.speed);
      this.sprite.anims.play(ANIMATION_KEYS.left, true);
    } else if (cursorKeys.right.isDown) {
      this.sprite.setVelocityX(PLAYER.speed);
      this.sprite.anims.play(ANIMATION_KEYS.right, true);
    } else {
      this.sprite.setVelocityX(0);
      this.sprite.anims.play(ANIMATION_KEYS.turn);
    }

    // touching.downを見ないと、空中で何度もジャンプできてしまう
    if (cursorKeys.up.isDown && this.sprite.body.touching.down) {
      this.sprite.setVelocityY(PLAYER.jumpVelocity);
    }
  }

  tintDamage(): void {
    this.sprite.setTint(0xff0000);
    this.sprite.anims.play(ANIMATION_KEYS.turn);
  }

  private createAnimations(): void {
    // existsで確認し、Scene再起動時の二重登録を防ぐ
    if (!this.scene.anims.exists(ANIMATION_KEYS.left)) {
      this.scene.anims.create({
        key: ANIMATION_KEYS.left,
        frames: this.scene.anims.generateFrameNumbers(ASSET_KEYS.dude, { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.scene.anims.exists(ANIMATION_KEYS.turn)) {
      this.scene.anims.create({
        key: ANIMATION_KEYS.turn,
        frames: [{ key: ASSET_KEYS.dude, frame: 4 }],
        frameRate: 20,
      });
    }

    if (!this.scene.anims.exists(ANIMATION_KEYS.right)) {
      this.scene.anims.create({
        key: ANIMATION_KEYS.right,
        frames: this.scene.anims.generateFrameNumbers(ASSET_KEYS.dude, { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }
}
