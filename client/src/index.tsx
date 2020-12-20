import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.css';
import './styles/tailwind.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { startListeningToAuthChanges } from './store/thunks/authThunks';
import store from './store/store';
import { BrowserRouter as Router } from 'react-router-dom';

store.dispatch(startListeningToAuthChanges());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
