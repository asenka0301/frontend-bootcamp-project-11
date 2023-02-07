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

const getFeed = (content) => {
  const feed = {};
  feed.id = _.uniqueId();
  feed.title = content.querySelector('channel > title').textContent;
  feed.description = content.querySelector('channel > description').textContent;
  return feed;
};

const getPosts = (content) => {
  const items = content.querySelectorAll('item');
  const posts = (Array.from(items)).map((item) => {
    const post = {};
    post.id = _.uniqueId();
    post.title = item.querySelector('title').textContent;
    post.description = item.querySelector('description').textContent;
    post.link = item.querySelector('link').textContent;
    return post;
  });
  return posts;
};

const loadRSS = (url) => {
  const proxyUrl = getProxyUrl(url);
  return axios.get(proxyUrl, { timeout: 5000 });
};

const addFeedAndPosts = (url, state) => {
  state.currentState = 'loading';
  loadRSS(url).then((response) => {
    const dataContent = parser(response.data.contents);
    console.log(dataContent);
    const feed = getFeed(dataContent);
    const posts = getPosts(dataContent);
    state.feeds = [feed, ...state.feeds];
    state.posts = [...posts, ...state.posts];
    state.additionForm.addedUrls = [...state.additionForm.addedUrls, url];
    state.currentState = 'loaded';
  }).catch((error) => {
    state.currentState = error.message === 'parseError' ? 'parseError' : 'networkError';
  });
};

export const updatePosts = (state) => {
  const result = (state.additionForm.addedUrls)
    .map((url) => loadRSS(url, state)
      .then((response) => {
        const dataContent = parser(response.data.contents);
        const posts = getPosts(dataContent);
        const isObjectTitlesEqual = ((obj1, obj2) => obj1.title === obj2.title);
        const checkPosts = _.differenceWith(posts, state.posts, isObjectTitlesEqual);
        state.posts = [...checkPosts, ...state.posts];
      }));
  Promise.all(result).then(() => setTimeout(() => updatePosts(state), 5000));
};

export default addFeedAndPosts;
