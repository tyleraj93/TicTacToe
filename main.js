const gameBoard = (function () {
    const board = new Array(9).fill("")
    console.log(board);

    const generateHtml = () => {
        let boardHTML = "";
        board.forEach((_, index) => {
            boardHTML += `<div class="square" id="${index}"></div>`;
        });
        return boardHTML;
    };

    const render = () => {
        const gameboardElement = document.querySelector("#gameboard");
        const boardHTML = generateHtml();
        gameboardElement.innerHTML = boardHTML;

        const squares = gameboardElement.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", () => {
                Game.handlePlayerMove(square);
            });
        });
    };

    return {
        render,
        board,
    };
})();

const createPlayer = (player, mark, score = 0) => {
    return {
        player,
        mark,
        score,
    };
};

const Game = (() => {
    const addPlayerDialog = document.getElementById("add-player-dialog");
    const playerOne = document.getElementById("player-one");
    const playerOneStart = document.getElementById("player-one-start");
    const playerOneScore = document.querySelector("#player-one-score");
    const playerTwo = document.getElementById("player-two");
    const playerTwoStart = document.getElementById("player-two-start");
    const playerTwoScore = document.querySelector("#player-two-score");
    const roundText = document.querySelector("#round");
    const winnerDialog = document.querySelector("#winner-dialog");
    const winnerDialogText = document.querySelector("#winner-dialog-text");
    const gameboardElement = document.querySelector("#gameboard");
    const startButtonText = `
            <button>
                <p id="start-button">Start</p>
            </button>
        `;
    const restartButtonText = `
            <button>
                <p id="restart-button">Restart</p>
            </button>
        `;

    //Dialog box asking what tile player1 wants to use after clicking the start button
    // will change so that start button starts the flow and modal pops up in game not on button press;
    const startButtonContainer = document.querySelector("#start");
    const startButton = document.getElementById("start-button");
    startButton.addEventListener("click", () => {
        start();
    });

    const replaceWithRestart = () => {
        startButtonContainer.innerHTML = restartButtonText;
        const restartButton = document.querySelector("#restart-button");
        restartButton.addEventListener("click", () => {
            restart();
        });
    };

    const replaceWithStart = () => {
        startButtonContainer.innerHTML = startButtonText;
        const startButton = document.getElementById("start-button");
        startButton.addEventListener("click", () => {
            start();
        });
    };

    const cancelButton = document.getElementById("cancel-button");
    cancelButton.addEventListener("click", () => {
        addPlayerDialog.style.display = "none";
        addPlayerDialog.close();
    });

    const pieces = document.querySelectorAll(".pieces");
    pieces.forEach((pieceButton) => {
        pieceButton.addEventListener("click", () => {
            addPlayerDialog.style.display = "none";
            const piece = pieceButton.textContent;
            playerOne.textContent = piece;
            playerTwo.textContent = piece === "X" ? "O" : "X";
            startGame();
        });
    });

    const continueButton = document.createElement("button");
    continueButton.innerHTML = "Continue";
    continueButton.addEventListener("click", () => {
        round++;
        roundText.innerHTML = round;
        for (let i = 0; i < gameBoard.board.length; i++) {
            gameBoard.board[i] = "";
        }
        gameboardElement.innerHTML = "";
        winnerDialog.style.display = "none";
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        Game.startGame(players[0].score, players[1].score, currentPlayerIndex);
        winnerDialog.close();
    });

    const start = () => {
        addPlayerDialog.style.display = "grid";
        addPlayerDialog.showModal();
        replaceWithRestart();
    };

    const restart = () => {
        round = 1;
        roundText.innerHTML = "";
        players[0].score = 0;
        playerOne.innerHTML = "";
        playerOneScore.innerHTML = "";
        players[1].score = 0;
        playerTwo.innerHTML = "";
        playerTwoScore.innerHTML = "";
        gameboardElement.innerHTML = "";
        for (let i = 0; i < gameBoard.board.length; i++) {
            gameBoard.board[i] = "";
        }
        replaceWithStart();
        winnerDialog.style.display = "none";
        winnerDialog.close();
    };

    let players = [];
    let round = 1;
    let currentPlayerIndex;
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // Rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // Columns
        [0, 4, 8],
        [2, 4, 6], // Diagonals
    ];

    const startGame = (oneScore = 0, twoScore = 0, startingPlayer = 0) => {
        players = [
            createPlayer(
                document.getElementById("player-one-start").textContent,
                document.getElementById("player-one").textContent,
                oneScore
            ),
            createPlayer(
                document.getElementById("player-two-start").textContent,
                document.getElementById("player-two").textContent,
                twoScore
            ),
        ];

        playerOneScore.innerHTML = players[0].score;
        playerTwoScore.innerHTML = players[1].score;
        roundText.innerHTML = round;
        currentPlayerIndex = startingPlayer;
        gameBoard.render();
    };

    const switchPlayer = () => {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    const score = () => {
        players[currentPlayerIndex].score++;
        playerOneScore.innerHTML = players[0].score;
        playerTwoScore.innerHTML = players[1].score;
    };

    const alertPlayer = (message) => {
        winnerDialog.style.display = "grid";
        while (winnerDialog.lastChild) {
            winnerDialog.removeChild(winnerDialog.lastChild);
        }
        winnerDialogText.textContent = message;
        winnerDialog.appendChild(winnerDialogText)
        winnerDialog.appendChild(continueButton);
        const restartButton = document.createElement("div");
        restartButton.innerHTML = restartButtonText;
        restartButton.addEventListener("click", () => {
            restart();
        });
        winnerDialog.appendChild(restartButton);
        winnerDialog.showModal();
    };

    const checkForDraw = () => {
        if (gameBoard.board.every((square) => square !== "")) {
            alertPlayer("It was a draw");
        }
    };

    const checkForWin = (playerMark) => {
        for (const combination of winningCombinations) {
            if (
                gameBoard.board[combination[0]] === playerMark &&
                gameBoard.board[combination[1]] === playerMark &&
                gameBoard.board[combination[2]] === playerMark
            ) {
                alertPlayer(`${players[currentPlayerIndex].player} wins!`);
                score();
                gameBoard.render();
                return true;
            }
        }
        return false;
    };

    const handlePlayerMove = (square) => {
        if (!square.textContent) {
            const id = parseInt(square.id, 10);
            square.textContent = players[currentPlayerIndex].mark;
            gameBoard.board[id] = players[currentPlayerIndex].mark;
            if (
                checkForWin(players[currentPlayerIndex].mark) ||
                checkForDraw()
            ) {
                return; // Exit the function if a win or draw is detected
            }
            switchPlayer();
        }
    };

    return {
        startGame,
        handlePlayerMove,
    };
})();
