import Phaser from "phaser";
import { TEXT } from "../constants/game.js";

// 解説: ScoreBoard.html
export class ScoreBoard {
  private score = 0;
  private readonly text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.text = scene.add.text(TEXT.scoreX, TEXT.scoreY, "score: 0", {
      fontSize: TEXT.scoreFontSize,
      color: TEXT.scoreColor,
    });
  }

  add(points: number): void {
    this.score += points;
    this.text.setText(`Score: ${this.score}`);
  }

  reset(): void {
    this.score = 0;
    this.text.setText("score: 0");
  }
}
