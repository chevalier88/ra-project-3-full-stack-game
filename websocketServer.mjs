import http from 'http';

import express from 'express';

import { WebSocketServer } from 'ws';
import { parse } from 'path';

const serverPort = 3010;

const app = express();
const server = http.createServer(app);

const clientsHashKey = {
  spectators: [],
  players: [],
};

let currentSubmissions = [];

let currentVotes = {};
let currentWinner = null;

let gameState = null;

const websocketServer = new WebSocketServer({ server });

// shortcut function to send JSONs to everyone
function sendToAllClients(object) {
  websocketServer.clients.forEach((client) => {
    client.send(JSON.stringify(object));
  });
}

// function to count all votes in an object that tracks their count
function sumOfValuesInHashTable(obj) {
  let sum = 0;
  for (const el in obj) {
    if (obj.hasOwnProperty(el)) {
      sum += parseFloat(obj[el]);
    }
  }
  return sum;
}
// https://bobbyhadz.com/blog/javascript-check-if-all-object-values-equal#:~:text=To%20check%20if%20all%20of,in%20the%20object%20are%20equal.
function allAreEqual(obj) {
  return new Set(Object.values(obj)).size === 1;
}

// randomInteger to permit tie breaking logic
function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// sort the elements in ascending order
// https://stackoverflow.com/questions/1069666/sorting-object-property-by-values
function sortable(hashTable) {
  return Object.entries(hashTable).sort(([, a], [, b]) => a - b).reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
}

