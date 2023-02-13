import _ from 'lodash';

export default (data) => {
  const parser = new DOMParser();
  const content = parser.parseFromString(data, 'text/xml');
  if (content.querySelector('parsererror')) {
    throw new Error('parseError');
  }

  const getFeed = (parsedData) => {
    const feed = {};
    feed.id = _.uniqueId();
    feed.title = parsedData.querySelector('channel > title').textContent;
    feed.description = parsedData.querySelector('channel > description').textContent;
    return feed;
  };

  const getPosts = (parsedData) => {
    const items = parsedData.querySelectorAll('item');
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

  const feed = getFeed(content);
  const posts = getPosts(content);

  return { feed, posts };
};
