// import labelInputMaker from '../helperFunctions';

const infoContainer = document.querySelector('#info-container');

// player name div
const playerNameDiv = document.createElement('div');

const playerNameLabel = document.createElement('label');
playerNameLabel.setAttribute('for', 'player');
playerNameLabel.textContent = 'Player Name:  ';
playerNameDiv.appendChild(playerNameLabel);

const playerNameInput = document.createElement('input');
playerNameInput.setAttribute('id', 'player');
playerNameDiv.appendChild(playerNameInput);
infoContainer.appendChild(playerNameDiv);

infoContainer.appendChild(playerNameDiv);
