const starsCanvas = document.querySelector("#starsCanvas");
const starsCtx = starsCanvas.getContext("2d");
let w = (starsCanvas.width = window.innerWidth);
let h = (starsCanvas.height = window.innerHeight);
let stars = [];

let mouse = {
  x: undefined,
  y: undefined,
};

let rgb = ["rgb(139, 163, 175)", "rgb(198, 248, 255)", "rgb(22, 151, 196)"];

function animationLoop() {
  starsCtx.clearRect(0, 0, w, h);
  starsCtx.globalCompositeOperation = "lighter";
  drawStars();

  requestAnimationFrame(animationLoop);
}

function drawStars() {
  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].draw();
  }
}

function mousemove(e) {
  mouse.x = e.x;
  mouse.y = e.y;

  stars.push(new Star());
}

function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
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

window.addEventListener("DOMContentLoaded", animationLoop);
window.addEventListener("mousemove", mousemove);
