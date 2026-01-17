import React from 'react';
import ReactDOM from 'react-dom/client';
import SlideshowApp from './components/app/app';
import { DarkModeProvider } from './contexts/DarkModeContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <DarkModeProvider>
      <SlideshowApp />
    </DarkModeProvider>
  </React.StrictMode>
);