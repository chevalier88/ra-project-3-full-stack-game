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

const
  websocketServer = new WebSocketServer({ server });

websocketServer.on('connection', (webSocketClient) => {
  websocketServer.clients.forEach((client) => {
    console.log(`${websocketServer.clients.size} client(s) connecting!`);
    console.log(clientsHashKey);
    client.send(JSON.stringify({
      type: 'status_message',
      text: `connection is ok!
        ${websocketServer.clients.size} clients have joined,
        with ${Object.keys(clientsHashKey.spectators).length} spectators, and 
        with ${Object.keys(clientsHashKey.players).length} players so far!
        players: ${clientsHashKey.players}
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
            text: `a new SPECTATOR, ${parsedMessage.name} has joined!
            ${websocketServer.clients.size} clients have joined,
            with ${Object.keys(clientsHashKey.spectators).length} spectators, and 
            with ${Object.keys(clientsHashKey.players).length} players so far!
            players: ${clientsHashKey.players}
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
            text: `a new PLAYER, ${parsedMessage.name} has joined!
          ${websocketServer.clients.size} clients have joined,
          with ${Object.keys(clientsHashKey.spectators).length} spectators, and 
          with ${Object.keys(clientsHashKey.players).length} players so far!
          players: ${clientsHashKey.players}
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
      console.log(parsedMessage.gameState.player1Hand);
      console.log(parsedMessage.gameState.player2Hand);
      console.log(parsedMessage.gameState.player3Hand);
    }
  });

  // process messages meant for all websocket users
  // webSocketClient.on('message', (message) => { websocketServer.clients.forEach((client) => {
  //   console.log('client message incoming...');
  //   const parsedMessage = JSON.parse(message);
  //   console.log(parsedMessage);
  // });
  // });
});
server.listen(serverPort, () => {
  console.log(clientsHashKey);
  console.log(`Websocket server started on port ${serverPort}`);
});
