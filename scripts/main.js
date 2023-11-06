const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let x = 0;
let y = 0;
const circleRadius = 40;

const catPlanetRadius = 70;
const turtlePlanetRadius = 80;
const penguinPlanetRadius = 110;

// planets, their positions and radius
const planets = [
  { x: 200, y: 200, isMoving: false, radius: 70 },
  { x: 600, y: 400, isMoving: false, radius: 80 },
  { x: 1000, y: 300, isMoving: false, radius: 110 },
];

let circleX = canvas.width / 2;
let circleY = canvas.height / 2;
let playerColor = "blue";

const yellow_rgb = [
  "rgb(225, 193, 110)",
  "rgb(228, 155, 15)",
  "rgb(251, 206, 177)",
];
const red_rgb = ["rgb(129, 19, 49)", "rgb(248, 131, 121)", "rgb(236, 88, 0)"];
const white_rgb = [
  "rgb(245, 245, 220)",
  "rgb(233, 220, 201)",
  "rgb(226, 223, 210)",
];

///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////

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

let rgb = ["rgb(139, 163, 175)", "rgb(198, 248, 255)", "rgb(22, 151, 196)"];

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
}

class Star {
  constructor() {
    this.x = mouse.x + getRandomInt(-10, 10);
    this.y = mouse.y + getRandomInt(-10, 10);

    this.x_end = this.x + getRandomInt(-100, 100);
    this.y_end = this.y + getRandomInt(-100, 100);

    this.size = getRandomInt(5, 10);

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
      this.x += (this.x_end - this.x) * 0.005;
      this.y += (this.y_end - this.y) * 0.005;
    }

    this.time++;
  }
}

/////////////////////////////////////////////////////////////////

// Background Image

const bgCanvas = document.querySelector("#gameCanvas");
const bgCtx = bgCanvas.getContext("2d");
bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;

const backgroundImage = new Image();
backgroundImage.src = "./elements/AnimationBackground_brighter.png";

//////////////////////////////////////

// Planets and main character
const gameArea = {
  left: 0,
  top: 0,
  right: canvas.width,
  bottom: canvas.height,
};

let firstClick = false;

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

  ctx.beginPath();
  ctx.arc(planets[0].x, planets[0].y, catPlanetRadius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(planets[1].x, planets[1].y, turtlePlanetRadius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(planets[2].x, planets[2].y, penguinPlanetRadius, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();
}

function drawCircle(color) {
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
  drawStars();
}

function updateCirclePosition(event) {
  if (firstClick) {
    const rect = canvas.getBoundingClientRect();
    let newX = event.clientX - rect.left;
    let newY = event.clientY - rect.top;

    newX = Math.max(
      gameArea.left + circleRadius,
      Math.min(gameArea.right - circleRadius, newX)
    );
    newY = Math.max(
      gameArea.top + circleRadius,
      Math.min(gameArea.bottom - circleRadius, newY)
    );
    circleX = newX;
    circleY = newY;
  }
}

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

function checkCollisions() {
  let circleCenterX = 0;
  let circleCenterY = 0;
  for (let i = 0; i < planets.length; i++) {
    const dx = circleX - planets[i].x;
    const dy = circleY - planets[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < planets[i].radius + circleRadius + 30) {
      // Calculate the angle between the planet's center and the moving circle
      const angle = Math.atan2(dy, dx);
      console.log(i);
      // Calculate the position of the moving circle's center at the edge of the planet
      if (i == 2) {
        circleCenterX =
          planets[i].x + planets[i].radius * Math.cos(angle) * 1.35;
        circleCenterY =
          planets[i].y + planets[i].radius * Math.sin(angle) * 1.35;

        rgb = yellow_rgb;
        playerColor = "yellow";
      } else if (i == 1) {
        circleCenterX =
          planets[i].x + planets[i].radius * Math.cos(angle) * 1.5;
        circleCenterY =
          planets[i].y + planets[i].radius * Math.sin(angle) * 1.5;

        rgb = white_rgb;
        playerColor = "white";
      } else {
        circleCenterX =
          planets[i].x + planets[i].radius * Math.cos(angle) * 1.55;
        circleCenterY =
          planets[i].y + planets[i].radius * Math.sin(angle) * 1.55;

        rgb = red_rgb;
        playerColor = "red";
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

function gameLoop() {
  drawBackground();
  if (firstClick) {
    checkCollisions();

    drawCircle(playerColor);
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
