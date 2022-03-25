/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Card Deck Functions
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

// get a random index from an array given it's size
const getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

// cards is an array of card objects
const shuffleCards = function (cards) {
  let currentIndex = 0;

  // loop over the entire cards array
  while (currentIndex < cards.length) {
    // select a random position from the deck
    const randomIndex = getRandomIndex(cards.length);

    // get the current card in the loop
    const currentItem = cards[currentIndex];

    // get the random card
    const randomItem = cards[randomIndex];

    // swap the current card and the random card
    cards[currentIndex] = randomItem;
    cards[randomIndex] = currentItem;

    currentIndex += 1;
  }

  // give back the shuffled deck
  return cards;
};

const makeDeck = function () {
  let deck = {};
  // create the empty deck at the beginning
  import(
    './cah-cards-compact-base.json'
  ).then(({ default: cardsData }) => {
    deck = cardsData;
    return deck;
  });
};

/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Controller Functions
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

export default function initGamesController(db) {
  // render the main page
  const index = (request, response) => {
    response.render('games/index');
  };

  // create a new game. Insert a new row in the DB.
  const create = async (request, response) => {
    // deal out a new shuffled deck for this game.
    const cardDeck = shuffleCards(makeDeck());
    const player1Hand = [cardDeck.white.pop(), cardDeck.white.pop()];
    const player2Hand = [cardDeck.white.pop(), cardDeck.white.pop()];

    const newGame = {
      gameState: {
        cardDeck,
        player1Hand,
        player2Hand,
      },
    };

    try {
      // run the DB INSERT query
      const game = await db.Game.create(newGame);

      // send the new game back to the user.
      // dont include the deck so the user can't cheat
      response.send({
        id: game.id,
        player1Hand: game.gameState.player1Hand,
        player2Hand: game.gameState.player2Hand,

      });
    } catch (error) {
      response.status(500).send(error);
    }
  };

  // deal two new cards from the deck.
  const deal = async (request, response) => {
    try {
      // get the game by the ID passed in the request
      const game = await db.Game.findByPk(request.params.id);

      console.log('printing request.params.id');
      console.log(request.params.id);

      // make changes to the object
      const player1Hand = [game.gameState.cardDeck.pop(), game.gameState.cardDeck.pop()];
      const player2Hand = [game.gameState.cardDeck.pop(), game.gameState.cardDeck.pop()];

      // update the game with the new info
      await game.update({
        gameState: {
          cardDeck: game.gameState.cardDeck,
          player1Hand,
          player2Hand,
        },

      });

      console.log(game.gameState);

      // send the updated game back to the user.
      // dont include the deck so the user can't cheat
      response.cookie('gameId', game.id);
      response.send({
        id: game.id,
        player1Hand: game.gameState.player1Hand,
        player2Hand: game.gameState.player2Hand,
      });
    } catch (error) {
      response.status(500).send(error);
    }
  };

  // return all functions we define in an object
  // refer to the routes file above to see this used
  return {
    deal,
    create,
    index,
  };
}
