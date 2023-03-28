require('@babel/register');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const render = (reactElement, properties, response) => {
  const reactEl = React.createElement(reactElement, properties);

  const html = ReactDOMServer.renderToStaticMarkup(reactEl);

  if (properties.docType) {
    response.write('<!DOCTYPE html>');
  }
  response.write(html);
  response.end();
};

module.exports = render;
