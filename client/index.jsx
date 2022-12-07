import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import 'bootstrap-icons/font/bootstrap-icons.scss';

const container = document.querySelector('#root');
const root = ReactDOM.createRoot(container);

root.render(<App />);
