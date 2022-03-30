import http from 'http';

import express from 'express';

import { WebSocketServer } from 'ws';

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
  // webSocketClient.send(JSON.stringify({
  //   connection: 'ok',
  //   no_of_clients: websocketServer.clients.size,
  // }));

  websocketServer.clients.forEach((client) => {
    console.log(`${websocketServer.clients.size} client(s) connecting!`);
    console.log(clientsHashKey);
    client.send(`connection: 'ok',
    no_of_clients: ${websocketServer.clients.size},`);
  });

  webSocketClient.on('close', () => {
    console.log(`1 connection closed, ${websocketServer.clients.size} clients left`);
  });

  // process messages sent by 1 websocket user
  webSocketClient.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    console.log(parsedMessage);
    if (parsedMessage.type === 'player_type_input') {
      // if loggin in as spectator, push that name into the hash key
      if (parsedMessage.user_type === 'spectator') {
        clientsHashKey.spectators.push(parsedMessage.name);
        console.log(clientsHashKey);
        webSocketClient.send(`${websocketServer.clients.size} clients have joined,\n
        with ${Object.keys(clientsHashKey.spectators).length} spectators,\n and 
        with ${Object.keys(clientsHashKey.players).length} players so far!\n
        players: ${clientsHashKey.players}\n spectators: ${clientsHashKey.spectators}`);
        // if logging in as player, push that name into the hash key again
      } else if (parsedMessage.user_type === 'player') {
        clientsHashKey.players.push(parsedMessage.name);
        console.log(clientsHashKey);
        webSocketClient.send(`${websocketServer.clients.size} clients have joined,\n
        with ${Object.keys(clientsHashKey.spectators).length} spectators,\n and 
        with ${Object.keys(clientsHashKey.players).length} players so far!\n
        players: ${clientsHashKey.players}\n spectators: ${clientsHashKey.spectators}`);
      }
    }
  });

  // process messages meant for all websocket users
  webSocketClient.on('message', (message) => { websocketServer.clients.forEach((client) => {
    console.log('client message incoming...');
    const parsedMessage = JSON.parse(message);
    console.log(parsedMessage);
    if (parsedMessage.type === 'player_type_input') {
      console.log(clientsHashKey);
      client.send(`${websocketServer.clients.size} clients have joined,\n
        with ${Object.keys(clientsHashKey.spectators).length} spectators,\n and 
        with ${Object.keys(clientsHashKey.players).length} players so far!\n
        players: ${clientsHashKey.players}\n spectators: ${clientsHashKey.spectators}`);
    } else {
      client.send(parsedMessage);
    }
  });
  });
});
server.listen(serverPort, () => {
  console.log(clientsHashKey);
  console.log(`Websocket server started on port ${serverPort}`);
});
