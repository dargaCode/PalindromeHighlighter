
// DOM SELECTORS

var editableDiv = document.querySelector('#editable-div');
var mirrorDiv = document.querySelector('#editable-div-mirror');

// EVENT BINDINGS

editableDiv.addEventListener('input', processText);

// FUNCTIONS

function processText() {
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
  const charCodeA = 'a'.charCodeAt(0);
  const charCodeZ = 'z'.charCodeAt(0);

  const isLowerCaseLetter = charCode >= charCodeA && charCode <= charCodeZ;

  return isLowerCaseLetter;
}

function isCharCodeDigit(charCode) {
  const charCodeZero = '0'.charCodeAt(0);
  const charCodeNine = '9'.charCodeAt(0);

  const isDigit = charCode >= charCodeZero && charCode <= charCodeNine;

  return isDigit;
}

// MAIN

(function main() {
  processText();

  editableDiv.focus();
}())
