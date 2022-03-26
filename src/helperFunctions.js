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

export const runGame = function ({ player1Hand, player2Hand }) {
  // manipulate DOM
  const player1Container = document.querySelector('#player1-container');

  const player1HandScore = player1Hand[0].rank + player1Hand[1].rank;
  const player2HandScore = player2Hand[0].rank + player2Hand[1].rank;

  player1Container.innerText = `
    Your Hand:
    ====
    ${player1Hand[0].name}
    of
    ${player1Hand[0].suit}
    ====
    ${player1Hand[1].name}
    of
    ${player1Hand[1].suit}
    ====
    Player 1's Total Score:
    ${player1HandScore}
  `;

  const player2Container = document.querySelector('#player2-container');

  player2Container.innerText = `
    Your Hand:
    ====
    ${player2Hand[0].name}
    of
    ${player2Hand[0].suit}
    ====
    ${player2Hand[1].name}
    of
    ${player2Hand[1].suit}
    ====
    Player 2's Total Score:
    ${player2HandScore}
  `;

  const infoContainer = document.querySelector('#info-container');

  // specify win declaration
  if (player1HandScore > player2HandScore) {
    infoContainer.innerText = `Game ${currentGame.id}: Player 1 Wins!`;
  } else if (player2HandScore > player1HandScore) {
    infoContainer.innerText = `Game ${currentGame.id}: Player 2 Wins!`;
  } else if (player1HandScore === player2HandScore) {
    infoContainer.innerText = `Game ${currentGame.id}: Player Round is Tied!`;
  } else if (currentGame.player1Hand[0] === null) {
    infoContainer.innerText = `Game ${currentGame.id}: Player Round is Tied!`;
  }
};
