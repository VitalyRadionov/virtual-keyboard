import create from './js/create-element.js';
import kb from './js/keyboard-layout.js';
import switchLang from './js/switch-lang.js';

const wrapper = create('div');
const header = create('header');
const virtualKeyboard = create('article');
const textField = create('textarea');
const keyboard = create('div');
const footer = create('footer');

const h1 = create('h1');
const keyboardCreateInWindows = create('p');
const notifSwitchLanguage = create('p');

wrapper.classList.add('wrapper');

header.classList.add('header');
h1.classList.add('header-title');
h1.innerHTML = 'RSS Виртуальная клавиатура';
header.append(h1);

keyboard.append(...kb());
keyboard.classList.add('keyboard');

textField.classList.add('text-field');
textField.autofocus = true;

virtualKeyboard.classList.add('virtual-keyboard');
virtualKeyboard.append(textField, keyboard);

footer.classList.add('footer');
keyboardCreateInWindows.classList.add('keyboard-create-in-windows');
notifSwitchLanguage.classList.add('notification-switch-language');
keyboardCreateInWindows.innerHTML = 'Виртуальная клавиатура создана в Windows OS';
notifSwitchLanguage.innerHTML = 'Для переключения методов ввода нажмите клавиши ctrl + alt';
footer.append(notifSwitchLanguage, keyboardCreateInWindows);

wrapper.append(header, virtualKeyboard, footer);

document.body.insertAdjacentElement('afterbegin', wrapper);

const arrowPad = {
  step: 0,
  lineStart() {
    return textField.value.lastIndexOf('\n', textField.selectionStart);
  },
  setStep() {
    let lineStart = textField.value.lastIndexOf('\n', textField.selectionStart);

    if (textField.selectionStart && lineStart > -1) {
      if (lineStart === textField.selectionStart) {
        console.log('lineStart === textField.selectionStart ', lineStart === textField.selectionStart);
        lineStart = textField.value.lastIndexOf('\n', textField.selectionStart - 1) + 1;
        this.step = textField.selectionStart - lineStart;
        console.log('this.step ', this.step);
        return this.step;
      }
      console.log('lineStart !== textField.selectionStart ', lineStart !== textField.selectionStart);
      this.step = textField.selectionStart - lineStart - 1;
      console.log('this.step ', this.step);
      return this.step;
    }

    lineStart = 0;
    this.step = textField.selectionStart - lineStart;
    console.log('this.step ', this.step);
    return this.step;
  },
  ArrowUp(selectionStart) {
    console.log('ArrowUp');
    console.log('step', this.step);

    if (selectionStart) {
      const lineEnd = textField.value.lastIndexOf('\n', selectionStart - 1);
      const lineStart = textField.value.lastIndexOf('\n', ((lineEnd <= -1) || lineEnd) - 1) + 1;

      console.log(`lineStart ${lineStart}`, `lineEnd ${lineEnd}`);
      const position = lineEnd > -1 ? (lineStart + this.step) : 0;

      if ((position > lineEnd) && (lineEnd > -1)) {
        console.log('lineStart > lineEnd');
        textField.setSelectionRange(lineEnd, lineEnd);
        return;
      }
      textField.setSelectionRange(position, position);
      return;
    }
    textField.setSelectionRange(selectionStart, selectionStart);
  },
  ArrowDown(selectionStart) {
    console.log('ArrowDown');
    console.log('step', this.step);

    const lineStart = textField.value.indexOf('\n', selectionStart);
    let lineEnd = textField.value.indexOf('\n', lineStart > -1 ? (lineStart + 1) : textField.value.length);
    let position = 0;

    if (lineEnd < 0) {
      lineEnd = textField.value.length;
    }

    console.log(`lineStart ${lineStart}`, `lineEnd ${lineEnd}`);

    if (lineStart > -1) {
      if (textField.value[selectionStart] === '\n') {
        console.log('textField.value[selectionStart] === n ', textField.value[selectionStart] === '\n');
        position = (lineStart + this.step) >= lineEnd ? lineEnd : (lineStart + this.step + 1);
        return textField.setSelectionRange(position, position);
      }
      position = (lineStart + this.step) >= lineEnd ? lineEnd : (lineStart + this.step + 1);
      console.log('this.step ', this.step);
      return textField.setSelectionRange(position, position);
    }

    return textField.setSelectionRange(textField.value.length, textField.value.length);
  },
  ArrowRight(start) {
    const position = start < textField.value.length ? start + 1 : textField.value.length;
    textField.setSelectionRange(position, position);
    return this.setStep();
  },
  ArrowLeft(start) {
    const position = start ? start - 1 : 0;
    textField.setSelectionRange(position, position);
    return this.setStep();
  },
};

function inputTextArea(e) {
  e.preventDefault();

  console.log('inputTextArea');

  const { selectionStart } = textField;
  const { selectionEnd } = textField;
  const oldText = textField.value;

  const prefix = oldText.substring(0, selectionStart);
  let inserted = '';
  const suffix = oldText.substring(selectionEnd);

  if (keyboard.classList.contains('shift-on')) {
    const tag = keyboard.querySelector(`.${e.code} .shift`);
    if (tag) {
      inserted = tag.outerText[0] ?? (tag.outerText[2] ?? tag.outerText[0]);
    }
  }

  textField.value = `${prefix}${inserted}${suffix}`;

  const newSelectionStart = prefix.length + inserted.length;
  const newSelectionEnd = prefix.length + inserted.length;
  return textField.setSelectionRange(newSelectionStart, newSelectionEnd);
}

