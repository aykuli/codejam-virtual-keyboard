keyboardKeys = [
  [
    ["", "Backquote", "ё", "Ё", "`", "~"],
    ["", "Digit1", "1", "!", "1", "!"],
    ["", "Digit2", "2", '"', "2", "@"],
    ["", "Digit3", "3", "№", "3", "#"],
    ["", "Digit4", "4", ";", "4", "$"],
    ["", "Digit5", "5", "%", "5", "%"],
    ["", "Digit6", "6", ":", "6", "^"],
    ["", "Digit7", "7", "?", "7", "&"],
    ["", "Digit8", "8", "*", "8", "*"],
    ["", "Digit9", "9", "(", "9", "("],
    ["", "Digit0", "0", ")", "0", ")"],
    ["", "Minus", "-", "_", "-", "_"],
    ["", "Equal", "=", "+", "=", "+"],
    [
      "backspace",
      "Backspace",
      "Backspace",
      "Backspace",
      "Backspace",
      "Backspace"
    ]
  ],
  [
    ["tab", "Tab", "Tab", "Tab", "Tab", "Tab"],
    ["", "KeyQ", "й", "Й", "q", "Q"],
    ["", "KeyW", "ц", "Ц", "w", "W"],
    ["", "KeyE", "у", "У", "e", "E"],
    ["", "KeyR", "к", "К", "r", "R"],
    ["", "KeyT", "е", "Е", "t", "T"],
    ["", "KeyY", "н", "Н", "y", "Y"],
    ["", "KeyU", "г", "Г", "u", "U"],
    ["", "KeyI", "ш", "Ш", "i", "I"],
    ["", "KeyO", "щ", "Щ", "o", "O"],
    ["", "KeyP", "з", "З", "p", "P"],
    ["", "BracketLeft", "х", "Х", "[", "{"],
    ["", "BracketRight", "ъ", "Ъ", "]", "}"],
    ["", "Backslash", "\\", "/", "\\", "|"],
    ["del", "Delete", "Del", "Del", "Del", "Del", "Del"]
  ],
  [
    [
      "capslock",
      "CapsLock",
      "CapsLock",
      "CapsLock",
      "CapsLock",
      "CapsLock",
      "CapsLock"
    ],
    ["", "KeyA", "ф", "Ф", "a", "A"],
    ["", "KeyS", "ы", "Ы", "s", "S"],
    ["", "KeyD", "в", "В", "d", "D"],
    ["", "KeyF", "а", "А", "f", "F"],
    ["", "KeyG", "п", "П", "g", "G"],
    ["", "KeyH", "р", "Р", "h", "H"],
    ["", "KeyJ", "о", "О", "j", "J"],
    ["", "KeyK", "л", "Л", "k", "K"],
    ["", "KeyL", "д", "Д", "l", "L"],
    ["", "Semicolon", "ж", "Ж", ";", ":"],
    ["", "Quote", "э", "Э", "'", '"'],
    ["enter", "Enter", "Enter", "Enter", "Enter", "Enter"]
  ],
  [
    ["shift", "Shift", "Shift", "Shift", "Shift", "Shift"],
    ["", "KeyZ", "я", "Я", "z", "Z"],
    ["", "KeyX", "ч", "Ч", "x", "X"],
    ["", "KeyC", "с", "С", "c", "C"],
    ["", "KeyV", "м", "М", "v", "V"],
    ["", "KeyB", "и", "И", "b", "B"],
    ["", "KeyN", "т", "Т", "n", "N"],
    ["", "KeyM", "ь", "Ь", "m", "M"],
    ["", "Comma", "б", "Б", ".", "<"],
    ["", "Period", "ю", "Ю", ",", ">"],
    ["", "Slash", ".", ",", "/", "?"],
    ["", "ArrowUp", "▲", "▲", "▲", "▲"],
    ["shift", "Shift", "Shift", "Shift", "Shift", "Shift"]
  ],
  [
    ["ctrl", "Ctrl", "Ctrl", "Ctrl", "Ctrl", "Ctrl"],
    ["win", "Win", "Win", "Win", "Win", "Win"],
    ["alt", "Alt", "Alt", "Alt", "Alt", "Alt"],
    ["space", "Space", " ", " ", " ", " "],
    ["alt", "Alt", "Alt", "Alt", "Alt", "Alt"],
    ["", "ArrowLeft", "<", "<", "<", "<"],
    ["", "ArrowDown", "▼", "▼", "▼", "▼"],
    ["", "ArrowRight", ">", ">", ">", ">"],
    ["ctrl", "Ctrl", "Ctrl", "Ctrl", "Ctrl", "Ctrl"]
  ]
];

