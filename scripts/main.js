const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.clearRect(0, 0, canvas.width, canvas.height);

let x = 0;
let y = 0;
const circleRadius = 60;

const catPlanetRadius = 70;
const turtlePlanetRadius = 80;
const penguinPlanetRadius = 110;

let rotationAngle = 0; // head rotation

// planets, their positions and radius
const planets = [
  { x: 200, y: 200, isMoving: false, radius: 70 },
  { x: 600, y: 400, isMoving: false, radius: 80 },
  { x: 1300, y: 500, isMoving: false, radius: 110 },
];

//Main character
let circleX = canvas.width / 2;
let circleY = canvas.height / 2;

// CIrcles
let littleCircle1X = 510;
let littleCircle1Y = 385;
let circle1Radius = 30;

let littleCircle2X = 690;
let littleCircle2Y = 420;
let circle2Radius = 30;

// Colors
const turtleColors = [
  "rgb(194, 180, 59)",
  "rgb(204, 233, 229)",
  "rgb(10, 68, 57)",
];
const penguinColors = [
  "rgb(194, 180, 59)",
  "rgb(72, 82, 117)",
  "rgb(206, 202, 233)",
];
const rabbitColors = [
  "rgb(194, 180, 59)",
  "rgb(97, 57, 73)",
  "rgb(245, 144, 155)",
];

let rgb = turtleColors;

//// Players
const turtleImage = new Image();
turtleImage.src = "./elements/turtle.png";

const rabbitImage = new Image();
rabbitImage.src = "./elements/rabbit.png";

const penguinImage = new Image();
penguinImage.src = "./elements/penguin.png";

let player = new Image();
player = turtleImage;
let playerAngle = 0;

// Particles
const starsCanvas = document.querySelector("#gameCanvas");
const starsCtx = starsCanvas.getContext("2d");
let w = (starsCanvas.width = window.innerWidth);
let h = (starsCanvas.height = window.innerHeight);
let stars = [];

let mouse = {
  x: undefined,
  y: undefined,
};

function drawStars() {
  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].draw();
  }
}

function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

function mousemove(e) {
  mouse.x = e.clientX || e.pageX;
  mouse.y = e.clientY || e.pageY;

  stars.push(new Star());
  stars.push(new Star());
}

class Star {
  constructor() {
    this.x = mouse.x + getRandomInt(-10, 10);
    this.y = mouse.y + getRandomInt(-10, 10);

    this.x_end = this.x + getRandomInt(-300, 300);
    this.y_end = this.y + getRandomInt(-300, 300);

    this.size = getRandomInt(5, 15);

    this.style = rgb[getRandomInt(0, rgb.length - 1)];

    this.time = 0;
    this.ttl = 150;
  }

  draw() {
    starsCtx.fillStyle = this.style;
    starsCtx.beginPath();
    starsCtx.moveTo(this.x, this.y - this.size);

    const spikes = 5;
    const outerRadius = this.size;
    const innerRadius = this.size / 2;

    for (let i = 0; i < spikes; i++) {
      const angle = (Math.PI * 2 * i) / spikes - Math.PI / 2;
      const x = this.x + Math.cos(angle) * outerRadius;
      const y = this.y + Math.sin(angle) * outerRadius;
      starsCtx.lineTo(x, y);

      const innerAngle = angle + Math.PI / spikes;
      const innerX = this.x + Math.cos(innerAngle) * innerRadius;
      const innerY = this.y + Math.sin(innerAngle) * innerRadius;
      starsCtx.lineTo(innerX, innerY);
    }

    starsCtx.closePath();
    starsCtx.fill();
  }

  update() {
    if (this.time <= this.ttl) {
      let progress = this.time / this.ttl;

      this.size = this.size * Math.pow(1 - progress, 0.1);
      this.x += (this.x_end - this.x) * 0.007;
      this.y += (this.y_end - this.y) * 0.007;
    }

    this.time++;
  }
}
// Background Image

const bgCanvas = document.querySelector("#gameCanvas");
const bgCtx = bgCanvas.getContext("2d");
bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;

const backgroundImage = new Image();
backgroundImage.src = "./elements/AnimationBackground_brighter.png";

// Planets and main character
const gameArea = {
  left: 0,
  top: 0,
  right: canvas.width,
  bottom: canvas.height,
};

let firstClick = false;
let clickCounter = 0;

function drawBackground() {
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, canvas.width, canvas.height);

  bgCtx.drawImage(
    backgroundImage,
    0,
    0,
    backgroundImage.width,
    (backgroundImage.width / bgCanvas.width) * bgCanvas.height,
    0,
    0,
    bgCanvas.width,
    bgCanvas.height
  );
  ctx.save();

  //circles on the rabbitplanet
  ctx.beginPath();
  ctx.arc(littleCircle1X, littleCircle1Y, circle1Radius, 0, Math.PI * 2, true);
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(littleCircle2X, littleCircle2Y, circle2Radius, 0, Math.PI * 2, true);
  ctx.closePath();
}

function drawCircle() {
  ctx.save();
  ctx.translate(circleX, circleY);
  ctx.rotate(playerAngle);

  ctx.drawImage(
    player,
    -circleRadius,
    -circleRadius,
    circleRadius * 2,
    circleRadius * 2
  );

  ctx.restore();
}

function updateCirclePosition(event) {
  if (firstClick) {
    const rect = canvas.getBoundingClientRect();
    let newX = event.clientX - rect.left;
    let newY = event.clientY - rect.top;

    // Calculate the angle based on the mouse movement
    const deltaX = newX - circleX;
    const deltaY = newY - circleY;
    playerAngle = Math.atan2(deltaY, deltaX);

    circleX = newX;
    circleY = newY;
  }
}

