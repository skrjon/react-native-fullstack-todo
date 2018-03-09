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

export const fetchingProfile = () => ({ type: profileActions.FETCHING });
export const finishedProfile = () => ({ type: profileActions.FINISHED });
export const loginProfile = (token) => ({ token, type: profileActions.LOGIN });
export const removeProfile = () => ({type: profileActions.REMOVE });
export const updateProfile = (profile) => ({ profile, type: profileActions.PROFILE });

export const getProfile = () => async (dispatch, getState) => {
  // Set status to fetching
  dispatch(fetchingProfile());
  try {
    // Gather data from API
    let response = await request.get('/profile');
    console.log('getProfile:response', response);
    // Update redux store with profile data
    return dispatch(updateProfile(response));
  } catch (err) {
    console.log('getProfile:err', err);
    alert(err.message);
    dispatch(finishedProfile());
    if(err.statusCode === 401) {
      // If token was not refreshed logout
      return dispatch(removeProfile());
    }
  }
};

export const logoutProfile = () => async (dispatch, getState) => {
  // Set status to fetching
  dispatch(fetchingProfile());
  try {
    // Gather data from API
    let response = await request.get('/profile/logout');
    return dispatch(removeProfile());
  } catch (err) {
    console.log('logoutProfile:err', err);
    alert(err.message);
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
    console.log('getTasks:err', err);
    alert(err.message);
    dispatch(finishedTasks());
    if(err.statusCode === 401) {
      // If token was not refreshed logout
      return dispatch(removeProfile());
    }
  }
};

export const createTask = (task) => async (dispatch, getState) => {
  // Set status to fetching
  dispatch(fetchingTasks());
  try {
    // Send task to the API
    let response = await request.post('/tasks', {
      body:task,
    });
    console.log('createTask:response', response);
    // Update redux store with new task
    return dispatch(addTask(response));
  } catch (err) {
    console.log('createTask:err', err);
    alert(err.message);
    dispatch(finishedTasks());
    if(err.statusCode === 401) {
      // If token was not refreshed logout
      return dispatch(removeProfile());
    }
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
    alert(err.message);
    dispatch(finishedTasks());
    if(err.statusCode === 401) {
      // If token was not refreshed logout
      return dispatch(removeProfile());
    }
  }
};