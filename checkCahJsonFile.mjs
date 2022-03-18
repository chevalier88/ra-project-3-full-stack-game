import { read } from './helperFunctions.mjs';

const CAHCards = await read('./cah-cards-compact.json');
console.log(CAHCards)
