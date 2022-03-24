import axios from 'axios';
import createGame from './helperFunctions.js';

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
