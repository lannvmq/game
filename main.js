const hero = document.getElementById('mario');
const blocks = document.querySelectorAll('.block');
const quests = document.querySelectorAll('[id^="quest"]');


let heroPosition = { x: 50, y: 130 }; 
const jumpHeight = 150; 
const heroSize = 150; 
let isJumping = false; 

let gameStarted = false;
let correctAnswers = 0;
const totalQuestions = quests.length;



function updateHeroPosition() {
  hero.style.left = `${heroPosition.x}px`;
  hero.style.bottom = `${heroPosition.y}px`;
}

function moveHero(direction) {
  if (direction === 'left' && heroPosition.x > 0) {
    heroPosition.x -= 10;
  }
  if (direction === 'right' && heroPosition.x < window.innerWidth - heroSize) {
    heroPosition.x += 10;
  }
  updateHeroPosition();
}


function jumpHero() {
  if (isJumping) return;
  isJumping = true;

  const initialY = heroPosition.y;
  heroPosition.y += jumpHeight;
  updateHeroPosition();

  setTimeout(() => {
    
    if (!checkCollisionWithBlocks()) {
      returnToGround();
    }
    isJumping = false;
    checkCollisionWithQuests();
  }, 500);
}


function checkCollisionWithBlocks() {
  let landedOnBlock = false;

  blocks.forEach(block => {
    const blockRect = block.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();

    if (
      heroRect.bottom >= blockRect.top &&
      heroRect.top <= blockRect.bottom &&
      heroRect.left < blockRect.right &&
      heroRect.right > blockRect.left
    ) {
      const blockBottom = parseInt(getComputedStyle(block).bottom);
      heroPosition.y = blockBottom + heroSize;
      updateHeroPosition();
      landedOnBlock = true;
    }
  });

  return landedOnBlock;
}


function checkCollisionWithQuests() {
  quests.forEach((quest, index) => {
    if (quest.style.display === 'none') return; 

    const questRect = quest.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();

    if (
      heroRect.top <= questRect.bottom &&
      heroRect.bottom >= questRect.top &&
      heroRect.left < questRect.right &&
      heroRect.right > questRect.left
    ) {
      const question = questions[index]; 
      const userAnswer = prompt(`${question.text}\n${question.options.join('\n')}`);
      if (userAnswer && userAnswer.toLowerCase() === question.correct.toLowerCase()) {
        alert('Poprawnie!');
        quest.style.display = 'none';
        correctAnswers++;

        if (correctAnswers === totalQuestions) {
          setTimeout(endGame, 500); 
        }
      } else {
        alert('Niepoprawnie. Spróbuj ponownie!');
      }
    }
  });
}



function returnToGround() {
  let landed = false;
  const groundY = window.innerHeight * 0.12;

  blocks.forEach(block => {
    const blockRect = block.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();

    if (
      heroRect.bottom > blockRect.top &&
      heroRect.left < blockRect.right &&
      heroRect.right > blockRect.left &&
      heroRect.top < blockRect.bottom
    ) {
      const blockBottom = parseInt(getComputedStyle(block).bottom);
      heroPosition.y = blockBottom + heroSize;
      landed = true;
    }
  });

  if (!landed) {
    heroPosition.y = groundY;
  }

  updateHeroPosition();
}



const questions = [
  { text: 'Ile to będzie 2 + 2?', options: ['3', '4', '5'], correct: '4' },
  { text: 'Czym jest CSS?', options: ['Język stylów', 'Kod', 'Obraz'], correct: 'Język stylów' },
  { text: 'Który tag jest używany dla nagłówków?', options: ['div', 'h1', 'p'], correct: 'h1' },
  { text: 'Ile to będzie 7 * 7?', options: ['49', '56', '48'], correct: '49' },
  { text: 'Czym jest JavaScript?', options: ['Język stylów', 'Język programowania', 'Obraz'], correct: 'Język programowania' }
];


document.addEventListener('keydown', event => {
  switch (event.code) {
    case 'ArrowLeft':
      moveHero('left');
      break;
    case 'ArrowRight':
      moveHero('right');
      break;
    case 'ArrowUp':
      jumpHero();
      break;
    case 'ArrowDown':
      returnToGround();
      break;
  }
});

function startGame() {
  document.getElementById('startScreen').style.display = 'none';
  gameStarted = true;
}

function endGame() {
  document.getElementById('endScreen').style.display = 'flex';
  gameStarted = false;
}

function restartGame() {
  window.location.reload();
}
