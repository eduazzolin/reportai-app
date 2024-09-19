import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './main/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
// https://react-bootstrap.netlify.app/docs/getting-started/introduction

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

