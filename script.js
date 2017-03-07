
// CONSTANTS

const CHAR_CODE_A = 'a'.charCodeAt(0);
const CHAR_CODE_Z = 'z'.charCodeAt(0);
const CHAR_CODE_0 = '0'.charCodeAt(0);
const CHAR_CODE_9 = '9'.charCodeAt(0);

// DOM SELECTORS

var editableDiv = document.querySelector('#editable-div');
var mirrorDiv = document.querySelector('#editable-div-mirror');

// EVENT BINDINGS

editableDiv.addEventListener('input', processInput);

editableDiv.addEventListener('paste', function(event) {
  const sanitizedText = event.clipboardData.getData('text/plain');

  populateChildDivs(this, sanitizedText);
  processInput();

  // prevent normal input on paste
  event.preventDefault();
});

// FUNCTIONS

function populateChildDivs(parentDiv, inputText) {
  const lines = inputText.split('\n');

  parentDiv.innerText = '';

  for (line of lines) {
    const div = document.createElement('div');

    // preserve empty lines in html
    if (line === '') {
      div.innerHTML = '</br>';
    } else {
      div.innerText = line;
    }

    parentDiv.appendChild(div);
  }
}

function processInput() {
  mirrorDivContent();
  highlightAllPalindromes();
}

function mirrorDivContent() {
  mirrorDiv.innerHTML = editableDiv.innerHTML;
}

function highlightAllPalindromes() {
  const childDivs = mirrorDiv.children;

  for (div of childDivs) {
    highlightPalindromesInDiv(div);
  }
}

function highlightPalindromesInDiv(div) {
  const divHTML = div.innerHTML;

  // do nothing to blank <br> divs. This prevents the empty space from being stripped out.
  if (divHTML === '<br>') {
    return;
  }

  const divText = div.innerText;
  const divWords = divText.split(" ");

  for (let i = 0; i < divWords.length; i++) {
    const word = divWords[i];
    const palindromic = isPalindromicWord(word);

    if (palindromic) {
      divWords[i] = `<span class="highlight">${word}</span>`;
    }
  }

  const newContent = divWords.join(' ');

  div.innerHTML = newContent;
}

function isPalindromicWord(word) {
  let frontWord = '';
  let backWord = '';

  for (let i = 0; i < word.length; i++) {
    var frontIndex = i;
    var backIndex = word.length - 1 - i;

    var frontChar = word.charAt(frontIndex);
    var backChar = word.charAt(backIndex);

    if (isCharValid(frontChar)) {
      frontWord += frontChar.toLowerCase();
    }

    if (isCharValid(backChar)) {
      backWord += backChar.toLowerCase();
    }
  }

  if (frontWord.length === 0) {
    return false;
  }

  return frontWord === backWord;
}

function isCharValid(char) {
  char = char.toLowerCase();
  const charCode = char.charCodeAt(0);

  const isDigit = isCharCodeDigit(charCode);
  const isLetter = isCharCodeLowerCaseLetter(charCode);

  // Numeric characters count as valid palindrome ingredients.
  const isValid = isDigit || isLetter;

  return isValid;
}

function isCharCodeLowerCaseLetter(charCode) {
  const isLowerCaseLetter = charCode >= CHAR_CODE_A && charCode <= CHAR_CODE_Z;

  return isLowerCaseLetter;
}

function isCharCodeDigit(charCode) {
  const isDigit = charCode >= CHAR_CODE_0 && charCode <= CHAR_CODE_9;

  return isDigit;
}

// MAIN

(function main() {
  processInput();

  editableDiv.focus();
}())
