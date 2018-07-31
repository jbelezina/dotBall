window.onload = function() {
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  let image = document.getElementById("zdjecie");

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

  class Enemy {
    constructor(x, y, velocity) {
      this.x = x;
      this.y = y;
      this.velocity = 2;
      this.direction = 1;
    }

    draw() {
      ctx.beginPath();
      ctx.rect(this.x, this.y, 40, 20);
      ctx.stroke();
    }

    move() {
      if (this.x + 40 === canvas.width) {
        this.direction = 0;
      } else if (this.x === 0) {
        this.direction = 1;
      }

      if (0 < this.x + 40 < canvas.width && this.direction === 1) {
        this.x += this.velocity;
      } else if (0 < this.x + 40 < canvas.width && this.direction === 0) {
        this.x -= this.velocity;
      }

      this.y += 0.1;
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
      this.x += 5;
    }

    moveLeft() {
      this.x -= 5;
    }

    moveUp() {
      this.y -= 5;
    }

    moveDown() {
      this.y += 5;
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

  function update() {
    // check for projectiles hitting the enemies

    let projectiles = playerOne.projectiles;
    if (projectiles.length > 0) {
      // collision detection
      for (let i = 0; i < playerOne.projectiles.length; i++) {
        for (let x = 0; x < enemies.length; x++) {
          if (playerOne.projectiles.length >= 1) {
            if (
              playerOne.projectiles[i]["x"] >= enemies[x]["x"] &&
              playerOne.projectiles[i]["x"] <= enemies[x]["x"] + 40 &&
              (playerOne.projectiles[i]["y"] < enemies[x]["y"] + 10 &&
                playerOne.projectiles[i]["y"] > enemies[x]["y"] - 10)
            ) {
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Update
    update();
    // Render
    render();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}; // end of window.onload()
