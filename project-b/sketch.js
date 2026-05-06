let faceMesh;
let video;
let faces = [];

let options = { maxFaces: 1, refineLandmarks: false, flipped: false };

let robot;
let playmat;
let bodyImg;
let song;

function preload() {
  faceMesh = ml5.faceMesh(options);
  playmat = loadImage("playmat.jpg");
  bodyImg = loadImage("body.png");
  song = loadSound("September.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  rectMode(CENTER);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  faceMesh.detectStart(video, gotFaces);

  robot = new Robot(width / 2, height / 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  robot = new Robot(width / 2, height / 2);
}

function draw() {
  image(playmat, 0, 0, width, height);
  video.loadPixels();

  let facePoint = getFacePoint();
  robot.update(facePoint);
  robot.display();

  fill(255);
  noStroke();
  textSize(14);
  textAlign(CENTER);
}

function gotFaces(results) {
  faces = results;
}

function getFacePoint() {
  if (faces.length > 0) {
    let face = faces[0];
    let totalX = 0;
    let totalY = 0;

    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      totalX += keypoint.x;
      totalY += keypoint.y;
    }

    let faceX = totalX / face.keypoints.length;
    let faceY = totalY / face.keypoints.length;

    return {
      x: map(faceX, 0, video.width, width, 0),
      y: map(faceY, 0, video.height, 0, height)
    };
  }

  return null;
}

function drawFacePixels(x, y, w, h) {
  if (faces.length > 0 && video.pixels.length > 0) {
    let face = faces[0];
    let minX = video.width;
    let maxX = 0;
    let minY = video.height;
    let maxY = 0;

    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      minX = min(minX, keypoint.x);
      maxX = max(maxX, keypoint.x);
      minY = min(minY, keypoint.y);
      maxY = max(maxY, keypoint.y);
    }

    let pixelSize = 10;

    for (let py = -h / 2; py < h / 2; py += pixelSize) {
      for (let px = -w / 2; px < w / 2; px += pixelSize) {
        let videoX = map(px, -w / 2, w / 2, maxX, minX);
        let videoY = map(py, -h / 2, h / 2, minY, maxY);

        videoX = floor(constrain(videoX, 0, video.width - 1));
        videoY = floor(constrain(videoY, 0, video.height - 1));

        let index = (videoX + videoY * video.width) * 4;

        fill(video.pixels[index], video.pixels[index + 1], video.pixels[index + 2]);
        noStroke();
        rect(x + px + pixelSize / 2, y + py + pixelSize / 2, pixelSize, pixelSize);
      }
    }
  } else {
    fill(245, 209, 92);
    rect(x, y, w, h, 20);
  }
}

function mousePressed() {
  robot.mousePressed(mouseX, mouseY);
}

function mouseDragged() {
  robot.mouseDragged(mouseX, mouseY);
}

function mouseReleased() {
  robot.mouseReleased();
}

