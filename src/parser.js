export default (data) => {
  const parser = new DOMParser();
  const content = parser.parseFromString(data, 'text/xml');
  if (content.querySelector('parseerror')) {
    throw new Error('parseError');
  }
  return content;
};
