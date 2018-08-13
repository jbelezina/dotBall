window.onload = function() {
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  let pitch = document.getElementById("pitch");
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
    started: false,
    playerTurn: 1,
    dontSwitchTurns: false,
    ballImg: document.getElementById("ball"),
    ball: {
      rowNo: 5,
      columnNo: 4,
      x: 400,
      y: 300
    },

    switchTurns() {
      if (this.playerTurn === 1) {
        this.playerTurn = 2;
      } else {
        this.playerTurn = 1;
      }
      console.log("switching player turns to" + this.playerTurn);
      return this.playerTurn;
    },

    startGame() {
      if (this.started === false) {
        this.started = true;
      }
    },

    drawBall() {
      ctx.drawImage(ball, this.ball.x - 25, this.ball.y - 25, 50, 50);
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
    constructor(id, x, y, rowNo, columnNo, dotSize, color) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.rowNo = rowNo;
      this.columnNo = columnNo;
      this.neighbourhood = [
        this.id - 1,
        this.id + 1,
        this.id - 9,
        this.id - 8,
        this.id - 10,
        this.id + 8,
        this.id + 9,
        this.id + 10
      ];
      this.noOfConnections = 0;
      this.connectedTo = [];
      this.dotSize = dotSize || 5;
      this.dotColor = "white";
      this.pulseDirection = 1;
      this.isNeighbour = false;
    }

    draw() {
      ctx.beginPath();
      ctx.lineWidth = "4";
      ctx.arc(this.x, this.y, this.dotSize, 0, 2 * Math.PI);
      ctx.fillStyle = this.dotColor;
      ctx.fill();
      ctx.closePath();
    }

    selected() {
      this.dotSize = 25;
      game.playerTurn === 1
        ? this.changeDotColor(playerOne.color)
        : this.changeDotColor(playerTwo.color);
    }

    drawNeighbour() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.dotSize, 0, 2 * Math.PI);
      ctx.strokeStyle = "lightgrey";
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

    isConnectedTo(dot) {
      if (this.connectedTo.indexOf(dot.id) != -1) {
        return true;
      } else {
        return false;
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
        if (item.playerTurn === 1) {
          ctx.strokeStyle = playerOne.color;
        } else if (item.playerTurn === 2) {
          ctx.strokeStyle = playerTwo.color;
        }
        ctx.moveTo(item.from[0], item.from[1]);
        ctx.lineTo(item.to[0], item.to[1]);
        ctx.stroke();
      });
    }

    drawBackground() {
      ctx.drawImage(pitch, 172, -6);
    }

    generateDots() {
      let id = 0;

      for (let r = 0; r < this.noOfRows; r++) {
        for (let c = 0; c < this.noOfColumns; c++) {
          ctx.moveTo(this.x, this.y);
          let dot = new Dot(id, this.x, this.y, r, c, 5, "green");
          if (id === 58) {
            game.ball = dot;
          }
          dots.push(dot);
          id++;
          this.x += this.spacing;
        }
        this.y += this.spacing;
        this.x = this.originalX;
      }
    }
  }

  let boisko = new Pitch(208, 12, 48, 9, 13);
  boisko.generateDots();
  boisko.drawBackground();
  let playerOne = new Player("Janek", "#ecc600");
  let playerTwo = new Player("Janek", "#fd6400");
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
      //click on ball to start the game
      if (dot.dotIsTarget() && game.started === false) {
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
          game.startGame();

          dots.forEach((thatdot, index) => {
            if (dot.neighbourhood.indexOf(thatdot.id) != -1) {
              if (thatdot.id === game.ball.id) {
                dot.selected();
              }
              if (thatdot.isConnectedTo(dot)) {
                thatdot.isNeighbour = false;
                thatdot.dotSize = 5;
              } else {
                thatdot.isNeighbour = true;
                thatdot.dotSize = 5;
              }
            }
          });
          mouseClick = {};
        }
      }

      if (dot.isNeighbour) {
        if (
          detectColisionWithCircle(
            //mouse click
            dot.dotSize + 2,
            dot.x,
            dot.y,
            mouseClick.x,
            mouseClick.y
          ) &&
          game.started === true
        ) {
          if (dot.id >= 3 && dot.id <= 5) {
            alert("Player" + game.playerTurn + " WON!!!!");
          }

          if (dot.id >= 111 && dot.id <= 113) {
            alert("Player" + game.playerTurn + " WON!!!!");
          }

          dot.noOfConnections++;
          game.ball.noOfConnections++;

          let newMove = {
            from: [game.ball.x, game.ball.y],
            to: [dot.x, dot.y],
            playerTurn: game.playerTurn
          };
          boisko.moves.push(newMove);

          if (dot.noOfConnections === 1) {
            game.switchTurns();
          }

          game.ball.connectedTo.push(dot.id);
          dot.connectedTo.push(game.ball.id);

          dots.forEach(dot => {
            dot.isNeighbour = false;
          });

          dots.forEach((thatdot, index) => {
            if (dot.neighbourhood.indexOf(thatdot.id) != -1) {
              // iterate thrugh neighbours to check if they are connected and if so isNeihgbour is false
              if (thatdot.noOfConnections > 7) {
                thatdot.isNeighbour = false;
                thatdot.dotSize = 5;
              } else if (thatdot.isConnectedTo(dot)) {
                thatdot.isNeighbour = false;
                thatdot.dotSize = 5;
              } else if (
                !thatdot.isConnectedTo(dot) &&
                thatdot.noOfConnections > 8
              ) {
                thatdot.isNeighbour = true;
                thatdot.dotSize = 5;
              } else {
                thatdot.isNeighbour = true;
                thatdot.dotSize = 5;
              }
            }
          });

          mouseClick = {};
          game.ball = dot;
        }
      } else {
        dot.inactive();
        dot.draw();
      }
    }
  }

  function render() {
    boisko.drawBackground();
    boisko.drawMoves();
    for (let d = 0; d < dots.length; d++) {
      let dot = dots[d];
      if (dot.isNeighbour) {
        dot.pulsate();
        dot.drawNeighbour();
      } else {
        dot.draw();
      }
      game.ball.selected();
    }
    game.drawBall();
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
