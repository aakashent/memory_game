const cardsArray = [
  "🍎", "🍌", "🍇", "🍉", "🍒", "🍓", "🍑", "🍍",
  "🍎", "🍌", "🍇", "🍉", "🍒", "🍓", "🍑", "🍍"
];

let gameBoard = document.getElementById("gameBoard");
let moveCountDisplay = document.getElementById("moveCount");

let moves = 0;
let flippedCards = [];
let matchedPairs = 0;

// Shuffle cards
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startGame() {
  gameBoard.innerHTML = '';
  moves = 0;
  matchedPairs = 0;
  flippedCards = [];
  moveCountDisplay.innerText = moves;

  // Shuffle and display cards
  const shuffledCards = shuffle([...cardsArray]);
  shuffledCards.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.innerText = symbol;
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
}

function flipCard() {
  if (flippedCards.length === 2) return;

  this.classList.add("flip");
  this.style.pointerEvents = "none";
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    moves++;
    moveCountDisplay.innerText = moves;

    // Check if cards match
    if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
      flippedCards.forEach(card => card.classList.add("matched"));
      flippedCards = [];
      matchedPairs++;
      if (matchedPairs === cardsArray.length / 2) {
        setTimeout(() => alert("Congratulations! You've won the game!"), 300);
      }
    } else {
      setTimeout(() => {
        flippedCards.forEach(card => {
          card.classList.remove("flip");
          card.style.pointerEvents = "auto";
        });
        flippedCards = [];
      }, 1000);
    }
  }
}

startGame();
