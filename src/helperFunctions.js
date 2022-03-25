// webpack really doesn't like in built modules.
// trying all kinds of solutions like:
// https://dev.to/itssimondev/readfilesync-return-enoent-3ef3
// https://stackoverflow.com/questions/43735486/load-static-json-file-in-webpack
// import cards from './cah-cards-compact-base.json';
// // eslint-disable-next-line import/prefer-default-export

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

export default function createGame() {
  console.log('pretending game got created');
  import(
    './cah-cards-compact-base.json'
  ).then(({ default: cardsData }) => {
  // do whatever you like with your "jsonMenu" variable
    console.log('cardsData: ', cardsData);
    const container = document.querySelector('#game-container');
    const findCreateGameButton = document.querySelector('#start-game-button');
    findCreateGameButton.remove();
    const cardsDataDiv = document.createElement('div');
    cardsDataDiv.innerHTML = cardsData.white[0];
    container.appendChild(cardsDataDiv);
  });
}
//   import(
//     './cah-cards-compact-base.json'
//   ).then(({ default: cardsData }) => {
//   // do whatever you like with your "jsonMenu" variable
//     console.log('cardsData: ', cardsData);
//   });
// }
