import api from '../api/';
import * as types from './types';
import oauth2 from '../oauth2/oauth2';

export const initApp = () => (dispatch, getState) => {
  oauth2.checkUserAuthorization()
    .then((isAuthorized) => {
      if (!isAuthorized) {
        dispatch(setScreen('login'));
      } else {
        dispatch(fetchTasklists());
        dispatch(fetchAvatar());
      }
    });
};

export const revokeUserAuthorization = () => (dispatch, getState) => {
  oauth2.revokeUserAuthorization()
    .catch((message) => console.log(message));
};

export const fetchTasklists = () => dispatch => {
  const settings = {
    path: `tasks/v1/users/@me/lists`
  };

  dispatch(sendRequest(settings))
  .then((tasklists) => {
    dispatch({
      type: types.RECEIVE_TASKLISTS,
      tasklists
    });
    dispatch(setScreen('tasklists'));
  });
};

export const fetchTasks = (tasklistID) => (dispatch, getState) => {
  const settings = {
    path: `tasks/v1/lists/${tasklistID}/tasks`
  };

  return dispatch(sendRequest(settings))
  .then((tasks) => {
    dispatch({
      type: types.RECEIVE_TASKS,
      tasks,
      tasklistID
    });
    return Promise.resolve();
  });
};

const fetchAvatar = () => dispatch => {
  const settings = {
    path: `plus/v1/people/me`
  };

  dispatch(sendRequest(settings))
  .then((profile) => dispatch({
    type: types.RECEIVE_AVATAR_URL,
    avatarURL: profile.image.url
  }));
}

const sendRequest = settings => dispatch => {
  dispatch({ type: types.START_PROGRESS });
  return api(settings)
  .then(data => {
    dispatch({ type: types.FINISH_PROGRESS });
    return data;    
  }, e => console.log(e));
}

export const selectTasklist = tasklistID => (dispatch, getState) => {
  const state = getState();
  if (!state.tasks[tasklistID]) {
    dispatch(fetchTasks(tasklistID))
      .then(() => dispatch({
        type: types.SELECT_TASKLIST,
        tasklistID
      })
    );
  } else {
    dispatch({
      type: types.SELECT_TASKLIST,
      tasklistID
    });  
  }

  if (state.screen !== 'tasks') {
    dispatch(setScreen('tasks'));
  }
};

export const toggleDrawer = () => ({
  type: types.TOGGLE_DRAWER
});

const setScreen = (screen) => ({
  type: types.SET_SCREEN,
  screen
});