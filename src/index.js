import axios from 'axios';
import 'bootstrap';

ws.onopen = () => {
  console.log('Connection opened!');
  messageContainer.innerHTML = 'connected!';
};
ws.onmessage = function (e) {
  console.log('received new message...');
  const message = e.data;
  messageContainer.innerHTML = message;
};

let userType;

const messageContainer = document.querySelector('#message-box');
const buttonsContainer = document.querySelector('#buttons-container');
const playersContainer = document.querySelector('#players-container');

messageContainer.innerHTML = 'Welcome to Crowds Against Humanity! Connect to the host game below:';

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
playersContainer.appendChild(clientNameLabel);

const clientNameInput = document.createElement('input');
clientNameInput.setAttribute('id', 'client');
playersContainer.appendChild(clientNameInput);

// // start game button
// const enterPlayerButton = document.createElement('button');
// enterPlayerButton.setAttribute('type', 'submit');
// enterPlayerButton.setAttribute('for', 'client');
// enterPlayerButton.textContent = 'ENTER PLAYER NAME';

const connectAsSpectatorButton = document.createElement('button');
connectAsSpectatorButton.addEventListener('click', joinAsSpectator);
connectAsSpectatorButton.setAttribute('id', 'join-as-spectator-button');
connectAsSpectatorButton.setAttribute('type', 'submit');
connectAsSpectatorButton.setAttribute('for', 'client');
connectAsSpectatorButton.innerText = 'Join as Spectator';
buttonsContainer.appendChild(connectAsSpectatorButton);

const connectAsPlayerButton = document.createElement('button');
connectAsPlayerButton.addEventListener('click', joinAsPlayer);
connectAsPlayerButton.setAttribute('id', 'join-as-player-button');
connectAsPlayerButton.setAttribute('for', 'client');
connectAsPlayerButton.innerText = 'Join as Player';
buttonsContainer.appendChild(connectAsPlayerButton);
