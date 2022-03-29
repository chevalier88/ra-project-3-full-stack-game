import axios from 'axios';

let userType;

const infoContainer = document.querySelector('#info-container');
const buttonsContainer = document.querySelector('#buttons-container');
const playersContainer = document.querySelector('#players-container');

infoContainer.innerHTML = 'Welcome to Crowds Against Humanity! Connect to the host game below:';

// user decides whether a player or a spectator
function joinAsPlayer() {
  console.log("you're a player, playa");
  userType = 'player';
  infoContainer.innerHTML = 'you are a player!';
}

function joinAsSpectator() {
  console.log("you're a spectator, casul");
  userType = 'spectator';
}

const connectAsSpectatorButton = document.createElement('button');
connectAsSpectatorButton.addEventListener('click', joinAsSpectator);
connectAsSpectatorButton.setAttribute('id', 'check-server-status-button');
connectAsSpectatorButton.innerText = 'Join as Spectator';
buttonsContainer.appendChild(connectAsSpectatorButton);

const connectAsPlayerButton = document.createElement('button');
connectAsPlayerButton.addEventListener('click', joinAsPlayer);
connectAsPlayerButton.setAttribute('id', 'connect-to-server-button');
connectAsPlayerButton.innerText = 'Join as Player';
buttonsContainer.appendChild(connectAsPlayerButton);
