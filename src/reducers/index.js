import { combineReducers } from 'redux';
import * as types from '../actions/types';

const tasklists = (state = {}, action) => {
  switch (action.type) {
    case types.RECEIVE_TASKLISTS:
      let taskLists = {};
      action.tasklists.items.forEach((taskList) => {
        taskLists[taskList.id] = taskList
      });
      return {
        ...state,
        ...taskLists
      };
    case types.RECEIVE_TASKLIST:
      return {
        ...state,
        [action.tasklist.id]: action.tasklist
      };
    case types.DELETE_TASKLIST:
      delete state[action.tasklistID];
      return {
        ...state
      };
    case types.RENAME_TASKLIST:
      return {
        ...state,
        [action.tasklistID]: action.tasklist
      };
    default:
      return state;
  }
};

const tasks = (state = {}, action) => {
  switch (action.type) {
    case types.RECEIVE_TASKS:
      let tasks = {};
      action.tasks.items.forEach((task) => {
        tasks[task.id] = task;
      });
      return {
        ...state,
        [action.tasklistID]: {
          ...state[action.tasklistID],
          ...tasks
        }
      };
    case types.RECEIVE_TASK:
      return {
        ...state,
        [action.tasklistID]: {
          ...state[action.tasklistID],
          [action.task.id]: action.task
        }
      }
    case types.DELETE_TASK:
      delete state[action.tasklistID][action.taskID];
      return {
        ...state
    }
    case types.EDIT_TASK:
      return {
        ...state,
        [action.tasklistID]: {
          ...state[action.tasklistID],
          [action.task.id]: action.task
        }
      }
    default:
      return state;
  }
};

const task = (state = {}, action) => {
  switch (action.type) {
    case types.RECEIVE_TASK:
      return {
        ...state,
        [action.task.id]: action.task
      }
    default:
      return state;
  }
};

const isDrawerOpen = (state = false, action) => {
  switch (action.type) {
    case types.TOGGLE_DRAWER:
      return !state;
    default:
      return state;
  }
};

const screen = (state = null, action) => {
  switch (action.type) {
    case types.SET_SCREEN:
      return action.screen;
    default:
      return state;
  }
};

const isFetching = (state = false, action) => {
  switch (action.type) {
    case types.START_PROGRESS:
      return true;
    case types.FINISH_PROGRESS:
      return false;
    default:
      return state;
  }
};

const avatarURL = (state = null, action) => {
  switch (action.type) {
    case types.RECEIVE_AVATAR_URL:
      return action.avatarURL;
    default:
      return state;
  }
};

const selectedTasklist = (state = null, action) => {
  switch (action.type) {
    case types.SELECT_TASKLIST:
      return action.tasklistID;
    default:
      return state;
  }
};

const isAuthorized = (state = false, action) => {
  switch (action.type) {
    case types.SET_AUTHORIZATION:
      return true;
    case types.RESET_AUTHORIZATION:
      return false;
    default:
      return state;
  }
};

const errorMessage = (state = null, action) => {
  switch (action.type) {
    case types.SET_ERROR_MESSAGE:
      return action.message;
    case types.RESET_ERROR_MESSAGE:
      return null;
    default:
      return state;
  }
};

const nextPageTokens = (state = { tasklists: null, tasks: null }, action) => {
  switch (action.type) {
    case types.RECEIVE_TASKLISTS:
      return {
        ...state,
        tasklists: action.tasklists.nextPageToken
      }
    case types.RECEIVE_TASKS:
      return {
        ...state,
        tasks: action.tasks.nextPageToken
      }
    default:
      return state;
  }
};

export const getTasksByTasklistID = (tasks, selectedTasklist) => ({
  ...tasks[selectedTasklist]
});

export default combineReducers({
  tasklists,
  isDrawerOpen,
  screen,
  isFetching,
  avatarURL,
  tasks,
  selectedTasklist,
  isAuthorized,
  errorMessage,
  nextPageTokens
});