class Robot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.bodyW = 220;
    this.bodyH = 220;
    this.buttonX = this.x + 55;
    this.buttonY = this.y + 20;
    this.buttonSize = 36;
    this.head = new Head(this.x, this.y - 170, 150);
    this.leftArm = new Limb(this.x - 115, this.y - 75, 34, 120);
    this.rightArm = new Limb(this.x + 115, this.y - 75, 34, 120);
    this.leftLeg = new Limb(this.x - 45, this.y + 110, 38, 120, true);
    this.rightLeg = new Limb(this.x + 45, this.y + 110, 38, 120, true);
  }

  update(facePoint) {
    if (facePoint != null) {
      let faceMove = map(facePoint.x, 0, width, -1, 1);
      let faceUpDown = map(facePoint.y, 0, height, -1, 1);

      this.head.faceAngle = faceMove * 0.35;
      this.head.faceLift = faceUpDown * 10;
      this.leftArm.faceAngle = faceMove * 0.25;
      this.rightArm.faceAngle = faceMove * 0.25;
      this.leftLeg.faceAngle = -faceMove * 0.12;
      this.rightLeg.faceAngle = -faceMove * 0.12;
    } else {
      this.head.faceAngle = 0;
      this.head.faceLift = 0;
      this.leftArm.faceAngle = 0;
      this.rightArm.faceAngle = 0;
      this.leftLeg.faceAngle = 0;
      this.rightLeg.faceAngle = 0;
    }

    this.head.update();
    this.leftArm.update();
    this.rightArm.update();
    this.leftLeg.update();
    this.rightLeg.update();
  }

  display() {
    this.leftArm.display();
    this.rightArm.display();

    image(bodyImg, this.x - this.bodyW / 2, this.y - this.bodyH / 2, this.bodyW, this.bodyH);

    fill(220, 20, 20);
    stroke(120, 0, 0);
    strokeWeight(3);
    ellipse(this.buttonX, this.buttonY, this.buttonSize, this.buttonSize);
    noStroke();

    this.leftLeg.display();
    this.rightLeg.display();
    this.head.display();
  }

  mousePressed(mx, my) {
    if (dist(mx, my, this.buttonX, this.buttonY) < this.buttonSize / 2) {
      if (!song.isPlaying()) {
        song.play();
      }
      return;
    }

    if (this.head.mousePressed(mx, my)) return;
    if (this.leftArm.mousePressed(mx, my)) return;
    if (this.rightArm.mousePressed(mx, my)) return;
    if (this.leftLeg.mousePressed(mx, my)) return;
    if (this.rightLeg.mousePressed(mx, my)) return;
  }

  mouseDragged(mx, my) {
    this.head.mouseDragged(mx, my);
    this.leftArm.mouseDragged(mx, my);
    this.rightArm.mouseDragged(mx, my);
    this.leftLeg.mouseDragged(mx, my);
    this.rightLeg.mouseDragged(mx, my);
  }

  mouseReleased() {
    this.head.mouseReleased();
    this.leftArm.mouseReleased();
    this.rightArm.mouseReleased();
    this.leftLeg.mouseReleased();
    this.rightLeg.mouseReleased();
  }
}

class Limb {
  constructor(pivotX, pivotY, w, h, hasFoot) {
    this.pivotX = pivotX;
    this.pivotY = pivotY;
    this.w = w;
    this.h = h;
    this.hasFoot = hasFoot;
    this.baseX = pivotX;
    this.baseY = pivotY + h / 2;
    this.x = this.baseX;
    this.y = this.baseY;

    this.angle = 0;
    this.angularVelocity = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.dragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.lastDragX = this.baseX;
    this.lastDragY = this.baseY;
    this.faceAngle = 0;
  }

  update() {
    if (this.dragging) {
      this.angle = constrain(this.angle, -0.9, 0.9);
      return;
    }

    let springX = (this.baseX - this.x) * 0.12;
    let springY = (this.baseY - this.y) * 0.12;
    let damping = 0.84;

    this.velocityX += springX;
    this.velocityY += springY;
    this.velocityX *= damping;
    this.velocityY *= damping;

    this.x += this.velocityX;
    this.y += this.velocityY;

    this.angularVelocity += this.velocityX * 0.03 - (this.angle - this.faceAngle) * 0.16;
    this.angularVelocity *= 0.78;
    this.angle += this.angularVelocity;

    if (
      abs(this.baseX - this.x) < 0.01 &&
      abs(this.baseY - this.y) < 0.01 &&
      abs(this.velocityX) < 0.01 &&
      abs(this.velocityY) < 0.01
    ) {
      this.x = this.baseX;
      this.y = this.baseY;
      this.velocityX = 0;
      this.velocityY = 0;
      this.angularVelocity = 0;
    }

    this.angle = constrain(this.angle, -0.9, 0.9);
  }

  display() {
    push();
    translate(this.pivotX, this.pivotY);
    rotate(this.angle);
    translate(this.x - this.pivotX, this.y - this.pivotY);
    noStroke();
    fill(132, 156, 194);
    rect(0, 0, this.w, this.h, 8);

    fill(95, 120, 160);
    ellipse(0, -this.h / 2, this.w + 8, this.w + 8);
    ellipse(0, this.h / 2, this.w + 8, this.w + 8);

    fill(235, 220, 170);
    ellipse(0, 0, this.w * 0.45, this.w * 0.45);

    if (this.hasFoot) {
      fill(70, 95, 130);
      rect(0, this.h / 2 + 8, this.w + 18, 12, 4);
    }
    pop();
  }

