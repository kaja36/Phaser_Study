import Phaser from "phaser";
import ScrollScene from "./scenes/scrollScene";

// ゲームの基本設定を指定
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // レンダリングタイプを指定(CANVAS, WEBGL, AUTOがある)
  width: 800, // ゲームの幅を指定
  height: 600, // ゲームの高さを指定
  physics: { // 物理エンジンの設定
    default: 'arcade', // 使用する物理エンジンを指定
    arcade: {
        gravity: { x:0, y: 300 }, // 重力の方向と強さを指定
        debug: false // デバッグモード
    }
  },
  input: {
    keyboard: true // ここでキーボード入力を有効にする
  },
  scene: ScrollScene, // 後に作成するScrollScene というカスタムシーンを指定
};



// Phaser起動させるプロセスを開始
new Phaser.Game(config);
