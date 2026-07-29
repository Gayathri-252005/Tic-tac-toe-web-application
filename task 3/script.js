const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const pvpBtn = document.getElementById('pvpBtn');
const aiBtn = document.getElementById('aiBtn');

let currentPlayer = 'X';
let gameState = Array(9).fill(''); // 9 boxes now
let gameActive = true;
let gameMode = 'pvp'; // 'pvp' or 'ai'

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6] // diagonals
];

// Handle cell click
function handleCellClick(e) {
  const clickedCellIndex = parseInt(e.target.getAttribute('data-cell-index'));

  if (gameState[clickedCellIndex]!== '' ||!gameActive) return;

  makeMove(clickedCellIndex, currentPlayer);

  if (gameMode === 'ai' && gameActive && currentPlayer === 'O') {
    setTimeout(aiMove, 400); // AI delay
  }
}

// Make a move
function makeMove(index, player) {
  gameState[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase(), 'disabled');
  checkResult();
}

// AI Move
function aiMove() {
  let bestMove = findBestMove();
  if (bestMove!== null) makeMove(bestMove, 'O');
}

// AI Logic: Win > Block > Center > Corner > Random
function findBestMove() {
  // 1. Win
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === '') {
      gameState[i] = 'O';
      if (checkWin('O')) {
        gameState[i] = '';
        return i;
      }
      gameState[i] = '';
    }
  }
  // 2. Block
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === '') {
      gameState[i] = 'X';
      if (checkWin('X')) {
        gameState[i] = '';
        return i;
      }
      gameState[i] = '';
    }
  }
  // 3. Center
  if (gameState[4] === '') return 4;
  // 4. Corners
  let corners = [0, 2, 6, 8].filter(i => gameState[i] === '');
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
  // 5. Sides
  let sides = [1, 3, 5, 7].filter(i => gameState[i] === '');
  if (sides.length > 0) return sides[Math.floor(Math.random() * sides.length)];
  return null;
}

// Check win
function checkWin(player) {
  return winningConditions.some(condition =>
    condition.every(index => gameState[index] === player)
  );
}

// Check result
function checkResult() {
  if (checkWin(currentPlayer)) {
    statusText.textContent = gameMode === 'ai' && currentPlayer === 'O'
     ? `AI Wins! 🤖`
      : `Player ${currentPlayer} Wins! 🎉`;
    highlightWinningCells();
    gameActive = false;
    return;
  }

  if (!gameState.includes('')) {
    statusText.textContent = `Game Draw! 🤝`;
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X'? 'O' : 'X';
  statusText.textContent = gameMode === 'ai'
   ? (currentPlayer === 'X'? `Your Turn` : `AI Thinking...`)
    : `Player ${currentPlayer}'s Turn`;
}

// Highlight winning cells
function highlightWinningCells() {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      cells[a].classList.add('winning-cell');
      cells[b].classList.add('winning-cell');
      cells[c].classList.add('winning-cell');
      break;
    }
  }
}

// Restart game - FIXED
function restartGame() {
  currentPlayer = 'X';
  gameState = Array(9).fill(''); // FIXED: 9 boxes
  gameActive = true;
  statusText.textContent = gameMode === 'ai'? `Your Turn` : `Player X's Turn`;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o', 'disabled', 'winning-cell');
  });
}

// Switch modes
function setMode(mode) {
  gameMode = mode;
  pvpBtn.classList.toggle('active', mode === 'pvp');
  aiBtn.classList.toggle('active', mode === 'ai');
  restartGame();
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
pvpBtn.addEventListener('click', () => setMode('pvp'));
aiBtn.addEventListener('click', () => setMode('ai'));