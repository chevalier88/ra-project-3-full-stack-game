import http from 'http';

import express from 'express';

import { WebSocketServer } from 'ws';

const serverPort = 3000;

const app = express();
const server = http.createServer(app);

const
  websocketServer = new WebSocketServer({ server });

websocketServer.on('connection', (webSocketClient) => {
  webSocketClient.send('{ "connection" : "ok"}');
  webSocketClient.on('message', (message) => { websocketServer.clients.forEach((client) => { client.send(`{ "message" : ${message} back at you}`); });
  });
});
server.listen(serverPort, () => { console.log(`Websocket server started on port ${serverPort}`); });
