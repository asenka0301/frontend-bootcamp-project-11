import axios from 'axios';

const getProxyUrl = (stateUrl) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app');
  proxyUrl.pathname = '/get';
  proxyUrl.searchParams.set('disableCache', true);
  proxyUrl.searchParams.set('url', stateUrl);
  return proxyUrl.toString();
};

export default (url) => {
  const proxyUrl = getProxyUrl(url);
  return axios.get(proxyUrl, { timeout: 5000 });
};
