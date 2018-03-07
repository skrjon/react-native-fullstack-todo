import React, { Component } from 'react';
import { Provider } from 'react-redux';

import store from './store';
import App from './app';

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