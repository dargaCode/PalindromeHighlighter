
// CONSTANTS

const CHAR_CODE_A = 'a'.charCodeAt(0);
const CHAR_CODE_Z = 'z'.charCodeAt(0);
const CHAR_CODE_0 = '0'.charCodeAt(0);
const CHAR_CODE_9 = '9'.charCodeAt(0);

const SANITIZED_CHARS = {
  '<': '(',
  '>': ')',
  '&': '+',
}

// DOM SELECTORS

var editableDiv = document.querySelector('#editable-div');
var mirrorDiv = document.querySelector('#editable-div-mirror');

// EVENT BINDINGS

editableDiv.addEventListener('paste', function(event) {
  const pastedText = event.clipboardData.getData('text/plain');
  const sanitizedLines = getSanitizedLines(pastedText);

  populateChildDivs(this, sanitizedLines);
  processInput();

  // prevent normal input on paste
  event.preventDefault();
});

editableDiv.addEventListener('input', processInput);

// FUNCTIONS

// sanitize html while splitting, for improved performance
function getSanitizedLines(text) {
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < text.length; i++) {
    let char = text.charAt(i);

    //replace '&nbsp;' with ' '
    if (char === '&') {
      const charsToSkip = skipNonBreakingSpace(text, i);

      if (charsToSkip > 0) {
        char = ' ';
        // skip ahead past the rest of the special sequence
        i += charsToSkip;
      }
    }

    char = sanitizeChar(char);

    // make sure the final line is added, by checking for the end
    const endReached = i === text.length - 1;

    if (char === '\n') {
      lines.push(currentLine);
      currentLine = '';
    } else if (endReached) {
      currentLine += char;
      lines.push(currentLine);
    }
      else {
      currentLine += char;
    }
  }

  return lines;
}

// detect '&nbsp' html element, so it can be skipped and converted into an empty space.
function skipNonBreakingSpace(string, index) {
  let charsToSkip = 0;

  // need to detect both with and without semicolon, since both technically get rendered as a blank space between words.
  const checkStringShort = string.substring(index, index + 5);
  const checkStringLong = string.substring(index, index + 6);

  const nonBreakingShort = '&nbsp';
  const nonBreakingLong =  '&nbsp;';

  const shortFound = checkStringShort === nonBreakingShort;
  const longFound = checkStringLong === nonBreakingLong;

  if (longFound) {
    charsToSkip = 5;
  } else if (shortFound) {
    charsToSkip = 4;
  }

  return charsToSkip;
}

// used to strip html from the text
function sanitizeChar(char) {
  let sanitized = char;

  if (SANITIZED_CHARS[char]) {
    sanitized = SANITIZED_CHARS[char];
  }

  return sanitized;
}

// while typing content, content-editable divs represent each new line as a div. This converts pasted text into a consistent format
function populateChildDivs(parentDiv, lines) {
  parentDiv.textContent = '';

  for (line of lines) {
    const div = document.createElement('div');

    // preserve empty lines in html
    if (line === '') {
      div.innerHTML = '</br>';
    } else {
      div.textContent = line;
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
    const divHTML = div.innerHTML;

    // preserve the html of <br> divs, which are used by content-editable divs as spacers
    if (divHTML != '<br>') {
      highlightPalindromesInDiv(div);
    }
  }
}

function highlightPalindromesInDiv(div) {
  const divText = div.textContent;
  let currentWord = '';
  let highlightedContent = '';

  for (let i = 0; i < divText.length; i++) {
    let char = divText.charAt(i);

    char = sanitizeChar(char);

    // check for end of text, to make sure final word (or only word) is added.
    const endReached = i === divText.length - 1;

    // end of a word
    if (char === ' ') {
      // replace currentWord with highlight span
      currentWord = highlightPalindromicWord(currentWord);
      highlightedContent += currentWord;
      highlightedContent += ' ';
      currentWord = '';
    // last (or only) word in the string
    } else if (endReached) {
      currentWord += char;
      currentWord = highlightPalindromicWord(currentWord);
      highlightedContent += currentWord;
    // normal character
    } else {
      currentWord += char;
    }
  }

  div.innerHTML = highlightedContent;
}

function highlightPalindromicWord(word) {
  if (isPalindromicWord(word)) {
    word = `<span class="highlight">${word}</span>`;
  }

  return word;
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

  // no valid characters
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
