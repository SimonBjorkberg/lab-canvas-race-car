const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const background = new Image();
const carImage = new Image();
carImage.src = "/images/car.png";
background.src = "/images/road.png";

class Asset {
  constructor(x, y, height, width) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.speedY = 0;
    this.speedX = 0;
  }
  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }

  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
}

// CAR
const car = new Asset(215, 500, 130, 70);
addEventListener("keydown", (e) => {
  if (e.keyCode === 39 && car.x < canvas.width - car.width) {
    car.x += 10;
  }
  if (e.keyCode === 37 && car.x > 0) {
    car.x += -10;
  }
});

// OBSTACLES
const obstacles = [];
function createObst() {
  const obstacle = new Asset(Math.random() * (canvas.width - 200), 0, 35, 250);
  obstacles.push(obstacle);
}

const timer = setInterval(createObst, 4000);

function moveObst(obst) {
  obst.y += 0.5;
}

function drawObst() {
  obstacles.forEach((obst) => {
    ctx.fillRect(obst.x, obst.y, obst.width, obst.height);
    moveObst(obst);
  });
}

// STOP GAME
let animationId;

function checkCollision() {
  const crashed = obstacles.some(function (obstacle) {
    return car.crashWith(obstacle);
  });

  if (crashed) {
    gameOver();
    cancelAnimationFrame(animationId);
  }
}

// POINTS
let score = 0;
function addPoints() {
  score++;
}
function points() {
  ctx.font = "20px roboto";
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${score}`, 350, 60);
}
const pointTimer = setInterval(addPoints, 400);

// EXECUTION
window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    canvas.style.backgroundImage = `url(${background.src})`;
    canvas.style.backgroundSize = "cover";
    ctx.drawImage(carImage, car.x, car.y, car.width, car.height);
    startGame();
  };
  function startGame() {
    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(carImage, car.x, car.y, car.width, car.height);
      checkCollision();
      drawObst();
      points();
      animationId = requestAnimationFrame(update);
    }
    update();
  }
};

// GAME OVER
function gameOver() {
  gameOverScreen();
  clearInterval(timer);
  clearInterval(pointTimer);
  cancelAnimationFrame(animationId);
  obstacles.length = 0;
  animationId = null;
}
