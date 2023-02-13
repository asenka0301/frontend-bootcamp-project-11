import i18next from 'i18next';
import validate from './validator.js';
import watcher from './watcher.js';
import resources from './locales/index.js';
import { updatePosts } from './loader.js';

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

export default () => {
  const state = {
    addedUrls: [],
    feeds: [],
    posts: [],
    lng: 'ru',
    currentState: '',
    uiState: {
      selectedPostIds: {},
      selectedPostId: null,
      clickedBy: null,
    },
  };

  const i18nextInstance = i18next.createInstance();

  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    const watchedState = watcher(state, elements, i18nextInstance);

    elements.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const url = formData.get('url');
      validate({ url }, watchedState).then((result) => console.log(result));
    });

    updatePosts(watchedState);

    elements.langButtons.addEventListener('click', (event) => {
      const buttonId = event.target.getAttribute('id');
      i18nextInstance.changeLanguage(buttonId);
      watchedState.lng = buttonId;
    });

    elements.posts.addEventListener('click', (event) => {
      const clickedButton = event.target;
      const clickedPostId = clickedButton.getAttribute('data-id');
      watchedState.uiState.selectedPostIds[clickedPostId] = true;
      watchedState.uiState.selectedPostId = clickedPostId;
      watchedState.uiState.clickedBy = clickedButton.tagName;
      watchedState.uiState.clickedBy = null;
    });
  });
};
