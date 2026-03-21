let scanned = [];
let dog;
let robot;
let Curdog =0;
let Currobot =0;
let dogX = -200;
let dogY = 300;
// let eyes;
// let rockets;
// let doodles1;
// let doodles2;

// let curEye = 0;
// let curRocket = 0;
// let rocketY = 500;
// let rocketSpeedY = 0;
// let curDoodle1 = 0;
// let curDoodle2 = 0;

function preload() {
  for (let i = 1; i <= 6; i++) {
    scanned.push(loadImage(i + ".jpg"));
  }
}

function setup() {
  eraseBg(scanned, 10);
  createCanvas(800, 500);
  dog = crop(scanned,0, 0, 900, 700);
  robot =crop(scanned, 900, 0, 900, 700);
  
//   eyes = crop(scanned, 0, 0, 585, 356);
//   rockets = crop(scanned, 1600, 90, 650, 420);
//   doodles1 = crop(scanned, 1514, 1300, 830, 300);
//   doodles2 = crop(scanned, 100, 1300, 366, 311);
}

function draw() {
  background(255);
  image(
    dog[Curdog],
    dogX,
    dogY,
    dog[0].width * 0.3,
    dog[0].height * 0.3
  );

  Curdog = floor((frameCount / 30) % dog.length);
  dogX += 2;

  let robotX = width / 2;
  let robotY = 200 + sin(frameCount * 0.1) * 20;

  image(
    robot[Currobot],
    robotX,
    robotY,
    robot[0].width * 0.3,
    robot[0].height * 0.3
  );

  Currobot = floor((frameCount / 30) % robot.length);

}

// You shouldn't need to modify these helper functions:

function crop(imgs, x, y, w, h) {
  let cropped = [];
  for (let i = 0; i < imgs.length; i++) {
    cropped.push(imgs[i].get(x, y, w, h));
  }
  return cropped;
}

function eraseBg(imgs, threshold = 10) {
  for (let i = 0; i < imgs.length; i++) {
    let img = imgs[i];
    img.loadPixels();
    for (let j = 0; j < img.pixels.length; j += 4) {
      let d = 255 - img.pixels[j];
      d += 255 - img.pixels[j + 1];
      d += 255 - img.pixels[j + 2];
      if (d < threshold) {
        img.pixels[j + 3] = 0;
      }
    }
    img.updatePixels();
  }
  // this function uses the pixels array
  // we will cover this later in the semester - stay tuned
}
