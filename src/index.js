import axios from 'axios';
import { linebreak } from './helperFunctions';

const infoContainer = document.querySelector('#info-container');
const loggedInDiv = document.createElement('div');

const buttonContainer = document.querySelector('#buttons-container');
// player name div
const playerNameDiv = document.createElement('div');

const playerNameLabel = document.createElement('label');
playerNameLabel.setAttribute('for', 'player');
playerNameLabel.textContent = 'Player Name:  ';
playerNameDiv.appendChild(playerNameLabel);

const playerNameInput = document.createElement('input');
playerNameInput.setAttribute('id', 'player');
playerNameDiv.appendChild(playerNameInput);

// start game button
const enterPlayerButton = document.createElement('button');
enterPlayerButton.setAttribute('type', 'submit');
enterPlayerButton.setAttribute('for', 'player');
enterPlayerButton.textContent = 'ENTER PLAYER NAME';

// enter number of players button, for later summoning
// player numbers div
const playerNumbersDiv = document.createElement('div');

const playerNumbersLabel = document.createElement('label');
playerNumbersLabel.setAttribute('for', 'player-numbers');
playerNumbersLabel.textContent = 'Number of Players: ';
playerNumbersDiv.appendChild(playerNumbersLabel);

const playerNumbersInput = document.createElement('input');
playerNumbersInput.setAttribute('id', 'player-numbers');
playerNumbersDiv.appendChild(playerNumbersInput);

const enterPlayerNumbersButton = document.createElement('button');
enterPlayerNumbersButton.setAttribute('type', 'submit');
enterPlayerNumbersButton.setAttribute('for', 'player-numbers');
enterPlayerNumbersButton.textContent = 'SUBMIT';

buttonContainer.appendChild(enterPlayerButton);

infoContainer.appendChild(playerNameDiv);

// create an empty game
let currentGame = null;

// empty player number count
let playerNumbers = null;

const runGame = function ({ player1Hand, player2Hand, dealerHand }) {
  // manipulate DOM
  // show the dealer hand
  infoContainer.innerHTML = `${dealerHand.text}`;

  const playersContainer = document.querySelector('#players-container');
  playersContainer.appendChild(linebreak);

  // playersContainer.innerHTML = `
  //   Your Hand:
  //   ====
  //   ${player1Hand[0]}
  //   ====
  //   ${player1Hand[1]}
  //   ====
  //   ${player1Hand[2]}
  //   ====
  //   ${player1Hand[3]}
  //   ====
  //   ${player1Hand[4]}
  //   ====
  //   ${player1Hand[5]}
  //   ====
  //   ${player1Hand[6]}
  //   ====
  //   ${player1Hand[7]}
  //   ====
  //   ${player1Hand[8]}
  //   ====
  //   ${player1Hand[9]}
  // `;

  // const player2Container = document.createElement('div');
  // player2Container.appendChild(linebreak);

  // player2Container.innerHTML = `
  //   Player 2's Hand:
  //   ====
  //   ${player2Hand[0]}
  //   ====
  //   ${player2Hand[1]}
  //   ====
  //   ${player2Hand[2]}
  //   ====
  //   ${player2Hand[3]}
  //   ====
  //   ${player2Hand[4]}
  //   ====
  //   ${player2Hand[5]}
  //   ====
  //   ${player2Hand[6]}
  //   ====
  //   ${player2Hand[7]}
  //   ====
  //   ${player2Hand[8]}
  //   ====
  //   ${player2Hand[9]}
  // `;
};

const dealCards = function () {
  axios.put(`/games/${currentGame.id}/deal`)
    .then((response) => {
      // get the updated hand value
      currentGame = response.data;
      console.log('printing currentGame...');
      console.log(currentGame);
      // display it to the user
      runGame(currentGame);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

const createGame = function () {
  const createGameButtonAgain = document.getElementById('start-game-button');
  createGameButtonAgain.remove();
  loggedInDiv.remove();
  // Make a request to create a new game
  axios.post('/games')
    .then((response) => {
      // set the global value to the new game.
      currentGame = response.data;

      console.log(currentGame);

      // display it out to the user
      runGame(currentGame);

      // for this current game, create a button that will allow the user to
      // manipulate the deck that is on the DB.
      // Create a button for it.
      const dealButton = document.createElement('button');
      dealButton.addEventListener('click', dealCards);

      // display the button
      dealButton.innerText = 'New Round';
      dealButton.appendChild(linebreak);
      buttonContainer.appendChild(dealButton);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

// entering player name either creates or checks for existing player id
// login button functionality
enterPlayerButton.addEventListener('click', () => {
  const data = {
    name: playerNameInput.value,
  };
  console.log('printing user login input data...');
  console.log(data);
  axios
    .post('/login', data)
    .then((response) => {
      console.log('printing response...');
      console.log(response);
      console.log('printing response.data response...');
      console.log(response.data);
      playerNameDiv.remove();
      enterPlayerButton.remove();

      loggedInDiv.textContent = response.data;
      infoContainer.appendChild(loggedInDiv);
      infoContainer.appendChild(playerNumbersDiv);

      buttonContainer.appendChild(enterPlayerNumbersButton);
    })
    .catch((error) => {
      console.log(error);
    });
});

// temporary createGame placeholder function

// manipulate DOM, set up create game button
// create game btn
enterPlayerNumbersButton.addEventListener('click', () => {
  loggedInDiv.remove();

  playerNumbers = playerNumbersInput.value;

  infoContainer.innerHTML = `${playerNumbers} Player Game Created! Awaiting Players...`;
  playerNumbersDiv.remove();
  enterPlayerNumbersButton.remove();

  const createGameButton = document.createElement('button');
  createGameButton.addEventListener('click', createGame);
  createGameButton.setAttribute('id', 'start-game-button');
  createGameButton.innerText = 'Create New Game';
  buttonContainer.appendChild(createGameButton);
});
