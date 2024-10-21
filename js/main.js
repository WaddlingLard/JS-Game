// set up canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// New Shape Class (only has a constructor)
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// New game element! Spawns in balls
class Spawner extends Shape {
  constructor(x, y) {
    super(x, y, 0, 0); // Non-moving
    this.color = "rgb(75 180 75)";
    this.size = 25;
    this.exists = true;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);

    ctx.fillStyle = "rgb(255 50 50)";
    ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.size / 4, 0, 2 * Math.PI);
    ctx.fill();
  }

  collides() {
    const size = random(10, 20);
    const ball = new Ball (
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-3, 3),
      random(-3, 3),
      randomRGB(),
      size
    );

    balls.push(ball);
    currentBalls++;
  }
}

// Game element that 'deletes' items in a radius from the bomb
// class Bomb extends Shape {
//   constructor(x, y, color, size) {
//     super (x, y, 0, 0);
//     this.color = color;
//     this.size = size;
//   }

//   draw() {
//     ctx.beginPath();
//     ctx.fillStyle = this.color;
//     ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
//     ctx.fill();
//   }

//   collides() {

//   }
// }

class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= width) {
      this.velX = -Math.abs(this.velX);
    }

    if (this.x - this.size <= 0) {
      this.velX = Math.abs(this.velX);
    }

    if (this.y + this.size >= height) {
      this.velY = -Math.abs(this.velY);
    }

    if (this.y - this.size <= 0) {
      this.velY = Math.abs(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists === true) { // Modified if-statement
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

class EvilCircle extends Shape {
  constructor(x, y) {
    // super(x, y, 20, 20); // Hardcoded velX, velY
    super(x, y, 10, 10);
    this.color = "white";
    this.size = 10;
    this.exists = false;
    let keySequence = [];

    window.addEventListener("keydown", (e) => {
      if (e.key === 'a' || e.key === 'd' || e.key === 's' || e.key === 'w') {
        keySequence[e.key] = true;  // setting key press on w a s or d
      }

      if (keySequence.length === 1) {} // Check for diagonal movement
        if (keySequence['w'] && keySequence['a'] && keySequence['s'] && keySequence['d']) { // all pressed
        } else if (keySequence['w'] && keySequence['s']) { // opposite directions
          if (keySequence['a']) {
            this.x -= this.velX;
          } else if (keySequence['d']){
            this.x += this.velX;
          }
        } else if (keySequence['a'] && keySequence['d']) { // opposite directions
          if (keySequence['w']) {
            this.y -= this.velY;
          } else if (keySequence['s']){
            this.y += this.velY;
          }
        } else if (keySequence['w'] && keySequence['a']) { // moving up and left
          this.x -= this.velX * .75;
          this.y -= this.velY * .75;
        } else if (keySequence['w'] && keySequence['d']) { // moving up and right
          this.x += this.velX * .75;
          this.y -= this.velY * .75;
        } else if (keySequence['s'] && keySequence['a']) { // right down and left
          this.x -= this.velX * .75;
          this.y += this.velY * .75;
        } else if (keySequence['s'] && keySequence['d']) { // moving down and right
          this.x += this.velX * .75;
          this.y += this.velY * .75;
        }
      else { // Single direction
        switch (e.key) {
          case "a":
            this.x -= this.velX;
            break;
          case "s":
            this.y += this.velY;
            break;
          case "d":
            this.x += this.velX;
            break;
          case "w":
            this.y -= this.velY;
            break;
        }
      }
    })

    window.addEventListener("keyup", (e) => { // resetting what movement keys are no longer pushed
      if (keySequence[e.key] == null) {
      } else {
        keySequence[e.key] = false;
      }
    })

    window.addEventListener("click", (e) => { // Initalize position
      if (this.exists === false) {
        this.x = e.x; 
        this.y = e.y - 60; // accounting for canvas offset
        this.exists = true;
      }

    })
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color; // Using strokeStyle as opposed to fillStyle
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if (this.x + this.size >= width) {
      this.x -= this.size;
    }

    if (this.x - this.size <= 0) {
      this.x += this.size;
    }

    if (this.y + this.size >= height - 60) { // accounting for canvas offset
      this.y -= this.size;
    }

    if (this.y - this.size <= 0) {
      this.y += this.size;
    }
  }

  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists === true) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false;
          currentBalls--;
          ballsEaten++;
          this.bulk();
        }
      }
    }

    for (const spawner of spawners) {
      if (spawner.exists === true) {
        const dx = this.x - spawner.x;
        const dy = this.y - spawner.y;
        const distance = Math.sqrt(dx * dx + dy * dy); // Need to implement more accurate method

        if (distance < this.size + spawner.size) {
          spawner.exists = false;
          spawner.collides();
        }
      }
    }
  }

  bulk() {
    this.size = this.size + 1;
  }

}

const balls = [];
const spawners = [];
const evilBall = new EvilCircle(0, 0);
let currentBalls = 0;
let ballsEaten = 0;

const score = document.querySelector("#score");
const eaten = document.querySelector("#eaten");
const button = document.querySelector("#reset");

button.addEventListener("click", handler);

function handler() {
  window.location.reload(); // Reloads the webpage
}

function reset() {
  if (balls.length < 1) {
    balls.pop();
  }
  if (spawners.length < 1) {
    spawners.pop();
  }
  // evilBall = new EvilCircle(random(0, width), random(0, height));

  while (balls.length < 25) {
    while (spawners.length < 10) {
      const spawner = new Spawner(
        random(25, width - 25),
        random(25, height -25)
      )
      spawners.push(spawner);
    }
    const size = random(10, 20);
    const ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      random(0 + size, width - size),
      random(0 + size, height - size),
      // random(-7, 7),
      // random(-7, 7),
      random(-3, 3), // Makes things slower
      random(-3, 3),
      // 0, // Testing purposes
      // 0,
      randomRGB(),
      size
    );
  
    balls.push(ball);
    currentBalls++;
  }
}

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);
  for (const spawner of spawners) {
    if (spawner.exists === true) {
      spawner.draw();
    }
  }

  for (const ball of balls) {
    if (ball.exists === true) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
    
    if (evilBall.exists === true) {
      evilBall.draw();
      evilBall.checkBounds();
      evilBall.collisionDetect();
    }
  }
  score.innerHTML = "Score: " + currentBalls;
  eaten.innerHTML = "Eaten: " + ballsEaten;
  requestAnimationFrame(loop);
}

reset();
loop();