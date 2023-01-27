import validator from './validator.js';
import watcher from './watcher.js';

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

  const elements = { form, input, message };

  const watchedState = watcher(state, elements);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    validator({ url }, watchedState);
  });
};
