import * as types from './types';
import oauth2 from '../oauth2/oauth2';
import { sendRequest, setScreen } from './common';

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

export const addTask = (tasklistID, title) => (dispatch) => {
  const settings = {
    path: `tasks/v1/lists/${tasklistID}/tasks`,
    method: 'POST',
    body: {
      title
    }
  };
  
  return dispatch(sendRequest(settings)).then((task) => {
    dispatch({
      type: types.RECEIVE_TASK,
      tasklistID,
      task
    });
  });
};

export const deleteTask = (tasklistID, taskID) => (dispatch) => {
  const settings = {
    path: `tasks/v1/lists/${tasklistID}/tasks/${taskID}`,
    method: 'DELETE'
  };

  return dispatch(sendRequest(settings)).then(() => {
    dispatch({
        type: types.DELETE_TASK,
        tasklistID,
        taskID
    }); 
  });
};

export const editTask = (tasklistID, taskID, newTitle) => (dispatch) => {
  const settings = {
    path: `tasks/v1/lists/${tasklistID}/tasks/${taskID}`,
    method: 'PUT',
    body: {
      id: taskID,
      title: newTitle
    }
  };

  return dispatch(sendRequest(settings)).then((task) => {
    dispatch({
      type: types.EDIT_TASK,
      tasklistID,
      task
    });
  });
};

export const toggleTask = (tasklistID, task) => dispatch => {
  const settings = {
    path: `tasks/v1/lists/${tasklistID}/tasks/${task.id}`,
    method: 'PUT',
    body: {
      id: task.id,
      status: task.status === 'completed' ? 'needsAction' : 'completed'
    }
  }

  return dispatch(sendRequest(settings)).then((task) => {
    dispatch({
      type: types.RECEIVE_TASK,
      tasklistID,
      task
    });
  });
};