import { profileActions, taskActions, userActions } from './reducers';

export const addUser = (user) => ({ type: userActions.ADD, user });

export const fetchingProfile = () => ({ type: profileActions.FETCHING });
export const loginProfile = (token) => ({ token, type: profileActions.LOGIN });
export const updateProfile = (profile) => ({ profile, type: profileActions.PROFILE });

export const getProfile = () => (dispatch, getState) => {
  dispatch(fetchingProfile());
  fetch('http://localhost:3000/profile', {
      headers: new Headers({
        'Authorization': getState().profile.token,
      }),
    })
    .then(response => response.json())
    .then(json => dispatch(updateProfile(json)))
    .catch(error => console.error(error));
};

const addTask = (task) => ({ task, type: taskActions.ADD});
const fetchingTasks = () => ({type: taskActions.FETCHING });
const receiveTasks = (tasks) => ({tasks, type: taskActions.RECEIVE });
const updateTask = (task) => ({ task, type: taskActions.UPDATE});

export const getTasks = () => (dispatch, getState) => {
  dispatch(fetchingTasks());
  fetch('http://localhost:3000/tasks', {
      headers: new Headers({
        'Authorization': getState().profile.token,
      }),
    })
    .then(response => response.json())
    .then(json => dispatch(receiveTasks(json)))
    .catch(error => console.error(error));
};

export const createTask = (task) => (dispatch, getState) => {
  dispatch(fetchingTasks());
  fetch('http://localhost:3000/tasks', {
      body: JSON.stringify(task),
      headers: new Headers({
        'Authorization': getState().profile.token,
        'Content-Type': 'application/json'
      }),
      method: 'PUT',
    })
    .then(response => response.json())
    .then(json => dispatch(addTask(json)))
    .catch(error => console.error(error));
};

export const toggleTask = (id, completed) => (dispatch, getState) => {
  dispatch(fetchingTasks());
  fetch('http://localhost:3000/tasks/' + id, {
      body: JSON.stringify({completed:completed}),
      headers: new Headers({
        'Authorization': getState().profile.token,
        'Content-Type': 'application/json'
      }),
      method: 'POST',
    })
    .then(response => response.json())
    .then(json => dispatch(updateTask(json)))
    .catch(error => console.error(error));
};