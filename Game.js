import {
  ctx,
  canvas,
  dots,
  detectColisionWithCircle,
  mouseClick,
  clearMouseClick
} from "./Globals.js";
import { boisko } from "./index.js";

export let Game = {
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

    if (!Game.started) {
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
    this.drawMessage("PLAYER " + Game.winner, 180, 260);
    this.drawMessage("WON", 265, 400);
  },

  blockMessage() {
    this.drawMessage("YOU ARE " + Game.winner, 180, 260);
    this.drawMessage("BLOCKED!", 265, 400);
  },

  clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },

  update() {
    // draw the dots
    for (let d = 0; d < dots.length; d++) {
      let dot = dots[d];
      //click on ball to start the game

      if (dot.dotIsTarget() && Game.started === false) {
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
          Game.startGame();
          boisko.directionAnimation = true;
          dots.forEach((thatdot, index) => {
            if (dot.neighbourhood.indexOf(thatdot.id) != -1) {
              if (thatdot.id === Game.ball.id) {
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
          clearMouseClick();
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
          Game.started === true
        ) {
          if (dot.id === 39 || dot.id === 52 || dot.id === 65) {
            Game.winner = 1;
          }
          if (dot.id === 51 || dot.id === 64 || dot.id === 77) {
            Game.winner = 2;
          }
          dot.noOfConnections++;
          Game.ball.noOfConnections++;
          let newMove = {
            from: [Game.ball.x, Game.ball.y],
            to: [dot.x, dot.y],
            playerTurn: Game.playerTurn
          };
          boisko.moves.push(newMove);

          if (dot.noOfConnections === 1) {
            Game.switchTurns();
          }

          Game.ball.connectedTo.push(dot.id);
          dot.connectedTo.push(Game.ball.id);

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
            Game.blocked = true;
          }

          clearMouseClick();
          Game.ball = dot;
        }
      } else {
        dot.inactive();
        dot.draw();
      }
    }
  },

  render() {
    boisko.drawBackground();
    if (Game.playerTurn === 1 && boisko.directionAnimation) {
      boisko.drawDirectionLeft();
    } else if (Game.playerTurn === 2 && boisko.directionAnimation) {
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
      Game.ball.selected();
    }
    Game.drawBall();
    if (Game.winner) {
      Game.winMessage();
    }
    if (Game.blocked) {
      Game.blockMessage();
    }
  }
};
