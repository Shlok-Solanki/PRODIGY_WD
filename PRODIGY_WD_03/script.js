const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const playerScoreEl = document.getElementById("playerScore");
const computerScoreEl = document.getElementById("computerScore");
const vsPlayerBtn = document.getElementById("vsPlayerBtn");
const vsComputerBtn = document.getElementById("vsComputerBtn");
const player2Label = document.getElementById("player2Label");
const difficultySelect = document.getElementById("difficultySelect");

let currentPlayer = "X";
let gameActive = false;
let boardState = Array(9).fill("");
let gameMode = "";
let difficulty = "easy";

// Separate scores for each mode
let playerXScore_player = 0;
let playerOScore_player = 0;
let playerXScore_computer = 0;
let computerScore = 0;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

vsPlayerBtn.addEventListener("click", () => {
  gameMode = "player";
  resetGame();
  gameActive = true;
  player2Label.innerHTML = "Player O: <span id='computerScore'>" + playerOScore_player + "</span>";
  playerScoreEl.textContent = playerXScore_player;
  statusText.textContent = "Player X's turn";
});

vsComputerBtn.addEventListener("click", () => {
  gameMode = "computer";
  difficulty = difficultySelect.value;
  resetGame();
  gameActive = true;
  player2Label.innerHTML = "Computer: <span id='computerScore'>" + computerScore + "</span>";
  playerScoreEl.textContent = playerXScore_computer;
  statusText.textContent = "Player X's turn";
});

board.addEventListener("click", handleCellClick);
resetBtn.addEventListener("click", resetGame);

function handleCellClick(e) {
  const cell = e.target;
  const index = cell.getAttribute("data-index");

  if (boardState[index] !== "" || !gameActive || (gameMode === "computer" && currentPlayer === "O")) return;

  makeMove(index, currentPlayer);
  checkGameState();

  if (gameMode === "computer" && gameActive && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function makeMove(index, player) {
  boardState[index] = player;
  document.querySelector(`.cell[data-index="${index}"]`).textContent = player;
}

function computerMove() {
  let bestMove;
  if (difficulty === "easy") {
    bestMove = getRandomMove();
  } else if (difficulty === "medium") {
    bestMove = getMediumMove();
  } else {
    bestMove = getBestMove(); // Minimax
  }

  if (bestMove !== undefined) {
    makeMove(bestMove, "O");
    checkGameState();
  }
}

function getRandomMove() {
  let empty = boardState.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function getMediumMove() {
  for (let i = 0; i < 9; i++) {
    if (boardState[i] === "") {
      boardState[i] = "O";
      if (checkWin("O")) {
        boardState[i] = "";
        return i;
      }
      boardState[i] = "";
    }
  }

  for (let i = 0; i < 9; i++) {
    if (boardState[i] === "") {
      boardState[i] = "X";
      if (checkWin("X")) {
        boardState[i] = "";
        return i;
      }
      boardState[i] = "";
    }
  }

  return getRandomMove();
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (boardState[i] === "") {
      boardState[i] = "O";
      let score = minimax(boardState, 0, false);
      boardState[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  const scores = { O: 1, X: -1, tie: 0 };
  let result = checkWinnerForMinimax();
  if (result !== null) return scores[result];

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        best = Math.max(best, minimax(newBoard, depth + 1, false));
        newBoard[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        best = Math.min(best, minimax(newBoard, depth + 1, true));
        newBoard[i] = "";
      }
    }
    return best;
  }
}

function checkWin(player) {
  return winningConditions.some(([a, b, c]) =>
    boardState[a] === player && boardState[b] === player && boardState[c] === player
  );
}

function checkWinnerForMinimax() {
  for (let [a, b, c] of winningConditions) {
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c])
      return boardState[a];
  }
  if (!boardState.includes("")) return "tie";
  return null;
}

function checkGameState() {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      gameActive = false;
      if (boardState[a] === "X") {
        statusText.textContent = "Player X Wins!";
        if (gameMode === "player") {
          playerXScore_player++;
        } else {
          playerXScore_computer++;
        }
      } else {
        if (gameMode === "player") {
          statusText.textContent = "Player O Wins!";
          playerOScore_player++;
        } else {
          statusText.textContent = "Computer Wins!";
          computerScore++;
        }
      }
      updateScores();
      return;
    }
  }

  if (!boardState.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function updateScores() {
  if (gameMode === "player") {
    playerScoreEl.textContent = playerXScore_player;
    computerScoreEl.textContent = playerOScore_player;
  } else {
    playerScoreEl.textContent = playerXScore_computer;
    computerScoreEl.textContent = computerScore;
  }
}

function resetGame() {
  boardState = Array(9).fill("");
  currentPlayer = "X";
  gameActive = gameMode !== "";
  statusText.textContent = gameActive ? "Player X's turn" : "Choose a mode to start";
  document.querySelectorAll(".cell").forEach(cell => cell.textContent = "");
}


