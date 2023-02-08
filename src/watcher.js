import onChange from 'on-change';
import _ from 'lodash';

const possibleErrorMessages = ['parseError', 'networkError', 'invalidUrl', 'existingUrls', 'filledField'];

const renderFeed = (state, elements, i18nextInstance) => {
  (elements.feeds).innerHTML = '';
  const div = document.createElement('div');
  div.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4', 'feeds-heading');
  h2.textContent = i18nextInstance.t('feeds');
  cardBody.append(h2);
  div.append(cardBody);

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
  div.append(ul);
  (elements.feeds).append(div);
};

const renderPosts = (state, elements, i18nextInstance) => {
  (elements.posts).innerHTML = '';
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
    a.setAttribute('data-id', `${post.id}`);
    if (state.uiState.selectedPostIds[post.id]) {
      a.classList.add('fw-normal');
      a.classList.add('link-secondary');
    } else {
      a.classList.add('fw-bold');
    }
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
    button.setAttribute('id', 'view');
    button.textContent = i18nextInstance.t('review');
    li.append(button);
    ul.append(li);
  });
  div.append(ul);
  (elements.posts).append(div);
};

const translatePageContent = (elements, i18nextInstance) => {
  elements.mainHeader.textContent = i18nextInstance.t('header');
  elements.paragraph.textContent = i18nextInstance.t('mainParagraph');
  elements.addButton.textContent = i18nextInstance.t('addButton');
  elements.exampleParagraph.textContent = i18nextInstance.t('exampleParagraph');
  elements.inputLabel.textContent = i18nextInstance.t('inputLabel');
  elements.footerText.textContent = i18nextInstance.t('footerText');
  if (document.querySelector('.feeds-heading')) {
    document.querySelector('.feeds-heading').textContent = i18nextInstance.t('feeds');
    document.querySelector('.posts-heading').textContent = i18nextInstance.t('posts');
    document.querySelectorAll('#view').textContent = i18nextInstance.t('review');
  }
};

const translateOutputMessage = (state, elements, i18nextInstance) => {
  if (!state.currentState) {
    elements.message.textContent = '';
  } else if (possibleErrorMessages.includes(state.currentState)) {
    elements.message.textContent = i18nextInstance.t(`errors.${state.currentState}`);
  } else {
    elements.message.textContent = i18nextInstance.t('RSSLoaded');
  }
};

const languageChangeRender = (state, elements, i18nextInstance) => {
  translatePageContent(elements, i18nextInstance);
  translateOutputMessage(state, elements, i18nextInstance);
};

const showModal = (state, elements) => {
  if (state.uiState.clickedBy) {
    const visitedLink = (elements.posts).querySelector(`a[data-id="${state.uiState.selectedPostId}"]`);
    const relatedPost = _.find(state.posts, { id: state.uiState.selectedPostId });
    if (state.uiState.selectedPostIds[state.uiState.selectedPostId]) {
      visitedLink.classList.remove('fw-bold');
      visitedLink.classList.add('fw-normal');
      visitedLink.classList.add('link-secondary');
    }
    if (state.uiState.clickedBy === 'BUTTON') {
      elements.body.classList.add('modal-open');
      elements.body.setAttribute('style', 'overflow: hidden; padding-right: 17px');
      elements.modal.classList.add('show');
      elements.modal.setAttribute('style', 'display: block');
      elements.modal.removeAttribute('aria-hidden');
      elements.modal.setAttribute('aria-modal', 'true');
      const header = elements.modal.querySelector('h5');
      header.textContent = relatedPost.title;
      const description = elements.modal.querySelector('.modal-body');
      description.textContent = relatedPost.description;
      const divModal = document.createElement('div');
      divModal.classList.add('modal-backdrop', 'fade', 'show');
      elements.body.append(divModal);
      const closeModalButton = elements.modal.querySelectorAll('[data-bs-dismiss="modal"]');
      const article = elements.modal.querySelector('.full-article');

      article.addEventListener('click', () => {
        article.setAttribute('href', `${relatedPost.link}`);
      });

      const closeModal = () => {
        elements.body.classList.remove('modal-open');
        elements.body.removeAttribute('style');
        elements.modal.classList.remove('show');
        elements.modal.removeAttribute('style');
        elements.modal.setAttribute('aria-hidden', 'true');
        elements.modal.removeAttribute('aria-modal');
        divModal.remove();
      };

      closeModalButton.forEach((button) => {
        button.addEventListener('click', () => {
          closeModal();
        });
      });
      elements.body.addEventListener('click', (event) => {
        if (event.target === elements.modal) {
          closeModal();
        }
      });
    }
  }
};

const watcher = (state, elements, i18nextInstance) => onChange(state, (path) => {
  if (path === 'currentState') {
    if (state.currentState === 'loading') {
      elements.input.readOnly = true;
      elements.addButton.disabled = true;
      elements.message.textContent = '';
    }
    if (state.currentState === 'loaded') {
      elements.input.readOnly = false;
      elements.addButton.disabled = false;
      elements.input.classList.remove('is-invalid');
      elements.message.textContent = i18nextInstance.t('RSSLoaded');
      elements.message.classList.remove('text-danger');
      elements.message.classList.add('text-success');
      elements.form.reset();
      elements.form.focus();
    }
    if (possibleErrorMessages.includes(state.currentState)) {
      elements.message.textContent = i18nextInstance.t(`errors.${state.currentState}`);
      elements.message.classList.remove('text-success');
      elements.message.classList.add('text-danger');
      elements.input.readOnly = false;
      elements.addButton.disabled = false;
    }
  }
  if (path === 'posts') {
    renderPosts(state, elements, i18nextInstance);
  }
  if (path === 'feeds') {
    renderFeed(state, elements, i18nextInstance);
  }
  if (path === 'lng') {
    console.log(state);
    languageChangeRender(state, elements, i18nextInstance);
    renderPosts(state, elements, i18nextInstance);
  }
  if (path === 'uiState.clickedBy') {
    showModal(state, elements);
  }
});

export default watcher;
