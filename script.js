const cardsArray = [
  "🍎", "🍌", "🍇", "🍉", "🍒", "🍓", "🍑", "🍍",
  "🍎", "🍌", "🍇", "🍉", "🍒", "🍓", "🍑", "🍍"
];

let gameBoard = document.getElementById("gameBoard");
let statusLabel = document.getElementById("statusLabel");
let statusValue = document.getElementById("statusValue");

let mode = ""; // Track the current game mode
let sequence = [];
let playerSequence = [];
let level = 1;
let moves = 0;

// Function to shuffle an array
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Function to restart the game
function restartGame() {
  level = 1;
  moves = 0;
  sequence = [];
  playerSequence = [];
  updateStatusDisplay();
  
  if (mode === "memoryGame") {
    startMemoryGame();
  } else if (mode === "memorySpan") {
    startMemorySpan();
  }
}

// Start Memory Match mode
function startMemoryGame() {
  mode = "memoryGame";
  level = 1;
  moves = 0;
  updateStatusDisplay();
  gameBoard.innerHTML = '';
  setupMemoryMatch();
}

// Start Memory Span mode
function startMemorySpan() {
  mode = "memorySpan";
  level = 1;
  moves = 0;
  updateStatusDisplay();
  gameBoard.innerHTML = '';
  setupMemorySpan();
}

// Update the status display based on the current game mode
function updateStatusDisplay() {
  if (mode === "memoryGame") {
    statusLabel.innerText = "Moves: ";
    statusValue.innerText = moves;
  } else if (mode === "memorySpan") {
    statusLabel.innerText = "Level: ";
    statusValue.innerText = level;
  }
}

// Memory Match game setup
function setupMemoryMatch() {
  let flippedCards = [];
  let matchedPairs = 0;
  const shuffledCards = shuffle([...cardsArray]);

  shuffledCards.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.innerText = ""; // Hide the emoji initially
    card.addEventListener("click", function () {
      // Prevent more than two cards from being flipped at once
      if (flippedCards.length === 2 || card.classList.contains("matched")) return;

      card.classList.add("flip");
      card.innerText = symbol;
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        moves++; // Increment moves when two cards are flipped
        updateStatusDisplay(); // Update the moves display

        if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
          flippedCards.forEach(card => card.classList.add("matched"));
          matchedPairs++;
          flippedCards = [];

          // Check if all pairs are matched
          if (matchedPairs === cardsArray.length / 2) {
            setTimeout(() => alert("Congratulations! You've completed Memory Match mode!"), 300);
          }
        } else {
          // If no match, flip cards back over after a short delay
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

  // Create the card grid for span mode using a subset of unique cards
  const shuffledCards = shuffle([...cardsArray]).slice(0, 8);
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

// Display the sequence for the player to memorize
function showSequence() {
  const cards = Array.from(document.querySelectorAll(".card"));
  sequence.push(cards[Math.floor(Math.random() * cards.length)]); // Add a new random card to the sequence

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
  if (playerSequence.length >= sequence.length) return; // Prevent extra clicks after sequence is complete

  this.classList.add("flip");
  this.innerText = this.dataset.symbol;
  playerSequence.push(this);

  // Check if the player sequence matches the game's sequence so far
  if (!checkSequence()) {
    alert("Incorrect sequence! Starting over from level 1.");
    level = 1;
    restartGame();
  } else if (playerSequence.length === sequence.length) {
    // Level up if the player completes the sequence correctly
    level++;
    updateStatusDisplay(); // Update level display
    playerSequence = [];
    setTimeout(showSequence, 1000); // Add a new card and show the updated sequence
  }

  // Flip the card back over after a brief delay
  setTimeout(() => {
    this.classList.remove("flip");
    this.innerText = "";
  }, 500);
}

// Check if the player's sequence matches the game's sequence so far
function checkSequence() {
  for (let i = 0; i < playerSequence.length; i++) {
    if (playerSequence[i] !== sequence[i]) {
      return false;
    }
  }
  return true;
}