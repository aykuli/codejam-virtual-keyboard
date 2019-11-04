import keyboardKeys from './keyboardKeys.js';

// Creating textaree and keyboard div container
const wrapper = document.createElement('div');
wrapper.className = 'wrapper';
document.body.append(wrapper);

const pageLangBtn = document.createElement('button');
pageLangBtn.className = 'page-lang';
wrapper.append(pageLangBtn);
pageLangBtn.insertAdjacentText('afterbegin', 'blabla');
pageLangBtn.innerText = localStorage.getItem('virtualKeyboardLang');

const textArea = document.createElement('textarea');
textArea.className = 'textarea';
wrapper.append(textArea);
textArea.setAttribute('type', 'textarea');
textArea.focus();

const keyboard = document.createElement('div');
keyboard.className = 'keyboard';
wrapper.append(keyboard);

// KeyboardLanguage changing
if (localStorage.getItem('virtualKeyboardLang') === null) {
  localStorage.setItem('virtualKeyboardLang', 'EN');
}

// Creating buttons
const rowNumbers = [14, 15, 13, 13, 9];
for (let i = 0; i < 5; i += 1) {
  const row = document.createElement('div');
  row.className = 'row';
  keyboard.append(row);

  for (let j = 0; j < rowNumbers[i]; j += 1) {
    const key = document.createElement('button');
    key.className = `key ${keyboardKeys[i][j][0]}`;
    row.append(key);

    const spanEn = document.createElement('span');
    const spanEnUp = document.createElement('span');
    const spanEnDown = document.createElement('span');
    const spanRu = document.createElement('span');
    const spanRuUp = document.createElement('span');
    const spanRuDown = document.createElement('span');

    let [langOn, langOff] = [' on', ' off'];
    if (localStorage.getItem('virtualKeyboardLang') === 'EN') {
      langOn = ' on';
      langOff = ' off';
    } else {
      langOn = ' off';
      langOff = ' on';
    }
    spanEn.className = keyboardKeys[i][j][1] + langOn;
    spanRu.className = keyboardKeys[i][j][1] + langOff;

    key.append(spanEn);
    key.append(spanRu);

    spanRuDown.className = 'case-shown';
    spanRu.append(spanRuDown);
    spanRuDown.insertAdjacentText('afterbegin', keyboardKeys[i][j][2]);

    spanRuUp.className = 'case-hidden';
    spanRu.append(spanRuUp);
    spanRuUp.insertAdjacentText('afterbegin', keyboardKeys[i][j][3]);

    spanEnDown.className = 'case-shown';
    spanEn.append(spanEnDown);
    spanEnDown.insertAdjacentText('afterbegin', keyboardKeys[i][j][4]);

    spanEnUp.className = 'case-hidden';
    spanEn.append(spanEnUp);
    spanEnUp.insertAdjacentText('afterbegin', keyboardKeys[i][j][5]);
  }
}
// flags of special button pressed/not pressed
let shiftPress = false;
let [altLeftPress, altRightPress] = [false, false];
let [ctrlLeftPress, ctrlRightPress] = [false, false];

function caseUp() {
  shiftPress = true;
  // Changing case view in index.html to Uppercase
  document.querySelectorAll('.on').forEach(key => {
    key.children[0].classList.remove('case-shown');
    key.children[0].classList.add('case-hidden');
    key.children[1].classList.add('case-shown');
    key.children[1].classList.remove('case-hidden');
  });
}

// Changing case view in index.html to undercase
function caseDown() {
  shiftPress = false;
  document.querySelectorAll('.on').forEach(key => {
    key.children[0].classList.add('case-shown');
    key.children[0].classList.remove('case-hidden');
    key.children[1].classList.remove('case-shown');
    key.children[1].classList.add('case-hidden');
  });
}

