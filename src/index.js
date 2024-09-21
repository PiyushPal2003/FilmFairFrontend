import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Nav from './Nav';
import { Provider } from 'react-redux';
import {store} from './app/store';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Provider store={store}>
      <Suspense>
        <Nav />
      </Suspense>
    </Provider>
  </>
);

reportWebVitals();
