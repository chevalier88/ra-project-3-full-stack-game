export default function initWinnersController(db) {
  const createWin = async (request, response) => {
    try {
      console.log('trying to see winners request...');
      console.log(request.body);

      const winnerData = await db.Winner.create({
        name: request.body.name,
        gameId: request.body.game_id,
      });

      response.send(winnerData);
    }
    catch (error) {
      console.log('problems have arisen...');
      console.log(error);
      response.send(error);
    }
  };
  return { createWin };
}
