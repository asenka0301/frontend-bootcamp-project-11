import onChange from 'on-change';

const renderFeed = (state, elements, i18nextInstance) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4', 'feeds-heading');
  h2.textContent = i18nextInstance.t('feeds');
  cardBody.append(h2);
  card.append(cardBody);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  (state.feeds).forEach((el) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = el.description;
    li.append(h3);
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = el.title;
    li.append(p);
    ul.append(li);
  });
  card.append(ul);
  (elements.feeds).append(card);
};

const renderPosts = (state, elements, i18nextInstance) => {
  const div = document.createElement('div');
  div.classList.add('card', 'border-0');
  const divCard = document.createElement('div');
  divCard.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4', 'posts-heading');
  h2.textContent = i18nextInstance.t('posts');
  divCard.append(h2);
  div.append(divCard);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  (state.posts).forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    a.classList.add('fw-bold');
    a.setAttribute('data-id', `${post.id}`);
    a.setAttribute('href', `${post.link}`);
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('target', '_blank');
    a.textContent = post.title;
    li.append(a);
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-id', `${post.id}`);
    button.setAttribute('type', 'button');
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = 'Просмотр';
    li.append(button);
    ul.append(li);
  });
  div.append(ul);
  (elements.posts).append(div);
};

const languageChangeRender = (state, elements, i18nextInstance) => {
  elements.mainHeader.textContent = i18nextInstance.t('header');
  elements.paragraph.textContent = i18nextInstance.t('mainParagraph');
  elements.addButton.textContent = i18nextInstance.t('addButton');
  elements.exampleParagraph.textContent = i18nextInstance.t('exampleParagraph');
  elements.inputLabel.textContent = i18nextInstance.t('inputLabel');
  elements.footerText.textContent = i18nextInstance.t('footerText');
  if (!state.additionForm.validationError && !state.additionForm.urlIsValid) {
    elements.message.textContent = '';
  } else {
    elements.message.textContent = state.additionForm.urlIsValid ? i18nextInstance.t('RSSLoaded') : i18nextInstance.t(`errors.${state.additionForm.validationError}`);
  }
  if (document.querySelector('.feeds-heading') && document.querySelector('.posts-heading')) {
    document.querySelector('.feeds-heading').textContent = i18nextInstance.t('feeds');
    document.querySelector('.posts-heading').textContent = i18nextInstance.t('posts');
  }
};

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
  if (path === 'feeds') {
    renderFeed(state, elements, i18nextInstance);
  }
  if (path === 'posts') {
    renderPosts(state, elements, i18nextInstance);
  }
  if (path === 'lng') {
    languageChangeRender(state, elements, i18nextInstance);
  }
});

export default watcher;
