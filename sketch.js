let video;
let hands;
let camera;
let handLandmarks = null;

let scene = 0;
let startTime = 0;
let scanProgress = 0;
let fadeAlpha = 0;

let particles = [];
let freezeMode = false;
let slowMotion = false;
let fingerprintAngle = 0;

// For AR Holi effect
let holiSplashes = [];
let balloons = [];

// Shayari lines
let shayariLines = [
  "Phool hain gulab ka 🌸",
  "Chameli ka mat samajhna ❤️",
  "Aashiq hoon aapka",
  "Saheli ka mat samajhna… 💖",
  "Kisses from Aditya 😘"
];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.8,
    minTrackingConfidence: 0.8
  });

  hands.onResults(results => {
    if (results.multiHandLandmarks.length > 0) {
      handLandmarks = results.multiHandLandmarks[0];
    } else {
      handLandmarks = null;
    }
  });

  camera = new Camera(video.elt, {
    onFrame: async () => await hands.send({ image: video.elt }),
    width: width,
    height: height
  });
  camera.start();

  startTime = millis();
  textFont('Helvetica');
}

function draw() {
  background(0);

  if (scene !== 1) {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();
  }

  cinematicBars();

  switch (scene) {
    case 0: introScene(); break;
    case 1: scanScene(); break;
    case 2: greetingScene(); break;
    case 3: holiGameScene(); break;
    case 3.5: scene3_5Pause(); break;
    case 4: girlScene(); break;
    case 5: shayariScene(); break;
    case 6: finalScene(); break;
  }

  updateHoliSplashes();
  updateBalloons();
}

/////////////////////////
// SCENES
/////////////////////////
function introScene() {
  background(0);
  textAlign(CENTER, CENTER);
  textSize(40);

  // Spawn Holi splashes continuously during intro
  if (frameCount % 5 === 0) {
    holiSplashes.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      color: color(random(255), random(255), random(255), 180),
      alpha: 180
    });
  }

  // Spawn balloons slowly during intro
  if (frameCount % 60 === 0) {
    balloons.push({
      x: random(width),
      y: height + 50,
      size: random(30, 60),
      color: color(random(255), random(255), random(255)),
      speed: random(1, 3)
    });
  }

  let story = [
    " Radhe Radhe!🙏,",
    " Myself Aditya Kesarwani 😎…",
    " Brace yourself, I’m going to hack your system!💻",
    " Welcome to Neural Holi! 🌈",
    "Time to splash colors on your digital world!🎉🎊🎈"

  ];

  let t = floor((millis() - startTime) / 2500);

  for (let i = 0; i < min(t, story.length); i++) {
    let c = color(
      map(i + frameCount % 255, 0, 255, 50, 255),
      map(i + frameCount * 2 % 255, 0, 255, 100, 255),
      map(i + frameCount * 3 % 255, 0, 255, 150, 255)
    );
    fill(c);
    text(story[i], width / 2, 180 + i * 60);
  }

  // Draw Holi splashes and balloons
  updateHoliSplashes();
  updateBalloons();

  if (t > story.length) {
    scene = 1;
    startTime = millis();
    scanProgress = 0;
  }
}

function scanScene() {
  background(0);
  fill(0, 255, 255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Show your hand in front of camera \n Then scan your fingerprint", width / 2, 120);

  let centerX = width / 2;
  let centerY = height / 2;

  fingerprintAngle += 4;
  stroke(0, 255, 0);
  strokeWeight(2);
  noFill();
  circle(centerX, centerY, 200);

  for (let i = 0; i < 360; i += 15) {
    let angle = radians(i + fingerprintAngle);
    let x = centerX + 100 * cos(angle);
    let y = centerY + 100 * sin(angle);
    fill((i + frameCount) % 255, 255, 255);
    noStroke();
    circle(x, y, 8);
  }

  if (handLandmarks) {
    drawHandSkeletonWhiteRed();
    let ix = width - handLandmarks[8].x * width;
    let iy = handLandmarks[8].y * height;
    fill(0, 255, 0);
    circle(ix, iy, 20);

    if (dist(ix, iy, centerX, centerY) < 100) {
      scanProgress += 2;
    }
  }

  if (scanProgress > 120) {
    scene = 2;
    startTime = millis();
  }
}

function greetingScene() {
  if (frameCount % 5 === 0) {
    holiSplashes.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      color: color(random(255), random(255), random(255), 180),
      alpha: 180
    });
  }

  // Spawn balloons slowly
  if (frameCount % 60 === 0) {
    balloons.push({
      x: random(width),
      y: height + 50,
      size: random(30, 60),
      color: color(random(255), random(255), random(255)),
      speed: random(1, 3)
    });
  }

  let elapsed = (millis() - startTime) / 1000;
  textAlign(CENTER, CENTER);

  if (elapsed > 0) {
    fill(random(100, 255), random(100, 255), random(100, 255));
    textSize(50 + sin(frameCount*0.05)*5);
    text("From Aditya with love 💖,", width / 2, 150);
  }
  if (elapsed > 2) {
    fill(random(100, 255), random(100, 255), random(100, 255));
    textSize(48 + cos(frameCount*0.05)*5);
    text("Wishing you a Happy Holi!", width / 2, 220);
  }
  if (elapsed > 4) {
    fill(random(100, 255), random(100, 255), random(100, 255));
    textSize(46 + sin(frameCount*0.03)*5);
    text("😊 Smile! You are looking gorgeous today!", width / 2, 290);
  }

  if (elapsed > 7) {
    scene = 3;
    startTime = millis();
  }
}

