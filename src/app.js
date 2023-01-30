import i18next from 'i18next';
import validator from './validator.js';
import watcher from './watcher.js';
import resources from './locales/index.js';

export default () => {
  const state = {
    additionForm: {
      currentUrl: '',
      urlIsValid: false,
      addedUrls: [],
      validationError: null,
    },
  };

  const form = document.querySelector('.rss-form');
  const input = document.querySelector('#url-input');
  const message = document.querySelector('.feedback');
  const buttonRu = document.querySelector('.btn-group button:first-child');
  const paragraph = document.querySelector('.lead');
  const buttonEn = document.querySelector('.btn-group button:last-child');
  const mainHeader = document.querySelector('h1');
  const addButton = document.querySelector('button[type="submit"]');
  const exampleParagraph = document.querySelector('p.example');
  const inputLabel = document.querySelector('.form-floating label');
  const footerText = document.querySelector('.footer-text');
  const elements = { form, input, message };

  const i18nextInstance = i18next.createInstance();

  const render = (watchedState) => {
    mainHeader.textContent = i18nextInstance.t('header');
    paragraph.textContent = i18nextInstance.t('mainParagraph');
    addButton.textContent = i18nextInstance.t('addButton');
    exampleParagraph.textContent = i18nextInstance.t('exampleParagraph');
    inputLabel.textContent = i18nextInstance.t('inputLabel');
    footerText.textContent = i18nextInstance.t('footerText');
    message.textContent = watchedState.additionForm.urlIsValid ? i18nextInstance.t('RSSLoaded') : i18nextInstance.t(`errors.${watchedState.additionForm.validationError}`);
  };

  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    const watchedState = watcher(state, elements, i18nextInstance);

    buttonEn.addEventListener('click', () => {
      i18nextInstance.changeLanguage('en');
      render(watchedState);
      buttonRu.classList.remove('btn-success');
      buttonEn.classList.remove('btn-outline-success', 'text-dark');
      buttonRu.classList.add('btn-outline-success', 'text-dark');
      buttonEn.classList.add('btn-success');
      console.log(watchedState);
    });

    buttonRu.addEventListener('click', () => {
      i18nextInstance.changeLanguage('ru');
      render(watchedState);
      console.log(watchedState);
      buttonEn.classList.remove('btn-success');
      buttonRu.classList.add('btn-success');
      buttonRu.classList.remove('btn-outline-success', 'text-dark');
      buttonEn.classList.add('btn-outline-success', 'text-dark');
    });
    console.log(state);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const url = formData.get('url');
      validator({ url }, watchedState, i18nextInstance);
    });
  });
};