websocketServer.on('connection', (webSocketClient) => {
  websocketServer.clients.forEach((client) => {
    console.log(`${websocketServer.clients.size} client(s) connecting!`);
    console.log(clientsHashKey);
    client.send(JSON.stringify({
      type: 'status_message',
      text: `connection is ok!
        ${websocketServer.clients.size} clients have joined,
        with ${Object.keys(clientsHashKey.spectators).length} spectators, and\n  
        with ${Object.keys(clientsHashKey.players).length} players so far!\n
        players: ${clientsHashKey.players}\n
        spectators: ${clientsHashKey.spectators}`,
    }));
  });

  webSocketClient.on('close', () => {
    webSocketClient.send(JSON.stringify({
      type: 'status_message',
      text: `1 connection closed, ${websocketServer.clients.size} clients left...`,
    }));
  });

  // process messages sent by 1 websocket user
  webSocketClient.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    console.log(parsedMessage);
    if (parsedMessage.type === 'player_type_input') {
      // if loggin in as spectator, push that name into the hash key, if name is unique.
      if ((parsedMessage.user_type === 'spectator') && (clientsHashKey.spectators.includes(parsedMessage.name) === false) && (clientsHashKey.players.includes(parsedMessage.name) === false)) {
        console.log('checking for duplicates...');
        console.log(clientsHashKey.spectators.includes(parsedMessage.name));
        console.log(clientsHashKey.players.includes(parsedMessage.name));
        clientsHashKey.spectators.push(parsedMessage.name);
        console.log(clientsHashKey);
        // send the status message that we have a new spectator to that client
        webSocketClient.send(JSON.stringify({
          type: 'status_message',
          spectator_join: true,
          name: parsedMessage.name,
          text: 'you joined as a spectator',
        }));
        // tell everyone who joined about this new spectator
        websocketServer.clients.forEach((client) => {
          client.send(JSON.stringify({
            type: 'status_message',
            text: `a new SPECTATOR, ${parsedMessage.name} has joined!\n
            ${websocketServer.clients.size} clients have joined,\n
            with ${Object.keys(clientsHashKey.spectators).length} spectators, and\n 
            with ${Object.keys(clientsHashKey.players).length} players so far!\n
            players: ${clientsHashKey.players}\n
            spectators: ${clientsHashKey.spectators}`,
          }));
        });
        // if logging in as player, push that name into the hash key again, if name is unique.
      } else if ((parsedMessage.user_type === 'player') && (clientsHashKey.spectators.includes(parsedMessage.name) === false) && (clientsHashKey.players.includes(parsedMessage.name) === false)) {
        console.log('checking for duplicates...');
        console.log(clientsHashKey.spectators.includes(parsedMessage.name));
        console.log(clientsHashKey.players.includes(parsedMessage.name));
        clientsHashKey.players.push(parsedMessage.name);
        console.log(clientsHashKey);
        // send the status message that we have a new unique player to that client
        webSocketClient.send(JSON.stringify({
          type: 'status_message',
          player_join: true,
          name: parsedMessage.name,
          text: 'you joined as a player',
        }));
        // tell everyone who joined about this new player
        websocketServer.clients.forEach((client) => {
          client.send(JSON.stringify({
            type: 'status_message',
            text: `a new PLAYER, ${parsedMessage.name} has joined!\n
          ${websocketServer.clients.size} clients have joined\n
          with ${Object.keys(clientsHashKey.spectators).length} spectators, and\n
          with ${Object.keys(clientsHashKey.players).length} players so far!\n
          players: ${clientsHashKey.players}\n
          spectators: ${clientsHashKey.spectators}`,
          }));
        });

        // because this is a real-time app, we cannot have everyone making axios requests.
        // so i artificially render the first player who joins the game as the game host.
        // only the game host can make axios requests.
        // everyone else can play the game, but cannot touch the database.
        // therefore, checking here if this is the first player ever to log their name in.
        if (clientsHashKey.players.length === 1) {
          console.log('first player of the game detected!');
          const makePlayerHost = {
            type: 'status_message',
            host_enabler: true,
            text: `${parsedMessage.name}, you are the DB host!`,
          };
          webSocketClient.send(JSON.stringify(makePlayerHost));
          // the game can begin if you have 3 players.
          // tell everyone when the game can begin.
        } if (clientsHashKey.players.length === 3) {
          console.log('game can begin, spawning buttons for host player to start game...');
          const enableStartGame = {
            type: 'game_message',
            can_start_game: true,
            text: '3 players detected! awaiting Host player to create game...',
          };
          websocketServer.clients.forEach((client) => {
            client.send(JSON.stringify(enableStartGame));
          });
        }
      } else {
        console.log('duplicate detected!');
        webSocketClient.send(JSON.stringify({
          type: 'status_message',
          duplicate: true,
          text: 'sorry, this name has already been picked! please pick another unique name!',
        }));
      }
      // takes gameState and readies it for broadcasting
    } else if (parsedMessage.type === 'current_game_input') {
      console.log('confirming gameState...');
      gameState = parsedMessage.game_state;
      console.log(clientsHashKey);
      // change the playerHands to the names of the players in our Websocket Server
      gameState[clientsHashKey.players[0]] = gameState.player1Hand;
      gameState[clientsHashKey.players[1]] = gameState.player2Hand;
      gameState[clientsHashKey.players[2]] = gameState.player3Hand;
      gameState[`${clientsHashKey.players[0]}Submit`] = gameState.player1Submit;
      gameState[`${clientsHashKey.players[1]}Submit`] = gameState.player2Submit;
      gameState[`${clientsHashKey.players[2]}Submit`] = gameState.player3Submit;
      // delete the old keys
      delete gameState.player1Hand;
      delete gameState.player2Hand;
      delete gameState.player3Hand;
      delete gameState.player1Submit;
      delete gameState.player2Submit;
      delete gameState.player3Submit;
      // make identifier keys so that websockets understands what to do next with Front End
      gameState.type = 'game_message';
      gameState.gameStage = 'fresh_game_deal';
      // we also want to broadcast to players what to do
      gameState.broadcastMessage = `${clientsHashKey.players[0]}, ${clientsHashKey.players[1]}, and ${clientsHashKey.players[2]}, click the funniest ${gameState.dealerHand.pick} card(s) from your hand!!`;
      // checking game state again
      console.log('checking modified gameState again...');
      console.log(gameState.player1Hand);
      console.log(gameState);
      // send everyone back this updated game state
      sendToAllClients(gameState);
      // takes submitted cards and amends the gameState accordingly
    } else if (parsedMessage.type === 'card_submit') {
      console.log('1 card submitted!');
      currentSubmissions.push(parsedMessage);
      console.log(`${currentSubmissions.length} cards submitted so far...`);
      if (currentSubmissions.length === 3) {
        console.log('all cards this round were submitted!');
        console.log('turning this to a popularity contest...');
        console.log('reminding ourselves what gameState is like...');
        console.log(gameState);
        const votingRoundMessage = {
          type: 'game_message',
          can_vote: true,
          cards_submitted: currentSubmissions,
          text: 'SPECTATORS, time to vote for the funniest card! Which White card is the best answer?',
        };
        sendToAllClients(votingRoundMessage);
        currentSubmissions = [];
      }
    } else if (parsedMessage.type === 'card_vote') {
      // have to use this special notation to increment numerical values in Objects
      // https://bobbyhadz.com/blog/javascript-increment-value-in-object#:~:text=To%20increment%20a%20value%20in,it%20gets%20initialized%20to%201%20.
      currentVotes[parsedMessage.name] = currentVotes[parsedMessage.name] + 1 || 1;
      // currentVotes.push(parsedMessage);
      console.log('checking out the votes so far...');
      console.log(currentVotes);
      const broadcastOneVote = {
        type: 'game_message',
        vote_broadcast: true,
        name: parsedMessage.name,
      };
      sendToAllClients(broadcastOneVote);
      if (clientsHashKey.spectators.length === sumOfValuesInHashTable(currentVotes)) {
        console.log('all votes are in! checking currentVotes...');
        // console.log('seeing game state again...');
        // console.log(gameState);
        // check for the highest number of votes
        currentVotes = sortable(currentVotes);
        console.log(currentVotes);
        // check for equally dispersed votes
        if (allAreEqual(currentVotes) === true) {
          console.log('triple tie state detected!');
          console.log('rolling a 3-sided die');
          const randomInteger = randomIntFromInterval(0, 2);
          currentWinner = Object.keys(currentVotes)[randomInteger];
          console.log(`${currentWinner} wins by sheer luck!!`);
          const broadcastWinMessage = {
            type: 'game_message',
            winner: true,
            name: currentWinner,
            text: `There was a tie with votes for all players, so we rolled a 3-sided dice and ${currentWinner} won by sheer luck!`,
          };
          sendToAllClients(broadcastWinMessage);
          // check for tied votes between 2 players out of 3
        } else if (Object.values(currentVotes)[1] === Object.values(currentVotes)[2] && Object.values(currentVotes)[2] > Object.values(currentVotes)[0]) {
          console.log('double tie state detected!');
          const randomInteger = randomIntFromInterval(1, 2);
          currentWinner = Object.keys(currentVotes)[randomInteger];
          console.log(`${Object.keys(currentVotes)[1]} and ${Object.keys(currentVotes)[2]} tied, so we flipped a coin and ${currentWinner} wins by sheer luck!!`);
          const broadcastWinMessage = {
            type: 'game_message',
            winner: true,
            name: currentWinner,
            text: `There was a tie with 2 players, so we flipped a coin and ${currentWinner} won by sheer luck!`,
          };
          sendToAllClients(broadcastWinMessage);
          // clearly 1 winner by vote count
        } else {
          currentWinner = Object.keys(currentVotes)[2];
          console.log(`${currentWinner} has been voted the funniest!`);
          const broadcastWinMessage = {
            type: 'game_message',
            winner: true,
            name: currentWinner,
            text: `${currentWinner} has the most votes and won this game!`,
          };
          sendToAllClients(broadcastWinMessage);
        }
      }
    }
  });
});
server.listen(serverPort, () => {
  console.log(clientsHashKey);
  console.log(`Websocket server started on port ${serverPort}`);
});
