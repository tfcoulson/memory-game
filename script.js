import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const db = getDatabase();
const loginScreen = document.getElementById("login-screen");
const gameArea = document.getElementById("game-area");
const waitingRoom = document.getElementById("waiting-room");
const tipArea = document.getElementById("tip-area");
const joinBtn = document.getElementById("join-button");
const nameInput = document.getElementById("name");
const playersList = document.getElementById("players-list");

const gameQuestion = document.getElementById("game-question");
const memoryContent = document.getElementById("memory-content");
const answerSection = document.getElementById("answer-section");
const answerInput = document.getElementById("answer");
const submitBtn = document.getElementById("submit-answer");

let playerName = "";
let currentRound = 0;

const games = [
  {
    question: "MEMORISE THIS NUMBER:",
    content: "1945872",
    tip: "Chunking helps! Try remembering it as 194 - 587 - 2",
    answer: "1945872"
  },
  {
    question: "MEMORISE THESE WORDS:",
    content: "banana, lamp, rocket, shirt, violin, fox, bread",
    tip: "Make a silly story linking the items!",
    answer: "banana, lamp, rocket, shirt, violin, fox, bread"
  }
];

function showWaitingRoom() {
  loginScreen.classList.add("hidden");
  gameArea.classList.add("hidden");
  waitingRoom.classList.remove("hidden");
  updatePlayersList();
}

function updatePlayersList() {
  const playersRef = ref(db, "players");
  onValue(playersRef, (snapshot) => {
    const players = snapshot.val() || {};
    playersList.innerHTML = "<strong>Players:</strong><br>" + Object.keys(players).map(p => `${p} (${players[p].ready ? 'Ready' : '...'})`).join("<br>");
    checkAllReady(players);
  });
}

function checkAllReady(players) {
  const allReady = Object.values(players).every(p => p.ready);
  if (allReady) startGameRound();
}

function startGameRound() {
  const game = games[currentRound];
  if (!game) return;

  waitingRoom.classList.add("hidden");
  gameArea.classList.remove("hidden");
  tipArea.classList.add("hidden");

  gameQuestion.textContent = game.question;
  memoryContent.textContent = game.content;

  setTimeout(() => {
    answerSection.classList.remove("hidden");
  }, 10000);
}

submitBtn.addEventListener("click", () => {
  const answer = answerInput.value.trim();
  const correct = answer.toLowerCase() === games[currentRound].answer.toLowerCase();

  tipArea.textContent = `Tip: ${games[currentRound].tip}`;
  tipArea.classList.remove("hidden");
  gameArea.classList.add("hidden");
  waitingRoom.classList.remove("hidden");

  update(ref(db, `players/${playerName}`), { ready: true, answer });
  answerInput.value = "";
  currentRound++;
});

joinBtn.addEventListener("click", () => {
  playerName = nameInput.value.trim();
  if (!playerName) return;

  set(ref(db, `players/${playerName}`), { ready: false });
  showWaitingRoom();
});
