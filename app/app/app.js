/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import Login from './screens/login';
import Tasks from './screens/tasks';

class App extends Component<{}> {
  constructor(props) {
    super(props);
  }

  render() {
    const { profile } = this.props;
    console.log('render app', profile);

    if (profile.token) {
      return <Tasks />;
    } else {
      return <Login />;
    }

  }
}

const mapStateToProps = (state) => {
  const { profile } = state;
  return {
    profile
  };
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);