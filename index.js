keyboardKeys = [[
    ['', 'Backquote', "ё", "Ё", "`", "~"],
    ['', 'Digit1', "1", "!", "1", "!"],
    ['', 'Digit2', "2", '"', "2", "@"],
    ['', 'Digit3', "3", "№", "3", "#"],
    ['', 'Digit4', "4", ";", "4", "$"],
    ['', 'Digit5', "5", "%", "5", "%"],
    ['', 'Digit6',"6", ":", "6", "^"],
    ['', 'Digit7', "7", "?", "7", "&"],
    ['', 'Digit8',"8", "*", "8", "*"],
    ['', 'Digit9',"9", "(", "9", "("],
    ['', "Digit0", "0", ")", "0", ")"],
    ['', 'Minus', "-", "_", "-", "_"],
    ['', 'Equal',"=", "+", "=", "+"],
    ['backspace', "Backspace", 'Backspace', '', '', '']
  ],
[
    
]];

// Creating keyboard elements
let keys = [ ['Backquote', 'Digit1', 'Minus', 'Equal', 'Backspace'] ]
let form = document.createElement('form');
form.className = 'wrapper';
document.body.append(form);

let textarea = document.createElement('textarea');
textarea.className = 'textarea';
form.append(textarea);
textarea.setAttribute('type', 'textarea');

let keyboard = document.createElement('div');
keyboard.className = 'keyboard';
form.append(keyboard);

for (let i = 0; i < 6; i++) {
    var row = document.createElement('div');
    row.className = 'row';
    keyboard.append(row);
    console.log('row created');
    if (i === 0) {
        console.log('i === 0');
        for (let j = 0; j < 14; j++) {
            console.log(row);
            let key = document.createElement('button');
            key.className = 'key ' + keyboardKeys[i][j][0];
            row.append(key);

            let span = document.createElement('span');
            span.className = keyboardKeys[i][j][1];
            key.append(span);
            span.insertAdjacentText("afterbegin", keyboardKeys[i][j][2]);
        }
    }
}