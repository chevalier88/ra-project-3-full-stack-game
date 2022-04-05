import { resolve } from 'path';
import db from './models/index.mjs';

import initPlayersController from './controllers/players.mjs';
import initGamesController from './controllers/games.mjs';
import initWinnersController from './controllers/winners.mjs';

export default function bindRoutes(app) {
  const PlayersController = initPlayersController(db);
  const GamesController = initGamesController(db);
  const WinnersController = initWinnersController(db);
  // special JS page. Include the webpack main.html file
  app.get('/', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
  // post new or existing Player Name
  app.post('/login', PlayersController.login);

  // create a new game
  app.post('/games', GamesController.create);
  // update a game with a round's winner
  app.post('/winners', WinnersController.createWin);
  // update a game with new cards
  app.put('/games/:id/deal', GamesController.deal);
}
