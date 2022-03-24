// webpack really doesn't like in built modules.
// trying all kinds of solutions like:
// https://dev.to/itssimondev/readfilesync-return-enoent-3ef3
// https://stackoverflow.com/questions/43735486/load-static-json-file-in-webpack
// import cards from './cah-cards-compact-base.json';
// // eslint-disable-next-line import/prefer-default-export

export default function createGame() {
  console.log('pretending game got created');
  import(
    './cah-cards-compact-base.json'
  ).then(({ default: cardsData }) => {
  // do whatever you like with your "jsonMenu" variable
    console.log('cardsData: ', cardsData);
    return cardsData;
  });
}
//   import(
//     './cah-cards-compact-base.json'
//   ).then(({ default: cardsData }) => {
//   // do whatever you like with your "jsonMenu" variable
//     console.log('cardsData: ', cardsData);
//   });
// }