canvas.addEventListener("click", function (e) {
  const turtlePlanetElement = document.getElementById("turtlePlanet");
  turtlePlanetElement.style.width = "140px";
  turtlePlanetElement.style.height = "140px";
  turtlePlanetElement.style.left = "200px";
  turtlePlanetElement.style.top = "200px";

  const rabbitPlanetElement = document.getElementById("penguinPlanet");
  rabbitPlanetElement.style.width = "230px";
  rabbitPlanetElement.style.height = "230px";
  rabbitPlanetElement.style.left = "1300px";
  rabbitPlanetElement.style.top = "500px";

  const penguinPlanetElement = document.getElementById("rabbitPlanet");
  penguinPlanetElement.style.width = "246px";
  penguinPlanetElement.style.height = "180px";
  penguinPlanetElement.style.left = "600px";
  penguinPlanetElement.style.top = "400px";
});

canvas.addEventListener("click", function (e) {
  if (!firstClick) {
    firstClick = true;
    const rect = canvas.getBoundingClientRect();
    circleX = e.clientX - rect.left;
    circleY = e.clientY - rect.top;

    canvas.addEventListener("mousemove", updateCirclePosition);
    canvas.addEventListener("mousemove", mousemove);
  }
});

function showIntroduction() {
  const turtlePlanetElement = document.getElementById("turtlePlanet");
  turtlePlanetElement.style.width = "80px";
  turtlePlanetElement.style.height = "80px";
  turtlePlanetElement.style.left = "52%";
  turtlePlanetElement.style.top = "82%";

  const rabbitPlanetElement = document.getElementById("penguinPlanet");
  rabbitPlanetElement.style.width = "130px";
  rabbitPlanetElement.style.height = "130px";
  rabbitPlanetElement.style.left = "38%";
  rabbitPlanetElement.style.top = "22%";

  const penguinPlanetElement = document.getElementById("rabbitPlanet");
  penguinPlanetElement.style.width = "89px";
  penguinPlanetElement.style.height = "65px";
  penguinPlanetElement.style.left = "63%";
  penguinPlanetElement.style.top = "70%";
}

function checkCollisions() {
  let circleCenterX = 0;
  let circleCenterY = 0;
  // rabbitplanet collision circles
  const dxC1 = circleX - littleCircle1X;
  const dyC1 = circleY - littleCircle1Y;
  const distanceC1 = Math.sqrt(dxC1 * dxC1 + dyC1 * dyC1);
  const angleC1 = Math.atan2(dyC1, dxC1);
  if (distanceC1 < circle1Radius + circleRadius) {
    circleCenterX = littleCircle1X + circle1Radius * Math.cos(angleC1) * 3;
    circleCenterY = littleCircle1Y + circle1Radius * Math.sin(angleC1) * 3;

    rgb = rabbitColors;
    player = rabbitImage;
    circleX = circleCenterX;
    circleY = circleCenterY;
  }

  const dxC2 = circleX - littleCircle2X;
  const dyC2 = circleY - littleCircle2Y;
  const distanceC2 = Math.sqrt(dxC2 * dxC2 + dyC2 * dyC2);
  const angleC2 = Math.atan2(dyC2, dxC2);
  if (distanceC2 < circle2Radius + circleRadius) {
    circleCenterX = littleCircle2X + circle2Radius * Math.cos(angleC2) * 3;
    circleCenterY = littleCircle2Y + circle2Radius * Math.sin(angleC2) * 3;

    rgb = rabbitColors;
    player = rabbitImage;
    circleX = circleCenterX;
    circleY = circleCenterY;
  }

  for (let i = 0; i < planets.length; i++) {
    //Circles Collision
    const dx = circleX - planets[i].x;
    const dy = circleY - planets[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < planets[i].radius + circleRadius) {
      // Calculate the angle between the planet's center and the moving circle
      const angle = Math.atan2(dy, dx);

      // Calculate the position of the moving circle's center at the edge of the planet
      if (i == 2) {
        circleCenterX =
          planets[i].x + planets[i].radius * Math.cos(angle) * 1.5;
        circleCenterY =
          planets[i].y + planets[i].radius * Math.sin(angle) * 1.5;

        rgb = penguinColors;
        player = penguinImage;
      } else if (i == 1) {
        circleCenterX =
          planets[i].x + planets[i].radius * Math.cos(angle) * 1.8;
        circleCenterY =
          planets[i].y + planets[i].radius * Math.sin(angle) * 1.8;

        rgb = rabbitColors;
        player = rabbitImage;
      } else {
        circleCenterX =
          planets[i].x + planets[i].radius * Math.cos(angle) * 1.8;
        circleCenterY =
          planets[i].y + planets[i].radius * Math.sin(angle) * 1.8;

        rgb = turtleColors;
        player = turtleImage;
      }
      // Update the position of the moving circle to stay on the edge of the planet
      circleX = circleCenterX;
      circleY = circleCenterY;
    }
  }
}

function drawParticles() {
  requestAnimFrame(drawParticles);

  starsCtx.clearRect(0, 0, w, h);
  starsCtx.globalCompositeOperation = "lighter";
  drawStars();
}

function drawStars() {
  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].draw();
  }
}

function introductionWindow() {
  const introWindow = document.getElementById("introWindow");
  introWindow.style.width = "400px";
  introWindow.style.height = "500px";
  introWindow.style.left = "550px";
  introWindow.style.top = "100px";
}
function gameLoop() {
  drawBackground();
  drawStars();

  if (firstClick) {
    checkCollisions();

    drawCircle();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
setTimeout(function () {
  introductionWindow();
}, 50);

setTimeout(function () {
  showIntroduction();
}, 200);
