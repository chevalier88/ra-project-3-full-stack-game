import axios from 'axios';
// import '@babel/polyfill';
// import WebSocket from 'ws';

// create WebSocket for connection later
// const ws = new WebSocket('ws://localhost:3010/');
// // console.log(ws);

// build WebSocket connector for clients
function connectToWebsocketServer() {
  // ws.onopen = function (e) {
  //   console.log('connection established');
  // };
  console.log('connecting?');
}

function createGame() {
  console.log('creating game?');
}
const infoContainer = document.querySelector('#info-container');
const buttonContainer = document.querySelector('#buttons-container');
const playersContainer = document.querySelector('#players-container');
// user comes in and is asked to connect to websocket host server

infoContainer.innerHTML = 'Welcome to Crowds Against Humanity! Connect to the host game below:';
// user decides whether a player or a spectator

const connectToServerButton = document.createElement('button');
connectToServerButton.addEventListener('click', connectToWebsocketServer);
connectToServerButton.setAttribute('id', 'connect-to-server-button');
connectToServerButton.innerText = 'Connect To Server';
buttonContainer.appendChild(connectToServerButton);

// const createGameButton = document.createElement('button');
// createGameButton.addEventListener('click', createGame);
// createGameButton.setAttribute('id', 'start-game-button');
// createGameButton.innerText = 'Create New Game';
// buttonContainer.appendChild(createGameButton);
const playerNameLabel = document.createElement('label');
playerNameLabel.setAttribute('for', 'player');
playerNameLabel.textContent = 'Player Name:  ';
playersContainer.appendChild(playerNameLabel);

const playerNameInput = document.createElement('input');
playerNameInput.setAttribute('id', 'player');
playersContainer.appendChild(playerNameInput);

// start game button
const enterPlayerButton = document.createElement('button');
enterPlayerButton.setAttribute('type', 'submit');
enterPlayerButton.setAttribute('for', 'player');
enterPlayerButton.textContent = 'ENTER PLAYER NAME';
