import axios from 'axios';

const infoContainer = document.querySelector('#info-container');

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

playerNameDiv.appendChild(enterPlayerButton);

infoContainer.appendChild(playerNameDiv);

// create an empty game
let currentGame = null;

const runGame = function ({ player1Hand, player2Hand, dealerHand }) {
  // manipulate DOM
  const player1Container = document.querySelector('#player1-container');

  player1Container.innerHTML = `
    Your Hand:
    ====
    ${player1Hand[0]}
    ====
    ${player1Hand[1]}
    ====
    ${player1Hand[2]}
    ====
    ${player1Hand[3]}
    ====
    ${player1Hand[4]}
    ====
    ${player1Hand[5]}
    ====
    ${player1Hand[6]}
    ====
    ${player1Hand[7]}
    ====
    ${player1Hand[8]}
    ==== 
    ${player1Hand[9]}   
  `;

  const player2Container = document.querySelector('#player2-container');

  player2Container.innerHTML = `
    Your Hand:
    ====
    ${player2Hand[0]}
    ====
    ${player2Hand[1]}
    ====
    ${player2Hand[2]}
    ====
    ${player2Hand[3]}
    ====
    ${player2Hand[4]}
    ====
    ${player2Hand[5]}
    ====
    ${player2Hand[6]}
    ====
    ${player2Hand[7]}
    ====
    ${player2Hand[8]}
    ==== 
    ${player2Hand[9]}   
  `;

  // show the dealer hand
  infoContainer.innerHTML = `${dealerHand}`;
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
  const createGameBtnAgain = document.getElementById('start-game-button');
  createGameBtnAgain.remove();
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
      const dealBtn = document.createElement('button');
      dealBtn.addEventListener('click', dealCards);

      // display the button
      const container = document.querySelector('#game-container');
      dealBtn.innerText = 'Deal';
      container.appendChild(dealBtn);
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

      const container = document.querySelector('#game-container');

      const loggedInDiv = document.createElement('div');
      loggedInDiv.textContent = response.data;
      container.appendChild(loggedInDiv);

      // temporary createGame placeholder function

      // manipulate DOM, set up create game button
      // create game btn
      const createGameBtn = document.createElement('button');
      createGameBtn.addEventListener('click', createGame);
      createGameBtn.setAttribute('id', 'start-game-button');
      createGameBtn.innerText = 'Create New Game';
      container.appendChild(createGameBtn);
    })
    .catch((error) => {
      console.log(error);
    });
});
