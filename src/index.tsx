import React from 'react';
import ReactDOM from 'react-dom';

import Root from './components/Root';

const render = () => {
  ReactDOM.render(
    <Root />,
    document.getElementById('root'),
  );
};

// We technically don't need this check since we are only
// supporting modern browsers, but it's a good practice.
if(navigator.serviceWorker) {
  navigator.serviceWorker
           .register('/sw.js')
           .then(() => {
             console.info("Service Worker Registered!");
             render();
           });
}
