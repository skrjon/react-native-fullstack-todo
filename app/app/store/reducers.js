import { combineReducers } from 'redux';

export const profileActions = {
  FETCHING: 'PROFILE_FETCHING',
  LOGIN: 'PROFILE_LOGIN',
  PROFILE: 'PROFILE_PROFILE',
  REMOVE: 'PROFILE_REMOVE',
};

function profile(state = {isFetching:false, profile: undefined, token:undefined}, action = {}) {
  switch (action.type) {
    case profileActions.FETCHING:
      return {
        ...state,
        isFetching: true,
      };
    case profileActions.LOGIN:
      return {
        ...state,
        token: action.token,
      };
    case profileActions.PROFILE:
      return {
        ...state,
        isFetching: false,
        profile: action.profile,
      };
    case profileActions.REMOVE:
      return {
        isFetching: false,
        profile: undefined,
        token: undefined,
      };
    default:
      return state;
  }
}

export const userActions = {
  ADD: 'USER_ADD',
};

function users(state = {isFetching:false, list:[], login:undefined}, action = {}) {
  switch (action.type) {
    case userActions.ADD:
      return {
        ...state,
        list: [
          ...state.list,
          action.user,
        ],
      };
    default:
      return state;
  }
}

export const taskActions = {
  ADD: 'TASK_ADD',
  FETCHING: 'TASK_FETCHING',
  FINISHED: 'TASK_FINISHED',
  RECEIVE: 'TASK_RECEIVE',
  UPDATE: 'TASK_UPDATE',
};

function tasks(state = {isFetching:false, list:[]}, action = {}) {
  switch (action.type) {
    case taskActions.ADD:
      return {
        ...state,
        isFetching: false,
        list: [
          ...state.list,
          action.task,
        ],
      };
    case taskActions.FETCHING:
      return {
        ...state,
        isFetching: true,
      };
    case taskActions.FINISHED:
      return {
        ...state,
        isFetching: false,
      };
    case taskActions.RECEIVE:
      return {
        ...state,
        isFetching: false,
        list: action.tasks
      };
    case taskActions.UPDATE:
      return {
        ...state,
        isFetching: false,
        list: state.list.map((task) => {
          if((task.id) !== action.task.id) return task;
          return action.task;
        })
      };
    default:
      return state;
  }
}

export const reducers = combineReducers({
  profile,
  tasks,
  users,
});