import axios from 'axios';
import 'bootstrap';
import { linebreak } from './helperFunctions.js';
import './styles.scss';

// all clients are null userType initially with no name
let isHost = false;
let isPlayer = false; // if you're not a player you are a spectator by default
let name = null;
let canVote = true;
// we build an empty currentGame
let currentGame = null;

// we build an empty submission array
let cardToSubmit = {};
let cardVoted = null;

let voteTracker = null;

// canSelect logic is similar to canClick to prevent clicking more than 1 card
let canSelect = true;

// instantiate containers for querying
const messageBox = document.querySelector('#message-box');
const infoContainer = document.querySelector('#info-container');
const buttonsContainer = document.querySelector('#buttons-container');
const playersContainer = document.querySelector('#players-container');
const loggedInContainer = document.querySelector('#users-logged-in');
const playArea = document.querySelector('#play-area');
const dealerArea = document.querySelector('#dealer-area');
const playerHandArea = document.querySelector('#your-hand');
const submissionArea = document.querySelector('#submission-area');

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
      name = message.name;
      console.log(`your name: ${name}`);
      clientNameDiv.remove();
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
          loggedInContainer.innerHTML = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(`your player name: ${name}`);
      // records you as spectator
    } if (message.spectator_join) {
      console.log("you're a unique spectator!");
      console.log(`isPlayer = ${isPlayer}`);
      name = message.name;
      console.log(`name: ${name}`);
      clientNameDiv.remove();
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
      // this happens after the host player creates the game. game begins!
    } else if (message.gameStage === 'fresh_game_deal') {
      console.log('building play area...');
      // build the dealer's dark card. you'll only ever see 1 of these per round
      const darkCard = document.createElement('div');
      darkCard.setAttribute('class', 'dark-cah card-cah');
      const cardPara = document.createElement('p');
      cardPara.setAttribute('class', 'text-cah');
      const cardText = document.createTextNode(message.dealerHand.text);
      cardPara.appendChild(cardText);
      darkCard.appendChild(cardPara);

      dealerArea.appendChild(darkCard);

      // build the player client's individual hand, that no one else can see but that player
      const yourCurrentHand = message[`${name}`];
      console.log(`this is your hand, ${name}...`);
      console.log(yourCurrentHand);

      yourCurrentHand.forEach((card) => {
        console.log(card);
        const singleStackedCard = document.createElement('div');
        singleStackedCard.setAttribute('class', 'col light-cah card-cah');
        singleStackedCard.setAttribute('id', `${card}`);
        const whitePara = document.createElement('p');
        whitePara.setAttribute('class', 'text-cah');
        const whiteText = document.createTextNode(card);

        whitePara.appendChild(whiteText);
        singleStackedCard.appendChild(whitePara);

        playerHandArea.appendChild(singleStackedCard);
        // tell the game what will happen if you click a card to submit
        singleStackedCard.addEventListener('click', (event) => {
          console.log(`card clicked is ${card}`);
          if (singleStackedCard.getAttribute('class').includes('light-cah') && canSelect) {
            canSelect = false;
            singleStackedCard.classList.remove('light-cah');
            singleStackedCard.classList.add('card-selected');
            cardToSubmit = {
              type: 'card_submit',
              name,
              card_text: card,
            };
            console.log('printing card to submit...');
            console.log(cardToSubmit);
            singleStackedCard.appendChild(submitCardButton);
          }
          // If it's already been selected, and you deselect, make sure that
          // doesn't get swapped and the cardsToSubmit logic accounts for this
          else if (canSelect === false && (singleStackedCard.getAttribute('class').includes('card-selected'))) {
            canSelect = true;
            console.log('deselecting');
            singleStackedCard.classList.remove('card-selected');
            singleStackedCard.classList.add('light-cah');
            cardVoted = null;
            console.log('printing card to vote...');
            console.log(cardVoted);
            submitCardButton.remove();
          }
        });
      });
      // tell people what to do in the websocket message box
      messageBox.innerHTML = message.broadcastMessage;
    } else if (message.can_vote) {
      canSelect = true;
      messageBox.innerHTML = message.text;

      // save the voting state
      voteTracker = message.cards_submitted;
      console.log('showing initial voteTracker state...');
      voteTracker.forEach((candidate) => {
        candidate.votes = 0;
      });
      console.log(voteTracker);
      submissionArea.innerHTML = 'popularity contest underway! Only SPECTATORS can vote...';
      // show everyone the submissions!
      message.cards_submitted.forEach((card) => {
        const singleStackedCard = document.createElement('div');
        singleStackedCard.setAttribute('class', 'col light-cah card-cah');
        singleStackedCard.setAttribute('id', `${card.name}`);
        const whitePara = document.createElement('p');
        whitePara.setAttribute('class', 'text-cah');
        const whiteText = document.createTextNode(card.card_text);
        whitePara.appendChild(whiteText);
        singleStackedCard.appendChild(whitePara);

        // append the vote score element too
        const votedNumberPara = document.createElement('p');
        votedNumberPara.setAttribute('id', `${card.name}-votes`);
        singleStackedCard.appendChild(votedNumberPara);

        // append the submitted cards to the main area for voting
        playerHandArea.appendChild(singleStackedCard);
        // only spectators can vote!
        singleStackedCard.addEventListener('click', (event) => {
          console.log(`card clicked is ${card}`);
          if (singleStackedCard.getAttribute('class').includes('light-cah') && canSelect && isPlayer === false && canVote) {
            canSelect = false;
            singleStackedCard.classList.remove('light-cah');
            singleStackedCard.classList.add('card-selected');
            cardVoted = {
              type: 'card_vote',
              name: card.name,
              card_text: card.card_text,
            };
            console.log('printing card to vote...');
            console.log(cardVoted);
            singleStackedCard.appendChild(submitVoteButton);
          }
          // If it's already been selected, and you deselect, make sure that
          // doesn't get swapped and the cardsToSubmit logic accounts for this
          else if (canSelect === false && (singleStackedCard.getAttribute('class').includes('card-selected')) && canVote) {
            canSelect = true;
            console.log('deselecting');
            singleStackedCard.classList.remove('card-selected');
            singleStackedCard.classList.add('light-cah');
            cardToSubmit = {};
            console.log('printing card to submit...');
            console.log(cardToSubmit);
            submitVoteButton.remove();
          }
        });
      });
    } else if (message.vote_broadcast) {
      console.log(`${message.name} just got voted!`);
      // get the new votes from the hashKey
      const obj = voteTracker.find((o) => o.name === `${message.name}`);
      obj.votes += 1;
      // update the element that shows the votes rising in the chosen cards, real-time
      const findVotesByPlayerName = document.querySelector(`#${message.name}-votes`);
      findVotesByPlayerName.innerHTML = obj.votes;
      // const votedNumberPara = document.createElement('p');
      // votedNumberPara.setAttribute('class', 'text-cah');
      // const votedNumberText = document.createTextNode(obj.votes);
      // votedNumberPara.appendChild(votedNumberText);
      // findVotedCardByPlayerName.appendChild(votedNumberPara);
      console.log('showing new voteTracker status...');
      console.log(voteTracker);
      // what to tell everyone when there's a tie
    } else if (message.winner) {
      alert(message.text);
      currentGame.roundWinners.push(message.name);
      console.log(currentGame.roundWinners);
      console.log('just printed current game to remind ourselves what is up!');
      const data = {
        game_id: currentGame.id,
        winner_name: message.name,
      };
      // trying to post the updated winner into the back end
      if (isHost) {
        // push round winners somewhere
        console.log(currentGame.roundWinners);
        console.log(Object.keys(currentGame));
      }
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

function submitCard() {
  console.log('submitting card!');
  ws.send(JSON.stringify(cardToSubmit));
  submitCardButton.remove();
  playerHandArea.innerHTML = '';
  submissionArea.innerHTML = `${name}, your card was submitted!`;
}

function voteCard() {
  console.log('submitting vote!');
  ws.send(JSON.stringify(cardVoted));
  canVote = false; // prevents double voting.
  submitVoteButton.remove();
}

// name entry Div
const clientNameDiv = document.createElement('div');
clientNameDiv.setAttribute('class', 'row text-center');
clientNameDiv.setAttribute('id', 'client-input');
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
connectAsSpectatorButton.setAttribute('class', 'col btn btn-secondary btn-sm');
connectAsSpectatorButton.innerText = 'Join as Spectator';

// connect as a player button DOM
const connectAsPlayerButton = document.createElement('button');
connectAsPlayerButton.addEventListener('click', joinAsPlayer);
connectAsPlayerButton.setAttribute('id', 'join-as-player-button');
connectAsPlayerButton.setAttribute('for', 'client');
connectAsPlayerButton.setAttribute('class', 'col btn btn-primary btn-sm');
connectAsPlayerButton.innerText = 'Join as Player';

buttonsContainer.appendChild(connectAsSpectatorButton);
buttonsContainer.appendChild(connectAsPlayerButton);

// disconnect button DOM
const disconnectButton = document.createElement('button');
disconnectButton.addEventListener('click', disconnectSocket);
disconnectButton.setAttribute('id', 'disconnect-button');
disconnectButton.setAttribute('class', 'col btn btn-danger btn-sm');
disconnectButton.innerText = 'Disconnect';
buttonsContainer.appendChild(disconnectButton);

// create game button DOM
const createGameButton = document.createElement('button');
createGameButton.addEventListener('click', createGame);
createGameButton.setAttribute('id', 'start-game-button');
createGameButton.setAttribute('class', 'col btn btn-success btn-sm');
createGameButton.innerText = 'Create New Game';

// create submit card button DOM
const submitCardButton = document.createElement('button');
submitCardButton.addEventListener('click', submitCard);
submitCardButton.setAttribute('id', 'submit-card-button');
submitCardButton.setAttribute('class', 'col btn btn-danger btn-sm');
submitCardButton.innerText = 'Submit This Card!';

// create submit vote button DOM
const submitVoteButton = document.createElement('button');
submitVoteButton.addEventListener('click', voteCard);
submitVoteButton.setAttribute('id', 'submit-vote-button');
submitVoteButton.setAttribute('class', 'col btn btn-danger btn-sm');
submitVoteButton.innerText = 'Vote This Card!';
