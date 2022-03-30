import axios from 'axios';
import 'bootstrap';

// all clients are null userType initially
let userType;

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
ws.onmessage = function (e) {
  console.log('received new message...');
  const message = e.data;
  messageContainer.innerHTML = message;
};

// as soon as you join, connect to socket and give clients
// the right to disconnect
function disconnectSocket() {
  console.log('disconnecting from Websocket server!');
  messageContainer.innerHTML = 'you have disconnected!';
  ws.close();
  disconnectButton.remove();
  // connectAsPlayerButton.remove();
  // connectAsSpectatorButton.remove();
}

// user decides whether a player or a spectator
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

const clientNameLabel = document.createElement('label');
clientNameLabel.setAttribute('for', 'client');
clientNameLabel.textContent = 'Enter Your Name:  ';

const clientNameInput = document.createElement('input');
clientNameInput.setAttribute('id', 'client');

const connectAsSpectatorButton = document.createElement('button');
connectAsSpectatorButton.addEventListener('click', joinAsSpectator);
connectAsSpectatorButton.setAttribute('id', 'join-as-spectator-button');
connectAsSpectatorButton.setAttribute('type', 'submit');
connectAsSpectatorButton.setAttribute('for', 'client');
connectAsSpectatorButton.innerText = 'Join as Spectator';

const connectAsPlayerButton = document.createElement('button');
connectAsPlayerButton.addEventListener('click', joinAsPlayer);
connectAsPlayerButton.setAttribute('id', 'join-as-player-button');
connectAsPlayerButton.setAttribute('for', 'client');
connectAsPlayerButton.innerText = 'Join as Player';

const disconnectButton = document.createElement('button');
disconnectButton.addEventListener('click', disconnectSocket);
disconnectButton.setAttribute('id', 'disconnect-button');
disconnectButton.innerText = 'Disconnect';
buttonsContainer.appendChild(disconnectButton);
