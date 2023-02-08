import i18next from 'i18next';
import validator from './validator.js';
import watcher from './watcher.js';
import resources from './locales/index.js';
import { updatePosts } from './loader.js';

export default () => {
  const state = {
    // additionForm: {
    //   // urlIsValid: false,
    //   addedUrls: [],
    //   validationError: '',
    // },
    addedUrls: [],
    feeds: [],
    posts: [],
    lng: 'ru',
    currentState: '', // текущее состоние
    uiState: {
      selectedPostIds: {},
      selectedPostId: null,
      clickedBy: null,
    },
  };

  const elements = {
    body: document.querySelector('body'),
    modal: document.querySelector('.modal'),
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    message: document.querySelector('.feedback'),
    paragraph: document.querySelector('.lead'),
    langButtons: document.querySelector('#langButtons'),
    buttonEn: document.querySelector('#en'),
    buttonRu: document.querySelector('#ru'),
    mainHeader: document.querySelector('h1'),
    addButton: document.querySelector('button[type="submit"]'),
    exampleParagraph: document.querySelector('p.example'),
    inputLabel: document.querySelector('.form-floating label'),
    footerText: document.querySelector('.footer-text'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modals: document.querySelectorAll('button[data-bs-target]'),
  };

  const i18nextInstance = i18next.createInstance();

  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    const watchedState = watcher(state, elements, i18nextInstance);

    elements.langButtons.addEventListener('click', (event) => {
      const buttonId = event.target.getAttribute('id');
      i18nextInstance.changeLanguage(buttonId);
      watchedState.lng = buttonId;
      const primaryButton = buttonId === 'ru' ? elements.buttonRu : elements.buttonEn;
      const outlineButton = buttonId === 'ru' ? elements.buttonEn : elements.buttonRu;
      outlineButton.classList.remove('btn-success');
      outlineButton.classList.add('btn-outline-success', 'text-dark');
      primaryButton.classList.remove('btn-outline-success', 'text-dark');
      primaryButton.classList.add('btn-success');
    });

    elements.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const url = formData.get('url');
      validator({ url }, watchedState);
    });

    elements.posts.addEventListener('click', (event) => {
      const clickedButton = event.target;
      const clickedPostId = clickedButton.getAttribute('data-id');
      watchedState.uiState.selectedPostIds[clickedPostId] = true;
      watchedState.uiState.selectedPostId = clickedPostId;
      watchedState.uiState.clickedBy = clickedButton.tagName;
      watchedState.uiState.clickedBy = null;
    });

    updatePosts(watchedState);
  });
};
