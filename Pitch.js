import { canvas, ctx, dots } from "./Globals.js";
import Dot from "./Dot.js";
import { Game } from "./Game.js";
import { playerOne, playerTwo } from "./index.js";

export default class Pitch {
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
          Game.ball = dot;
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
