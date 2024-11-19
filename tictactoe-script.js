document.addEventListener("DOMContentLoaded", () => {
    const board = Array(9).fill(null); 
    const player = "X"; 
    const computer = "O"; 
    const gameBoard = document.getElementById("game-board");
    const message = document.getElementById("message");
    const restartButton = document.getElementById("restart-button");
    let userTurn = true; 

   
    function renderBoard() {
        gameBoard.innerHTML = ""; 
        board.forEach((cell, index) => {
            const cellDiv = document.createElement("div");
            cellDiv.className = "cell";
            cellDiv.dataset.index = index;
            cellDiv.textContent = cell || ""; 
            if (cell) cellDiv.classList.add("taken");
            gameBoard.appendChild(cellDiv);
        });
    }

   
    function checkWin(mark) {
        const winCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        return winCombinations.some(combo =>
            combo.every(index => board[index] === mark)
        );
    }

    function isDraw() {
        return board.every(cell => cell !== null);
    }

    function minimax(newBoard, isMaximizing) {
        if (checkWin(computer)) return 1;
        if (checkWin(player)) return -1;
        if (isDraw()) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (!newBoard[i]) {
                    newBoard[i] = computer;
                    bestScore = Math.max(bestScore, minimax(newBoard, false));
                    newBoard[i] = null;
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (!newBoard[i]) {
                    newBoard[i] = player;
                    bestScore = Math.min(bestScore, minimax(newBoard, true));
                    newBoard[i] = null;
                }
            }
            return bestScore;
        }
    }

  
    function computerMove() {
        let bestScore = -Infinity;
        let move = null;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = computer;
                const score = minimax(board, false);
                board[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        if (move !== null) board[move] = computer;

        renderBoard();
        if (checkWin(computer)) {
            message.textContent = "Computer wins!";
        } else if (isDraw()) {
            message.textContent = "It's a draw!";
        } else {
            userTurn = true; 
        }
    }

  
    function handleCellClick(event) {
        if (!userTurn) return; 

        const index = event.target.dataset.index;
        if (!board[index]) {
            board[index] = player; 
            userTurn = false; 
            renderBoard();

            if (checkWin(player)) {
                message.textContent = "Congratulations! You win!";
            } else if (isDraw()) {
                message.textContent = "It's a draw!";
            } else {
                setTimeout(computerMove, 500); 
            }
        }
    }

 
    function restartGame() {
        board.fill(null);
        userTurn = true; 
        message.textContent = "";
        renderBoard();
    }


    gameBoard.addEventListener("click", handleCellClick);
    restartButton.addEventListener("click", restartGame);
    renderBoard();
});
