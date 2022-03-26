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

function makeDeck() {
  let deck = {};
  // create the empty deck at the beginning
  import(
    '../src/cah-cards-compact-base.json'
  ).then(({ default: cardsData }) => {
    deck = cardsData;
    console.log('deck');
    return deck;
  });
}

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
  // create a new game. Insert a new row in the DB.
  const create = async (request, response) => {
    // deal out a new shuffled deck for this game.
    const wholeDeck = makeDeck();
    console.log('printing wholeDeck type...');
    console.log(wholeDeck);
    const rawWhiteDeck = wholeDeck.white;
    const rawBlackDeck = wholeDeck.black;
    const shuffledWhiteDeck = shuffleCards(rawWhiteDeck);
    const shuffledBlackDeck = shuffleCards(rawBlackDeck);

    let player1Hand = [];
    let player2Hand = [];
    let dealerHand = [];

    // pop ten cards from shuffled deck into each player's hand
    for (let i = 0; i <= 10; i += 1) {
      player1Hand = shuffledWhiteDeck.pop();
      player2Hand = shuffledWhiteDeck.pop();
    }

    // pop 1 card for the dealer
    dealerHand = shuffledBlackDeck.pop();

    const newGame = {
      gameState: {
        shuffledWhiteDeck,
        shuffledBlackDeck,
        player1Hand,
        player2Hand,
        dealerHand,
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
        dealerHand: game.gameState.dealerHand,
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

      let player1Hand = [];
      let player2Hand = [];

      // make changes to the object
      for (let i = 0; i <= 10; i += 1) {
        player1Hand = game.gameState.shuffledWhiteDeck.pop();
        player2Hand = game.gameState.shuffledWhiteDeck.pop();
      }
      const dealerHand = game.gameState.shuffledBlackDeck.pop();

      // update the game with the new info
      await game.update({
        gameState: {
          shuffledWhiteDeck: game.gameState.shuffledWhiteDeck,
          shuffledBlackDeck: game.gameState.shuffledBlackDeck,
          player1Hand,
          player2Hand,
          dealerHand,
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
        dealerHand: game.gameState.dealerHand,
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
  };
}