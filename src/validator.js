import * as yup from 'yup';

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
      .notOneOf(state.addedUrls),
  });

  return schema.validate(field, state)
    .then((data) => data.url)
    .catch((error) => {
      throw new Error(error.message);
    });
};
