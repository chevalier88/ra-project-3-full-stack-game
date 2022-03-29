import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';

import http from 'http';
import bindRoutes from './routes.mjs';

// import clientID randomizing function
import { guid } from './websocketFunctions.mjs';

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

bindRoutes(app);

const serverPORT = process.env.serverPORT || 3009;

const server = http.createServer(app);

// Set Express to listen on the given port with websockets
// app.listen(PORT);
server.listen(serverPORT, () => {
  console.log(`Websocket server started on port ${serverPORT}`);
});
