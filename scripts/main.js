// INITIAL ELEMENTS AND VALUES

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
var closeButton = document.getElementById("closeButton");

ctx.clearRect(0, 0, canvas.width, canvas.height);

let x = 0;
let y = 0;

let rotationAngle = 0; // head rotation
let lastMouseMove = null;
let isDialogClosed = false;
let firstClick = false;
var idleTime = 5000;

// Planets, their positions and radius
const planets = [
  { x: 200, y: 200, radius: 70 },
  { x: 600, y: 400, radius: 80 },
  { x: 1300, y: 500, radius: 110 },
];

const helpingPlanets = [
  { x: 510, y: 385, radius: 30 },
  { x: 690, y: 420, radius: 30 },
];

// Main character
const circleRadius = 60;
let circleX = canvas.width / 2;
let circleY = canvas.height / 2;

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

// Players
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

// Background Image

const bgCanvas = document.querySelector("#gameCanvas");
const bgCtx = bgCanvas.getContext("2d");
bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;

const backgroundImage = new Image();
backgroundImage.src = "./elements/AnimationBackground_brighter.png";

// -------------------------------------------------------
// STAR CLASS

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

// -------------------------------------------------------
// FUNCTIONS

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

  if (isDialogClosed) {
    stars.push(new Star());
    stars.push(new Star());
  }

  lastMouseMove = new Date().getTime();
}

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

  // Circles on the rabbitplanet
  drawCircle(helpingPlanets[0]);
  drawCircle(helpingPlanets[1]);
}

function drawCircle(circle) {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, true);
  ctx.closePath();
}

function drawCharacter() {
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

function checkCollisions() {
  // rabbitplanet collision circles
  var [distanceC1, angleC1] = calculatePosition(helpingPlanets[0]);
  if (distanceC1 < helpingPlanets[0].radius + circleRadius) {
    repositionCharacter(
      helpingPlanets[0],
      rabbitColors,
      rabbitImage,
      angleC1,
      3
    );
  }

  var [distanceC2, angleC2] = calculatePosition(helpingPlanets[1]);
  if (distanceC2 < helpingPlanets[1].radius + circleRadius) {
    repositionCharacter(
      helpingPlanets[1],
      rabbitColors,
      rabbitImage,
      angleC2,
      3
    );
  }

  for (let i = 0; i < planets.length; i++) {
    var [distance, angle] = calculatePosition(planets[i]);
    if (distance < planets[i].radius + circleRadius) {
      // Calculate the position of the moving circle's center at the edge of the planet
      if (i == 2) {
        repositionCharacter(
          planets[i],
          penguinColors,
          penguinImage,
          angle,
          1.6
        );
      } else if (i == 1) {
        repositionCharacter(planets[i], rabbitColors, rabbitImage, angle, 1.8);
      } else {
        repositionCharacter(planets[i], turtleColors, turtleImage, angle, 1.8);
      }
    }
  }
}

function calculatePosition(planet) {
  const dx = circleX - planet.x;
  const dy = circleY - planet.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  // Calculate the angle between the planet's center and the moving circle
  const angle = Math.atan2(dy, dx);
  return [distance, angle];
}

function repositionCharacter(planet, colors, image, angle, multiplier) {
  circleCenterX = planet.x + planet.radius * Math.cos(angle) * multiplier;
  circleCenterY = planet.y + planet.radius * Math.sin(angle) * multiplier;

  rgb = colors;
  player = image;

  circleX = circleCenterX;
  circleY = circleCenterY;
}

function drawStars() {
  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].draw();
  }
}

function gameLoop() {
  drawBackground();
  if (isDialogClosed && firstClick) {
    drawStars();
    checkCollisions();
    drawCharacter();
  }

  requestAnimationFrame(gameLoop);
}

function handleClick(event) {
  if (!firstClick) {
    circleX = mouse.x;
    circleY = mouse.y;

    window.addEventListener("mousemove", updateCirclePosition);
  }

  firstClick = true;
  isDialogClosed = true;

  changePlanetsPosition();
  drawCharacter();
  resizeElement("introWindow", "400px", "500px", "36%", "100%");
}

function showDialog() {
  resizeElement("introWindow", "400px", "500px", "36%", "100px");
}

function changePlanetsPosition() {
  resizeElement("turtlePlanet", "140px", "140px", "200px", "200px");
  resizeElement("penguinPlanet", "230px", "230px", "1300px", "500px");
  resizeElement("rabbitPlanet", "246px", "180px", "600px", "400px");
}

function showIntroduction() {
  resizeElement("turtlePlanet", "80px", "80px", "52%", "82%");
  resizeElement("penguinPlanet", "130px", "130px", "35%", "19%");
  resizeElement("rabbitPlanet", "89px", "65px", "63%", "70%");
}

function resizeElement(elementId, width, height, left, top) {
  const element = document.getElementById(elementId);
  element.style.width = width;
  element.style.height = height;
  element.style.left = left;
  element.style.top = top;
}

function handleResize() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}

function checkIdle() {
  var currentTime = new Date().getTime();

  if (lastMouseMove == null || !isDialogClosed) {
    lastMouseMove = currentTime;
    setTimeout(checkIdle, 100);
    return;
  }

  var elapsedTime = currentTime - lastMouseMove;

  if (elapsedTime >= idleTime) {
    isDialogClosed = false;
    showDialog();
    showIntroduction();

    lastMouseMove = currentTime;
  }

  setTimeout(checkIdle, 100);
}

// -------------------------------------------------------
// EVENT LISTENERS //
closeButton.addEventListener("click", handleClick);
canvas.addEventListener("mousemove", mousemove);
window.addEventListener("resize", handleResize);

// -------------------------------------------------------
// MAIN CODE //
gameLoop();

setTimeout(function () {
  showDialog();
}, 50);

setTimeout(function () {
  showIntroduction();
}, 200);

checkIdle();
