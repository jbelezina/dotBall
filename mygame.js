window.onload = function() {
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  let mouseX;
  let mouseY;
  let dots = [];

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  canvas.addEventListener(
    "mousemove",
    function(evt) {
      var mousePos = getMousePos(canvas, evt);
      mouseX = mousePos.x;
      mouseY = mousePos.y;
    },
    false
  );

  class Dot {
    constructor(x, y, rowNo, columnNo) {
      this.x = x;
      this.y = y;
      this.rowNo = rowNo;
      this.columnNo = columnNo;
      this.noOfConnections = 0;
      this.connectedTo = [];
      this.dotSize = 5;
      this.dotColor = "black";
    }

    draw() {
      // pulsating effect
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.dotSize, 0, 2 * Math.PI);
      ctx.fillStyle = this.dotColor;
      ctx.fill();
      ctx.closePath();
    }

    increaseDotSize() {
      this.dotSize++;
    }

    changeDotColor(color) {
      this.dotColor = color;
    }
  }

  class Pitch {
    constructor(x, y, spacing, noOfColumns, noOfRows) {
      this.x = x;
      this.y = y;
      this.originalX = x;
      this.originalY = y;
      this.spacing = spacing;
      this.noOfColumns = noOfColumns;
      this.noOfRows = noOfRows;
    }

    generateDots() {
      for (let r = 0; r < this.noOfRows; r++) {
        for (let c = 0; c < this.noOfColumns; c++) {
          ctx.moveTo(this.x, this.y);
          let dot = new Dot(this.x, this.y, r, c);
          dots.push(dot);
          this.x += this.spacing;
        }
        this.y += this.spacing;
        this.x = this.originalX;
      }
    }
  }

  let boisko = new Pitch(canvas.width / 3, canvas.width / 4, 30, 9, 10);
  boisko.generateDots();
  // HANDLE EVENTS

  function detectColisionWithCircle(radius, circleX, circleY, pointX, pointY) {
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

  function update() {
    // draw the dots
    for (let d = 0; d < dots.length; d++) {
      let dot = dots[d];

      if (detectColisionWithCircle(dot.dotSize, dot.x, dot.y, mouseX, mouseY)) {
        dot.increaseDotSize();
        dot.changeDotColor("red");
      }
      dot.draw();
    }
  }

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

  // GAME LOOP

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    update();

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
};
