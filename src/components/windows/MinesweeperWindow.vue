<!-- src/components/windows/MinesweeperWindow.vue -->
<template>
  <WindowBase
    title="Minesweeper"
    icon="/vite.svg"
    :show-toolbar="false"
    :show-sidebar="false"
    v-bind="$attrs"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
    @maximize="$emit('maximize')"
    @focus="$emit('focus')"
  >
    <div class="minesweeper-container">
      <!-- Header con controles -->
      <div class="game-header">
        <!-- Contador de minas -->
        <div class="counter">
          <div class="digit">{{ mineCountDigits[0] }}</div>
          <div class="digit">{{ mineCountDigits[1] }}</div>
          <div class="digit">{{ mineCountDigits[2] }}</div>
        </div>

        <!-- Botón de reset (cara) -->
        <button class="reset-btn" @click="resetGame">
          <span v-if="gameState === 'playing'"><img src="/ui/iconos/smile_pixel.png"/></span>
          <span v-else-if="gameState === 'won'"><img src="/ui/iconos/kind_pixel.png"/></span>
          <span v-else-if="gameState === 'lost'"><img src="/ui/iconos/sad_pixel.png"/></span>
        </button>

        <!-- Contador de tiempo -->
        <div class="counter">
          <div class="digit">{{ timeDigits[0] }}</div>
          <div class="digit">{{ timeDigits[1] }}</div>
          <div class="digit">{{ timeDigits[2] }}</div>
        </div>
      </div>

      <!-- Selector de dificultad -->
      <div class="difficulty-selector">
        <button 
          @click="setDifficulty('beginner')"
          :class="{ active: difficulty === 'beginner' }"
        >
          Beginner (9x9)
        </button>
        <button 
          @click="setDifficulty('intermediate')"
          :class="{ active: difficulty === 'intermediate' }"
        >
          Intermediate (16x16)
        </button>
        <button 
          @click="setDifficulty('expert')"
          :class="{ active: difficulty === 'expert' }"
        >
          Expert (30x16)
        </button>
      </div>

      <!-- Tablero del juego -->
      <div class="game-board" :style="boardStyle">
        <div
          v-for="(cell, index) in board"
          :key="index"
          class="cell"
          :class="{
            revealed: cell.isRevealed,
            flagged: cell.isFlagged,
            mine: cell.isMine && gameState === 'lost',
            'mine-exploded': cell.isMine && cell.isRevealed && gameState === 'lost'
          }"
          @click="revealCell(index)"
          @contextmenu.prevent="toggleFlag(index)"
        >
          <!-- Celda sin revelar -->
          <span v-if="!cell.isRevealed && !cell.isFlagged"></span>
          
          <!-- Bandera -->
          <span v-else-if="cell.isFlagged" class="flag">🚩</span>
          
          <!-- Mina revelada -->
          <span v-else-if="cell.isMine" class="mine">💣</span>
          
          <!-- Número de minas adyacentes -->
          <span 
            v-else-if="cell.adjacentMines > 0" 
            class="number"
            :class="`number-${cell.adjacentMines}`"
          >
            {{ cell.adjacentMines }}
          </span>
        </div>
      </div>

      <!-- Instrucciones -->
      <div class="instructions">
        <p><strong>Left Click:</strong> Reveal cell | <strong>Right Click:</strong> Place flag</p>
        <p v-if="gameState === 'won'" class="win-message">🎉 You Won! Time: {{ timer }}s</p>
        <p v-if="gameState === 'lost'" class="lose-message">💥 Game Over! Click the face to try again</p>
      </div>
    </div>
  </WindowBase>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import WindowBase from '../WindowBase.vue';

defineEmits(['close', 'minimize', 'maximize', 'focus']);

// ============================================
// CONFIGURACIÓN
// ============================================
const difficulties = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 }
};

// ============================================
// ESTADO REACTIVO
// ============================================
const difficulty = ref('beginner');
const board = ref([]);
const gameState = ref('playing'); // 'playing', 'won', 'lost'
const timer = ref(0);
const flagCount = ref(0);
let timerInterval = null;

