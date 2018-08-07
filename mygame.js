window.onload = function() {
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  let mouseX;
  let mouseY;
  let mouseClick = {};
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

  let game = {
    turn: 2,
    ball: {}
  };

  class Player {
    constructor(name, color) {
      this.name = name;
      this.color = color;
      this.moves = [];
    }
  }

  class Dot {
    constructor(x, y, rowNo, columnNo) {
      this.x = x;
      this.y = y;
      this.rowNo = rowNo;
      this.columnNo = columnNo;
      this.noOfConnections = 0;
      this.connectedTo = [];
      this.dotSize = 5;
      this.dotColor = "lightgray";
      this.pulseDirection = 1;
    }

    draw() {
      // pulsating effect
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.dotSize, 0, 2 * Math.PI);
      ctx.fillStyle = this.dotColor;
      ctx.fill();
      ctx.closePath();
    }

    selected() {
      this.dotSize = 20;
      game.turn === 1
        ? this.changeDotColor(playerOne.color)
        : this.changeDotColor(playerTwo.color);
    }

    pulsate() {
      if (this.dotSize === 5) {
        this.dotSize = 10;
        this.pulseDirection = 1;
        game.turn === 1
          ? (this.dotColor = playerOne.color)
          : (this.dotColor = playerTwo.color);
      }

      if (this.pulseDirection === 1) {
        if (this.dotSize < 15) {
          this.increaseDotSize();
        } else if (this.dotSize >= 15) {
          this.decreaseDotSize();
          this.pulseDirection = 0;
        }
      } else if (this.pulseDirection === 0) {
        if (this.dotSize > 10) {
          this.decreaseDotSize();
        } else if (this.dotSize <= 10) {
          this.increaseDotSize();
          this.pulseDirection = 1;
        }
      }
    }

    inactive() {
      this.dotSize = 5;
      this.dotColor = "lightgrey";
    }

    increaseDotSize() {
      this.dotSize += 0.3;
    }

    decreaseDotSize() {
      this.dotSize -= 0.3;
    }

    incrementPulseFrame() {
      this.pulseFrame++;
    }

    decrementPulseFrame() {
      this.pulseFrame--;
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

  let boisko = new Pitch(50, 50, 50, 9, 11);
  boisko.generateDots();
  let playerOne = new Player("Janek", "lightgreen");
  let playerTwo = new Player("Janek", "lightyellow");
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

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function update() {
    // draw the dots
    for (let d = 0; d < dots.length; d++) {
      let dot = dots[d];

      if (dot.x === game.ball.rowNo && dot.y === game.ball.columnNo) {
        dot.selected();
      }

      if (
        detectColisionWithCircle(
          // check if mousover
          dot.dotSize + 2,
          dot.x,
          dot.y,
          mouseX,
          mouseY
        ) &&
        (dot.x !== game.ball.rowNo && dot.y !== game.ball.columnNo)
      ) {
        dot.pulsate();
      } else {
        if (dot.x === game.ball.rowNo && dot.y === game.ball.columnNo) {
          dot.selected();
        } else {
          dot.inactive();
        }
      }

      if (
        detectColisionWithCircle(
          // check if click
          dot.dotSize + 2,
          dot.x,
          dot.y,
          mouseClick.x,
          mouseClick.y
        )
      ) {
        console.log("clicked" + dot.rowNo + dot.columnNo);
        game.ball = {
          row: dot.rowNo,
          column: dot.columnNo
        };
        mouseClick = {};
      }
    }
  }

  function render() {
    for (let d = 0; d < dots.length; d++) {
      let dot = dots[d];
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
    clear();
    update();
    render();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
};
