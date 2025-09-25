import React from 'react';
import ReactDOM from 'react-dom/client'; // Use react-dom/client for createRoot
import { BrowserRouter } from 'react-router-dom';
import App from './Componentes/App';
import { store } from "./Routes/Store";
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
