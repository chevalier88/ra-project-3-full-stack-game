export default function initPlayersController(db) {
  const login = async (req, res) => {
    try {
      console.log(req.body);

      const [playerData, created] = await db.Player.findOrCreate({
        where: {
          name: req.body.name,
        },
        defaults: {
        },
      });
      console.log(playerData);
      if (created) {
        console.log('is this a new user that just got created?');
        console.log(created); // The boolean indicating whether this instance was just created
        res.cookie('loggedIn', true);
        res.cookie('playerId', playerData.id);
        res.send(`you're a new PLAYER with ID ${playerData.id}!`);
      } else {
        console.log('printing existing playerData...');
        res.cookie('loggedIn', true);
        res.cookie('playerId', playerData.id);
        res.send(`you're an existing PLAYER! Logged in with ID ${playerData.id}`);
      }
    }
    catch (error) {
      console.log('problems have arisen...');
      console.log(error);
      res.send(error);
    }
  };
  return { login };
}
