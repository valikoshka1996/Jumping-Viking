const gameContainer = document.getElementById("game-container");
const hero = document.getElementById("hero");
const scoreDisplay = document.getElementById("score");
const pauseButton = document.getElementById("pauseButton");
const resumeButton = document.getElementById("resumeButton");
const groundHeight = 10;
const heroHeight = 50;
const heroWidth = 30;
const gameWidth = gameContainer.offsetWidth;
const gameHeight = gameContainer.offsetHeight;

let score = 0;
let isJumping = false;
let obstacles = [];
let gameInterval;
let obstacleInterval;
let isPaused = false;

const jumpHeight = 100;  // Висота стрибка
const gravity = 2;  // Гравітація (швидкість падіння)

// Ініціалізація положення героя
hero.style.bottom = `${groundHeight}px`;

// Функція для стрибка
function jump() {
  if (isJumping || isPaused) return;  // Якщо вже стрибає або гра на паузі, не дозволяємо повторний стрибок
  isJumping = true;

  let bottomPosition = parseInt(hero.style.bottom);  // Поточна позиція героя
  let jumpUp = 0;
  const jumpTimer = setInterval(() => {
    if (jumpUp < jumpHeight) {
      bottomPosition += 2;
      hero.style.bottom = `${bottomPosition}px`;
      jumpUp += 2;
    } else {
      clearInterval(jumpTimer);
      let jumpDown = 0;
      const fallTimer = setInterval(() => {
        if (jumpDown < jumpHeight) {
          bottomPosition -= gravity;
          hero.style.bottom = `${bottomPosition}px`;
          jumpDown += gravity;
        } else {
          clearInterval(fallTimer);
          isJumping = false;
        }
      }, 10);
    }
  }, 10);
}

// Генерація перешкод
function generateObstacle() {
  if (isPaused) return; // Не генерувати перешкоди під час паузи

  const height = Math.random() * (heroHeight - 10) + 20;  // Висота перешкоди
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.style.height = `${height}px`;
  obstacle.style.left = `${gameWidth}px`;
  gameContainer.appendChild(obstacle);

  obstacles.push(obstacle);
}

// Перевірка на зіткнення
function checkCollision() {
  if (isPaused) return; // Не перевіряти зіткнення під час паузи

  obstacles.forEach(obstacle => {
    const heroRect = hero.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
      heroRect.left < obstacleRect.right &&
      heroRect.right > obstacleRect.left &&
      heroRect.bottom > obstacleRect.top &&
      heroRect.top < obstacleRect.bottom
    ) {
      clearInterval(gameInterval);
      clearInterval(obstacleInterval);
      alert("Гра закінчена! Ваш бал: " + score);
      location.reload();
    }
  });
}

// Оновлення позицій перешкод
function moveObstacles() {
  if (isPaused) return; // Не рухати перешкоди під час паузи

  obstacles.forEach(obstacle => {
    const currentLeft = parseInt(obstacle.style.left);
    if (currentLeft + obstacle.offsetWidth < 0) {
      obstacle.remove();
      obstacles = obstacles.filter(o => o !== obstacle);
      score++;
      scoreDisplay.textContent = "Бал: " + score;
    } else {
      obstacle.style.left = `${currentLeft - 2}px`;
    }
  });
}

// Основний ігровий цикл
function gameLoop() {
  moveObstacles();
  checkCollision();
}

// Запуск гри
function startGame() {
  gameInterval = setInterval(gameLoop, 10);
  obstacleInterval = setInterval(generateObstacle, 2000);  // Генерація перешкод кожні 2 секунди
}

// Функція для паузи гри
function pauseGame() {
  isPaused = true;
  pauseButton.style.display = "none";
  resumeButton.style.display = "inline-block";
  clearInterval(gameInterval);
  clearInterval(obstacleInterval);
}

// Функція для продовження гри
function resumeGame() {
  isPaused = false;
  pauseButton.style.display = "inline-block";
  resumeButton.style.display = "none";
  startGame();
}

// Керування за допомогою клавіші пробіл
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

// Обробка кнопки паузи
pauseButton.addEventListener("click", pauseGame);

// Обробка кнопки продовження
resumeButton.addEventListener("click", resumeGame);

startGame();
