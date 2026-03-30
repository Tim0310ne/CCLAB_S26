/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  dancer = new RobotDancer(width / 2, height / 2);
}

function draw() {
  background(0);
  drawFloor();

  dancer.update();
  dancer.display();
}

class RobotDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;

    this.headCol = color(70, 30, 180);
    this.neckCol = color(109, 129, 150);
    this.bodyCol = color(120, 160, 200);
    this.eyeCol = color(255, 240, 120);
    this.armCol = color(180, 180, 220);
    this.legCol = color(160, 160, 190);

    this.swayAngle = 0;
    this.swaySpeed = 0.05;

    this.armLength = 55;
    this.legLength = 45;

    this.headOffset = 0;
    this.armWave = 0;
    this.bodyBounce = 0;
  }

  update() {
    this.swayAngle += this.swaySpeed;

    this.headOffset = sin(this.swayAngle) * 10;
    this.armWave = sin(this.swayAngle * 2) * 25;
    this.bodyBounce = sin(this.swayAngle * 3) * 6;
  }

  display() {
    push();
    translate(this.x, this.y + this.bodyBounce);

    rectMode(CENTER);
    angleMode(RADIANS);

    // body
    noStroke();
    fill(this.bodyCol);
    rect(0, 10, 60, 70, 10);

    // neck
    fill(this.neckCol);
    rect(0, -35, 14, 20, 4);

    // head
    push();
    translate(this.headOffset, -60);
    fill(this.headCol);
    rect(0, 0, 55, 40, 8);

    // eyes
    fill(this.eyeCol);
    ellipse(-12, -5, 10, 10);
    ellipse(12, -5, 10, 10);

    // mouth
    stroke(255);
    strokeWeight(2);
    line(-10, 10, 10, 10);
    pop();

    // left arm
    push();
    translate(-30, -10);
    rotate(radians(-20) + sin(this.swayAngle * 2) * 0.5);
    stroke(this.armCol);
    strokeWeight(8);
    line(0, 0, -this.armLength, this.armWave);
    pop();

    // right arm
    push();
    translate(30, -10);
    rotate(radians(20) - sin(this.swayAngle * 2) * 0.5);
    stroke(this.armCol);
    strokeWeight(8);
    line(0, 0, this.armLength, -this.armWave);
    pop();

    // left leg
    push();
    translate(-15, 45);
    rotate(sin(this.swayAngle * 2) * 0.3);
    stroke(this.legCol);
    strokeWeight(9);
    line(0, 0, -8, this.legLength);
    pop();

    // right leg
    push();
    translate(15, 45);
    rotate(-sin(this.swayAngle * 2) * 0.3);
    stroke(this.legCol);
    strokeWeight(9);
    line(0, 0, 8, this.legLength);
    pop();

    this.drawReferenceShapes();
    pop();
  }

  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rectMode(CENTER);
    rect(0, 0, 200, 200);
    fill(255);
    stroke(0);
  }
}