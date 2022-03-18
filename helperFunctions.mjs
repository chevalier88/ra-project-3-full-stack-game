// We omit the write function above here for brevity.
import { readFile } from 'fs';

// builds a button element
// export function buttonMaker(buttonName, eventListenerCallback, buttonIDString, innerTextString, parentToAppend) {
//   const buttonName = document.createElement('click', eventListenerCallback);
//   buttonName.setAttribute('id', buttonIDString);
//   buttonName.innerText = innerTextString;
//   parentToAppend.appendChild(buttonName)
//   return buttonMaker
// }

// builds an input element with label
export function labelInputMaker(labelConstName, labelString, labelTextContent, inputConstName, parentToAppend){
  const labelConstName = document.createElement('label');
  labelConstName.setAttribute('for', labelString);
  labelConstName.textContent = labelTextContent;
  parentToAppend.appendChild(labelConstName);
  const inputConstName = document.createElement('input');
  inputConstName.setAttribute('id', labelString);
  parentToAppend.appendChild(inputConstName);
}



/**
 * Read and log the contents of the target JSON file
 * @param {string} filename - The name of the target JSON file
 * @returns undefined
 */
export function read(filename) {
  const handleFileRead = (readErr, jsonContentStr) => {
    if (readErr) {
      console.error('Reading error', readErr);
      return;
    }
    // We only log the value of jsonContentStr. We could also parse it
    // into a JS Object to access specific keys and values.
    console.log(jsonContentStr);
  };

  readFile(filename, 'utf-8', handleFileRead);
}
