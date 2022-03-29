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
