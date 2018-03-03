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
  let fetch_response = await fetch(DOMAIN + '/auth/token', {
    headers: new Headers({
      'refresh_token': getState().profile.token.refresh_token,
    }),
  });
  console.log('refreshAccessToken',fetch_response);
  let response = await fetch_response.json();
  if(response.statusCode === 401) {
    // If we receive a 401 here it means our refresh token is no longer valid
    alert(response.message);
    return dispatch(removeProfile());
  }
  if(!fetch_response.ok) {
    // If we recieve an error here the user will need to login again
    alert(response.message);
    return dispatch(removeProfile());
  }
  // Assemble the updated token
  let token = {
    access_token: response.access_token,
    expires_in: response.expires_in,
    refresh_token: getState().profile.token.refresh_token,
  }
  return dispatch(loginProfile(token));
}

export const fetchingProfile = () => ({ type: profileActions.FETCHING });
export const finishedProfile = () => ({ type: profileActions.FINISHED });
export const loginProfile = (token) => ({ token, type: profileActions.LOGIN });
export const removeProfile = () => ({type: profileActions.REMOVE });
export const updateProfile = (profile) => ({ profile, type: profileActions.PROFILE });

export const getProfile = () => async (dispatch, getState) => {
  // Set status to fetching
  await dispatch(fetchingProfile());
  try {
    // Gather data from API
    let fetch_response = await fetch(DOMAIN + '/profile', {
      headers: new Headers({
        'access_token': getState().profile.token.access_token,
      }),
    });
    let response = await fetch_response.json();
    console.log('getProfile:response', response);
    if(response.statusCode === 401) {
      // Get a new Access Token
      let refresh_response = await dispatch(refreshAccessToken());
      // If successful recall toggleTask
      if (refresh_response.type === 'PROFILE_LOGIN') return dispatch(getProfile());
      // If token was not refreshed logout
      alert(response.message);
      return dispatch(removeProfile());
    }
    if(!fetch_response.ok) {
      alert(response.message);
      return dispatch(finishedProfile());
    }
    // Update redux store with profile data
    return dispatch(updateProfile(response));
  } catch (error) {
    console.error('getProfile', error);
    return dispatch(removeProfile());
  }
};

export const logoutProfile = () => async (dispatch, getState) => {
  // Set status to fetching
  await dispatch(fetchingProfile());
  try {
    // Gather data from API
    let response = await fetch(DOMAIN + '/auth/logout', {
      headers: new Headers({
        'access_token': getState().profile.token.access_token,
      }),
    });
    if(response.statusCode === 401) {
      // Get a new Access Token
      let refresh_response = await dispatch(refreshAccessToken());
      // If successful recall toggleTask
      if (refresh_response.type === 'PROFILE_LOGIN') return dispatch(logoutProfile());
      // If token was not refreshed logout anyway
      alert(response.message);
      return dispatch(removeProfile());
    }
    return dispatch(removeProfile());
  } catch (error) {
    console.error('logoutProfile', error);
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
  await dispatch(fetchingTasks());
  try {
    // Gather data from API
    let fetch_response = await fetch(DOMAIN + '/tasks', {
      headers: new Headers({
        'access_token': getState().profile.token.access_token,
      }),
    });
    console.log('getTasks:response', response);
    let response = await fetch_response.json();
    if(response.statusCode === 401) {
      // Get a new Access Token
      let refresh_response = await dispatch(refreshAccessToken());
      // If successful recall toggleTask
      if (refresh_response.type === 'PROFILE_LOGIN') return dispatch(getTasks());
      // If token was not refreshed logout
      alert(response.message);
      await dispatch(finishedTasks());
      return dispatch(removeProfile());
    }
    if(!fetch_response.ok) {
      alert(response.message);
      return dispatch(finishedTasks());
    }
    // Update redux store with task list
    return dispatch(receiveTasks(response));
  } catch (error) {
    console.error('getTasks', error);
    return dispatch(finishedTasks());
  }
};

export const createTask = (task) => async (dispatch, getState) => {
  // Set status to fetching
  await dispatch(fetchingTasks());
  try {
    // Gather data from API
    let fetch_response = await fetch(DOMAIN + '/tasks', {
      body: JSON.stringify(task),
      headers: new Headers({
        'access_token': getState().profile.token.access_token,
        'content-type': 'application/json'
      }),
      method: 'PUT',
    });
    let response = await fetch_response.json();
    console.log('createTask:response', response);
    if(response.statusCode === 401) {
      // Get a new Access Token
      let refresh_response = await dispatch(refreshAccessToken());
      // If successful recall toggleTask
      if (refresh_response.type === 'PROFILE_LOGIN') return dispatch(createTask(task));
      // If token was not refreshed logout
      alert(response.message);
      await dispatch(finishedTasks());
      return dispatch(removeProfile());
    }
    if(!fetch_response.ok) {
      alert(response.message);
      return dispatch(finishedTasks());
    }
    // Update redux store with new task
    return dispatch(addTask(response));
  } catch (error) {
    console.error('createTask', error);
    return dispatch(finishedTasks());
  }
};

export const toggleTask = (id, completed) => async (dispatch, getState) => {
  // Set status to fetching
  await dispatch(fetchingTasks());
  try {
    // Gather data from API
    let fetch_response = await fetch(DOMAIN + '/tasks/' + id, {
      body: JSON.stringify({completed:completed}),
      headers: new Headers({
        'access_token': getState().profile.token.access_token,
        'Content-Type': 'application/json'
      }),
      method: 'POST',
    });
    let response = await fetch_response.json();
    console.log('toggleTask:response', response);
    if(response.statusCode === 401) {
      // Get a new Access Token
      let refresh_response = await dispatch(refreshAccessToken());
      // If successful recall toggleTask
      if (refresh_response.type === 'PROFILE_LOGIN') return dispatch(toggleTask(id, completed));
      // If token was not refreshed logout
      alert(response.message);
      await dispatch(finishedTasks());
      return dispatch(removeProfile());
    }
    if(!fetch_response.ok) {
      alert(response.message);
      return dispatch(finishedTasks());
    }
    // Update redux store with new task information
    dispatch(updateTask(response));
  } catch (error) {
    console.error('toggleTask', error);
    return dispatch(finishedTasks());
  }
};