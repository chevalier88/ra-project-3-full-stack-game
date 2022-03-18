import { resolve } from 'path';
import db from './models/index.mjs';

import initPlayersController from './controllers/players.mjs';

export default function bindRoutes(app) {
  const PlayersController = initPlayersController(db);
  // special JS page. Include the webpack index.html file
  app.get('/', PlayersController.root);
  // post new or existing Player Name
  app.post('/login', PlayersController.login);
}
