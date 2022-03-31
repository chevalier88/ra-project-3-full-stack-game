import axios from 'axios';
import 'bootstrap';
import { linebreak } from './helperFunctions.js';

// all clients are null userType initially with no name
let isHost = false;
let isPlayer = false; // if you're not a player you are a spectator by default
let name = null;

// we build an empty currentGame
let currentGame = null;

// instantiate containers for querying
const messageBox = document.querySelector('#message-box');
const infoContainer = document.querySelector('#info-container');
const buttonsContainer = document.querySelector('#buttons-container');
const playersContainer = document.querySelector('#players-container');
const loggedInContainer = document.querySelector('#users-logged-in');

// initial welcome message
messageBox.innerHTML = 'Welcome to Crowds Against Humanity!';

// ws.onopen = () => {
//   console.log('Connection opened!');
//   messageBox.innerHTML = 'connected!';
// };

// broadcast webserver messages upon events like joining or disconnecting
ws.onmessage = function (e) {
  console.log('received new message...');
  const message = JSON.parse(e.data);
  if (message.type === 'status_message') {
    // parse and view the websocket message display for all to see
    messageBox.innerHTML = message.text;
    // restore buttons for people with duplicate names to pick a new name
    if (message.duplicate) {
      playersContainer.appendChild(clientNameDiv);
      buttonsContainer.appendChild(connectAsSpectatorButton);
      buttonsContainer.appendChild(connectAsPlayerButton);
      // records you as host
    } if (message.host_enabler) {
      console.log("you're the host player!");
      isHost = true;
      console.log(`isHost = ${isHost}`);
      // records you as normal player
    } if (message.player_join) {
      console.log("you're a unique player!");
      isPlayer = true;
      console.log(`isPlayer = ${isPlayer}`);
      const data = {
        name: message.name,
      };
      console.log('about to send login data to db:');
      console.log(data);
      // logs cookie in based on userID for players only
      axios
        .post('/login', data)
        .then((response) => {
          console.log('printing response...');
          console.log(response);
          console.log('printing response.data response...');
          console.log(response.data);
          loggedInContainer.textContent = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
      // records you as spectator
    } if (message.spectator_join) {
      console.log("you're a unique spectator!");
      console.log(`isPlayer = ${isPlayer}`);
      name = message.name;
      console.log(`name: ${name}`);
    }
    // game messages become a thing when the 3-player state is achieved
    // this means the game can begin when the Websocket Server detects 3 players
  } else if (message.type === 'game_message') {
    console.log('receiving game message..');
    console.log(message);
    connectAsPlayerButton.remove(); // no longer accepting players after 3 people are players.
    if (message.can_start_game && isHost) {
      console.log('you are the host and the game can begin, wanna start it?');
      buttonsContainer.appendChild(createGameButton);
    }
  }
};

// as soon as you join, connect to socket and give clients
// the right to disconnect
function disconnectSocket() {
  console.log('disconnecting from Websocket server!');
  messageBox.innerHTML = 'you have disconnected! hit F5 to reconnect...';

  // if you're a player and you disconnect, it impacts whether the game can begin.
  // so if you disconnect, the websocket server needs to know.
  if (isPlayer) {
    console.log('player has disconnected');
  }
  ws.close();
  disconnectButton.remove();
  connectAsPlayerButton.remove();
  connectAsSpectatorButton.remove();
}

// user decides whether a player or a spectator
// join as a player and record the player state on the websocket server
function joinAsPlayer() {
  console.log("you're asking to be a player...");
  const playerJoinMessage = {
    type: 'player_type_input',
    user_type: 'player',
    name: clientNameInput.value,
  };
  console.log(playerJoinMessage);
  ws.send(JSON.stringify(playerJoinMessage));
  connectAsPlayerButton.remove();
  connectAsSpectatorButton.remove();
}

// join as a spectator and record the spectator state on the ws server
function joinAsSpectator() {
  console.log("you're asking to be a spectator...");
  const spectatorJoinMessage = {
    type: 'player_type_input',
    user_type: 'spectator',
    name: clientNameInput.value,
  };
  console.log(spectatorJoinMessage);
  ws.send(JSON.stringify(spectatorJoinMessage));
  connectAsPlayerButton.remove();
  connectAsSpectatorButton.remove();
}

// click event: start the game, after 3 players are logged in
function createGame() {
  console.log('creating game, dealing hands...');
  const createGameButtonAgain = document.getElementById('start-game-button');
  createGameButtonAgain.remove();
  clientNameDiv.remove();
  // Make a request to create a new game
  axios.post('/games')
    .then((response) => {
      // set the global value to the new game.
      currentGame = response.data;

      // send it to the websocketServer for broadcasting
      console.log('sending currentGame to websocket server...');
      const hostCurrentGameMessage = {
        type: 'current_game_input',
        game_state: currentGame,
      };
      ws.send(JSON.stringify(hostCurrentGameMessage));
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
}

// name entry Div
const clientNameDiv = document.createElement('div');

const clientNameLabel = document.createElement('label');
clientNameLabel.setAttribute('for', 'client');
clientNameLabel.textContent = 'Enter Your Name:  ';

const clientNameInput = document.createElement('input');
clientNameInput.setAttribute('id', 'client');

clientNameDiv.appendChild(clientNameLabel);
clientNameDiv.appendChild(clientNameInput);
playersContainer.appendChild(clientNameDiv);

// connect as a spectator button DOM
const connectAsSpectatorButton = document.createElement('button');
connectAsSpectatorButton.addEventListener('click', joinAsSpectator);
connectAsSpectatorButton.setAttribute('id', 'join-as-spectator-button');
connectAsSpectatorButton.setAttribute('type', 'submit');
connectAsSpectatorButton.setAttribute('for', 'client');
connectAsSpectatorButton.innerText = 'Join as Spectator';

// connect as a player button DOM
const connectAsPlayerButton = document.createElement('button');
connectAsPlayerButton.addEventListener('click', joinAsPlayer);
connectAsPlayerButton.setAttribute('id', 'join-as-player-button');
connectAsPlayerButton.setAttribute('for', 'client');
connectAsPlayerButton.innerText = 'Join as Player';

buttonsContainer.appendChild(connectAsSpectatorButton);
buttonsContainer.appendChild(connectAsPlayerButton);

// disconnect button DOM
const disconnectButton = document.createElement('button');
disconnectButton.addEventListener('click', disconnectSocket);
disconnectButton.setAttribute('id', 'disconnect-button');
disconnectButton.innerText = 'Disconnect';
buttonsContainer.appendChild(disconnectButton);

// create game button DOM
const createGameButton = document.createElement('button');
createGameButton.addEventListener('click', createGame);
createGameButton.setAttribute('id', 'start-game-button');
createGameButton.innerText = 'Create New Game';
