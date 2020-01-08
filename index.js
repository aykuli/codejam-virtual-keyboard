import keyboardKeys from './keyboardKeys.js';

class KeyboardVirtual {
  constructor() {
    this.isShiftPress = false;
    this.isAltLeftPress = false;
    this.isAltRightPress = false;
    this.isCtrlLeftPress = false;
    this.isCtrlRightPress = false;

    this.symbol = '';
    this.keyboard = document.createElement('div');
    this.textArea = document.createElement('textarea');
    this.pageLangBtn = document.createElement('button');
  }

  createMainElements() {
    // KeyboardLanguage changing
    if (localStorage.getItem('virtualKeyboardLang') === null) {
      localStorage.setItem('virtualKeyboardLang', 'EN');
    }

    // Creating textaree and keyboard div container
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    document.body.append(wrapper);

    this.pageLangBtn.className = 'page-lang';
    wrapper.append(this.pageLangBtn);
    this.pageLangBtn.insertAdjacentText('afterbegin', 'blabla');
    this.pageLangBtn.innerText = localStorage.getItem('virtualKeyboardLang');

    this.textArea.className = 'textarea';
    wrapper.append(this.textArea);
    this.textArea.setAttribute('type', 'textarea');
    this.textArea.focus();

    this.keyboard.className = 'keyboard';
    wrapper.append(this.keyboard);
  }

  createButtons() {
    // Creating buttons
    const rowNumbers = [14, 15, 13, 13, 9];
    for (let i = 0; i < 5; i += 1) {
      const row = document.createElement('div');
      row.className = 'row';
      this.keyboard.append(row);

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
  }

  caseUp() {
    this.isShiftPress = true;
    // Changing case view in index.html to Uppercase
    document.querySelectorAll('.on').forEach(key => {
      key.children[0].classList.remove('case-shown');
      key.children[0].classList.add('case-hidden');
      key.children[1].classList.add('case-shown');
      key.children[1].classList.remove('case-hidden');
    });
  }

  // Changing case view in index.html to lowercase
  caseDown() {
    this.isShiftPress = false;
    document.querySelectorAll('.on').forEach(key => {
      key.children[0].classList.add('case-shown');
      key.children[0].classList.remove('case-hidden');
      key.children[1].classList.remove('case-shown');
      key.children[1].classList.add('case-hidden');
    });
  }

  setCaretPosition(pos) {
    if (this.textArea.setSelectionRange) {
      this.textArea.focus();
      this.textArea.setSelectionRange(pos, pos);
    } else if (this.textArea.createTextRange) {
      const range = this.textArea.createTextRange();
      range.collapse(true);
      range.moveEnd('', pos);
      range.moveStart('', pos);
      range.select();
    }
  }

  // Highlighting buttins pressed on real keyboard
  activeBtnHighlighting(specialBtnEl) {
    if (this.isShiftPress) {
      this.isShiftPress = true;
      specialBtnEl.classList.add('active');
    } else {
      this.isShiftPress = false;
      specialBtnEl.classList.remove('active');
    }
  }

  // Language chanching pressing on button on page
  pageLangChanging() {
    if (localStorage.getItem('virtualKeyboardLang') === 'EN') {
      localStorage.removeItem('virtualKeyboardLang');
      localStorage.setItem('virtualKeyboardLang', 'RU');
    } else if (localStorage.getItem('virtualKeyboardLang') === 'RU') {
      localStorage.removeItem('virtualKeyboardLang');
      localStorage.setItem('virtualKeyboardLang', 'EN');
    }
    this.pageLangBtn.innerText = localStorage.getItem('virtualKeyboardLang');

    this.keyboard.querySelectorAll('.row').forEach(row => {
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
  symbolChoise(el) {
    const [, , ruLowerCase, ruUpperCase, enLowerCase, enUpperCase] = el;
    if (localStorage.getItem('virtualKeyboardLang') === 'RU' && this.isShiftPress) {
      this.symbol = ruUpperCase;
    } else if (localStorage.getItem('virtualKeyboardLang') === 'RU' && !this.isShiftPress) {
      this.symbol = ruLowerCase;
    } else if (localStorage.getItem('virtualKeyboardLang') === 'EN' && this.isShiftPress) {
      this.symbol = enUpperCase;
    } else if (localStorage.getItem('virtualKeyboardLang') === 'EN' && !this.isShiftPress) {
      this.symbol = enLowerCase;
    }
  }

  // Function that printing symbols
  printingInTextArea(evt) {
    this.symbol = '';
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
          ) {
            const [, , ruLowerCase, ruUpperCase, enLowerCase, enUpperCase] = el;
            if (localStorage.getItem('virtualKeyboardLang') === 'RU' && this.isShiftPress) {
              this.symbol = ruUpperCase;
            } else if (localStorage.getItem('virtualKeyboardLang') === 'RU' && !this.isShiftPress) {
              this.symbol = ruLowerCase;
            } else if (localStorage.getItem('virtualKeyboardLang') === 'EN' && this.isShiftPress) {
              this.symbol = enUpperCase;
            } else if (localStorage.getItem('virtualKeyboardLang') === 'EN' && !this.isShiftPress) {
              this.symbol = enLowerCase;
            }
          }
        });
      });

      if (specialBtn === 'tab') {
        this.symbol = '  ';
      }

      if (specialBtn === 'enter') {
        this.symbol = '\n';
      }
      // Adding symbol to textArea
      this.textArea.setRangeText(
        this.symbol,
        this.textArea.selectionStart,
        this.textArea.selectionEnd,
        'end',
      );

