import { resolve } from 'path';
import db from './models/index.mjs';

import initPlayersController from './controllers/players.mjs';

export default function bindRoutes(app) {
  const PlayersController = initPlayersController(db);
  // post new or existing Player Name
  app.post('/login', PlayersController.login);
  // special JS page. Include the webpack main.html file
  app.get('/home', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
}
