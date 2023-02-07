import i18next from 'i18next';
import validator from './validator.js';
import watcher from './watcher.js';
import resources from './locales/index.js';
import { updatePosts } from './loader.js';

export default () => {
  const state = {
    additionForm: {
      // currentUrl: '',
      urlIsValid: false,
      addedUrls: [],
      validationError: '',
    },
    feeds: [],
    posts: [],
    lng: 'ru',
    currentState: 'initial', // текущее состоние
    // error: '', // другие ошибки
    uiState: {
      selectedPostIds: {
      },
      selectedPostId: null,
    },
  };

  const elements = {
    body: document.querySelector('body'),
    modal: document.querySelector('.modal'),
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    message: document.querySelector('.feedback'),
    buttonRu: document.querySelector('.btn-group button:first-child'),
    paragraph: document.querySelector('.lead'),
    buttonEn: document.querySelector('.btn-group button:last-child'),
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

    elements.buttonEn.addEventListener('click', () => {
      i18nextInstance.changeLanguage('en');
      watchedState.lng = 'en';
      elements.buttonRu.classList.remove('btn-success');
      elements.buttonEn.classList.remove('btn-outline-success', 'text-dark');
      elements.buttonRu.classList.add('btn-outline-success', 'text-dark');
      elements.buttonEn.classList.add('btn-success');
    });

    elements.buttonRu.addEventListener('click', () => {
      i18nextInstance.changeLanguage('ru');
      watchedState.lng = 'ru';
      elements.buttonEn.classList.remove('btn-success');
      elements.buttonRu.classList.add('btn-success');
      elements.buttonRu.classList.remove('btn-outline-success', 'text-dark');
      elements.buttonEn.classList.add('btn-outline-success', 'text-dark');
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
      watchedState.uiState.selectedPostId = null;
    });

    updatePosts(watchedState);
  });
};
