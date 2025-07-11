import React from 'react';
import { createRoot } from 'react-dom/client'; // Modern API
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import  store  from './app/store'; // Use named import

import 'antd/dist/reset.css'; 

const container = document.getElementById('root');
const root = createRoot(container); 

root.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>
);
