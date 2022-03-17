export default function initPlayersController(db) {
  const root = (req, res) => {
    res.render('main');
  };

  return { root };
}
