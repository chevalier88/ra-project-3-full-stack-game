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
