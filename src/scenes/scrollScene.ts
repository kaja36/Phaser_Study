import Phaser from "phaser";

class ScrollScene extends Phaser.Scene {
  // 初期化
  private _cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;
  private _player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private _stars?: Phaser.Physics.Arcade.Group;
  private _bombs?: Phaser.Physics.Arcade.Group;
  private _score: number = 0;
  private _scoreText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'scrollScene' });
  }

  // ゲーム素材を読み込む(最初に読み込んでおく必要がある)
  preload() : void {
    // 素材リソースのベースとなるURLを指定
    this.load.setBaseURL("https://labs.phaser.io");

    /**
     * (例) https://labs.phaser.io/assets/skies/space3.pngを指定している状態
     * 第一引数には、読み込んだ素材を識別するためのキーを指定
     * 第二引数に対象の画像を指定
     * localにphaserをinstallしている場合は、baseURLを指定しなくても良い
     */
    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('ground', 'assets/sprites/platform.png');
    this.load.image('star', 'assets/demoscene/star.png');
    this.load.image('bomb', 'assets/sprites/bullet.png');
    // マップデータ(スプライトシート)を読み込む
    this.load.spritesheet('dude', // キー
        'assets/sprites/dude.png', // 画像を指定
        { frameWidth: 32, frameHeight: 48 } // フレームの幅と高さを指定
    );

  }

  // ゲーム画面の初期化
  create() : void {
    // 背景画像の追加
    // 画像の表示位置は、x: 400, y: 300
    // preloadで読み込んだsky画像を指定
    // オブジェクトが表示される順序は、下記で作成している順序と一致する。
    // 背景画像にしたい画像は一番最初に指定する。
    this.add.image(400, 300, 'sky');

    // 「静的」な物理オブジェクトを作成するための設定, オブジェクトは動かない、壁や地面などに使う
    const platforms = this.physics.add.staticGroup();

    // 画面内の緑の地面を作成
    // setScale(2)で、画像のサイズを2倍に拡大, スケールを変更した時は物理エンジンを更新させる必要がある。
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // プレイヤーを作成、初期配置
    this._player = this.physics.add.sprite(100, 450, 'dude');
    this._player.setBounce(0.2); // 地面に着地した際のバウンド値
    this._player.setCollideWorldBounds(true); // 画面の外に出ないようにする

    // プレイヤーにアニメーションを定義(あくまでアニメーションの定義であてtこれで動くわけではない)
    this.anims.create({
        key: 'left', // 左向きのアニメーション
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }), // 0~3のフレームを指定(0~3が左向きで歩行する画像)
        frameRate: 10,
        repeat: -1 // 繰り返し再生
    });   
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });   
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // 地面オブジェクト、プレイヤーオブジェクトの衝突判定を行うcolliderオブジェクトを作成する
    this.physics.add.collider(this._player, platforms);

    // プレイヤーを操作するためのキーボードマネージャ反映
    if (this.input.keyboard) {
      this._cursorKeys = this.input.keyboard.createCursorKeys();
    } else {
      console.error('Keyboard input not initialized');
    }

    // マップに配置する「動的」な星オブジェクトを作成
    this._stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });
    // 
    this._stars.children.iterate((child: Phaser.GameObjects.GameObject) => {
      // 作成された12個の各星オブジェクトに0.4~0.8のバウンド値を設定
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    // 地面オブジェクト、星オブジェクトの衝突判定を行うcolliderオブジェクトを作成する
    this.physics.add.collider(this._stars, platforms);

    // プレイヤーが星オブジェクトに触れた際の処理
    this.physics.add.overlap(this._player, this._stars, this.collectStar, null, this);

    // スコアをカウントさせるための初期値定義
    this._scoreText = this.add.text(10, 10, 'score: 0', { fontSize: '32px', fill: '#FFFFFF' });

    // ボムオブジェクトを作成
    this._bombs = this.physics.add.group();
    this.physics.add.collider(this._bombs, platforms);
    this.physics.add.collider(this._player, this._bombs, this.hitBomb, null, this);
  }

  // update ゲーム画面の更新 操作など(画面を表示するだけなので今回は使わない)
  update() : void {
    // プレイヤーやカーソルキーが初期化されていない場合は、何もせずにリターン
    if (!this._player || !this._cursorKeys) {
      return;
    }

    // キーボードの入力に応じてプレイヤーの移動制御
    if (this._cursorKeys.left.isDown)
    {
        this._player.setVelocityX(-160);
        this._player.anims.play('left', true);
    }
    else if (this._cursorKeys.right.isDown)
    {
        this._player.setVelocityX(160);
        this._player.anims.play('right', true);
    }
    else
    {
        this._player.setVelocityX(0);
        this._player.anims.play('turn');
    }
    
    if (this._cursorKeys.up.isDown && this._player.body.touching.down)
    {
        this._player.setVelocityY(-300);
    }
  }

  /**
   * プレイヤーが星オブジェクトに触れた際の処理
   * @param player 
   * @param star 
   */
  private collectStar (
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, 
    star: Phaser.GameObjects.GameObject
  ) : void {
      star.disableBody(true, true);

      this._score += 10;
      this._scoreText.setText('Score: ' + this._score);

      if (this._stars.countActive(true) === 0)
      {
          this._stars.children.iterate(function (child: Phaser.GameObjects.GameObject) {
              child.enableBody(true, child.x, 0, true, true);
          });
    
          let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
          let bomb = this._bombs.create(x, 16, 'bomb');
          bomb.setBounce(1);
          bomb.setCollideWorldBounds(true);
          bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    
      }
  }

  /**
   * プレイヤーが爆弾オブジェクトに触れた際の処理
   * @param player 
   * @param bomb 
   */
  private hitBomb (
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, 
    bomb: Phaser.Physics.Arcade.Group
  ) : void {
      this.physics.pause();

      player.setTint(0xff0000);

      player.anims.play('turn');
      
      this.add.text(200, 250, 'GAME OVER', { fontSize: '80px', fill: '#ff0000' });
  }
}

export default ScrollScene;