// Creating textaree and keyboard div container
let form = document.createElement("div");
form.className = "wrapper";
document.body.append(form);

let textArea = document.createElement("textarea");
textArea.className = "textarea";
form.append(textArea);
textArea.setAttribute("type", "textarea");

let keyboard = document.createElement("div");
keyboard.className = "keyboard";
form.append(keyboard);

//KeyboardLanguage changing
if (localStorage.getItem("virtualKeyboardLang") === null) {
  localStorage.setItem("virtualKeyboardLang", "en");
}

document.addEventListener("keydown", function(evt) {
  if (evt.shiftKey && evt.altKey) {
    if (localStorage.getItem("virtualKeyboardLang") === "en") {
      localStorage.removeItem("virtualKeyboardLang");
      localStorage.setItem("virtualKeyboardLang", "ru");
    } else if (localStorage.getItem("virtualKeyboardLang") === "ru") {
      localStorage.removeItem("virtualKeyboardLang");
      localStorage.setItem("virtualKeyboardLang", "en");
    }
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
});

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
    if (localStorage.getItem("virtualKeyboardLang") === "en") {
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
//Functionality: printing symbols
let shiftPress = false;
let caps = false;

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
  shiftPress = false;
  caseDown();
}

function printingInTextArea(evt) {
  let symbol = "";
  let targetBtn = evt.target.closest("button");
  targetSpan = targetBtn.querySelector(".on");
  let targetBtnName = targetSpan.className.split(" ")[0];
  let specialBtn = targetBtn.classList[1];
  // console.log(targetBtn);

  // Finding pressed symbol
  keyboardKeys.forEach(row => {
    row.forEach(el => {
      if (el[1] === targetBtnName &&
          targetBtnName !== "Delete" &&
          targetBtnName !== "Backspace" &&
          targetBtnName !== "CapsLock") {
        if (localStorage.getItem("virtualKeyboardLang") === "ru") {
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
  textArea.setRangeText(symbol, textArea.selectionStart, textArea.selectionEnd, "end" );

  if (specialBtn === "backspace") {
    if (textArea.selectionStart > 0) {
      let pos = textArea.selectionStart;
      textArea.value = textArea.value.slice(0, pos - 1) + textArea.value.slice(pos, textArea.value.length);
      textArea.setRangeText("", pos - 1, pos - 1, "end");
    }
  }

  if (specialBtn === "del") {
    let pos = textArea.selectionStart;
    if (textArea.selectionStart <= textArea.value.length) {
      textArea.value = textArea.value.slice(0, pos) + textArea.value.slice( pos + 1, textArea.value.length );
      textArea.setRangeText("", pos, pos, "end");
    }
  }

  if (specialBtn === 'capslock') {
    let capsBtn = document.querySelector('.capslock');
    if (caps === true) {
      capsBtn.classList.add('active');
      caseUp();
    } else {
      capsBtn.classList.remove('active');
      caseDown();
    }    
    caps = !caps;
  }
  textArea.focus();
}

document.addEventListener("keydown", shiftUpKeyboard);
keyboard.addEventListener("click", printingInTextArea);
document.addEventListener("keyup", shiftDownKeyboard);
