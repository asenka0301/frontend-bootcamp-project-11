import onChange from 'on-change';

const watcher = (state, elements, i18nextInstance) => onChange(state, (path, value) => {
  if (path === 'additionForm.validationError') {
    elements.input.classList.add('is-invalid');
    elements.message.classList.add('text-danger');
    elements.message.textContent = i18nextInstance.t(`errors.${value}`);
  }
  if (path === 'additionForm.urlIsValid') {
    elements.input.classList.remove('is-invalid');
    elements.message.textContent = i18nextInstance.t('RSSLoaded');
    elements.message.classList.remove('text-danger');
    elements.message.classList.add('text-success');
    elements.form.reset();
    elements.form.focus();
  }
});

export default watcher;
