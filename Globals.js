export let canvas = document.getElementById("myCanvas");
export let ctx = canvas.getContext("2d");
export let pitch = document.getElementById("pitch");
export let mouseX;
export let mouseY;
export let mouseClick = {};
export let dots = [];
export let moves = [];

export function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

export function detectColisionWithCircle(
  radius,
  circleX,
  circleY,
  pointX,
  pointY
) {
  if (
    Math.sqrt(
      (pointX - circleX) * (pointX - circleX) +
        (pointY - circleY) * (pointY - circleY)
    ) < radius
  ) {
    return true;
  } else {
    return false;
  }
}

export let clearMouseClick = () => {
  mouseClick = {};
};

canvas.addEventListener(
  "mousemove",
  function(evt) {
    var mousePos = getMousePos(canvas, evt);
    mouseX = mousePos.x;
    mouseY = mousePos.y;
  },
  false
);

canvas.addEventListener(
  "click",
  function(evt) {
    var mousePos = getMousePos(canvas, evt);
    mouseClick = {
      x: mousePos.x,
      y: mousePos.y
    };
    mouseY = mousePos.y;
  },
  false
);

window.addEventListener(
  "keydown",
  function(event) {
    switch (event.keyCode) {
      case 37: // Left
        break;

      case 38: // Up
        break;

      case 39: // Right
        break;

      case 40: // Down
        break;

      case 32: // Down
        break;
    }
  },
  false
);
