import create from './create-element.js';

const url = './data/data.json';
const response = await fetch(url);
const keysObj = await response.json();

const l = localStorage.getItem('lang');

const template = [
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'Delete'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'],
  ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight'],
];

const templateRU = ['Backquote', 'BracketLeft', 'BracketRight', 'Semicolon', 'Quote', 'Comma', 'Period'];

const keyboardLayout = (lang = l) => template.map((arrKeys, numberRow) => {
  const row = create('div');
  row.classList.add('row', `row-${numberRow}`);

  row.append(...arrKeys.map((nameKey) => {
    const key = create('div');
    if (Object.prototype.hasOwnProperty.call(keysObj, nameKey)) {
      key.dataset.key = nameKey;
      if (keysObj[nameKey].section === 'writingSystem') {
        if (nameKey.startsWith('Key')) {
          key.classList.add('caps-lock');
        }
        if (lang === 'ru' && templateRU.includes(nameKey)) {
          key.classList.add('caps-lock');
        }
        key.classList.add('shift', 'key');
      } else {
        key.classList.add('functional', 'key');
      }
      if (Object.prototype.hasOwnProperty.call(keysObj[nameKey], lang)) {
        keysObj[nameKey][lang].map((u16) => {
          const sign = create('span');
          sign.classList.add('sign');
          sign.innerHTML = String.fromCharCode(parseInt(u16, 16));
          key.prepend(sign);
          return sign;
        });
      } else {
        keysObj[nameKey].default.map((u16) => {
          const sign = create('span');
          sign.classList.add('sign');
          if (u16.startsWith('0x')) {
            sign.innerHTML = String.fromCharCode(parseInt(u16, 16));
          } else {
            sign.innerHTML = u16;
          }
          key.prepend(sign);
          return sign;
        });
      }
    }
    return key;
  }));
  return row;
});

export default keyboardLayout;