  mousePressed(mx, my) {
    if (dist(mx, my, this.x, this.y) < max(this.w, this.h) * 0.55) {
      this.dragging = true;
      this.dragOffsetX = mx - this.x;
      this.dragOffsetY = my - this.y;
      this.lastDragX = this.x;
      this.lastDragY = this.y;
      this.velocityX = 0;
      this.velocityY = 0;
      this.angularVelocity = 0;
      return true;
    }
    return false;
  }

  mouseDragged(mx, my) {
    if (!this.dragging) {
      return;
    }

    this.lastDragX = this.x;
    this.lastDragY = this.y;

    this.x = constrain(mx - this.dragOffsetX, this.baseX - this.h * 0.6, this.baseX + this.h * 0.6);
    this.y = constrain(my - this.dragOffsetY, this.baseY - this.h * 0.6, this.baseY + this.h * 0.6);

    this.velocityX = this.x - this.lastDragX;
    this.velocityY = this.y - this.lastDragY;
  }

  mouseReleased() {
    if (!this.dragging) {
      return;
    }

    this.dragging = false;
    this.velocityX *= 1.4;
    this.velocityY *= 1.2;
    this.angularVelocity = this.velocityX * 0.05;
  }
}

class Head {
  constructor(x, y, size) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.size = size;

    this.angle = 0;
    this.angularVelocity = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.dragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.lastDragX = x;
    this.lastDragY = y;
    this.faceAngle = 0;
    this.faceLift = 0;
  }

  update() {
    if (this.dragging) {
      this.angle = constrain(this.angle, -0.9, 0.9);
      return;
    }

    let springX = (this.baseX - this.x) * 0.12;
    let springY = (this.baseY - this.y) * 0.12;
    let damping = 0.84;

    this.velocityX += springX;
    this.velocityY += springY;
    this.velocityX *= damping;
    this.velocityY *= damping;

    this.x += this.velocityX;
    this.y += this.velocityY;
    this.y += (this.baseY + this.faceLift - this.y) * 0.05;

    this.angularVelocity += this.velocityX * 0.03 - (this.angle - this.faceAngle) * 0.16;
    this.angularVelocity *= 0.78;
    this.angle += this.angularVelocity;

    if (
      abs(this.baseX - this.x) < 0.01 &&
      abs(this.baseY - this.y) < 0.01 &&
      abs(this.velocityX) < 0.01 &&
      abs(this.velocityY) < 0.01
    ) {
      this.x = this.baseX;
      this.y = this.baseY;
      this.velocityX = 0;
      this.velocityY = 0;
      this.angularVelocity = 0;
    }

    this.angle = constrain(this.angle, -0.9, 0.9);
  }

  display() {
    push();
    translate(this.baseX, this.baseY);
    rotate(this.angle);
    translate(this.x - this.baseX, this.y - this.baseY);

    noStroke();
    fill(60, 80, 115);
    rect(0, 0, this.size + 18, this.size * 0.82 + 18, 22);

    drawFacePixels(0, 0, this.size, this.size * 0.82);

    pop();
  }

  mousePressed(mx, my) {
    if (dist(mx, my, this.x, this.y) < this.size * 0.55) {
      this.dragging = true;
      this.dragOffsetX = mx - this.x;
      this.dragOffsetY = my - this.y;
      this.lastDragX = this.x;
      this.lastDragY = this.y;
      this.velocityX = 0;
      this.velocityY = 0;
      this.angularVelocity = 0;
      return true;
    }
    return false;
  }

  mouseDragged(mx, my) {
    if (!this.dragging) {
      return;
    }

    this.lastDragX = this.x;
    this.lastDragY = this.y;

    this.x = constrain(mx - this.dragOffsetX, this.baseX - this.size * 0.6, this.baseX + this.size * 0.6);
    this.y = constrain(my - this.dragOffsetY, this.baseY - this.size * 0.35, this.baseY + this.size * 0.32);

    this.velocityX = this.x - this.lastDragX;
    this.velocityY = this.y - this.lastDragY;
  }

  mouseReleased() {
    if (!this.dragging) {
      return;
    }

    this.dragging = false;
    this.velocityX *= 1.4;
    this.velocityY *= 1.2;
    this.angularVelocity = this.velocityX * 0.05;
  }
}
