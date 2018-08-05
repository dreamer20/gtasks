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