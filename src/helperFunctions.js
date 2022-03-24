// We omit the write function above here for brevity.
// import { readFileSync } from 'fs';
import * as fs from 'fs';
// builds a button element
// export function buttonMaker(buttonName, eventListenerCallback,
// buttonIDString, innerTextString, parentToAppend) {
//   const buttonName = document.createElement('click', eventListenerCallback);
//   buttonName.setAttribute('id', buttonIDString);
//   buttonName.innerText = innerTextString;
//   parentToAppend.appendChild(buttonName)
//   return buttonMaker
// }

// builds an input element with label
// export function labelInputMaker(labelConstName, labelString,
// labelTextContent, inputConstName, parentToAppend){
//   const labelConstName = document.createElement('label');
//   labelConstName.setAttribute('for', labelString);
//   labelConstName.textContent = labelTextContent;
//   parentToAppend.appendChild(labelConstName);
//   const inputConstName = document.createElement('input');
//   inputConstName.setAttribute('id', labelString);
//   parentToAppend.appendChild(inputConstName);
// }

// eslint-disable-next-line import/prefer-default-export
export function createGame() {
  console.log('pretending game got created');
  const rawCardsJson = fs.readFileSync('cah-cards-base.json');
  const parsedCardsJson = JSON.parse(rawCardsJson);
  console.log(parsedCardsJson);
}
