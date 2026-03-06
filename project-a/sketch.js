let t = 0;                
let prevMouseX = 0;
let prevMouseY = 0;

function setup() {
    let canvas = createCanvas(800, 500);
    background(20);
    canvas.id("p5-canvas");
    canvas.parent("p5-canvas-container");
}

function draw() {
  drawWaveBackground();            
  drawCreature(width / 2, height / 2); 

  
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}


function drawWaveBackground() {
  fill(20, 25);
  noStroke();
  rect(0, 0, width, height);
  let amp = map(mouseY, 0, height, 10, 40);
  let freq = 0.02;
  let rowGap = 20;

  stroke(100, 160, 255);
  strokeWeight(2);
  noFill();

  for (let v = 0; v <= height; v += rowGap) {
    beginShape();

    for (let x = 0; x <= width; x += 10) {
      let yOffset = sin(x * freq + t) * amp;
      if (mouseIsPressed) {
        let d = dist(x, v, mouseX, mouseY);
        if (d < 120) {
          yOffset *= 0.3; // smaller movement = looks slower
        }
      }

      vertex(x, v + yOffset);
    }

    endShape();
  }

  if (mouseIsPressed) {
    t += 0.01; // slower flow
  } else {
    t += 0.03; // normal flow
  }
}

function drawCreature(x, y) {
  push();

    // smooth follow movement
  let targetX = mouseX;
  let targetY = mouseY;

  // slowly move toward mouse
  x = lerp(x, targetX, 0.05);
  y = lerp(y, targetY, 0.05);

  translate(x, y);

  let speed = dist(mouseX, mouseY, prevMouseX, prevMouseY);
  let disturbed = speed > 20;
  let pulse = 1 + sin(frameCount * 0.05) * 0.06;

  let shrink = disturbed ? 0.85 : 1;
  scale(shrink);

  drawBody(0, 0, 150 * pulse);
  drawEye(0, -10, 20);

  pop();
}

function drawBody(x, y, size) {
  push();
  translate(x, y);

  noStroke();

  // outer body
  fill(40, 140, 180, 120);
  ellipse(0, 0, size, size * 0.7);

  // inner core
  fill(120, 220, 255, 150);
  ellipse(0, 5, size * 0.4, size * 0.3);

  pop();
}

function drawEye(x, y, r) {
  push();
  translate(x, y);

  noStroke();

  fill(220, 250, 255, 180);
  ellipse(0, 0, r * 1.5, r);

  fill(20, 40, 60);
  ellipse(0, 0, r * 0.6, r * 0.6);

  fill(255);
  ellipse(-r * 0.2, -r * 0.2, r * 0.25, r * 0.25);

  pop();
}