function setCaretPosition(elem, pos) {
  if (elem.setSelectionRange) {
    elem.focus();
    elem.setSelectionRange(pos, pos);
  } else if (elem.createTextRange) {
    const range = elem.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
}
// Highlighting buttins pressed on real keyboard
function activeBtnHighlighting(btnPress, specialBtnEl) {
  let btnPressCopy = btnPress;
  if (!btnPress) {
    btnPressCopy = true;
    specialBtnEl.classList.add('active');
  } else {
    btnPressCopy = false;
    specialBtnEl.classList.remove('active');
  }
  return btnPressCopy;
}

// Language chanching pressing on button on page
function pageLangChanging() {
  if (localStorage.getItem('virtualKeyboardLang') === 'EN') {
    localStorage.removeItem('virtualKeyboardLang');
    localStorage.setItem('virtualKeyboardLang', 'RU');
  } else if (localStorage.getItem('virtualKeyboardLang') === 'RU') {
    localStorage.removeItem('virtualKeyboardLang');
    localStorage.setItem('virtualKeyboardLang', 'EN');
  }
  pageLangBtn.innerText = localStorage.getItem('virtualKeyboardLang');

  keyboard.querySelectorAll('.row').forEach(row => {
    row.querySelectorAll('.key').forEach(key => {
      const on = key.querySelector('.on');
      const off = key.querySelector('.off');
      on.classList.remove('on');
      on.classList.add('off');
      off.classList.remove('off');
      off.classList.add('on');
    });
  });
}
// Choosing symbol to print on depend of shift or caps pressed and language
function symbolChoise(el) {
  let res = '';
  const [, , ruLowerCase, ruUpperCase, enLowerCase, enUpperCase] = el;
  if (localStorage.getItem('virtualKeyboardLang') === 'RU' && shiftPress) {
    res = ruUpperCase;
  } else if (localStorage.getItem('virtualKeyboardLang') === 'RU' && !shiftPress) {
    res = ruLowerCase;
  } else if (localStorage.getItem('virtualKeyboardLang') === 'EN' && shiftPress) {
    res = enUpperCase;
  } else if (localStorage.getItem('virtualKeyboardLang') === 'EN' && !shiftPress) {
    res = enLowerCase;
  }
  return res;
}

// Function that printing symbols
function printingInTextArea(evt) {
  let symbol = '';
  const targetBtn = evt.target.closest('button');
  if (targetBtn) {
    const targetSpan = targetBtn.querySelector('.on');
    const targetBtnName = targetSpan.className.split(' ')[0];
    const specialBtn = targetBtn.classList[1];

    // Finding pressed symbol
    keyboardKeys.forEach(row => {
      row.forEach(el => {
        if (
          el[1] === targetBtnName &&
          (specialBtn === undefined ||
            specialBtn === 'space' ||
            specialBtn === 'tab' ||
            specialBtn === 'enter')
        )
          symbol = symbolChoise(el);
      });
    });

    if (specialBtn === 'tab') {
      symbol = '  ';
    }

    if (specialBtn === 'enter') {
      symbol = '\n';
    }
    // Adding symbol to textArea
    textArea.setRangeText(symbol, textArea.selectionStart, textArea.selectionEnd, 'end');

    if (specialBtn === 'backspace') {
      if (textArea.selectionStart > 0) {
        const pos = textArea.selectionStart;
        textArea.value =
          textArea.value.slice(0, pos - 1) + textArea.value.slice(pos, textArea.value.length);
        textArea.setRangeText('', pos - 1, pos - 1, 'end');
      }
    }

    if (specialBtn === 'del') {
      const pos = textArea.selectionStart;
      if (textArea.selectionStart <= textArea.value.length) {
        textArea.value =
          textArea.value.slice(0, pos) + textArea.value.slice(pos + 1, textArea.value.length);
        textArea.setRangeText('', pos, pos, 'end');
      }
    }

    const specialBtnEl = document.querySelector(`.${specialBtn}`);
    if (specialBtn === 'shift-left' || specialBtn === 'shift-right' || specialBtn === 'capslock') {
      if (!shiftPress) {
        specialBtnEl.classList.add('active');
        caseUp();
      } else {
        specialBtnEl.classList.remove('active');
        caseDown();
      }
    }

    if (specialBtn === 'arrow') {
      const pos = textArea.selectionStart;

      if (targetBtnName === 'ArrowUp') {
        if (textArea.selectionStart > 69) setCaretPosition(textArea, pos - 69);
      } else if (targetBtnName === 'ArrowRight') {
        setCaretPosition(textArea, pos + 1);
      } else if (targetBtnName === 'ArrowDown') {
        setCaretPosition(textArea, pos + 69);
      } else if (targetBtnName === 'ArrowLeft') {
        if (textArea.selectionStart > 0) setCaretPosition(textArea, pos - 1);
      }
    }

    if (specialBtn === 'alt-left') {
      altLeftPress = activeBtnHighlighting(altLeftPress, specialBtnEl);
    }

    if (specialBtn === 'alt-right') {
      altRightPress = activeBtnHighlighting(altRightPress, specialBtnEl);
    }

    if (specialBtn === 'ctrl-left') {
      ctrlLeftPress = activeBtnHighlighting(ctrlLeftPress, specialBtnEl);
    }

    if (specialBtn === 'ctrl-right') {
      ctrlRightPress = activeBtnHighlighting(ctrlRightPress, specialBtnEl);
    }
  }
  textArea.focus();
}

document.addEventListener('keydown', evt => {
  if (evt.shiftKey) {
    caseUp();
  }
});
keyboard.addEventListener('click', printingInTextArea);
document.addEventListener('keyup', caseDown);
document.addEventListener('keydown', evt => {
  if (evt.shiftKey && evt.altKey) pageLangChanging();
});
pageLangBtn.addEventListener('click', pageLangChanging);

document.addEventListener('keydown', evt => {
  let symbol = '';
  textArea.focus();

  keyboardKeys.forEach(row => {
    row.forEach(el => {
      if (
        el[1] === evt.code &&
        evt.code !== 'Backspace' &&
        evt.code !== 'Delete' &&
        evt.code !== 'CapsLock' &&
        evt.code !== 'ShiftLeft' &&
        evt.code !== 'ShiftRight' &&
        evt.code !== 'ControlLeft' &&
        evt.code !== 'ControlRight' &&
        evt.code !== 'MetaLeft' &&
        evt.code !== 'AltLeft' &&
        evt.code !== 'AltRight' &&
        evt.code !== 'ArrowUp' &&
        evt.code !== 'ArrowRight' &&
        evt.code !== 'ArrowDown' &&
        evt.code !== 'ArrowLeft'
      ) {
        evt.preventDefault();
        symbol = symbolChoise(el);
      }
    });
  });

  if (evt.code === 'Tab') {
    symbol = '  ';
  }

  if (evt.code === 'Enter') {
    symbol = '\n';
  }

  if (evt.code === 'Backspace') {
    if (textArea.selectionStart > 0) {
      const pos = textArea.selectionStart;
      textArea.value =
        textArea.value.slice(0, pos - 1) + textArea.value.slice(pos, textArea.value.length);
      textArea.setRangeText('', pos - 1, pos - 1, 'end');
    }
  }

  if (evt.code === 'Delete') {
    const pos = textArea.selectionStart;
    if (textArea.selectionStart <= textArea.value.length) {
      textArea.value =
        textArea.value.slice(0, pos) + textArea.value.slice(pos + 1, textArea.value.length);
      textArea.setRangeText('', pos, pos, 'end');
    }
  }

  const pos = textArea.selectionStart;

  if (evt.code === 'ArrowUp') {
    setCaretPosition(textArea, pos - 69);
  } else if (evt.code === 'ArrowRight') {
    setCaretPosition(textArea, pos + 1);
  } else if (evt.code === 'ArrowDown') {
    setCaretPosition(textArea, pos + 69);
  } else if (evt.code === 'ArrowLeft') {
    if (textArea.selectionStart > 0) setCaretPosition(textArea, pos - 1);
  }

  textArea.setRangeText(symbol, textArea.selectionStart, textArea.selectionEnd, 'end');

  // Highliting keyboard pressing symbols
  keyboard.querySelectorAll('.row').forEach(row => {
    row.querySelectorAll('.key').forEach(symb => {
      if (evt.code === symb.children[0].classList[0]) {
        if (evt.code === 'CapsLock') {
          if (symb.classList.contains('active')) {
            symb.classList.remove('active');
            caseDown();
            shiftPress = false;
          } else {
            symb.classList.add('active');
            caseUp();
            shiftPress = true;
          }
        } else {
          symb.classList.add('active');
        }
      }
    });
  });
});
document.addEventListener('keyup', evt => {
  keyboard.querySelectorAll('.row').forEach(row => {
    row.querySelectorAll('.key').forEach(key => {
      if (evt.code === key.children[0].classList[0] && evt.code !== 'CapsLock') {
        key.classList.remove('active');
      }
    });
  });
});
