
// CONSTANTS

var CHAR_CODE_A = 'a'.charCodeAt(0);
var CHAR_CODE_Z = 'z'.charCodeAt(0);
var CHAR_CODE_0 = '0'.charCodeAt(0);
var CHAR_CODE_9 = '9'.charCodeAt(0);

var SANITIZED_CHARS = {
  '<': '(',
  '>': ')',
  '&': '+',
}

// DOM SELECTORS

var editableDiv = document.querySelector('#editable-div');
var mirrorDiv = document.querySelector('#editable-div-mirror');

// EVENT BINDINGS

editableDiv.addEventListener('paste', function(event) {
  var pastedText = event.clipboardData.getData('text/plain');
  var sanitizedLines = getSanitizedLines(pastedText);

  populateChildDivs(this, sanitizedLines);
  processInput();

  // prevent normal input on paste
  event.preventDefault();
});

editableDiv.addEventListener('input', processInput);

// FUNCTIONS

// sanitize html while splitting, for improved performance
function getSanitizedLines(text) {
  var lines = [];
  var currentLine = '';

  for (var i = 0; i < text.length; i++) {
    var char = text.charAt(i);

    //replace '&nbsp;' with ' '
    if (char === '&') {
      var charsToSkip = skipNonBreakingSpace(text, i);

      if (charsToSkip > 0) {
        char = ' ';
        // skip ahead past the rest of the special sequence
        i += charsToSkip;
      }
    }

    char = sanitizeChar(char);

    // make sure the final line is added, by checking for the end
    var endReached = i === text.length - 1;

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
  var charsToSkip = 0;

  // need to detect both with and without semicolon, since both technically get rendered as a blank space between words.
  var checkStringShort = string.substring(index, index + 5);
  var checkStringLong = string.substring(index, index + 6);

  var nonBreakingShort = '&nbsp';
  var nonBreakingLong =  '&nbsp;';

  var shortFound = checkStringShort === nonBreakingShort;
  var longFound = checkStringLong === nonBreakingLong;

  if (longFound) {
    charsToSkip = 5;
  } else if (shortFound) {
    charsToSkip = 4;
  }

  return charsToSkip;
}

// used to strip html from the text
function sanitizeChar(char) {
  var sanitized = char;

  if (SANITIZED_CHARS[char]) {
    sanitized = SANITIZED_CHARS[char];
  }

  return sanitized;
}

// while typing content, content-editable divs represent each new line as a div. This converts pasted text into a consistent format
function populateChildDivs(parentDiv, lines) {
  parentDiv.textContent = '';

  for (line of lines) {
    var div = document.createElement('div');

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
  var editableDivChildren = editableDiv.children;
  var noChildDiv = editableDivChildren.length === 0;

  // single line of text
  if (noChildDiv) {
    // when text is longer than one line, content-editable divs represent each line as its own div. Wrap a single line in a div as well, so that expectations can be consistent for later functions.
    var inputText = editableDiv.textContent;
    var inputDiv = wrapTextInDiv(inputText);

    mirrorDiv.innerHTML = '';
    mirrorDiv.appendChild(inputDiv);
  // multiple lines of text
  } else {
    mirrorDiv.innerHTML = editableDiv.innerHTML;
  }
}

function wrapTextInDiv(text) {
  var div = document.createElement('div');

  div.textContent = text;

  return div;
}

function highlightAllPalindromes() {
  var childDivs = mirrorDiv.children;

  for (div of childDivs) {
    var divHTML = div.innerHTML;

    // preserve the html of <br> divs, which are used by content-editable divs as spacers
    if (divHTML != '<br>') {
      highlightPalindromesInDiv(div);
    }
  }
}

function highlightPalindromesInDiv(div) {
  var divText = div.textContent;
  var currentWord = '';
  var highlightedContent = '';

  for (var i = 0; i < divText.length; i++) {
    var char = divText.charAt(i);

    char = sanitizeChar(char);

    // check for end of text, to make sure final word (or only word) is added.
    var endReached = i === divText.length - 1;

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
  var frontWord = '';
  var backWord = '';

  for (var i = 0; i < word.length; i++) {
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
  var charCode = char.charCodeAt(0);

  var isDigit = isCharCodeDigit(charCode);
  var isLetter = isCharCodeLowerCaseLetter(charCode);

  // Numeric characters count as valid palindrome ingredients.
  var isValid = isDigit || isLetter;

  return isValid;
}

function isCharCodeLowerCaseLetter(charCode) {
  var isLowerCaseLetter = charCode >= CHAR_CODE_A && charCode <= CHAR_CODE_Z;

  return isLowerCaseLetter;
}

function isCharCodeDigit(charCode) {
  var isDigit = charCode >= CHAR_CODE_0 && charCode <= CHAR_CODE_9;

  return isDigit;
}

// MAIN

(function main() {
  processInput();

  editableDiv.focus();
}())
