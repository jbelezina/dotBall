import { Game } from "./Game.js";
import Player from "./Player.js";
import Dot from "./Dot.js";
import Pitch from "./Pitch.js";
import {
  canvas,
  ctx,
  pitch,
  mouseX,
  mouseY,
  mouseClick,
  dots,
  moves,
  getMousePos,
  detectColisionWithCircle,
  clearMouseClick
} from "./Globals.js";

// set up the pitch and players

export let boisko = new Pitch(70, 80, 55, 13, 9);
boisko.generateDots();
boisko.drawBackground();
export let playerOne = new Player("Janek", "#ecc600");
export let playerTwo = new Player("Dzbanek", "#fd6400");

function frame() {
  Game.clear();
  Game.update();
  Game.render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