function wasClick(e) {
  if (!e.target.classList.contains('key')) {
    return;
  }
  console.log('wasClick');
  console.log(e);
  if (!(e.target.dataset.key === 'CapsLock')) {
    e.target.style.background = 'var(--prussian-blue)';
  }

  document.addEventListener('mouseup', (v) => {
    if (!v.shiftKey) {
      keyboard.classList.remove('shift-on');
    }
    if (!e.target.classList.contains('pressed')) {
      e.target.style.background = '';
    }
  });

  const { selectionStart } = textField;
  const { selectionEnd } = textField;
  const oldText = textField.value;

  let prefix = oldText.substring(0, selectionStart);
  let inserted = '';
  let suffix = oldText.substring(selectionEnd);

  const eventCode = {
    ShiftLeft() {
      keyboard.classList.add('shift-on');
    },
    ShiftRight() {
      keyboard.classList.add('shift-on');
    },
    CapsLock() {
      e.target.classList.toggle('pressed');
      keyboard.classList.toggle('caps-lock-on');
    },
    Backspace() {
      prefix = oldText.substring(0, selectionStart - 1);
    },
    Space() {
      inserted = ' ';
    },
    Tab() {
      inserted = '\t';
    },
    Delete() {
      suffix = oldText.substring(selectionEnd + 1);
    },
    Enter() {
      inserted = '\n';
    },
    ControlLeft() {
      return inserted;
    },
    ControlRight() {
      return inserted;
    },
    AltLeft() {
      return inserted;
    },
    AltRight() {
      return inserted;
    },
    MetaLeft() {
      return inserted;
    },
  };

  if (Object.hasOwnProperty.call(arrowPad, e.target.dataset.key)) {
    arrowPad[e.target.dataset.key](selectionStart);
    return;
  }
  if (Object.hasOwnProperty.call(eventCode, e.target.dataset.key)) {
    eventCode[e.target.dataset.key]();
  } else {
    const outerText = e.target.outerText[2] ?? e.target.outerText[0];
    inserted = e.shiftKey ? e.target.outerText[0] : outerText;
  }

  textField.value = `${prefix}${inserted}${suffix}`;

  const newSelectionStart = prefix.length + inserted.length;
  const newSelectionEnd = prefix.length + inserted.length;
  textField.setSelectionRange(newSelectionStart, newSelectionEnd);
  arrowPad.setStep();
}

function whichButton(e) {
  e.preventDefault();

  const a = document.querySelector(`[data-key=${e.code ? e.code : 'null'}]`);
  const { selectionStart } = textField;
  const { selectionEnd } = textField;
  const oldText = textField.value;

  let prefix = oldText.substring(0, selectionStart);
  let inserted = '';
  let suffix = oldText.substring(selectionEnd);

  if (e.altKey && e.ctrlKey) {
    a.style.background = 'var(--prussian-blue)';
    let lang = localStorage.getItem('lang');
    if (lang === 'en') {
      lang = 'ru';
      localStorage.setItem('lang', lang);
      switchLang(lang);
    } else {
      lang = 'en';
      localStorage.setItem('lang', lang);
      switchLang(lang);
    }
    return;
  }

  if (a && e.key !== 'CapsLock') {
    a.style.background = 'var(--prussian-blue)';
  }

  const eventCode = {
    Shift() {
      keyboard.classList.add('shift-on');
    },
    CapsLock() {
      if (!e.repeat) {
        const capsLock = keyboard.querySelector('[data-key=CapsLock]');
        capsLock.classList.toggle('pressed');
        keyboard.classList.toggle('caps-lock-on');
      }
    },
    Backspace() {
      prefix = oldText.substring(0, selectionStart - 1);
    },
    Space() {
      console.log('Space');
      inserted = ' ';
    },
    Tab() {
      inserted = '\t';
    },
    Delete() {
      suffix = oldText.substring(selectionEnd + 1);
    },
    Enter() {
      inserted = '\n';
    },
    Control() {
      return inserted;
    },
    Alt() {
      return inserted;
    },
    Meta() {
      return inserted;
    },
  };

  if (Object.hasOwnProperty.call(eventCode, e.key) && !e.code.startsWith('Num')) {
    console.log('e.key', e.key);
    eventCode[e.key]();
  }
  if (Object.hasOwnProperty.call(arrowPad, e.key) && !e.code.startsWith('Num')) {
    arrowPad[e.key](selectionStart);
    return;
  }
  if (e.key.length <= 1 && !e.code.startsWith('Num')) {
    const tag = keyboard.querySelector(`[data-key=${e.code}]`);
    const sht = keyboard.classList.contains('shift-on');

    if (tag && sht) {
      [inserted] = tag.outerText;
    } else {
      console.log('inserted', inserted);
      inserted = tag.outerText[2] ?? (tag.outerText[0] ?? ' ');
    }
  }

  if (keyboard.classList.contains('caps-lock-on') || keyboard.classList.contains('shift-on')) {
    inserted = inserted.toUpperCase();
  }
  textField.value = `${prefix}${inserted}${suffix}`;

  const newSelectionStart = prefix.length + inserted.length;
  const newSelectionEnd = prefix.length + inserted.length;
  textField.setSelectionRange(newSelectionStart, newSelectionEnd);
  arrowPad.setStep();
}

document.addEventListener('keydown', whichButton);
document.addEventListener('keyup', (e) => {
  const a = document.querySelector(`[data-key=${e.code ? e.code : 'null'}]`);
  if (a && e.key !== 'CapsLock') {
    a.style.background = '';
  }

  if (e.key === 'Shift') {
    keyboard.classList.remove('shift-on');
  }
});
textField.addEventListener('keydown', inputTextArea);
keyboard.addEventListener('mousedown', wasClick);
textField.addEventListener('click', () => {
  arrowPad.setStep();
});
textField.addEventListener('blur', () => textField.focus());
