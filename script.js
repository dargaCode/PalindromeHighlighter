
// CONSTANTS

var TEST = 'Madam, did you refer to the sagas of Bob and Anna, the civic planner and the racecar driver? While paddling a kayak at noon with no rotor, Bob became red, and then redder and redder. Anna said, "Wow Dad, if your level of exposure gets much higher, I might be required to become your reviver!"';

// DOM SELECTORS

var editableDiv = document.querySelector('#editable-div');

// FUNCTIONS

function isPalindromicWord(word) {
  let frontWord = '';
  let backWord = '';

  for (let i = 0; i < word.length; i++) {
    var frontIndex = i;
    var backIndex = word.length - 1 - i;

    var frontChar = word.charAt(frontIndex);
    var backChar = word.charAt(backIndex);

    if (frontChar != ',') {
      frontWord += frontChar.toLowerCase();
    }

    if (backChar != ',') {
      backWord += backChar.toLowerCase();
    }
  }

  return frontWord === backWord;
}

function charsMatch(charA, charB) {
  const lowerA = charA.toLowerCase();
  const lowerB = charB.toLowerCase();

  return (lowerA === lowerB);
}

function isCharLetter(char) {
  const charCode = char.charCodeAt(0);

  console.log(charCode);
}

// MAIN

(function main() {
  const childDivs = editableDiv.children;

  for (div of childDivs) {
    const divText = div.innerText;
    const divWords = divText.split(" ");

    for (let i = 0; i < divWords.length; i++) {
      const word = divWords[i];
      const palindromic = isPalindromicWord(word);

      if (palindromic) {
        divWords[i] = `!!${word}!!`;
      }
    }

    console.log(divWords.join(' '));
  }

}())