      if (specialBtn === 'backspace') {
        if (this.textArea.selectionStart > 0) {
          const pos = this.textArea.selectionStart;
          this.textArea.value =
            this.textArea.value.slice(0, pos - 1) +
            this.textArea.value.slice(pos, this.textArea.value.length);
          this.textArea.setRangeText('', pos - 1, pos - 1, 'end');
        }
      }

      if (specialBtn === 'del') {
        const pos = this.textArea.selectionStart;
        if (this.textArea.selectionStart <= this.textArea.value.length) {
          this.textArea.value =
            this.textArea.value.slice(0, pos) +
            this.textArea.value.slice(pos, this.textArea.value.length);
          this.textArea.setRangeText('', pos, pos + 1, 'end');
        }
      }

      const specialBtnEl = document.querySelector(`.${specialBtn}`);
      if (
        specialBtn === 'shift-left' ||
        specialBtn === 'shift-right' ||
        specialBtn === 'capslock'
      ) {
        if (!this.isShiftPress) {
          specialBtnEl.classList.add('active');
          this.caseUp();
        } else {
          specialBtnEl.classList.remove('active');
          this.caseDown();
        }
      }

      if (specialBtn === 'arrow') {
        const pos = this.textArea.selectionStart;

        if (targetBtnName === 'ArrowUp') {
          this.setCaretPosition(pos - 70);
        } else if (targetBtnName === 'ArrowRight') {
          this.setCaretPosition(pos + 1);
        } else if (targetBtnName === 'ArrowDown') {
          this.setCaretPosition(pos + 70);
        } else if (targetBtnName === 'ArrowLeft') {
          if (this.textArea.selectionStart > 0) this.setCaretPosition(pos - 1);
        }
      }

      if (specialBtn === 'alt-left') {
        this.isAltLeftPress = this.activeBtnHighlighting(this.isAltLeftPress, specialBtnEl);
      }

      if (specialBtn === 'alt-right') {
        this.isAltRightPress = this.activeBtnHighlighting(this.isAltRightPress, specialBtnEl);
      }

      if (specialBtn === 'ctrl-left') {
        this.isCtrlLeftPress = this.activeBtnHighlighting(this.isCtrlLeftPress, specialBtnEl);
      }

      if (specialBtn === 'ctrl-right') {
        this.isCtrlRightPress = this.activeBtnHighlighting(this.isCtrlRightPress, specialBtnEl);
      }
    }
    this.textArea.focus();
  }

  keyDownOnRealKeyboard(evt) {
    if (evt.shiftKey) {
      this.caseUp();
    }

    if (evt.shiftKey && evt.altKey) this.pageLangChanging();

    this.textArea.focus();
    this.symbol = '';

    keyboardKeys.forEach(row => {
      row.forEach(el => {
        if (
          el[1] === evt.code &&
          evt.key !== 'Backspace' &&
          evt.key !== 'Delete' &&
          evt.key !== 'CapsLock' &&
          evt.key !== 'Shift' &&
          evt.key !== 'Control' &&
          evt.key !== 'Meta' &&
          evt.key !== 'Enter' &&
          evt.key !== 'Alt' &&
          evt.key !== 'Tab' &&
          evt.key !== 'ArrowUp' &&
          evt.key !== 'ArrowRight' &&
          evt.key !== 'ArrowDown' &&
          evt.key !== 'ArrowLeft'
        ) {
          evt.preventDefault();
          const [, , ruLowerCase, ruUpperCase, enLowerCase, enUpperCase] = el;
          if (localStorage.getItem('virtualKeyboardLang') === 'RU' && this.isShiftPress) {
            this.symbol = ruUpperCase;
          } else if (localStorage.getItem('virtualKeyboardLang') === 'RU' && !this.isShiftPress) {
            this.symbol = ruLowerCase;
          } else if (localStorage.getItem('virtualKeyboardLang') === 'EN' && this.isShiftPress) {
            this.symbol = enUpperCase;
          } else if (localStorage.getItem('virtualKeyboardLang') === 'EN' && !this.isShiftPress) {
            this.symbol = enLowerCase;
          }
        }
      });
    });

    this.textArea.setRangeText(
      this.symbol,
      this.textArea.selectionStart,
      this.textArea.selectionEnd,
      'end',
    );

    // Highliting keyboard pressing symbols
    this.keyboard.querySelectorAll('.row').forEach(row => {
      row.querySelectorAll('.key').forEach(symb => {
        if (evt.code === symb.children[0].classList[0]) {
          if (evt.key === 'CapsLock') {
            if (symb.classList.contains('active')) {
              symb.classList.remove('active');
              this.caseDown();
              this.isShiftPress = false;
            } else {
              symb.classList.add('active');
              this.caseUp();
              this.isShiftPress = true;
            }
          } else {
            symb.classList.add('active');
          }
        }
      });
    });
  }

  keyUpOnRealKeyboard(evt) {
    this.caseDown();

    this.keyboard.querySelectorAll('.row').forEach(row => {
      row.querySelectorAll('.key').forEach(key => {
        if (evt.code === key.children[0].classList[0] && evt.key !== 'CapsLock') {
          key.classList.remove('active');
        }
      });
    });
  }
}

const virtualKeyboard = new KeyboardVirtual();
virtualKeyboard.createMainElements();
virtualKeyboard.createButtons();

document.addEventListener('click', evt => {
  if (evt.target.classList.contains('page-lang')) {
    virtualKeyboard.pageLangChanging(evt);
  } else {
    virtualKeyboard.printingInTextArea(evt);
  }
});

document.addEventListener('keydown', evt => {
  virtualKeyboard.keyDownOnRealKeyboard(evt);
});

document.addEventListener('keyup', evt => {
  virtualKeyboard.keyUpOnRealKeyboard(evt);
});

window.onbeforeunload = () => {
  return 'Есть несохранённые изменения. Всё равно уходим?';
};
