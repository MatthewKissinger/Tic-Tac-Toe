// TODO
// 1) Style the site
// 2) Look into adding the AI for 'computerAI' player

// player constructor factory function
const playerFactory = (name, intelligence) => {

    let marks = [];
    let turn = false;
    
    const resetMarks = function() {
        marks = [];
    }

    return {
        name,  
        marks, 
        turn, 
        intelligence, 
        resetMarks
    }
}

// global variables 
let playerX;
let playerO;

// gameBoard Module
const gameBoard = (() => {

    let squares = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    let gameArea = document.querySelector('#gameboard-container');

    squares.forEach(function(el) {
        let square = document.createElement('div');
        square.classList.add('square');
        square.setAttribute('data-index', squares[el]);
        square.setAttribute('id', `square-${squares[el]}`);
        gameArea.appendChild(square);
    });

    let squareDivs = document.querySelectorAll('.square');

    const resetBoard = function() {
        squareDivs.forEach((square) => {
            square.innerHTML = '';
        })
    }

    return {
        squareDivs, 
        resetBoard
    }
})();

// message Module
const messageDisplay = (() => {

    let message = document.querySelector('#message');

    return {
        message
    }

})();

// gameSetup Module
const gameSetup = (() => {

    let startButton = document.querySelector('#game-start');

    let playerXContainer = document.querySelector('#playerX-container');
    let playerOContainer = document.querySelector('#playerO-container');

    // grab the human or AI intelligence value upon clickStart
    let _playerXIntel = document.querySelector('#playerX-choice');
    let _playerOIntel = document.querySelector('#playerO-choice');

    let clickStart = function() {
        startButton.addEventListener('click', function() {

            if (startButton.innerText === 'Click Here to Start') {
                if (_playerXIntel.value === '' || _playerOIntel.value === '') {
                    alert('Choose an intelligence for both players!');
                } else {
                    playerX = playerFactory('Player X', _playerXIntel.value);
                    playerO = playerFactory('Player O', _playerOIntel.value);
    
                    playerXContainer.style.display = 'none';
                    playerOContainer.style.display = 'none';
                    startButton.style.display = 'none';
                    messageDisplay.message.style.display = 'flex';
                    playGame.firstTurn();
                } 
            } 
            if (startButton.innerText === 'Click to Restart') {
                console.log('Restart sequence initiated');

                playerXContainer.style.display = 'flex';
                playerOContainer.style.display = 'flex';
                messageDisplay.message.style.display = 'none';
                playerX.resetMarks();
                playerO.resetMarks();
                gameBoard.resetBoard();

                startButton.innerText = 'Click Here to Start';
            }
        })
    }

    return {
        startButton, 
        clickStart, 
        playerXContainer, 
        playerOContainer
    }
})();

gameSetup.clickStart();

// PlayGame Module
const playGame = (() => {

    const winningCombos = [ ['0', '1', '2'], ['3', '4', '5'], ['6', '7', '8'], ['0', '3', '6'], ['1', '4', '7'], ['2', '5', '8'], ['0', '4', '8'], ['2', '4', '6'] ];

    let turnCounter = 0;

    // randomized which player goes first
    let firstTurn = function() {
        let num = Math.random();
        if (num < .5) {
            playerX.turn = true;
            messageDisplay.message.innerHTML = `<span>Player X's Turn</span`;
        } else {
            playerO.turn = true;
            messageDisplay.message.innerHTML = `<span>Player O's Turn</span`;
        }
    }

    function winner(player) {
        for (let i = 0; i < winningCombos.length; i++) {
            if (winningCombos[i].every((item) => player.marks.includes(item))) {
                return true;
            }
        }
    }

    function resetGame(message) {
        messageDisplay.message.innerHTML = `<span>${message}</span>`;
        gameSetup.startButton.style.display = 'flex';
        gameSetup.startButton.innerText = 'Click to Restart';
        turnCounter = 0;
    }

    gameBoard.squareDivs.forEach((square) => {
        square.addEventListener('click', function() {
            // logic so the square won't be overwritten
            if (square.innerHTML === '' && messageDisplay.message.style.display === 'flex') {
                if (playerX.turn) {
                    square.innerHTML = `<span>X</span>`;
                    playerX.marks.push(square.dataset.index);
                    playerX.turn = false;
                    playerO.turn = true;
                    messageDisplay.message.innerHTML = `<span>Player O's Turn</span`;
                    
                } else {
                    square.innerHTML = `<span>O</span>`;
                    playerO.marks.push(square.dataset.index);
                    playerX.turn = true;
                    playerO.turn = false;
                    messageDisplay.message.innerHTML = `<span>Player X's Turn</span`;
                }

                if (winner(playerX)) {
                    resetGame('Player X Wins!');
                } 
                
                else if (winner(playerO)) {
                    resetGame('Player O Wins!');
                } 
                
                else {
                    turnCounter++;
                    if (turnCounter === 9) {
                        resetGame('Draw');
                    }
                }
            }
        })
    });
    return {
        firstTurn
    }
})();



// TESTING AREA







