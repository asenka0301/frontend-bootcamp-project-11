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

export default (state) => {
  const proxyUrl = getProxyUrl(state.additionForm.currentUrl);
  state.currentState = 'loading';
  axios.get(proxyUrl)
    .then((response) => {
      console.log(response);
      const dataContent = parser(response.data.contents);
      console.log(dataContent);
      console.log(dataContent);
      const feed = getFeed(dataContent);
      const posts = getPosts(dataContent);
      posts.forEach((post) => {
        post.feedId = feed.id;
      });
      state.feeds = [feed, ...state.feeds];
      state.posts = [...posts, ...state.posts];
      state.currentState = 'loaded';
    }).catch((error) => {
      state.error = error.message === 'parseError' ? 'parseError' : 'networkError';
      state.currentState = 'parseOrNetworkError';
    });
};
