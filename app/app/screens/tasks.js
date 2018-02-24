/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SafariView from 'react-native-safari-view';
import { CheckBox } from 'react-native-elements';

import {
  ActivityIndicator,
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import {
  createTask,
  getTasks,
  logoutProfile,
  toggleTask,
} from '../store/actions';

class Tasks extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      new: '',
    };
  }

  componentDidMount() {
    this.props.getTasks();
  }

  toggleTask(id, value) {
    console.log('toggleTask', id, value);
    this.props.toggleTask(id, value);
  }

  createTask() {
    this.props.createTask({description: this.state.new});
    this.setState({
      new: '',
    });
  }

  render() {
    const { logoutProfile, profile, tasks } = this.props;
    console.log('render tasks', tasks, profile);

    return (
      <ScrollView style={styles.container}>
        <View>
          {(profile.profile === undefined || profile.isFetching) ?
            <View style={styles.container}>
              <ActivityIndicator />
            </View>
            : // Show the Tasks
            <View style={styles.header}>
              <Image source={{ uri: profile.profile.img }} style={styles.avatarImage} />
              <Text style={styles.name}>
                Welcome {profile.profile.name}!
              </Text>
              <Button onPress={logoutProfile} title="Logout" />
            </View>
          }
          {tasks.isFetching ?
            <View style={styles.container}>
              <ActivityIndicator />
            </View>
            : // Show the Tasks
            <View>
              <View>
                <TextInput
                  style={{borderColor: 'gray', borderWidth: 1, height: 40, marginHorizontal: 8}}
                  onChangeText={(text) => this.setState({new: text})}
                  onSubmitEditing={() => this.createTask()}
                  value={this.state.new} />
              </View>
              <View>
                {tasks.list.map((task) => (
                  <View key={task.id}>
                    <CheckBox
                      checked={task.completed}
                      onIconPress={(value) => this.toggleTask(task.id, !task.completed)}
                      title={`${task.description} (${task.name})`}
                    />
                  </View>
                ))}
              </View>
            </View>
          }
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  avatarImage: {
    height: 40,
    width: 40,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginBottom: 30,
  },
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
    marginHorizontal: 16,
    marginTop: 32,
  },
  name: {
    fontSize: 20,
    marginHorizontal: 10,
    textAlign: 'center',
  },
});

const mapStateToProps = (state) => {
  const { profile, users, tasks } = state;
  return {
    profile,
    tasks,
    users,
  };
};

const mapDispatchToProps = (dispatch) => ({
  createTask: bindActionCreators(createTask, dispatch),
  getTasks: bindActionCreators(getTasks, dispatch),
  logoutProfile: bindActionCreators(logoutProfile, dispatch),
  toggleTask: bindActionCreators(toggleTask, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tasks);