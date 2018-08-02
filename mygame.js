window.onload = function() {
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  let image = document.getElementById("zdjecie");
  let explosion = document.getElementById("explosion");

  ctx.save();

  class Background {
    constructor(x, y, image) {
      this.x = x;
      this.y = y;
    }

    move() {
      this.y += 1;
    }

    draw() {
      ctx.drawImage(image, this.x, this.y, canvas.width, canvas.height);
    }
  }

  class Explosion {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.imgXY = [
        [0, 0],
        [100, 0],
        [200, 0],
        [300, 0],
        [400, 0],
        [500, 0],
        [600, 0],
        [700, 0],
        [800, 0],
        [0, 100],
        [100, 100],
        [200, 100],
        [300, 100],
        [400, 100],
        [500, 100],
        [600, 100],
        [700, 100],
        [800, 100],
        [0, 200],
        [100, 200],
        [200, 200],
        [300, 200],
        [400, 200],
        [500, 200],
        [600, 200],
        [700, 200],
        [800, 200],
        [0, 300],
        [100, 300],
        [200, 300],
        [300, 300],
        [400, 300],
        [500, 300],
        [600, 300],
        [700, 300],
        [800, 300],
        [0, 100],
        [100, 400],
        [200, 400],
        [300, 400],
        [400, 400],
        [500, 400],
        [600, 400],
        [700, 400],
        [800, 400],
        [0, 500],
        [100, 500],
        [200, 500],
        [300, 500],
        [400, 500],
        [500, 500],
        [600, 500],
        [700, 500],
        [800, 500],
        [0, 600],
        [100, 600],
        [200, 600],
        [300, 600],
        [400, 600],
        [500, 600],
        [600, 600],
        [700, 600],
        [800, 600],
        [0, 700],
        [100, 700],
        [200, 700],
        [300, 700],
        [400, 700],
        [500, 700],
        [600, 700],
        [700, 700],
        [800, 700]
      ];
      this.frame = 0;
      this.sourceWidth = 100;
      this.sourceHeight = 100;
      this.destinationWidth = 50;
      this.destinationHeight = 50;
    }

    draw(x, y) {
      ctx.drawImage(
        explosion,
        this.imgXY[this.frame][0],
        this.imgXY[this.frame][1],
        this.sourceWidth,
        this.sourceHeight,
        this.x,
        this.y,
        this.destinationWidth,
        this.destinationHeight
      );

      if (this.frame < 71) {
        this.frame += 1;
      } else if (this.frame >= 71) {
        this.frame = 0;
      }
    }
  }

  class Enemy {
    constructor(x, y, velocity) {
      this.x = x;
      this.y = y;
      this.velocityX = 2;
      this.velocityY = 0.2;
      this.directionX = 1;
      this.directionY = 1;
    }

    draw() {
      ctx.beginPath();
      ctx.rect(this.x, this.y, 40, 20);
      ctx.stroke();
    }

    move() {
      if (this.x + 40 >= canvas.width) {
        this.directionX = 0;
      } else if (this.x === 0) {
        this.directionX = 1;
      }

      if (this.x + 40 < canvas.width && this.directionX === 1) {
        this.x += this.velocityX;
      } else if (0 < this.x + 40 < canvas.width && this.directionX === 0) {
        this.x -= this.velocityX;
      }

      if (this.y <= 0 && this.directionY === 0) {
        this.directionY = 1;
      } else if (this.y + 20 >= canvas.height && this.directionY === 1) {
        this.directionY = 0;
      }

      if (this.directionY === 1) {
        this.y += this.velocityY;
      } else if (this.directionY === 0) {
        this.y -= this.velocityY;
      }
    }
  }

  class Projectile {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
      ctx.stroke();
    }

    move() {
      this.y -= 1;
    }
  }

  class Plane {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.projectiles = [];
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.x + 10, this.y + 25);
      ctx.lineTo(this.x, this.y);
      ctx.lineTo(this.x - 10, this.y + 25);
      ctx.strokeStyle = this.color;
      ctx.stroke();
      ctx.closePath();
      if (this.projectiles.length > 0) {
        for (let x = 0; x < this.projectiles.length; x++) {
          this.projectiles[x].draw();
          this.projectiles[x].move();
        }
      }
    }

    moveRight() {
      if (this.x <= canvas.width - 15) {
        this.x += 5;
      }
    }

    moveLeft() {
      if (this.x >= 15) {
        this.x -= 5;
      }
    }

    moveUp() {
      if (this.y > 0) {
        this.y -= 5;
      }
    }

    moveDown() {
      if (this.y + 25 < canvas.height) {
        this.y += 5;
      }
    }

    shoot() {
      let projectile = new Projectile(this.x, this.y - 5);
      this.projectiles.push(projectile);
    }
  }

  let playerOne = new Plane(canvas.width / 2, canvas.height - 40, "red");
  let enemies = [];

  function spawnEnemies() {
    let enemiesArr = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    let enemyX = 10;
    let enemyY = 10;
    enemiesArr.forEach(() => {
      let enemy = new Enemy(enemyX, enemyY);
      enemies.push(enemy);
      enemyX += 50;
      enemyY += 10;
    });
  }

  spawnEnemies();
  let backgrounds = [];
  let backgroundOne = new Background(0, 0, image);
  backgrounds.push(backgroundOne);
  let backgroundTwo = new Background(0, backgroundOne.y - canvas.height, image);
  backgrounds.push(backgroundTwo);
  let backgroundThree = new Background(
    0,
    backgroundTwo.y - canvas.height,
    image
  );
  backgrounds.push(backgroundThree);
  let explosions = [];

  function update() {
    // check for projectiles hitting the enemies

    let projectiles = playerOne.projectiles;
    if (projectiles.length > 0) {
      // collision detection
      for (let i = 0; i < playerOne.projectiles.length; i++) {
        for (let x = 0; x < enemies.length; x++) {
          if (
            playerOne.projectiles.length >= 1 &&
            playerOne.projectiles[i]["x"]
          ) {
            if (
              playerOne.projectiles[i]["x"] >= enemies[x]["x"] &&
              playerOne.projectiles[i]["x"] <= enemies[x]["x"] + 40 &&
              (playerOne.projectiles[i]["y"] - 15 < enemies[x]["y"] + 10 &&
                playerOne.projectiles[i]["y"] + 15 > enemies[x]["y"] - 10)
            ) {
              let explosion = new Explosion(
                playerOne.projectiles[i]["x"] - 30,
                playerOne.projectiles[i]["y"] - 30
              );
              explosions.push(explosion);
              enemies.splice(x, 1);
              playerOne.projectiles.splice(i, 1);
            }
          }
        }
      }
    }
    // spawn enemies if projectile misses
    if (projectiles.length > 0) {
      for (let i = 0; i < playerOne.projectiles.length; i++) {
        if (playerOne.projectiles[i]["y"] === 0) {
          console.log("hit");
          let y = playerOne.projectiles[i]["y"];
          let x = playerOne.projectiles[i]["x"];
          let enemy = new Enemy(x, y);
          enemies.push(enemy);
          playerOne.projectiles.splice(i, 1);
        }
      }
    }

    // rendering the background
    if (backgrounds[1].y >= canvas.height) {
      backgrounds[0].y = backgrounds[2].y - canvas.height;
      let first = backgrounds.shift();
      backgrounds.push(first);
    }
    backgroundOne.move();
    backgroundTwo.move();
    backgroundThree.move();
  } // end of update

  function render() {
    backgroundOne.draw();
    backgroundTwo.draw();
    backgroundThree.draw();
    playerOne.draw();
    enemies.forEach(enemy => {
      enemy.draw();
      enemy.move();
    });
    if (enemies.length === 0) {
      ctx.font = "80px Arial";
      ctx.strokeText("YOU WON!", 30, canvas.height / 2);
    }

    for (let q = 0; q < explosions.length; q++) {
      let explosion = explosions[q];
      if (explosion.frame >= 71) {
        explosions.splice(q, 1);
      } else {
        explosion.draw();
      }
    }
  }

  // HANDLE EVENTS

  window.addEventListener(
    "keydown",
    function(event) {
      switch (event.keyCode) {
        case 37: // Left
          playerOne.moveLeft();
          break;

        case 38: // Up
          playerOne.moveUp();
          break;

        case 39: // Right
          playerOne.moveRight();
          break;

        case 40: // Down
          playerOne.moveDown();
          break;

        case 32: // Down
          playerOne.shoot();
          break;
      }
    },
    false
  );
  // GAME LOOP
  function frame() {
    // Clear
    console.log("frame");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Update
    update();
    // Render
    render();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}; // end of window.onload()
