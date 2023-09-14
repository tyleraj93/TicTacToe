const gameBoard = (function () {
    // Create a 3*3 grid
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push([" ?? "]);
        }
    }

    console.log(board);

    const render = () => {
        let boardHTML = "";
        let counter = 1;
        board.forEach((row, index) => {
            row.forEach((square) => {
                boardHTML += `<div class="square" id="square-${counter}">${square}</div>`;
                counter++;
            });
        });
        document.getElementById("gameboard").innerHTML = boardHTML;
    };

    return {
        render,
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
        playerOneStart.textContent += piece;
        playerTwoStart.textContent += piece === "X" ? "O" : "X";
        gameBoard.render();
    });
});

// const createPlayer = (name, mark) => {
//     return {
//         name,
//         mark
//     }
// }

// const Game = (() => {
//     let players = [];
//     let currentPlayerIndex;
//     let gameOver;

//     const start = () => {
//         players = [
//             createPlayer(document.querySelector("#player1").value, "X"),
//             createPlayer(document.querySelector("#player2").value, "O")
//         ]
//         currentPlayerIndex = 0;
//         gameOver = false;
//         Gameboard.render();
//     }

//     return {
//         start,
//     }
// })();

// const startButton = document.querySelector("#startButton");
// startButton.addEventListener("click", () => {
//     Game.start();
// })
