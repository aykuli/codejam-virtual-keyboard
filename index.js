let form = document.createElement('form');
form.className = 'wrapper';
document.body.append(form);

let textarea = document.createElement('textarea');
textarea.className = 'textarea';
form.append(textarea);
textarea.setAttribute('type', 'textarea');