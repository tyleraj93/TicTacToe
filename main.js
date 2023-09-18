const gameBoard = (function () {
    // Create a 3*3 grid
    const rows = 3;
    const columns = 3;
    const board = Array.from({ length: rows }, () => Array(columns).fill(null));
    console.log(board);

    const generateHtml = () => {
        let boardHTML = "";
        let counter = 0;
        board.forEach((row) => {
            row.forEach(() => {
                boardHTML += `<div class="square" id="${counter}"></div>`;
                counter++;
            });
        });
        return boardHTML;
    };

    const render = () => {
        const boardHTML = generateHtml();
        document.getElementById("gameboard").innerHTML = boardHTML;

        const squares = document.querySelectorAll(".square");
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

const startButton = document.getElementById("start-button");
const addPlayerDialog = document.getElementById("add-player-dialog");
const cancelButton = document.getElementById("cancel-button");
const pieces = document.querySelectorAll(".pieces");
const playerOne = document.getElementById("player-one");
const playerOneStart = document.getElementById("player-one-start");
const playerTwo = document.getElementById("player-two");
const playerTwoStart = document.getElementById("player-two-start");

//Dialog box asking what tile player1 wants to use after clicking the start button
// will change so that start button starts the flow and modal pops up in game not on button press;
startButton.addEventListener("click", () => {
    addPlayerDialog.style.display = "grid";
    addPlayerDialog.showModal();
    // game();
});

cancelButton.addEventListener("click", () => {
    addPlayerDialog.style.display = "none";
    addPlayerDialog.close();
});

pieces.forEach((pieceButton) => {
    pieceButton.addEventListener("click", () => {
        addPlayerDialog.style.display = "none";
        const piece = pieceButton.textContent;
        playerOne.textContent += piece;
        playerTwo.textContent += piece === "X" ? "O" : "X";
        Game.start();
    });
});

const createPlayer = (player, mark, score = 0) => {
    return {
        player,
        mark,
        score,
    };
};

const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    const start = () => {
        players = [
            createPlayer(
                document.getElementById("player-one-start").textContent,
                document.getElementById("player-one").textContent
            ),
            createPlayer(
                document.getElementById("player-two-start").textContent,
                document.getElementById("player-two").textContent
            ),
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        gameBoard.render();
    };

    const switchPlayer = () => {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    function checkForWin(playerMark) {
        for (const combination in winningCombinations) {
            if (
                gameBoard.board[combination[0]] === players[currentPlayerIndex].mark &&
                gameBoard.board[combination[1]] === players[currentPlayerIndex].mark &&
                gameBoard.board[combination[2]] === players[currentPlayerIndex].mark
            ) {
                console.log("winner")
                return true;
            }
        }
        return false;
    }

    const handlePlayerMove = (square) => {
        if (!square.textContent) {
            square.textContent =
                currentPlayerIndex === 0
                    ? `${players[currentPlayerIndex].mark}`
                    : `${players[1].mark}`;
            checkForWin(currentPlayerIndex);
            switchPlayer();
        };

    };

    return {
        start,
        handlePlayerMove,
    };
})();