'use strict'
// const keyboardKeys = require('./keyboard-keys');
import {keyboardKeys} from './keyboard-keys.js'

// Creating textaree and keyboard div container
let wrapper = document.createElement("div");
wrapper.className = "wrapper";
document.body.append(wrapper);

let pageLangBtn = document.createElement("button");
pageLangBtn.className = "page-lang";
wrapper.append(pageLangBtn);
pageLangBtn.insertAdjacentText("afterbegin", "blabla");
pageLangBtn.innerText = localStorage.getItem("virtualKeyboardLang");

let textArea = document.createElement("textarea");
textArea.className = "textarea";
wrapper.append(textArea);
textArea.setAttribute("type", "textarea");
textArea.focus();

let keyboard = document.createElement("div");
keyboard.className = "keyboard";
wrapper.append(keyboard);

//KeyboardLanguage changing
if (localStorage.getItem("virtualKeyboardLang") === null) {
  localStorage.setItem("virtualKeyboardLang", "EN");
}

// Creating buttons
let rowNumbers = [14, 15, 13, 13, 9];
for (let i = 0; i < 5; i++) {
  var row = document.createElement("div");
  row.className = "row";
  keyboard.append(row);

  for (let j = 0; j < rowNumbers[i]; j++) {
    var key = document.createElement("button");
    key.className = "key " + keyboardKeys[i][j][0];
    row.append(key);

    let spanEn = document.createElement("span");
    let spanEnUp = document.createElement("span");
    let spanEnDown = document.createElement("span");
    let spanRu = document.createElement("span");
    let spanRuUp = document.createElement("span");
    let spanRuDown = document.createElement("span");

    let [langOn, langOff] = [" on", " off"];
    if (localStorage.getItem("virtualKeyboardLang") === "EN") {
      langOn = " on";
      langOff = " off";
    } else {
      langOn = " off";
      langOff = " on";
    }
    spanEn.className = keyboardKeys[i][j][1] + langOn;
    spanRu.className = keyboardKeys[i][j][1] + langOff;

    key.append(spanEn);
    key.append(spanRu);

    spanRuDown.className = "case-shown";
    spanRu.append(spanRuDown);
    spanRuDown.insertAdjacentText("afterbegin", keyboardKeys[i][j][2]);

    spanRuUp.className = "case-hidden";
    spanRu.append(spanRuUp);
    spanRuUp.insertAdjacentText("afterbegin", keyboardKeys[i][j][3]);

    spanEnDown.className = "case-shown";
    spanEn.append(spanEnDown);
    spanEnDown.insertAdjacentText("afterbegin", keyboardKeys[i][j][4]);

    spanEnUp.className = "case-hidden";
    spanEn.append(spanEnUp);
    spanEnUp.insertAdjacentText("afterbegin", keyboardKeys[i][j][5]);
  }
}
//flags of special button pressed/not pressed
let shiftPress = false;
let [altLeftPress, altRightPress] = [false, false];
let [ctrlLeftPress, ctrlRightPress] = [false, false];

function caseUp() {
  shiftPress = true;
  // Changing case view in index.html to Uppercase
  document.querySelectorAll(".on").forEach(key => {
    key.children[0].classList.remove("case-shown");
    key.children[0].classList.add("case-hidden");
    key.children[1].classList.add("case-shown");
    key.children[1].classList.remove("case-hidden");
  });
}

// Changing case view in index.html to undercase
function caseDown() {
  shiftPress = false;
  document.querySelectorAll(".on").forEach(key => {
    key.children[0].classList.add("case-shown");
    key.children[0].classList.remove("case-hidden");
    key.children[1].classList.remove("case-shown");
    key.children[1].classList.add("case-hidden");
  });
}

function shiftUpKeyboard(evt) {
  if (evt.shiftKey) {
    caseUp();
  }
}

function shiftDownKeyboard() {
  caseDown();
}

function setCaretPosition(elem, pos) {
  if (elem.setSelectionRange) {
    elem.focus();
    elem.setSelectionRange(pos, pos);
  } else if (elem.createTextRange) {
    var range = elem.createTextRange();
    range.collapse(true);
    range.moveEnd("character", pos);
    range.moveStart("character", pos);
    range.select();
  }
}
//Language chanching pressing on button on page
function pageLangChanging() {
  if (localStorage.getItem("virtualKeyboardLang") === "EN") {
    localStorage.removeItem("virtualKeyboardLang");
    localStorage.setItem("virtualKeyboardLang", "RU");
  } else if (localStorage.getItem("virtualKeyboardLang") === "RU") {
    localStorage.removeItem("virtualKeyboardLang");
    localStorage.setItem("virtualKeyboardLang", "EN");
  }
  pageLangBtn.innerText = localStorage.getItem("virtualKeyboardLang");

  keyboard.querySelectorAll(".row").forEach(row => {
    row.querySelectorAll(".key").forEach(key => {
      let on = key.querySelector(".on");
      let off = key.querySelector(".off");
      on.classList.remove("on");
      on.classList.add("off");
      off.classList.remove("off");
      off.classList.add("on");
    });
  });
}

