import http from 'http';

import express from 'express';

import { WebSocketServer } from 'ws';

const serverPort = 3010;

const app = express();
const server = http.createServer(app);

const
  websocketServer = new WebSocketServer({ server });

websocketServer.on('connection', (webSocketClient) => {
  // webSocketClient.send(JSON.stringify({
  //   connection: 'ok',
  //   no_of_clients: websocketServer.clients.size,
  // }));

  websocketServer.clients.forEach((client) => {
    client.send(JSON.stringify({
      connection: 'ok',
      no_of_clients: websocketServer.clients.size,
    }));
  });

  webSocketClient.on('message', (message) => { websocketServer.clients.forEach((client) => {
    console.log(message);
    client.send(`{ "message" : ${message} back at you}`); });
  });
});
server.listen(serverPort, () => { console.log(`Websocket server started on port ${serverPort}`); });
