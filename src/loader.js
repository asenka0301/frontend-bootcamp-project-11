import axios from 'axios';
import _ from 'lodash';
import parser from './parser.js';

const getProxyUrl = (stateUrl) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app');
  proxyUrl.pathname = '/get';
  proxyUrl.searchParams.set('disableCache', true);
  proxyUrl.searchParams.set('url', stateUrl);
  return proxyUrl.toString();
};

const loadRSS = (url) => {
  const proxyUrl = getProxyUrl(url);
  return axios.get(proxyUrl, { timeout: 5000 });
};

const addFeedAndPosts = (url, state) => {
  state.currentState = 'loading';
  loadRSS(url).then((response) => {
    const content = parser(response.data.contents);
    state.feeds = [content.feed, ...state.feeds];
    state.posts = [...content.posts, ...state.posts];
    state.addedUrls = [...state.addedUrls, url];
    state.currentState = 'loaded';
  }).catch((error) => {
    state.currentState = error.message === 'parseError' ? 'parseError' : 'networkError';
  });
};

export const updatePosts = (state) => {
  const result = (state.addedUrls)
    .map((url) => loadRSS(url, state)
      .then((response) => {
        const content = parser(response.data.contents);
        const isObjectTitlesEqual = ((obj1, obj2) => obj1.title === obj2.title);
        const checkPosts = _.differenceWith(content.posts, state.posts, isObjectTitlesEqual);
        state.posts = [...checkPosts, ...state.posts];
      }));
  Promise.all(result).then(() => setTimeout(() => updatePosts(state), 5000));
};

export default addFeedAndPosts;
