// 1.jpg～6.jpg：第 1 帧左 1 右 4，第 2 帧左 2 右 5，第 3 帧左 3 右 6
// 用 image 的 9 个参数从原图裁一块再画满半屏，去掉左右留白，人物会靠近中间（第三帧比例更大）
let imgs = [];
// 左半屏：裁掉原图左侧多少比例（0～1），只保留靠「中缝」一侧的画面
let cutLeft = [0.34, 0.34, 0.5];
// 右半屏：只保留原图左侧多少比例（裁掉右侧留白），第三帧略小更贴中缝
let keepRightW = [0.68, 0.68, 0.52];

function preload() {
  for (let i = 1; i <= 6; i++) {
    imgs.push(loadImage(i + ".jpg"));
  }
}

function setup() {
  createCanvas(800, 500);
}

function draw() {
  background(255);

  let frame = floor(frameCount / 50) % 3;
  let halfW = width / 2;

  let L = imgs[frame];
  let R = imgs[3 + frame];

  let sxL = L.width * cutLeft[frame];
  image(L, 0, 0, halfW, height, sxL, 0, L.width - sxL, L.height);

  let swR = R.width * keepRightW[frame];
  image(R, halfW, 0, halfW, height, 0, 0, swR, R.height);
}
