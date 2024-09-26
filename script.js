document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.querySelectorAll(".gameBoardBtn");
    const playerTurn = document.getElementById("playerTurn");
    const resetBtn = document.getElementById("resetBtn");
    const gameResult = document.getElementById("gameResult");
    const twoPlayerBtn = document.getElementById("twoPlayerBtn");
    const aiBtn = document.getElementById("aiBtn");
  
    let currentPlayer = "X";
    let board = ["", "", "", "", "", "", "", "", ""];
    let isGameOver = false;
    let aiMode = false; // Track if playing vs AI (computer mode)
  
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
  
    // Handle a player's move
    function handleMove(event, index) {
      if (board[index] === "" && !isGameOver) {
        board[index] = currentPlayer;
        event.target.innerText = currentPlayer;
        checkForWin();
        if (!isGameOver) {
          currentPlayer = currentPlayer === "X" ? "O" : "X";
          playerTurn.innerText = `Player ${currentPlayer}'s turn`;
  
          // If in AI mode, make the AI move after the player
          if (aiMode && currentPlayer === "O") {
            setTimeout(aiMove, 500); // Delay AI move for realism
          }
        }
      }
    }
  
    // AI makes its move using Minimax algorithm
    function aiMove() {
      const bestMove = minimax(board, "O").index; // Get the best move for AI (Player "O")
      board[bestMove] = "O";
      gameBoard[bestMove].innerText = "O";
      checkForWin();
      if (!isGameOver) {
        currentPlayer = "X";
        playerTurn.innerText = `Player X's turn`;
      }
    }
  
    // Check if there is a winner or draw
    function checkForWin() {
      let roundWon = false;
  
      for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          roundWon = true;
          break;
        }
      }
  
      if (roundWon) {
        gameResult.innerText = `Player ${currentPlayer} Wins!`;
        alert(`Player ${currentPlayer} Wins!`);
        isGameOver = true;
      } else if (!board.includes("")) {
        gameResult.innerText = "It's a Draw!";
        isGameOver = true;
      }
    }
  
    // Reset the game
    function resetGame() {
      board = ["", "", "", "", "", "", "", "", ""];
      isGameOver = false;
      currentPlayer = "X";
      gameResult.innerText = "";
      playerTurn.innerText = "Player X's turn";
      gameBoard.forEach(btn => (btn.innerText = ""));
    }
  
    // Minimax algorithm for AI decision-making
    function minimax(newBoard, player) {
      const availableSpots = getEmptySpots(newBoard);
  
      // Check for terminal states: win, lose, or draw
      if (checkWin(newBoard, "X")) {
        return { score: -10 }; // AI loses
      } else if (checkWin(newBoard, "O")) {
        return { score: 10 }; // AI wins
      } else if (availableSpots.length === 0) {
        return { score: 0 }; // Draw
      }
  
      // Collect the scores from each available spot
      const moves = [];
  
      for (let i = 0; i < availableSpots.length; i++) {
        const move = {};
        move.index = availableSpots[i];
        newBoard[availableSpots[i]] = player;
  
        if (player === "O") {
          const result = minimax(newBoard, "X");
          move.score = result.score;
        } else {
          const result = minimax(newBoard, "O");
          move.score = result.score;
        }
  
        newBoard[availableSpots[i]] = ""; // Reset the board after the move
        moves.push(move);
      }
  
      // Choose the best move for AI (O) and the worst move for player (X)
      let bestMove;
      if (player === "O") {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }
  
      return moves[bestMove];
    }
  
    // Get empty spots on the board
    function getEmptySpots(board) {
      return board.map((value, index) => (value === "" ? index : null)).filter(index => index !== null);
    }
  
    // Check if a player has won
    function checkWin(board, player) {
      return winningConditions.some(condition => {
        const [a, b, c] = condition;
        return board[a] === player && board[a] === board[b] && board[a] === board[c];
      });
    }
  
    // Enable two-player mode
    twoPlayerBtn.addEventListener("click", () => {
      aiMode = false;
      resetGame();
      playerTurn.innerText = "Player X's turn (Two Players)";
    });
  
    // Enable AI mode
    aiBtn.addEventListener("click", () => {
      aiMode = true;
      resetGame();
      playerTurn.innerText = "Player X's turn (vs AI)";
    });
  
    // Attach event listeners to the game board buttons
    gameBoard.forEach((btn, index) => {
      btn.addEventListener("click", (event) => handleMove(event, index));
    });
  
    // Reset button listener
    resetBtn.addEventListener("click", resetGame);
  });
  