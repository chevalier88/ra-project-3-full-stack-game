import axios from 'axios';

const infoContainer = document.querySelector('#info-container');
const buttonsContainer = document.querySelector('#buttons-container');
const playersContainer = document.querySelector('#players-container');

infoContainer.innerHTML = 'Welcome to Crowds Against Humanity! Connect to the host game below:';

// user decides whether a player or a spectator
function connectToWebsocketServer() {
  // ws.onopen = function (e) {
  //   console.log('connection established');
  // };
  console.log('connecting...');
  axios.get('/connect')
    .then((response) => {
      console.log(response);
      infoContainer.innerHTML = JSON.stringify(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

const connectToServerButton = document.createElement('button');
connectToServerButton.addEventListener('click', connectToWebsocketServer);
connectToServerButton.setAttribute('id', 'connect-to-server-button');
connectToServerButton.innerText = 'Connect To Server';
buttonsContainer.appendChild(connectToServerButton);
