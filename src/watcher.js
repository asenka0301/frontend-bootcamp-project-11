import onChange from 'on-change';

const watcher = (state, elements) => onChange(state, (path, value) => {
  if (path === 'additionForm.validationError') {
    elements.input.classList.add('is-invalid');
    elements.message.classList.add('text-danger');
    elements.message.textContent = value;
  }
  if (path === 'additionForm.urlIsValid') {
    elements.input.classList.remove('is-invalid');
    elements.message.textContent = 'RSS успешно загружен';
    elements.message.classList.remove('text-danger');
    elements.message.classList.add('text-success');
    elements.form.reset();
    elements.form.focus();
  }
});

export default watcher;
