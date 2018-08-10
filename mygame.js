window.onload = function() {
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  let mouseX;
  let mouseY;
  let mouseClick = {};
  let dots = [];
  let moves = [];

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
    turn: 1,
    ball: {
      rowNo: 5,
      columnNo: 4,
      x: 400,
      y: 300
    }
  };

  class Player {
    constructor(name, color) {
      this.name = name;
      this.color = color;
      this.moves = [];
    }
  }

  class Dot {
    constructor(x, y, rowNo, columnNo, dotSize, color) {
      this.x = x;
      this.y = y;
      this.rowNo = rowNo;
      this.columnNo = columnNo;
      this.noOfConnections = 0;
      this.connectedTo = [];
      this.dotSize = dotSize || 5;
      this.dotColor = color || "lightgray";
      this.pulseDirection = 1;
      this.isNeighbour = false;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.dotSize, 0, 2 * Math.PI);
      ctx.fillStyle = this.dotColor;
      ctx.fill();
      ctx.closePath();
    }

    selected() {
      this.dotSize = 15;
      game.turn === 1
        ? this.changeDotColor(playerOne.color)
        : this.changeDotColor(playerTwo.color);
    }

    drawNeighbour() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.dotSize + 5, 0, 2 * Math.PI);
      ctx.strokeStyle = "red";
      ctx.stroke();
      ctx.closePath();
      this.pulsate();
    }

    dotIsTarget() {
      if (
        this.rowNo === game.ball.rowNo &&
        this.columnNo === game.ball.columnNo
      ) {
        return true;
      } else {
        return false;
      }
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
      this.dotSize += 0.1;
    }

    decreaseDotSize() {
      this.dotSize -= 0.1;
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
      this.moves = [];
    }

    drawMoves() {
      this.moves.forEach(item => {
        ctx.beginPath();
        ctx.lineWidth = "5";
        ctx.strokeStyle = playerOne.color;
        ctx.moveTo(item.from[0], item.from[1]);
        ctx.lineTo(item.to[0], item.to[1]);
        ctx.stroke();
      });
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

  let boisko = new Pitch(canvas.width / 4, canvas.height / 12, 50, 9, 11);
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

      if (dot.dotIsTarget()) {
        dot.selected();
      } else if (dot.isNeighbour) {
        dot.pulsate();

        if (
          detectColisionWithCircle(
            // mousemove
            dot.dotSize + 2,
            dot.x,
            dot.y,
            mouseX,
            mouseY
          )
        ) {
          dot.draw();
        }
      } else {
        dot.inactive();
      }

      if (
        detectColisionWithCircle(
          //mouse click
          dot.dotSize + 2,
          dot.x,
          dot.y,
          mouseClick.x,
          mouseClick.y
        )
      ) {
        let newMove = {
          from: [game.ball.x, game.ball.y],
          to: [dot.x, dot.y]
        };
        boisko.moves.push(newMove);
        game.ball = {
          rowNo: dot.rowNo,
          columnNo: dot.columnNo,
          x: dot.x,
          y: dot.y
        };

        dots.forEach(dot => {
          dot.isNeighbour = false;
        });

        dots[d - 1].isNeighbour = true;
        dots[d - 1].dotSize = 5;
        dots[d - 1].pulsate();
        dots[d + 1].isNeighbour = true;
        dots[d + 1].dotSize = 5;
        dots[d - 10].isNeighbour = true;
        dots[d - 10].dotSize = 5;
        dots[d - 9].isNeighbour = true;
        dots[d - 9].dotSize = 5;
        dots[d - 8].isNeighbour = true;
        dots[d - 8].dotSize = 5;
        dots[d + 10].isNeighbour = true;
        dots[d + 10].dotSize = 5;
        dots[d + 9].isNeighbour = true;
        dots[d + 9].dotSize = 5;
        dots[d + 8].isNeighbour = true;
        dots[d + 8].dotSize = 5;
        mouseClick = {};
      }
    }
  }

  function render() {
    boisko.drawMoves();
    for (let d = 0; d < dots.length; d++) {
      let dot = dots[d];

      if (dot.isNeighbour) {
        dot.drawNeighbour();
      } else {
        dot.draw();
      }
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
