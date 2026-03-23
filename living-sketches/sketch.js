let scanned = [];
let scanned1 = [];
let dog;
let robot;
let Curdog =0;
let Currobot =0;
let dogX = 0;
let dogY = 0;
let robotX = 1000;
let robotY = 0;
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
  for (let i = 1; i <= 3; i++) {
    scanned.push(loadImage(i + ".jpg"));
  }
  for (let i = 4; i <= 6; i++) {
    scanned1.push(loadImage(i + ".jpg"));
  }
}

function setup() {
  createCanvas(1920, 500);
  eraseBg(scanned, 20);
  eraseBg(scanned1, 20);
  dog = crop(scanned, 0, 100, 1200, 700);
  robot = crop(scanned1, 1100, 0, 1200, 700);
  
//   eyes = crop(scanned, 0, 0, 585, 356);
//   rockets = crop(scanned, 1600, 90, 650, 420);
//   doodles1 = crop(scanned, 1514, 1300, 830, 300);
//   doodles2 = crop(scanned, 100, 1300, 366, 311);
}

function draw() {
  background(255);

  
  Curdog = floor(frameCount / 30) % dog.length;
  Currobot = floor(frameCount / 30) % robot.length;

  image(
    dog[Curdog],
    dogX,
    dogY,
    dog[0].width * 0.3,
    dog[0].height * 0.3
  );


  image(
    robot[Currobot],
    robotX,
    robotY,
    robot[0].width * 0.3,
    robot[0].height * 0.3
  );


  if (mouseIsPressed) {
    robotX = mouseX;
    robotY = mouseY;


} else {
  robotX = 1000;
  robotY =0;

}


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
