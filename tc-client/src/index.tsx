import React from 'react';
import ReactDOM from 'react-dom/client';
import SlideshowApp from './components/app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <SlideshowApp />
  </React.StrictMode>
);