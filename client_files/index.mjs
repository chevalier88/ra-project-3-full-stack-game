// websocketServer.on('connection', (webSocketClient) => {
//   // send feedback to the incoming connection
//   // generate a new clientID
//   const clientId = guid();
//   clients[clientId] = 'connected';
//   console.log(clients);
//   const newClientConnectPayload = {
//     method: 'connect',
//     clientId,
//   };
//   webSocketClient.send(JSON.stringify(newClientConnectPayload));

//   // when a message is received
//   webSocketClient.on('message', (message) => {
//     // for each websocket client
//     websocketServer
//       .clients
//       .forEach((client) => {
//         // send the client the current message
//         console.log('received a message from client(s)...');
//         client.send('you are connected to the Crowds Against Humanity App');
//       });
//   });
// });