// ============================================
// COMPUTED
// ============================================
const currentDifficulty = computed(() => difficulties[difficulty.value]);

const mineCountDigits = computed(() => {
  const remaining = currentDifficulty.value.mines - flagCount.value;
  const str = Math.abs(remaining).toString().padStart(3, '0');
  return str.split('');
});

const timeDigits = computed(() => {
  const str = Math.min(timer.value, 999).toString().padStart(3, '0');
  return str.split('');
});

const boardStyle = computed(() => ({
  gridTemplateColumns: `repeat(${currentDifficulty.value.cols}, 20px)`,
  gridTemplateRows: `repeat(${currentDifficulty.value.rows}, 20px)`
}));

// ============================================
// FUNCIONES DEL JUEGO
// ============================================
const createBoard = () => {
  const { rows, cols, mines } = currentDifficulty.value;
  const totalCells = rows * cols;
  
  // Crear array de celdas
  const cells = Array.from({ length: totalCells }, () => ({
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    adjacentMines: 0
  }));
  
  // Colocar minas aleatoriamente
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const randomIndex = Math.floor(Math.random() * totalCells);
    if (!cells[randomIndex].isMine) {
      cells[randomIndex].isMine = true;
      minesPlaced++;
    }
  }
  
  // Calcular números adyacentes
  cells.forEach((cell, index) => {
    if (!cell.isMine) {
      cell.adjacentMines = countAdjacentMines(cells, index);
    }
  });
  
  return cells;
};

const countAdjacentMines = (cells, index) => {
  const { rows, cols } = currentDifficulty.value;
  const row = Math.floor(index / cols);
  const col = index % cols;
  
  let count = 0;
  
  // Revisar las 8 celdas adyacentes
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        const adjacentIndex = r * cols + c;
        if (cells[adjacentIndex].isMine) {
          count++;
        }
      }
    }
  }
  
  return count;
};

const revealCell = (index) => {
  if (gameState.value !== 'playing') return;
  if (board.value[index].isRevealed) return;
  if (board.value[index].isFlagged) return;
  
  // Iniciar timer en el primer click
  if (timer.value === 0 && !timerInterval) {
    startTimer();
  }
  
  board.value[index].isRevealed = true;
  
  // Si es mina, game over
  if (board.value[index].isMine) {
    gameState.value = 'lost';
    stopTimer();
    revealAllMines();
    return;
  }
  
  // Si no tiene minas adyacentes, revelar celdas vecinas
  if (board.value[index].adjacentMines === 0) {
    revealAdjacentCells(index);
  }
  
  // Verificar si ganó
  checkWin();
};

const revealAdjacentCells = (index) => {
  const { rows, cols } = currentDifficulty.value;
  const row = Math.floor(index / cols);
  const col = index % cols;
  
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        const adjacentIndex = r * cols + c;
        if (!board.value[adjacentIndex].isRevealed && !board.value[adjacentIndex].isFlagged) {
          revealCell(adjacentIndex);
        }
      }
    }
  }
};

const toggleFlag = (index) => {
  if (gameState.value !== 'playing') return;
  if (board.value[index].isRevealed) return;
  
  board.value[index].isFlagged = !board.value[index].isFlagged;
  flagCount.value += board.value[index].isFlagged ? 1 : -1;
};

const revealAllMines = () => {
  board.value.forEach(cell => {
    if (cell.isMine) {
      cell.isRevealed = true;
    }
  });
};

const checkWin = () => {
  const allNonMinesRevealed = board.value.every(cell => 
    cell.isMine || cell.isRevealed
  );
  
  if (allNonMinesRevealed) {
    gameState.value = 'won';
    stopTimer();
  }
};

const resetGame = () => {
  stopTimer();
  board.value = createBoard();
  gameState.value = 'playing';
  timer.value = 0;
  flagCount.value = 0;
};

const setDifficulty = (level) => {
  difficulty.value = level;
  resetGame();
};

