let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let bird, pipes = [], score = 0;
let gameSpeed = 2;
let isGameOver = false;

// Set canvas size to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Bird object (larger size)
bird = {
  x: 50,
  y: canvas.height / 2,
  width: 40,  // Increased bird size
  height: 40, // Increased bird size
  velocity: 0,
  gravity: 0.5,
  lift: -12,  // Slightly increased lift
  draw: function() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
  update: function() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // Prevent bird from going below the ground
    if (this.y + this.height >= canvas.height) {
      this.y = canvas.height - this.height;
      this.velocity = 0;
      if (!isGameOver) gameOver();
    }
  },
  flap: function() {
    this.velocity = this.lift;
  }
};

// Pipe object (with proper gaps between the walls)
function Pipe() {
  this.x = canvas.width;
  this.width = 50;  // Pipe width
  this.gap = 200;   // Gap between pipes (clear space to fly through)
  
  // Ensure pipes don't go too high or low, and the gap is big enough
  this.top = Math.random() * (canvas.height - this.gap - 100);
  this.bottom = canvas.height - (this.top + this.gap);

  this.draw = function() {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, 0, this.width, this.top);  // Top pipe
    ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);  // Bottom pipe
  };

  this.update = function() {
    this.x -= gameSpeed;  // Move pipes to the left
  };
}

// Create pipes at intervals with a larger gap
function createPipes() {
  // Create pipes at intervals (with enough space)
  if (Math.random() < 0.02) {
    pipes.push(new Pipe());
  }
}

// Check for collisions with pipes
function checkCollision() {
  pipes.forEach((pipe, index) => {
    // Check if the bird touches any part of the pipes
    if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width) {
      if (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom) {
        gameOver();
      }
    }
    // Remove pipes that have gone off-screen
    if (pipe.x + pipe.width < 0) {
      pipes.splice(index, 1);
      score++;
    }
  });
}

// Handle game over
function gameOver() {
  isGameOver = true;
  ctx.font = '30px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('Game Over!', canvas.width / 2 - 80, canvas.height / 2);
  ctx.fillText('Score: ' + score, canvas.width / 2 - 50, canvas.height / 2 + 40);
}

// Draw the score
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score, 10, 30);
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (isGameOver) return;

  bird.update();
  bird.draw();

  createPipes();
  pipes.forEach(pipe => {
    pipe.update();
    pipe.draw();
  });

  checkCollision();
  drawScore();

  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

// Event listener for bird flap
document.addEventListener('click', () => {
  if (isGameOver) {
    score = 0;
    pipes = [];
    isGameOver = false;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    gameLoop();
  } else {
    bird.flap();
  }
});

// Optional: Adjust canvas size when window is resized
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Reset bird position after resizing to prevent weird behavior
  bird.y = canvas.height / 2;
});
