let t = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let creatureX, creatureY;

// randomized properties (set in setup)
let waveR, waveG, waveB;
let bodyR, bodyG, bodyB;
let coreR, coreG, coreB;
let numTentacles;
let tentacleLen;
let baseAmp;
let bodyBaseSize;
let isScared = false;

function setup() {
  let canvas = createCanvas(800, 500);
  background(20);
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");

  creatureX = width / 2;
  creatureY = height / 2;

  // randomize appearance each run
  waveR = random(60, 140);
  waveG = random(120, 200);
  waveB = random(200, 255);

  bodyR = random(20, 80);
  bodyG = random(100, 180);
  bodyB = random(140, 220);

  coreR = random(100, 200);
  coreG = random(200, 255);
  coreB = random(230, 255);

  numTentacles = floor(random(5, 9));
  tentacleLen = random(40, 75);
  baseAmp = random(15, 35);
  bodyBaseSize = random(120, 160);
}

function draw() {
  drawWaveBackground();
  drawCreature();

  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function drawWaveBackground() {
  fill(20, 25);
  noStroke();
  rect(0, 0, width, height);

  let amp = map(mouseY, 0, height, 10, baseAmp * 1.5);
  let freq = 0.02;
  let rowGap = 20;

  stroke(waveR, waveG, waveB);
  strokeWeight(2);
  noFill();

  for (let v = 0; v <= height; v += rowGap) {
    beginShape();
    for (let x = 0; x <= width; x += 10) {
      let yOffset = sin(x * freq + t) * amp;
      if (mouseIsPressed) {
        let d = dist(x, v, mouseX, mouseY);
        if (d < 120) {
          yOffset *= 0.3;
        }
      }
      vertex(x, v + yOffset);
    }
    endShape();
  }

  if (mouseIsPressed) {
    t += 0.01;
  } else {
    t += 0.03;
  }
}

function drawCreature() {
  push();

  if (mouseIsPressed) {
    // run away from mouse
    isScared = true;
    let dx = creatureX - mouseX;
    let dy = creatureY - mouseY;
    let d = dist(mouseX, mouseY, creatureX, creatureY);

    if (d > 1) {
      let fleeStrength = map(d, 0, 300, 120, 30, true);
      let runX = creatureX + (dx / d) * fleeStrength;
      let runY = creatureY + (dy / d) * fleeStrength;

      // keep within canvas
      runX = constrain(runX, 60, width - 60);
      runY = constrain(runY, 60, height - 60);

      creatureX = lerp(creatureX, runX, 0.12);
      creatureY = lerp(creatureY, runY, 0.12);
    }
  } else {
    // smooth follow mouse
    isScared = false;
    let mouseSpeed = dist(mouseX, mouseY, prevMouseX, prevMouseY);

    if (mouseSpeed < 2) {
      // idle wandering when mouse is still
      let wanderX = mouseX + sin(frameCount * 0.02) * 40;
      let wanderY = mouseY + cos(frameCount * 0.015) * 30;
      wanderX = constrain(wanderX, 60, width - 60);
      wanderY = constrain(wanderY, 60, height - 60);
      creatureX = lerp(creatureX, wanderX, 0.03);
      creatureY = lerp(creatureY, wanderY, 0.03);
    } else {
      // follow mouse
      creatureX = lerp(creatureX, mouseX, 0.05);
      creatureY = lerp(creatureY, mouseY, 0.05);
    }
  }

  translate(creatureX, creatureY);

  // scared shaking effect
  if (isScared) {
    let shake = random(-3, 3);
    translate(shake, shake * 0.5);
  }

  let speed = dist(mouseX, mouseY, prevMouseX, prevMouseY);
  let disturbed = speed > 20 || isScared;
  let pulse = 1 + sin(frameCount * 0.05) * 0.06;

  let shrink = 1;
  if (disturbed) {
    shrink = 0.82;
  }
  scale(shrink);

  let currentSize = bodyBaseSize * pulse;

  drawTentacles(0, 0, currentSize);
  drawBody(0, 0, currentSize);
  drawEye(-15, -12, 16);
  drawEye(15, -12, 16);

  pop();
}

function drawTentacles(x, y, bodySize) {
  push();
  translate(x, y);
  noFill();
  strokeWeight(2);

  for (let i = 0; i < numTentacles; i++) {
    let angle = map(i, 0, numTentacles, PI * 0.15, PI * 0.85);
    let sx = cos(angle) * bodySize * 0.35;
    let sy = sin(angle) * bodySize * 0.2 + 10;

    stroke(bodyR + 20, bodyG + 40, bodyB, 100);

    beginShape();
    curveVertex(sx, sy);
    for (let j = 0; j <= 8; j++) {
      let p = j / 8;
      let waveSpeed = 0.06;
      let waveAmp = 12;
      if (isScared) {
        waveSpeed = 0.18;
        waveAmp = 22;
      }
      let wave = sin(frameCount * waveSpeed + i * 1.5 + j * 0.5) * waveAmp * p;
      let tx = sx + cos(angle) * p * tentacleLen + wave;
      let ty = sy + sin(angle) * p * tentacleLen;
      curveVertex(tx, ty);
    }
    endShape();
  }

  pop();
}

function drawBody(x, y, size) {
  push();
  translate(x, y);
  noStroke();

  // glow layers
  for (let i = 3; i > 0; i--) {
    fill(bodyR, bodyG, bodyB, 20 / i);
    ellipse(0, 0, size + i * 25, size * 0.7 + i * 18);
  }

  // outer body
  fill(bodyR, bodyG, bodyB, 120);
  ellipse(0, 0, size, size * 0.7);

  // inner core
  fill(coreR, coreG, coreB, 150);
  ellipse(0, 5, size * 0.4, size * 0.3);

  // decorative spots
  for (let i = 0; i < 5; i++) {
    let spotX = cos(i * 1.3 + 0.5) * size * 0.2;
    let spotY = sin(i * 1.3 + 0.5) * size * 0.15;
    fill(coreR, coreG, coreB, 60 + sin(frameCount * 0.03 + i) * 30);
    ellipse(spotX, spotY, size * 0.06, size * 0.06);
  }

  pop();
}

function drawEye(x, y, r) {
  push();
  translate(x, y);
  noStroke();

  // eye white
  fill(220, 250, 255, 180);
  ellipse(0, 0, r * 1.5, r);

  // pupil — shifts slightly toward mouse
  let dx = mouseX - creatureX;
  let dy = mouseY - creatureY;
  let maxOff = r * 0.15;
  let pupilX = constrain(dx * 0.01, -maxOff, maxOff);
  let pupilY = constrain(dy * 0.01, -maxOff, maxOff);

  fill(20, 40, 60);
  ellipse(pupilX, pupilY, r * 0.6, r * 0.6);

  // highlight
  fill(255);
  ellipse(pupilX - r * 0.12, pupilY - r * 0.12, r * 0.2, r * 0.2);

  pop();
}