const startTimer = () => {
  timerInterval = setInterval(() => {
    timer.value++;
  }, 1000);
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

// ============================================
// LIFECYCLE
// ============================================
// Inicializar el juego
resetGame();

// Limpiar interval al cerrar
onUnmounted(() => {
  stopTimer();
});
</script>

<style scoped>
.minesweeper-container {
  padding: 20px;
  background: #c0c0c0;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* ============================================
   HEADER
   ============================================ */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #c0c0c0;
  border: 3px solid;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #808080;
  border-bottom-color: #808080;
}

.counter {
  display: flex;
  gap: 2px;
  background: #000;
  padding: 4px 6px;
  border: 2px inset #808080;
}

.digit {
  width: 20px;
  height: 30px;
  background: #000;
  color: #ff0000;
  font-size: 24px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reset-btn {
  width: 50px;
  height: 50px;
  background: linear-gradient(180deg, #ffffff 0%, #c0c0c0 100%);
  border: 3px solid;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #808080;
  border-bottom-color: #808080;
  cursor: pointer;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s;
}

.reset-btn:active {
  border-top-color: #808080;
  border-left-color: #808080;
  border-right-color: #ffffff;
  border-bottom-color: #ffffff;
}

/* ============================================
   SELECTOR DE DIFICULTAD
   ============================================ */
.difficulty-selector {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.difficulty-selector button {
  padding: 8px 16px;
  background: linear-gradient(180deg, #ffffff 0%, #c0c0c0 100%);
  border: 2px solid;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #808080;
  border-bottom-color: #808080;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
  transition: all 0.1s;
}

.difficulty-selector button:hover {
  background: linear-gradient(180deg, #f0f0f0 0%, #d0d0d0 100%);
}

.difficulty-selector button.active {
  background: linear-gradient(180deg, #c0c0c0 0%, #808080 100%);
  border-top-color: #808080;
  border-left-color: #808080;
  border-right-color: #ffffff;
  border-bottom-color: #ffffff;
}

/* ============================================
   TABLERO
   ============================================ */
.game-board {
  display: grid;
  gap: 0;
  justify-content: center;
  padding: 10px;
  background: #c0c0c0;
  border: 3px solid;
  border-top-color: #808080;
  border-left-color: #808080;
  border-right-color: #ffffff;
  border-bottom-color: #ffffff;
  overflow: auto;
  max-height: 500px;
}

.cell {
  width: 20px;   /* ← Reducido de 30px a 20px */
  height: 20px;  /* ← Reducido de 30px a 20px */
  background: linear-gradient(180deg, #ffffff 0%, #c0c0c0 100%);
  border: 2px solid;  /* ← Reducido de 3px a 2px */
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #808080;
  border-bottom-color: #808080;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;  /* ← Reducido de 16px a 12px */
  font-weight: bold;
  user-select: none;
}

.cell:active {
  border-width: 1px;
}

.cell.revealed {
  background: #c0c0c0;
  border: 1px solid #808080;
  cursor: default;
}

.cell.flagged {
  background: linear-gradient(180deg, #ffffff 0%, #c0c0c0 100%);
}

.cell.mine {
  background: #ff0000;
}

.cell.mine-exploded {
  background: #ff0000;
  animation: explode 0.3s ease;
}

@keyframes explode {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

/* Números de colores */
.number-1 { color: #0000ff; }
.number-2 { color: #008000; }
.number-3 { color: #ff0000; }
.number-4 { color: #000080; }
.number-5 { color: #800000; }
.number-6 { color: #008080; }
.number-7 { color: #000000; }
.number-8 { color: #808080; }

/* ============================================
   INSTRUCCIONES
   ============================================ */
.instructions {
  text-align: center;
  font-size: 11px;
  color: #000;
}

.instructions p {
  margin: 5px 0;
}

.win-message {
  color: #008000;
  font-weight: bold;
  font-size: 14px;
}

.lose-message {
  color: #ff0000;
  font-weight: bold;
  font-size: 14px;
}

/* ============================================
   SCROLLBAR
   ============================================ */
.game-board::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}

.game-board::-webkit-scrollbar-track {
  background: #c0c0c0;
}

.game-board::-webkit-scrollbar-thumb {
  background: #808080;
  border: 2px solid #c0c0c0;
}
</style>