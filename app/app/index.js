import React, { Component } from 'react';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { reducers } from './store/reducers';
import App from './app';

const logger = createLogger();
const store = createStore(reducers, applyMiddleware(thunk, logger));

export default class todoapp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}