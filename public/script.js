import { labelInputMaker } from '../helperFunctions';

const infoContainer = document.querySelector('#info-container');

// email div
const emailDiv = document.createElement('div');

labelInputMaker(playerLabel, 'player-name', 'Enter Your Player Name: ', playerInput, emailDiv);

infoContainer.appendChild(emailDiv);
