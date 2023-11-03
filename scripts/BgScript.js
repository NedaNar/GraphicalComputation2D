const bgCanvas = document.querySelector("#bgCanvas");
const bgCtx = bgCanvas.getContext("2d");
bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;

const backgroundImage = new Image();
backgroundImage.src = "./elements/AnimationBackground_brighter.png";

backgroundImage.onload = function () {
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
};
