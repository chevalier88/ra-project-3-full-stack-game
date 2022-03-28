import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';

import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import bindRoutes from './routes.mjs';

// import clientID randomizing function
import { guid } from './websocketFunctions.mjs';

// hard to separate websockets from routes so i'll put it all in mjs for now.
import db from './models/index.mjs';

// hard to separate websockets from controllers so i'll put it all in mjs for now.
import initPlayersController from './controllers/players.mjs';

const PlayersController = initPlayersController(db);

// Initialise Express instance
const app = express();
// Set the Express view engine to expect EJS templates
app.set('view engine', 'ejs');
// Bind cookie parser middleware to parse cookies in requests
app.use(cookieParser());
// Bind Express middleware to parse request bodies for POST requests
app.use(express.urlencoded({ extended: false }));
// Bind Express middleware to parse JSON request bodies
app.use(express.json());
// Bind method override middleware to parse PUT and DELETE requests sent as POST requests
app.use(methodOverride('_method'));
// Expose the files stored in the public folder
app.use(express.static('public'));
app.use(express.json());

// Expose the files stored in the distribution folder
app.use(express.static('dist'));

const serverPORT = process.env.serverPORT || 3009;

const server = http.createServer(app);

// build empty object to track clients
const players = {};

// instantiate the websocket server
const websocketServer = new WebSocketServer({ server });

// Bind route definitions to the Express application
websocketServer.on('connection', (webSocketClient) => {
  // send feedback to the incoming connection
  // generate a new clientID
  const newClientConnectPayload = {
    method: 'connect',
    state: 'awaiting other players. send your name and state your user type like this: {name: "graham", user_type: "spectator"} or {name: "llama", user_type: "player"}.',
  };
  webSocketClient.send(JSON.stringify(newClientConnectPayload));

  // when a message is received
  webSocketClient.on('message', (message) => {
    // for each websocket client
    websocketServer
      .clients
      .forEach((client) => {
        console.log(message);
        const parsed_message = JSON.parse(message);
        // send the client the current message
        if (parsed_message.user_type === 'player') {
          console.log('received a message from client(s), we have a new player...');
          console.log(parsed_message.name);
        }
      });
  });
});

// Set Express to listen on the given port with websockets
// app.listen(PORT);
server.listen(serverPORT, () => {
  console.log(`Websocket server started on port ${serverPORT}`);
});
