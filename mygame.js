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
    blocked: false,
    winner: null,
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
    ballSize: 50,
    ballAnimation: 1,
    ballSpeed: 0.01,

    switchTurns() {
      if (this.playerTurn === 1) {
        this.playerTurn = 2;
      } else if (this.playerTurn === 2) {
        this.playerTurn = 1;
      }
      boisko.directionAnimation = true;
      boisko.startingAlpha = 0.5;
      console.log("reset alpha with switch turns");
      boisko.directionRightFrame = -250;
      boisko.directionLeftFrame = canvas.width + 50;
      return this.playerTurn;
    },

    startGame() {
      if (this.started === false) {
        this.started = true;
      }
    },

    drawBall() {
      console.log("drawing ball" + this.ballSize);
      ctx.drawImage(
        ball,
        this.ball.x - 25,
        this.ball.y - 25,
        this.ballSize,
        this.ballSize
      );

      if (this.ballSize >= 70) {
        this.ballAnimation = 0;
      } else if (this.ballSize <= 50) {
        this.ballAnimation = 1;
      }

      if (this.ballSize >= 50 && this.ballAnimation === 0) {
        this.ballSize--;
      }

      if (this.ballSize <= 80 && this.ballAnimation === 1) {
        this.ballSize++;
      }

      if (!game.started) {
        this.drawMessage("CLICK", 250, 260);
        this.drawMessage("THE BALL", 180, 400);
      }
    },

    drawMessage(message, x, y) {
      ctx.font = "100px Permanent Marker";
      ctx.fillStyle = "white";
      ctx.globalAlpha = 0.5;
      ctx.fillText(message, x, y);
      ctx.globalAlpha = 1;
    },

    winMessage() {
      this.drawMessage("PLAYER " + game.winner, 180, 260);
      this.drawMessage("WON", 265, 400);
    },

    blockMessage() {
      this.drawMessage("YOU ARE " + game.winner, 180, 260);
      this.drawMessage("BLOCKED!", 265, 400);
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
      this.neighbourhood = [];
      this.noOfConnections = 0;
      this.connectedTo = [];
      this.dotSize = dotSize || 5;
      this.dotColor = "white";
      this.pulseDirection = 1;
      this.isNeighbour = false;
    }

    draw() {
      ctx.beginPath();
      ctx.lineWidth = "8";
      ctx.arc(this.x, this.y, this.dotSize, 0, 2 * Math.PI);
      ctx.fillStyle = this.dotColor;
      ctx.fill();
      ctx.closePath();
    }

    selected() {
      this.dotSize = 30;
      game.playerTurn === 1
        ? this.changeDotColor(playerOne.color)
        : this.changeDotColor(playerTwo.color);
    }

    drawNeighbour() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.dotSize - 3, 0, 2 * Math.PI);
      ctx.fillStyle = "lightgrey";
      ctx.fill();
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
      this.directionAnimation = false;
      this.directionRightFrame = -250;
      this.directionLeftFrame = canvas.width + 50;
      this.startingAlpha = 0.5;
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

    drawDirectionLeft() {
      ctx.beginPath();
      ctx.moveTo(this.directionLeftFrame, canvas.height / 4);
      ctx.lineTo(this.directionLeftFrame - 50, canvas.height / 2);
      ctx.lineTo(this.directionLeftFrame, canvas.height - canvas.height / 4);
      ctx.lineTo(
        this.directionLeftFrame + 200,
        canvas.height - canvas.height / 4
      );
      ctx.lineTo(this.directionLeftFrame + 150, canvas.height / 2);
      ctx.lineTo(this.directionLeftFrame + 200, canvas.height / 4);
      ctx.closePath();
      ctx.fillStyle = "white";
      this.startingAlpha -= 0.003;
      ctx.globalAlpha = this.startingAlpha;
      ctx.fill();
      ctx.globalAlpha = 1;
      if (this.directionLeftFrame + 200 > 0) {
        this.directionLeftFrame -= 20;
      } else {
        this.directionLeftFrame = canvas.width + 50;
        this.directionAnimation = false;
      }
    }

    drawDirectionRight() {
      ctx.beginPath();
      ctx.moveTo(this.directionRightFrame, canvas.height / 4);
      ctx.lineTo(this.directionRightFrame + 50, canvas.height / 2);
      ctx.lineTo(this.directionRightFrame, canvas.height - canvas.height / 4);
      ctx.lineTo(
        this.directionRightFrame + 200,
        canvas.height - canvas.height / 4
      );
      ctx.lineTo(this.directionRightFrame + 250, canvas.height / 2);
      ctx.lineTo(this.directionRightFrame + 200, canvas.height / 4);
      ctx.lineTo(this.directionRightFrame, canvas.height / 4);
      ctx.fillStyle = "white";
      this.startingAlpha -= 0.003;
      ctx.globalAlpha = this.startingAlpha;
      ctx.fill();
      ctx.globalAlpha = 1;
      if (this.directionRightFrame < 800) {
        this.directionRightFrame += 20;
      } else {
        this.directionRightFrame = -250;
        this.directionAnimation = false;
        this.startingAlpha = 0.5;
      }
    }

    drawBackground() {
      ctx.drawImage(pitch, 50, 40);
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

          if (id === 0) {
            dot.neighbourhood = [dot.id + 1, dot.id + 13, dot.id + 14];
          } else if (id === 12) {
            dot.neighbourhood = [dot.id - 1, dot.id + 12, dot.id + 13];
          } else if (id === 104) {
            dot.neighbourhood = [dot.id + 1, dot.id - 13, dot.id - 12];
          } else if (id === 116) {
            dot.neighbourhood = [dot.id - 1, dot.id - 13, dot.id - 14];
          } else if (id <= 12 && id !== 0) {
            dot.neighbourhood = [
              dot.id - 1,
              dot.id + 1,
              dot.id + 12,
              dot.id + 13,
              dot.id + 14
            ];
          } else if (id > 103) {
            dot.neighbourhood = [
              dot.id + 1,
              dot.id - 1,
              dot.id - 12,
              dot.id - 13,
              dot.id - 14
            ];
          } else if (id % 13 === 0) {
            dot.neighbourhood = [
              dot.id + 1,
              dot.id - 12,
              dot.id - 13,
              dot.id + 13,
              dot.id + 14
            ];
            dot.noOfConnections = 3;
          } else if ((id + 1) % 13 === 0) {
            dot.neighbourhood = [
              dot.id - 1,
              dot.id - 13,
              dot.id - 14,
              dot.id + 12,
              dot.id + 13
            ];
            dot.noOfConnections = 3;
          } else {
            dot.neighbourhood = [
              dot.id - 1,
              dot.id + 1,
              dot.id - 12,
              dot.id - 13,
              dot.id - 14,
              dot.id + 12,
              dot.id + 13,
              dot.id + 14
            ];
          }

          dots.push(dot);
          this.x += this.spacing;
          id++;
        }
        this.y += this.spacing;
        this.x = this.originalX;
      }
    }
  }

  let boisko = new Pitch(70, 80, 55, 13, 9);
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
          boisko.directionAnimation = true;
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
          if (dot.id === 39 || dot.id === 52 || dot.id === 65) {
            game.winner = 1;
          }
          if (dot.id === 51 || dot.id === 64 || dot.id === 77) {
            game.winner = 2;
          }
          console.log("neigbourhood" + dot.neighbourhood);
          dot.noOfConnections++;
          game.ball.noOfConnections++;
          let newMove = {
            from: [game.ball.x, game.ball.y],
            to: [dot.x, dot.y],
            playerTurn: game.playerTurn
          };
          boisko.moves.push(newMove);

          if (dot.noOfConnections === 1) {
            console.log("1 connection dot");
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

          if (dot.noOfConnections === 8) {
            game.blocked = true;
          }

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
    if (game.playerTurn === 1 && boisko.directionAnimation) {
      boisko.drawDirectionLeft();
    } else if (game.playerTurn === 2 && boisko.directionAnimation) {
      boisko.drawDirectionRight();
    }
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
    if (game.winner) {
      game.winMessage();
    }
    if (game.blocked) {
      game.blockMessage();
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
