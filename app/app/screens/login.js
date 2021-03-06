import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import SafariView from 'react-native-safari-view';
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  getProfile,
  loginProfile,
} from '../store/actions';

import {
  DOMAIN
} from '../config';

class Login extends Component<{}> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Add event listener to handle todoapp:// URLs
    Linking.addEventListener('url', this.handleOpenURL);
    // Launched from an external URL
    Linking.getInitialURL().then((url) => {
      console.log('getInitialURL', url);
      if (url) {
        this.handleOpenURL({ url });
      }
    });
  }

  componentWillUnmount() {
    // Remove event listener
    Linking.removeEventListener('url', this.handleOpenURL);
  };

  handleOpenURL = ({ url }) => {
    console.log('handleOpenURL', url);
    const { getProfile, loginProfile } = this.props;
    // Close the Browser
    if (Platform.OS === 'ios') {
      SafariView.dismiss();
    }
    // Extract stringified user string out of the URL
    let token_matches = url.match(/token=([^#]+)/);
    console.log('returned token matches', token_matches);
    let info_matches = url.match(/info=([^#]+)/);
    console.log('returned info matches', info_matches);
    // Handle returned info
    if (info_matches) {
      let info = JSON.parse(decodeURI(info_matches[1]));
      alert(info.message);
    }
    // Handle returned token
    if (token_matches) {
      let token = JSON.parse(decodeURI(token_matches[1]));
      loginProfile(token);
      // Fetch profile
      getProfile();
    }
  };

  // Handle Login with Google button tap
  loginWithGoogle = () => this.openURL(DOMAIN + '/auth/google');

  // Open URL in a browser
  openURL = (url) => {
    console.log('openURL', url);
    // Use SafariView on iOS
    if (Platform.OS === 'ios') {
      SafariView.isAvailable()
        .then(available => {
          SafariView.show({
            fromBottom: true,
            url: url,
          });
        })
        .catch(error => {
          Alert.alert(
            'Safari not available',
            'Unable to authenticate without Safari',
            [],
            { cancelable: false }
          );
          console.log(error);
        });
    }
    // Or Linking.openURL on Android
    else {
      Linking.openURL(url);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
            Welcome!
          </Text>
          <View style={styles.avatar}>
            <Icon name="user-circle" size={100} color="rgba(0,0,0,.09)" />
          </View>
          <Text style={styles.text}>
            Please log in to continue
          </Text>
          <View style={styles.buttons}>
            <Icon.Button
              name="google"
              backgroundColor="#DD4B39"
              borderRadius={10}
              iconStyle={{paddingVertical: 5 }}
              onPress={this.loginWithGoogle}
            >
            Login with Google
            </Icon.Button>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    margin: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginBottom: 30,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },
});

const mapStateToProps = (state) => {
  const { profile } = state;
  return {
    profile
  };
};

const mapDispatchToProps = (dispatch) => ({
  getProfile: bindActionCreators(getProfile, dispatch),
  loginProfile: bindActionCreators(loginProfile, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);