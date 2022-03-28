import axios from 'axios';
import { linebreak } from './helperFunctions';

// instantitate selection of the button-container for appending children
const buttonContainer = document.querySelector('#buttons-container');

// create list of empty games
let currentGame = [];
// host new game. create new game ID.
function hostNewGame() {
  axios.post('/games')
    .then((response) => {
      // set the global value to the new game.
      currentGame = response.data;

      console.log(currentGame);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
}

const hostNewGameButton = document.createElement('button');
hostNewGameButton.addEventListener('click', hostNewGame);
hostNewGameButton.setAttribute('id', 'host-new-game-button');
hostNewGameButton.innerText('Host New Game');
buttonContainer.appendChild(hostNewGameButton);
// await players & audience membersjoining. 3-5 players only, everyone else is an audience member.

// to join the game, they are to send a message with the ID in the payload to the server.

// once all players have joined, deal cards/

// return cards per player to JSON back to the

// let each player pick their cards, and submit.

// await all players submitting

// once all players submit, put it to the public vote! each client can only
