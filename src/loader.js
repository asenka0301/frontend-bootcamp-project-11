import axios from 'axios';
import _ from 'lodash';
// import loader from 'sass-loader';
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
  return axios.get(proxyUrl);
};

const updatePosts = (state) => {
  state.currentState = 'loading';
  const result = (state.additionForm.addedUrls)
    .map((url) => loadRSS(url, state)
      .then((response) => {
        const dataContent = parser(response.data.contents);
        const feed = getFeed(dataContent);
        const posts = getPosts(dataContent);
        const isFeedInState = (state.feeds).find((item) => item.description === feed.description);
        if (!isFeedInState) {
          state.feeds = [feed, ...state.feeds];
        }
        const isObjectTitlesEqual = ((obj1, obj2) => obj1.title === obj2.title);
        const checkPosts = _.differenceWith(posts, state.posts, isObjectTitlesEqual);
        state.posts = [...checkPosts, ...state.posts];
        state.currentState = 'loaded';
      })
      .catch((error) => {
        console.log(error);
        state.currentState = 'parseError';
        const { urlsLength } = state.additionForm.addedUrls.length;
        state.additionForm.addedUrls = (state.additionForm.addedUrls).splice(urlsLength, 1);
      }));
  Promise.all(result).then(() => setTimeout(() => updatePosts(state), 5000));
};

export default updatePosts;
