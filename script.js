const cardsArray = [
  "🍎", "🍌", "🍇", "🍉", "🍒", "🍓", "🍑", "🍍",
  "🍎", "🍌", "🍇", "🍉", "🍒", "🍓", "🍑", "🍍"
];

let gameBoard = document.getElementById("gameBoard");
let levelDisplay = document.getElementById("level");

let mode = "memoryGame"; // To track the game mode
let sequence = [];
let playerSequence = [];
let level = 1;

// Shuffle function
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Restart the game
function restartGame() {
  level = 1;
  levelDisplay.innerText = level;
  if (mode === "memoryGame") {
    startMemoryGame();
  } else {
    startMemorySpan();
  }
}

// Start Memory Match mode
function startMemoryGame() {
  mode = "memoryGame";
  level = 1;
  levelDisplay.innerText = level;
  gameBoard.innerHTML = '';
  setupMemoryMatch();
}

// Start Memory Span mode
function startMemorySpan() {
  mode = "memorySpan";
  level = 1;
  levelDisplay.innerText = level;
  gameBoard.innerHTML = '';
  setupMemorySpan();
}

// Memory Match game setup
function setupMemoryMatch() {
  let moves = 0;
  let flippedCards = [];
  let matchedPairs = 0;
  const shuffledCards = shuffle([...cardsArray]);

  shuffledCards.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.innerText = ""; // Initially hide the emoji
    card.addEventListener("click", function () {
      if (flippedCards.length === 2 || card.classList.contains("matched")) return;

      card.classList.add("flip");
      card.innerText = symbol;
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        moves++;
        if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
          flippedCards.forEach(card => card.classList.add("matched"));
          matchedPairs++;
          if (matchedPairs === cardsArray.length / 2) {
            setTimeout(() => alert("Congratulations! You've won the game!"), 300);
          }
          flippedCards = [];
        } else {
          setTimeout(() => {
            flippedCards.forEach(card => {
              card.classList.remove("flip");
              card.innerText = "";
            });
            flippedCards = [];
          }, 1000);
        }
      }
    });
    gameBoard.appendChild(card);
  });
}

// Memory Span game setup
function setupMemorySpan() {
  sequence = [];
  playerSequence = [];
  gameBoard.innerHTML = '';

  // Create the card grid for span mode
  const shuffledCards = shuffle([...cardsArray]).slice(0, 8); // Use only 8 unique symbols
  shuffledCards.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.innerText = "";
    card.addEventListener("click", handleCardClickSpan);
    gameBoard.appendChild(card);
  });

  // Start level 1 sequence
  showSequence();
}

// Display the sequence to the player
function showSequence() {
  const cards = Array.from(document.querySelectorAll(".card"));
  sequence.push(cards[Math.floor(Math.random() * cards.length)]); // Add a random card to sequence

  let delay = 500;
  sequence.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("flip");
      card.innerText = card.dataset.symbol;
    }, delay * (index + 1));

    setTimeout(() => {
      card.classList.remove("flip");
      card.innerText = "";
    }, delay * (index + 1) + 500);
  });
}

// Handle player card selection in Memory Span mode
function handleCardClickSpan() {
  if (playerSequence.length >= sequence.length) return; // Prevent extra clicks

  this.classList.add("flip");
  this.innerText = this.dataset.symbol;
  playerSequence.push(this);

  // Check if the player sequence matches
  if (!checkSequence()) {
    alert("Incorrect sequence! Try again from level 1.");
    level = 1;
    restartGame();
  } else if (playerSequence.length === sequence.length) {
    // Level up if the player completes the sequence
    level++;
    levelDisplay.innerText = level;
    playerSequence = [];
    setTimeout(showSequence, 1000); // Add a new card and show the updated sequence
  }

  setTimeout(() => {
    this.classList.remove("flip");
    this.innerText = "";
  }, 500);
}

// Check if the player's sequence matches the game's sequence
function checkSequence() {
  for (let i = 0; i < playerSequence.length; i++) {
    if (playerSequence[i] !== sequence[i]) {
      return false;
    }
  }
  return true;
}