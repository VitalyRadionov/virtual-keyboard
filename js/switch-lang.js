import create from './create-element.js';

const url = './data/data.json';
const response = await fetch(url);
const keysObj = await response.json();

export default (lang) => {
  const oldKey = document.querySelectorAll('.shift');
  oldKey.forEach((key) => {
    const nameKey = key.dataset.key;
    const newKey = key;

    if (Object.hasOwn(keysObj[nameKey], lang)) {
      newKey.innerHTML = '';
      if (lang === 'ru' && !nameKey.startsWith('Digit')) {
        newKey.classList.add('caps-lock');
      }

      if (lang === 'en' && !nameKey.startsWith('Key')) {
        newKey.classList.remove('caps-lock');
      }

      keysObj[key.dataset.key][lang].map((u16) => {
        const sign = create('span');
        sign.classList.add('sign');
        sign.innerHTML = String.fromCharCode(parseInt(u16, 16));
        newKey.prepend(sign);
        return sign;
      });
    }
  });
};
