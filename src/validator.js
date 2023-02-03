import * as yup from 'yup';
import addFeedAndPosts from './loader.js';
import updatePosts from './loader.js';

export default (field, state) => {
  // описываю схему валидацию
  yup.setLocale({
    mixed: {
      notOneOf: 'existingUrls',
      required: 'filledField',
    },
    string: {
      url: 'invalidUrl',
    },
  });
  const schema = yup.object().shape({
    url: yup
      .string()
      .required()
      .url()
      .notOneOf(state.additionForm.addedUrls),
  });
  // вызываю асинхронный метод validate (передаю, проверяемый объект), который возвращает промис
  // получаю либо объект, прошедший валидацию, либо ошибки
  schema.validate(field, state)
    .then((data) => {
      // state.additionForm.currentUrl = data.url;
      state.additionForm.addedUrls = [...state.additionForm.addedUrls, data.url];
      state.additionForm.urlIsValid = true;
      updatePosts(state);
      // addFeedAndPosts(data.url, state);
    })
    .catch((error) => {
      state.additionForm.urlIsValid = false;
      state.additionForm.validationError = error.message;
    });
};
