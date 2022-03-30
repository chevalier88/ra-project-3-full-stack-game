import http from 'http';

import express from 'express';

import { WebSocketServer } from 'ws';

const serverPort = 3010;

const app = express();
const server = http.createServer(app);

const clientsHashKey = {
  spectators: {},
  players: {},
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
    client.send(JSON.stringify({
      connection: 'ok',
      no_of_clients: websocketServer.clients.size,
    }));
  });

  webSocketClient.on('message', (message) => { websocketServer.clients.forEach((client) => {
    console.log('client message incoming...');
    const parsedMessage = JSON.parse(message);
    console.log(parsedMessage);
    if (parsedMessage.type === 'player_type_input') {
      if (parsedMessage.user_type === 'spectator') {
        clientsHashKey.spectators.name = parsedMessage.name;
        console.log(clientsHashKey);
        client.send(`${websocketServer.clients.size} clients have joined,
        with ${Object.keys(clientsHashKey.spectators).length} spectators, and 
        with ${Object.keys(clientsHashKey.players).length} players so far!`);
      } else if (parsedMessage.user_type === 'player') {
        clientsHashKey.players.name = parsedMessage.name;
        console.log(clientsHashKey);
        client.send(`${websocketServer.clients.size} clients have joined,
        with ${Object.keys(clientsHashKey.spectators).length} spectators, and 
        with ${Object.keys(clientsHashKey.players).length} players so far!`);
      }
    }
  });
  });
});
server.listen(serverPort, () => {
  console.log(`Websocket server started on port ${serverPort}`);
});
