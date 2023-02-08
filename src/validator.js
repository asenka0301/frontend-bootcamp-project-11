import * as yup from 'yup';
import addPostsAndFeeds from './loader.js';

export default (field, state) => {
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
  schema.validate(field, state)
    .then((data) => {
      state.additionForm.validationError = '';
      addPostsAndFeeds(data.url, state);
    })
    .catch((error) => {
      // state.additionForm.urlIsValid = false;
      state.additionForm.validationError = error.message;
    });
};
