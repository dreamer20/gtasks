import * as types from './types';
import oauth2 from '../oauth2/oauth2';
import { sendRequest, setScreen, setErrorMessage } from './common';
import { fetchTasks } from './tasks';

export const addTasklist = (title) => (dispatch) => {
  const settings = {
    path: `tasks/v1/users/@me/lists`,
    method: 'POST',
    body: {
      title
    }
  };
  
  return dispatch(sendRequest(settings)).then((tasklist) => {
    dispatch({
      type: types.RECEIVE_TASKLIST,
      tasklist
    });
  });
};

export const deleteTasklist = (tasklistID) => (dispatch) => {
  const settings = {
    path: `tasks/v1/users/@me/lists/${tasklistID}`,
    method: 'DELETE'
  };

  return dispatch(sendRequest(settings)).then((response) => {
    if (response && response.error && response.error.message === 'Invalid Value') {
      dispatch(setErrorMessage('Нельзя удалить список по умолчанию.'));
    } else {
      dispatch({
        type: types.DELETE_TASKLIST,
        tasklistID
      });      
    }
  });
};

export const renameTasklist = (tasklistID, newTitle) => (dispatch) => {
  const settings = {
    path: `tasks/v1/users/@me/lists/${tasklistID}`,
    method: 'PUT',
    body: {
      id: tasklistID,
      title: newTitle
    }
  };

  return dispatch(sendRequest(settings)).then((tasklist) => {
    dispatch({
      type: types.RENAME_TASKLIST,
      tasklistID,
      tasklist
    });
  });
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

export const fetchTasklistsByToken = (pageToken) => dispatch => {
  const settings = {
    path: `tasks/v1/users/@me/lists?pageToken=${pageToken}`
  };

  dispatch(sendRequest(settings))
  .then((tasklists) => {
    dispatch({
      type: types.RECEIVE_TASKLISTS,
      tasklists
    });
  });
};

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