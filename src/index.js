import axios from 'axios';
import 'bootstrap';

// all clients are null userType initially
let userType;
const isHost = false;
const name = null;
// instantiate containers for querying
const messageContainer = document.querySelector('#message-box');
const infoContainer = document.querySelector('#info-container');
const buttonsContainer = document.querySelector('#buttons-container');
const playersContainer = document.querySelector('#players-container');

// initial welcome message
messageContainer.innerHTML = 'Welcome to Crowds Against Humanity!';

// ws.onopen = () => {
//   console.log('Connection opened!');
//   messageContainer.innerHTML = 'connected!';
// };

// broadcast webserver messages upon events like joining or disconnecting
ws.onmessage = function (e) {
  console.log('received new message...');
  const message = JSON.parse(e.data);
  if (message.type === 'status_message') {
    // parse and view the websocket message display for all
    messageContainer.innerHTML = message.text;
    // restore buttons for people with duplicate names
    if (message.duplicate) {
      playersContainer.appendChild(clientNameDiv);
      buttonsContainer.appendChild(connectAsSpectatorButton);
      buttonsContainer.appendChild(connectAsPlayerButton);
    }
  }
};

// as soon as you join, connect to socket and give clients
// the right to disconnect
function disconnectSocket() {
  console.log('disconnecting from Websocket server!');
  messageContainer.innerHTML = 'you have disconnected!';

  // if you're a player and you disconnect, it impacts whether the game can begin.
  // so if you disconnect, the websocket server needs to know.
  if (userType === 'player') {
    console.log('player has disconnected');
  }
  ws.close();
  disconnectButton.remove();
  // connectAsPlayerButton.remove();
  // connectAsSpectatorButton.remove();
}

// user decides whether a player or a spectator
// join as a player and record the player state on the websocket server
function joinAsPlayer() {
  console.log("you're a player, playa");
  userType = 'player';
  const playerJoinMessage = {
    type: 'player_type_input',
    user_type: userType,
    name: clientNameInput.value,
  };
  console.log(playerJoinMessage);
  ws.send(JSON.stringify(playerJoinMessage));
  connectAsPlayerButton.remove();
  connectAsSpectatorButton.remove();
}

// join as a spectator and record the spectator state on the ws server
function joinAsSpectator() {
  console.log("you're a spectator, casul");
  userType = 'spectator';
  const spectatorJoinMessage = {
    type: 'player_type_input',
    user_type: userType,
    name: clientNameInput.value,
  };
  console.log(spectatorJoinMessage);
  ws.send(JSON.stringify(spectatorJoinMessage));
  connectAsPlayerButton.remove();
  connectAsSpectatorButton.remove();
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
