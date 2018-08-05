import api from '../api/';
import * as types from './types';
import oauth2 from '../oauth2/oauth2';
import { fetchTasklists } from './tasklists';


export const initApp = () => (dispatch, getState) => {
  oauth2.checkUserAuthorization()
    .then((isAuthorized) => {
      if (!isAuthorized) {
        dispatch(setScreen('login'));
      } else {
        dispatch({
          type: types.SET_AUTHORIZATION
        });
        dispatch(fetchTasklists());
        dispatch(fetchAvatar());
      }
    });
};

export const revokeUserAuthorization = () => (dispatch, getState) => {
  oauth2.revokeUserAuthorization()
    .catch((message) => console.log(message));
};


export const fetchAvatar = () => dispatch => {
  const settings = {
    path: `plus/v1/people/me`
  };

  dispatch(sendRequest(settings))
  .then((profile) => dispatch({
    type: types.RECEIVE_AVATAR_URL,
    avatarURL: profile.image.url
  }));
};


export const sendRequest = settings => (dispatch, getState) => {
  dispatch({ type: types.START_PROGRESS });
  return api(settings)
  .then(data => {
    dispatch({ type: types.FINISH_PROGRESS });
    return data;
  }, response => {
    dispatch({ type: types.FINISH_PROGRESS });
    if (response.status === 400) {
      return response.json();
    } else {
      dispatch(setErrorMessage(`Ошибка: ${response.statusText}`)); 
    }
  });
};


export const toggleDrawer = () => ({
  type: types.TOGGLE_DRAWER
});

export const resetErrorMessage = () => ({
  type: types.RESET_ERROR_MESSAGE
});

export const setErrorMessage = message => ({
  type: types.SET_ERROR_MESSAGE,
  message
});

export const setScreen = (screen) => ({
  type: types.SET_SCREEN,
  screen
});