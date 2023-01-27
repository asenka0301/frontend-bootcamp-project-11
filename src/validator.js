import * as yup from 'yup';

export default (field, state) => {
  // описываю схему валидацию
  const schema = yup.object().shape({
    url: yup
      .string()
      .required('Поле должно быть заполнено!')
      .url('Ссылка должна быть валидным URL')
      .notOneOf(state.additionForm.addedUrls, 'Данный RSS уже существует!'),
  });
  // вызываю асинхронный метод validate (передаю, проверяемый объект), который возвращает промис
  // получаю либо объект, прошедший валидацию, либо ошибки
  schema.validate(field, state)
    .then((data) => {
      state.additionForm.currentUrl = data.url;
      state.additionForm.addedUrls = [...state.additionForm.addedUrls, data.url];
      state.additionForm.urlIsValid = true;
    })
    .catch((error) => {
      state.additionForm.urlIsValid = false;
      state.additionForm.validationError = error.message;
    });
};
