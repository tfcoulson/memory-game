// Grab the DOM elements
const joinButton = document.getElementById('joinButton');
const nameInput = document.getElementById('nameInput');
const nameEntry = document.getElementById('nameEntry');
const gameArea = document.getElementById('gameArea');
const playerNameElement = document.getElementById('playerName');
const gameBoard = document.getElementById('gameBoard');
const moveCount = document.getElementById('moveCount');
const timerElement = document.getElementById('timer');
const restartButton = document.getElementById('restartButton');

// Firebase setup
const database = getDatabase();

// Basic game variables
let moves = 0;
let timer;
let gameTime = 0; // Time in seconds
let cards = [];
let flippedCards = [];

// Game setup
const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const shuffledCards = [...cardValues, ...cardValues]; // Duplicate values for pairs

// Event listener for the "Join Game" button
joinButton.addEventListener('click', function() {
  const playerName = nameInput.value.trim();

  // Check if the name is not empty
  if (playerName === '') {
    alert("Please enter a name.");
    return;
  }

  // Save the player's name to Firebase
  const playerRef = ref(database, 'players/' + playerName);
  set(playerRef, {
    name: playerName,
    moves: 0,  // You can store more game details like moves, time, etc.
    time: 0
  }).then(() => {
    console.log('Player data saved to Firebase!');
  }).catch((error) => {
    console.error('Error saving data to Firebase:', error);
  });

  // Hide the name entry form
  nameEntry.style.display = 'none';

  // Show the game area
  gameArea.style.display = 'block';

  // Display the player's name in the game area
  playerNameElement.textContent = playerName;

  // Start the game
  startGame();
});

// Function to shuffle cards
function shuffleCards() {
  return shuffledCards.sort(() => Math.random() - 0.5);
}

// Function to create the game board
function createGameBoard() {
  const shuffled = shuffleCards();
  gameBoard.innerHTML = ''; // Clear the board

  shuffled.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.value = card;

    cardElement.addEventListener('click', () => flipCard(cardElement));

    gameBoard.appendChild(cardElement);
  });
}

// Function to flip cards
function flipCard(card) {
  if (flippedCards.length === 2 || card.classList.contains('flipped')) return;

  card.textContent = card.dataset.value;
  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    moveCount.textContent = moves;
    checkMatch();
  }
}

// Function to check if two cards match
function checkMatch() {
  const [firstCard, secondCard] = flippedCards;

  if (firstCard.dataset.value === secondCard.dataset.value) {
    flippedCards = [];
    if (document.querySelectorAll('.card.flipped').length === shuffledCards.length) {
      clearInterval(timer);
      alert("You won the game!");
    }
  } else {
    setTimeout(() => {
      firstCard.textContent = '';
      secondCard.textContent = '';
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}

// Timer function
function startTimer() {
  timer = setInterval(() => {
    gameTime++;
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    timerElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, 1000);
}

// Restart game
restartButton.addEventListener('click', () => {
  moves = 0;
  moveCount.textContent = moves;
  gameTime = 0;
  timerElement.textContent = '00:00';
  clearInterval(timer);
  flippedCards = [];
  createGameBoard();
  startTimer();
});

// Start the game
function startGame() {
  createGameBoard();
  startTimer();
}
