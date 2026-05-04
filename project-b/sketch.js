let robot;

function setup() {
  createCanvas(400, 400);
  angleMode(RADIANS);
  rectMode(CENTER);

  robot = new Robot(width / 2, height / 2);
}

function draw() {
  background(0);

  robot.update();
  robot.display();

  fill(255);
  noStroke();
  textSize(14);
  textAlign(CENTER);
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
    this.head = new Head(this.x, this.y - 95, 90);
    this.leftArm = new Limb(this.x - 60, this.y - 45, 20, 70);
    this.rightArm = new Limb(this.x + 60, this.y - 45, 20, 70);
    this.leftLeg = new Limb(this.x - 25, this.y + 60, 22, 70);
    this.rightLeg = new Limb(this.x + 25, this.y + 60, 22, 70);
  }

  update() {
    this.head.update();
    this.leftArm.update();
    this.rightArm.update();
    this.leftLeg.update();
    this.rightLeg.update();
  }

  display() {
    this.leftArm.display();
    this.rightArm.display();

    noStroke();
    fill(132, 156, 194);
    rect(this.x, this.y, 120, 120, 18);

    this.leftLeg.display();
    this.rightLeg.display();
    this.head.display();
  }

  mousePressed(mx, my) {
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
  constructor(pivotX, pivotY, w, h) {
    this.pivotX = pivotX;
    this.pivotY = pivotY;
    this.w = w;
    this.h = h;
    this.baseX = pivotX;
    this.baseY = pivotY + 35;
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

    this.angularVelocity += this.velocityX * 0.03 - this.angle * 0.16;
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
    rect(0, 0, this.w, this.h, 10);
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

    this.x = constrain(mx - this.dragOffsetX, this.baseX - 42, this.baseX + 42);
    this.y = constrain(my - this.dragOffsetY, this.baseY - 42, this.baseY + 42);

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

    this.angularVelocity += this.velocityX * 0.03 - this.angle * 0.16;
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
    fill(245, 209, 92);
    rect(0, 0, this.size, this.size * 0.82, 20);

    fill(70);
    ellipse(-18, -5, 10, 14);
    ellipse(18, -5, 10, 14);

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

    this.x = constrain(mx - this.dragOffsetX, this.baseX - 55, this.baseX + 55);
    this.y = constrain(my - this.dragOffsetY, this.baseY - 30, this.baseY + 28);

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
