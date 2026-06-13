// 解説: game.html

export const GAME_SIZE = {
  width: 800,
  height: 600,
} as const;

export const PHYSICS = {
  gravity: { x: 0, y: 300 },
  debug: false,
} as const;

export const ASSET_BASE_URL = "https://labs.phaser.io";

export const ASSET_KEYS = {
  sky: "sky",
  ground: "ground",
  star: "star",
  bomb: "bomb",
  dude: "dude",
} as const;

export const ASSET_PATHS = {
  sky: "assets/skies/space3.png",
  ground: "assets/sprites/platform.png",
  star: "assets/demoscene/star.png",
  bomb: "assets/sprites/bullet.png",
  dude: "assets/sprites/dude.png",
} as const;

export const ANIMATION_KEYS = {
  left: "left",
  turn: "turn",
  right: "right",
} as const;

export const PLAYER = {
  startX: 100,
  startY: 450,
  bounce: 0.2,
  speed: 160,
  jumpVelocity: -300,
} as const;

export const PLATFORM_LAYOUT = [
  { x: 400, y: 568, scale: 2 },
  { x: 600, y: 400 },
  { x: 50, y: 250 },
  { x: 750, y: 220 },
] as const;

export const STAR_FIELD = {
  repeat: 11,
  startX: 12,
  startY: 0,
  stepX: 70,
  minBounceY: 0.4,
  maxBounceY: 0.8,
} as const;

export const BOMB = {
  startY: 16,
  bounce: 1,
  minVelocityX: -200,
  maxVelocityX: 200,
  velocityY: 20,
} as const;

export const SCORE = {
  star: 10,
} as const;

export const TEXT = {
  scoreX: 10,
  scoreY: 10,
  scoreFontSize: "32px",
  scoreColor: "#FFFFFF",
  gameOverX: 200,
  gameOverY: 250,
  gameOverFontSize: "80px",
  gameOverColor: "#ff0000",
} as const;
