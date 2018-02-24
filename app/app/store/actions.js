import {
  profileActions,
  taskActions,
  userActions
} from './reducers';

import {
  DOMAIN
} from '../config';

export const addUser = (user) => ({ type: userActions.ADD, user });

export const fetchingProfile = () => ({ type: profileActions.FETCHING });
export const loginProfile = (token) => ({ token, type: profileActions.LOGIN });
export const removeProfile = () => ({type: profileActions.REMOVE });
export const updateProfile = (profile) => ({ profile, type: profileActions.PROFILE });

export const getProfile = () => async (dispatch, getState) => {
  // Set status to fetching
  dispatch(fetchingProfile());
  try {
    // Gather data from API
    let response = await fetch(DOMAIN + '/profile', {
      headers: new Headers({
        'Authorization': getState().profile.token,
      }),
    });
    console.log('getProfile:response', response);
    if(!response.ok) {
      alert(response._bodyText);
      dispatch(removeProfile());
      return;
    }
    let json = await response.json();
    // Update redux store with profile data
    dispatch(updateProfile(json));
  } catch (error) {
    console.error('getProfile', error);
  }
};

export const logoutProfile = () => async (dispatch, getState) => {
  // Set status to fetching
  dispatch(fetchingProfile());
  try {
    // Gather data from API
    let response = await fetch(DOMAIN + '/profile/logout', {
      headers: new Headers({
        'Authorization': getState().profile.token,
      }),
    });    
    dispatch(removeProfile());
  } catch (error) {
    console.error('logoutProfile', error);
    dispatch(removeProfile());
  }
};

const addTask = (task) => ({ task, type: taskActions.ADD});
const fetchingTasks = () => ({type: taskActions.FETCHING });
const receiveTasks = (tasks) => ({tasks, type: taskActions.RECEIVE });
const updateTask = (task) => ({ task, type: taskActions.UPDATE});

export const getTasks = () => async (dispatch, getState) => {
  // Set status to fetching
  dispatch(fetchingTasks());
  try {
    // Gather data from API
    let response = await fetch(DOMAIN + '/tasks', {
      headers: new Headers({
        'Authorization': getState().profile.token,
      }),
    });
    console.log('getTasks:response', response);
    if(!response.ok) {
      alert(response._bodyText);
      dispatch(removeProfile());
      return;
    }
    let json = await response.json();
    // Update redux store with task list
    dispatch(receiveTasks(json));
  } catch (error) {
    console.error('getTasks', error);
  }
};

export const createTask = (task) => async (dispatch, getState) => {
  // Set status to fetching
  dispatch(fetchingTasks());
  try {
    // Gather data from API
    let response = await fetch(DOMAIN + '/tasks', {
      body: JSON.stringify(task),
      headers: new Headers({
        'Authorization': getState().profile.token,
        'Content-Type': 'application/json'
      }),
      method: 'PUT',
    });
    if(!response.ok) {
      alert(response._bodyText);
      dispatch(removeProfile());
      return;
    }
    let json = await response.json();
    // Update redux store with new task
    dispatch(addTask(json));
  } catch (error) {
    console.error('createTask', error);
  }
};

export const toggleTask = (id, completed) => async (dispatch, getState) => {
  // Set status to fetching
  dispatch(fetchingTasks());
  try {
    // Gather data from API
    let response = await fetch(DOMAIN + '/tasks/' + id, {
      body: JSON.stringify({completed:completed}),
      headers: new Headers({
        'Authorization': getState().profile.token,
        'Content-Type': 'application/json'
      }),
      method: 'POST',
    });
    if(!response.ok) {
      alert(response._bodyText);
      dispatch(removeProfile());
      return;
    }
    let json = await response.json();
    // Update redux store with new task information
    dispatch(updateTask(json));
  } catch (error) {
    console.error('toggleTask', error);
  }
};