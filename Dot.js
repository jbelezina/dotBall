import { Game } from "./Game.js";
import { ctx } from "./Globals.js";
import { playerOne, playerTwo } from "./index.js";

export default class Dot {
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
    Game.playerTurn === 1
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
      this.rowNo === Game.ball.rowNo &&
      this.columnNo === Game.ball.columnNo
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
      Game.turn === 1
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