//Function that printing symbols
function printingInTextArea(evt) {
  let symbol = "";
  let targetBtn = evt.target.closest("button");
  if (targetBtn) {
    let targetSpan = targetBtn.querySelector(".on");
    let targetBtnName = targetSpan.className.split(" ")[0];
    let specialBtn = targetBtn.classList[1];

    // Finding pressed symbol
    keyboardKeys.forEach(row => {
      row.forEach(el => {
        if (
          el[1] === targetBtnName &&
          (specialBtn === undefined ||
            specialBtn === "space" ||
            specialBtn === "tab" ||
            specialBtn === "enter")
        ) {
          if (localStorage.getItem("virtualKeyboardLang") === "RU") {
            shiftPress ? (symbol = el[3]) : (symbol = el[2]);
          } else shiftPress ? (symbol = el[5]) : (symbol = el[4]);
        }
      });
    });

    if (specialBtn === "tab") {
      symbol = "  ";
    }

    if (specialBtn === "enter") {
      symbol = "\n";
    }
    // Adding symbol to textArea
    textArea.setRangeText(
      symbol,
      textArea.selectionStart,
      textArea.selectionEnd,
      "end"
    );

    if (specialBtn === "backspace") {
      if (textArea.selectionStart > 0) {
        let pos = textArea.selectionStart;
        textArea.value =
          textArea.value.slice(0, pos - 1) +
          textArea.value.slice(pos, textArea.value.length);
        textArea.setRangeText("", pos - 1, pos - 1, "end");
      }
    }

    if (specialBtn === "del") {
      let pos = textArea.selectionStart;
      if (textArea.selectionStart <= textArea.value.length) {
        textArea.value =
          textArea.value.slice(0, pos) +
          textArea.value.slice(pos + 1, textArea.value.length);
        textArea.setRangeText("", pos, pos, "end");
      }
    }

    let specialBtnEl = document.querySelector("." + specialBtn);
    if (
      specialBtn === "shift-left" ||
      specialBtn === "shift-right" ||
      specialBtn === "capslock"
    ) {
      if (shiftPress === false) {
        specialBtnEl.classList.add("active");
        caseUp();
      } else {
        specialBtnEl.classList.remove("active");
        caseDown();
      }
    }

    if (specialBtn === "arrow") {
      let pos = textArea.selectionStart;

      if (targetBtnName === "ArrowUp") {
        if (textArea.selectionStart > 69) setCaretPosition(textArea, pos - 60);
      } else if (targetBtnName === "ArrowRight") {
        setCaretPosition(textArea, pos + 1);
      } else if (targetBtnName === "ArrowDown") {
        setCaretPosition(textArea, pos + 60);
      } else if (targetBtnName === "ArrowLeft") {
        if (textArea.selectionStart > 0) setCaretPosition(textArea, pos - 1);
      }
    }

    if (specialBtn === "alt-left") {
      altLeftPress = activeBtnHighlighting(altLeftPress, specialBtnEl);
    }

    if (specialBtn === "alt-right") {
      altRightPress = activeBtnHighlighting(altRightPress, specialBtnEl);
    }

    if (specialBtn === "ctrl-left") {
      ctrlLeftPress = activeBtnHighlighting(ctrlLeftPress, specialBtnEl);
    }

    if (specialBtn === "ctrl-right") {
      ctrlRightPress = activeBtnHighlighting(ctrlRightPress, specialBtnEl);
    }
  }
  textArea.focus();
}

function activeBtnHighlighting(btnPress, specialBtnEl) {
  // console.log('btnPress =', btnPress);
  if (btnPress === false) {
    btnPress = true;
    specialBtnEl.classList.add("active");
  } else {
    btnPress = false;
    specialBtnEl.classList.remove("active");
  }
  return btnPress;
}

document.addEventListener("keydown", shiftUpKeyboard);
keyboard.addEventListener("click", printingInTextArea);
document.addEventListener("keyup", shiftDownKeyboard);
document.addEventListener("keydown", evt => {
  if (evt.shiftKey && evt.altKey) pageLangChanging();
});
pageLangBtn.addEventListener("click", pageLangChanging);

//highliting keyboard pressing symbols
document.addEventListener("keydown", function(evt) {
  textArea.focus();
  keyboard.querySelectorAll(".row").forEach(row => {
    row.querySelectorAll(".key").forEach(key => {
      if (evt.code === key.children[0].classList[0]) {
        key.classList.add("active");
      }
    });
  });
});
document.addEventListener("keyup", function(evt) {
  keyboard.querySelectorAll(".row").forEach(row => {
    row.querySelectorAll(".key").forEach(key => {
      if (evt.code === key.children[0].classList[0]) {
        key.classList.remove("active");
      }
    });
  });
});
