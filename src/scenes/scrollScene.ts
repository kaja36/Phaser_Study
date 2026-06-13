import Phaser from "phaser";
import { Player } from "../character/Player.js";
import {
  ASSET_BASE_URL,
  ASSET_KEYS,
  ASSET_PATHS,
  PLAYER,
  SCORE,
  TEXT,
} from "../constants/game.js";
import { Bombs } from "../objects/Bombs.js";
import { Stars } from "../objects/Stars.js";
import { Platforms } from "../stage/Platforms.js";
import type { ArcadeCallback, ArcadeSprite } from "../types/arcade.js";
import { ScoreBoard } from "../ui/ScoreBoard.js";

// 解説: ScrollScene.html
class ScrollScene extends Phaser.Scene {
  private _cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
  private _player!: Player;
  private _platforms!: Platforms;
  private _stars!: Stars;
  private _bombs!: Bombs;
  private _scoreBoard!: ScoreBoard;

  constructor() {
    super({ key: 'scrollScene' });
  }

  preload(): void {
    this.load.setBaseURL(ASSET_BASE_URL);

    this.load.image(ASSET_KEYS.sky, ASSET_PATHS.sky);
    this.load.image(ASSET_KEYS.ground, ASSET_PATHS.ground);
    this.load.image(ASSET_KEYS.star, ASSET_PATHS.star);
    this.load.image(ASSET_KEYS.bomb, ASSET_PATHS.bomb);
    this.load.spritesheet(ASSET_KEYS.dude, ASSET_PATHS.dude, { frameWidth: 32, frameHeight: 48 });
  }

  create(): void {
    this.add.image(400, 300, ASSET_KEYS.sky);

    this._platforms = new Platforms(this);
    this._player = new Player(this, PLAYER.startX, PLAYER.startY);
    this._stars = new Stars(this);
    this._bombs = new Bombs(this);
    this._scoreBoard = new ScoreBoard(this);

    if (this.input.keyboard) {
      this._cursorKeys = this.input.keyboard.createCursorKeys();
    } else {
      console.error('Keyboard input not initialized');
    }

    this.physics.add.collider(this._player.sprite, this._platforms.group);
    this.physics.add.collider(this._stars.group, this._platforms.group);
    this.physics.add.overlap(this._player.sprite, this._stars.group, this.handleCollectStar, undefined, this);
    this.physics.add.collider(this._bombs.group, this._platforms.group);
    this.physics.add.collider(this._player.sprite, this._bombs.group, this.handleHitBomb, undefined, this);
  }

  update(): void {
    if (!this._player || !this._cursorKeys) {
      return;
    }

    this._player.update(this._cursorKeys);
  }

  private handleCollectStar: ArcadeCallback = (player, star) => {
    const playerSprite = player as ArcadeSprite;
    const starSprite = star as ArcadeSprite;

    this._stars.collect(starSprite);
    this._scoreBoard.add(SCORE.star);

    if (!this._stars.hasActiveStars()) {
      this._stars.reset();
      this._bombs.spawnFromPlayer(playerSprite);
    }
  };

  private handleHitBomb: ArcadeCallback = (_player, _bomb) => {
    this.physics.pause();
    this._player.tintDamage();

    this.add.text(TEXT.gameOverX, TEXT.gameOverY, 'GAME OVER', {
      fontSize: TEXT.gameOverFontSize,
      color: TEXT.gameOverColor,
    });
  };
}

export default ScrollScene;