function holiGameScene() {
  fill(0, 255, 0);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("Let's Play Holi Balls Game 🎨", width / 2, 100);

  textSize(24);
  text("1 Finger → Stop Colors", width / 2, 160);
  text("2 Fingers → Fall Fast", width / 2, 200);
  text("3 Fingers → Slow Motion", width / 2, 240);

  if (handLandmarks) {
    drawHandSkeletonWhiteRed();
    let fingers = countFingers();

    if (fingers === 1) { freezeMode = true; slowMotion = false; }
    else if (fingers === 2) { freezeMode = false; slowMotion = false; particles.forEach(p => p.speed = 10); }
    else if (fingers === 3) { slowMotion = true; freezeMode = false; }
  }

  addParticles();

  if ((millis() - startTime) > 15000) {
    scene = 3.5;
    startTime = millis();
    particles = [];
  }
}

function scene3_5Pause() {
  background(0);
  cinematicBars();
  addParticles();

  textAlign(CENTER, CENTER);
  fill(255, 255, 0);
  textSize(40 + sin(frameCount*0.1)*5);
  text("Holi balls have fallen...", width / 2, height / 2);

  if ((millis() - startTime) > 2000) {
    scene = 4;
    startTime = millis();
  }
}

function girlScene() {
  background(0);
  cinematicBars();

  if (frameCount % 5 === 0) {
    holiSplashes.push({
      x: random(width),
      y: random(height),
      size: random(10, 60),
      color: color(random(255), random(255), random(255), 120),
      alpha: 120
    });
  }

  fill(255, 0, 255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("If you are a girl, raise 2 fingers ✌️👧??", width / 2, 180);

  if (handLandmarks) {
    drawHandSkeletonWhiteRed();
    let fingers = countFingers();

    if (fingers === 2) {
      scene = 5;
      startTime = millis();
    }
  }
}

function shayariScene() {
  textAlign(CENTER, CENTER);
  textSize(50);

  for (let i = 0; i < shayariLines.length; i++) {
    if ((millis() - startTime)/500 > i) {
      let c = color(
        map(frameCount % 255, 0, 255, 200, 255),
        map((frameCount + i*10) % 255, 0, 255, 200, 255),
        map((frameCount + i*20) % 255, 0, 255, 200, 255)
      );
      fill(c);
      textSize(45 + sin(frameCount*0.05)*5);
      text(shayariLines[i], width / 2, 150 + i*60);
    }
  }

  if ((millis() - startTime)/500 > shayariLines.length + 2) {
    scene = 6;
    startTime = millis();
  }
}

function finalScene() {
  textAlign(CENTER, CENTER);
  textSize(40);
  fill(0, 255, 255);
  text("Stay Colorful. Stay Beautiful . Stay Happy!", width / 2, height / 2 - 40);
  fill(255, 0, 255);
  text("Happy Holi 🎨", width / 2, height / 2 + 40);

  fadeAlpha += 0.002;
  fill(0, 255 * fadeAlpha);
  rect(0, 0, width, height);

  if (fadeAlpha >= 1) noLoop();
}

/////////////////////////////
// Utilities
/////////////////////////////
function cinematicBars() {
  fill(0);
  rect(0, 0, width, 60);
  rect(0, height - 60, width, 60);
}

function addParticles() {
  if (particles.length < 150) {
    particles.push({
      x: random(width),
      y: random(-50, 0),
      speed: random(3, 8),
      color: color(random(255), random(255), random(255))
    });
  }
  particles.forEach(p => {
    if (!freezeMode) {
      if (slowMotion) p.y += p.speed / 3;
      else p.y += p.speed;
    }
    fill(p.color);
    circle(p.x, p.y, 12);
  });
}

function updateHoliSplashes() {
  for (let i = holiSplashes.length-1; i >=0; i--) {
    let s = holiSplashes[i];
    fill(red(s.color), green(s.color), blue(s.color), s.alpha);
    noStroke();
    ellipse(s.x, s.y, s.size);
    s.alpha -= 3;
    s.size += 1;
    if (s.alpha <=0) holiSplashes.splice(i,1);
  }
}

// Floating balloons
function updateBalloons() {
  for (let i = balloons.length-1; i>=0; i--) {
    let b = balloons[i];
    fill(b.color);
    noStroke();
    ellipse(b.x, b.y, b.size, b.size*1.2); // balloon shape
    stroke(255);
    line(b.x, b.y + b.size*0.6, b.x, b.y + b.size*1.5); // string
    noStroke();
    b.y -= b.speed;
    if (b.y + b.size < 0) balloons.splice(i,1);
  }
}

function countFingers() {
  if (!handLandmarks) return 0;
  let count = 0;
  if (handLandmarks[8].y < handLandmarks[6].y) count++;
  if (handLandmarks[12].y < handLandmarks[10].y) count++;
  if (handLandmarks[16].y < handLandmarks[14].y) count++;
  return count;
}

function drawHandSkeletonWhiteRed() {
  if (!handLandmarks) return;
  stroke(255);
  strokeWeight(3);
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [5, 9], [9, 10], [10, 11], [11, 12],
    [9, 13], [13, 14], [14, 15], [15, 16],
    [13, 17], [17, 18], [18, 19], [19, 20],
    [0, 17]
  ];
  connections.forEach(c => {
    let x1 = width - handLandmarks[c[0]].x * width;
    let y1 = handLandmarks[c[0]].y * height;
    let x2 = width - handLandmarks[c[1]].x * width;
    let y2 = handLandmarks[c[1]].y * height;
    line(x1, y1, x2, y2);
  });
  fill(255, 0, 0);
  noStroke();
  for (let i = 0; i < handLandmarks.length; i++) {
    let x = width - handLandmarks[i].x * width;
    let y = handLandmarks[i].y * height;
    circle(x, y, 10);
  }
}