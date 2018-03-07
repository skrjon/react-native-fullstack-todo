import request from '../lib/request';

import {
  profileActions,
  taskActions,
  userActions
} from './reducers';

import {
  DOMAIN
} from '../config';

export const addUser = (user) => ({ type: userActions.ADD, user });

export const refreshAccessToken = () => async (dispatch, getState) => {
  console.log('refreshAccessToken');
  // Request a new access token
  try {
    let response = await request.refresh('/auth/token');
    // Assemble the updated token
    let token = {
      access_token: response.access_token,
      expires_in: response.expires_in,
      refresh_token: getState().profile.token.refresh_token,
    }
    return dispatch(loginProfile(token));
  } catch (err) {
    if(err.statusCode === 401) {
      // If we receive a 401 here it means our refresh token is no longer valid
      alert(err.message);
      return dispatch(removeProfile());
    }
    // If we recieve an error here the user will need to login again
    alert(err.message);
    return dispatch(removeProfile());
  }
}

export const fetchingProfile = () => ({ type: profileActions.FETCHING });
export const finishedProfile = () => ({ type: profileActions.FINISHED });
export const loginProfile = (token) => ({ token, type: profileActions.LOGIN });
export const removeProfile = () => ({type: profileActions.REMOVE });
export const updateProfile = (profile) => ({ profile, type: profileActions.PROFILE });

export const getProfile = (count = 0) => async (dispatch, getState) => {
  // Set status to fetching
  dispatch(fetchingProfile());
  try {
    // Gather data from API
    let response = await request.get('/profile');
    console.log('getProfile:response', response);
    // Update redux store with profile data
    return dispatch(updateProfile(response));
  } catch (err) {
    if(err.statusCode === 401) {
      // Check if we have already tried refreshing
      if(count === 0) {
        // Get a new Access Token
        let refresh_response = await dispatch(refreshAccessToken());
        // If successful recall
        if (refresh_response.type === 'PROFILE_LOGIN') return dispatch(getProfile(1));
      }
      // If token was not refreshed logout
      alert(err.message);
      return dispatch(removeProfile());
    }
    console.log('getProfile', error);
    alert(err.message);
    return dispatch(finishedProfile());
  }
};

export const logoutProfile = () => async (dispatch, getState) => {
  // Set status to fetching
  dispatch(fetchingProfile());
  try {
    // Gather data from API
    let response = await request.get('/auth/logout');
    return dispatch(removeProfile());
  } catch (err) {
    if(err.statusCode === 401) {
      // Get a new Access Token
      let refresh_response = await dispatch(refreshAccessToken());
      // If successful recall
      if (refresh_response.type === 'PROFILE_LOGIN') return dispatch(logoutProfile());
      // If token was not refreshed logout anyway
      alert(err.message);
      return dispatch(removeProfile());
    }
    console.log('logoutProfile', err);
    return dispatch(removeProfile());
  }
};

const addTask = (task) => ({ task, type: taskActions.ADD});
const fetchingTasks = () => ({type: taskActions.FETCHING });
const finishedTasks = () => ({type: taskActions.FINISHED });
const receiveTasks = (tasks) => ({tasks, type: taskActions.RECEIVE });
const updateTask = (task) => ({ task, type: taskActions.UPDATE});

export const getTasks = () => async (dispatch, getState) => {
  // Set status to fetching
  dispatch(fetchingTasks());
  try {
    // Gather data from API
    let response = await request.get('/tasks');
    console.log('getTasks:response', response);
    // Update redux store with task list
    return dispatch(receiveTasks(response));
  } catch (err) {
    // Handle authentication errors
    if(err.statusCode === 401) {
      // Get a new Access Token
      let refresh_response = await dispatch(refreshAccessToken());
      // If successful recall
      if (refresh_response.type === 'PROFILE_LOGIN') return dispatch(getTasks());
      // If token was not refreshed logout
      alert(err.message);
      dispatch(finishedTasks());
      return dispatch(removeProfile());
    }
    console.log('getTasks', err);
    // All other errors
    alert(err.message);
    return dispatch(finishedTasks());
  }
};

export const createTask = (task) => async (dispatch, getState) => {
  // Set status to fetching
  dispatch(fetchingTasks());
  try {
    // Send task to the API
    let response = await request.post('/tasks/'+id, {
      body:task,
    });
    console.log('createTask:response', response);
    // Update redux store with new task
    return dispatch(addTask(response));
  } catch (err) {
    if(err.statusCode === 401) {
      // Get a new Access Token
      let refresh_response = await dispatch(refreshAccessToken());
      // If successful recall
      if (refresh_response.type === 'PROFILE_LOGIN') return dispatch(createTask(task));
      // If token was not refreshed logout
      alert(err.message);
      dispatch(finishedTasks());
      return dispatch(removeProfile());
    }
    console.log('createTask', error);
    alert(response.message);
    return dispatch(finishedTasks());
  }
};

export const toggleTask = (id, completed) => async (dispatch, getState) => {
  // Set status to fetching
  dispatch(fetchingTasks());
  try {
    // Gather data from API
    let response = await request.put('/tasks/'+id, {
      body:{completed:completed},
    });
    console.log('toggleTask:response', response);
    // Update redux store with new task information
    return dispatch(updateTask(response));
  } catch (err) {
    console.log('toggleTask:err', err);
    if(err.statusCode === 401) {
      // Get a new Access Token
      let refresh_response = await dispatch(refreshAccessToken());
      // If successful recall
      if (refresh_response.type === 'PROFILE_LOGIN') return dispatch(toggleTask(id, completed));
      // If token was not refreshed logout
      alert(err.message);
      dispatch(finishedTasks());
      return dispatch(removeProfile());
    }
    console.log('toggleTask', error);
    alert(err.message);
    return dispatch(finishedTasks());
  }
};