import qs from 'qs';

const AUTHORIZATION_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_INFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v3/tokeninfo';
const REVOKE_TOKEN_ENDPOINT = 'https://accounts.google.com/o/oauth2/revoke';

const CLIENT_ID = '822102553032-ks13fvqvesf5jimq124em0hfndmt7u7q.apps.googleusercontent.com';
const REDIRECT_URI = 'https://dreamer20.github.io/gtasks';
const RESPONSE_TYPE = 'token';
const SCOPE = 'https://www.googleapis.com/auth/tasks ' +
              'https://www.googleapis.com/auth/tasks.readonly ' +
              'https://www.googleapis.com/auth/plus.me';

const queryParameters = {
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  response_type: RESPONSE_TYPE,
  scope: SCOPE
};

const queryString = qs.stringify(queryParameters);

export const oauth2URL = `${AUTHORIZATION_ENDPOINT}?${queryString}`;

export const checkUserAuthorization = () => {
  const token = getAccessToken();

  if (!token) {
    return Promise.resolve(false);
  }

  return verifyToken(token);
}

export const revokeUserAuthorization = () => {
  const accessToken = localStorage.getItem('accessToken');
  const queryParameters = {
    token: accessToken
  };
  const queryString = qs.stringify(queryParameters);

  return fetch(`${REVOKE_TOKEN_ENDPOINT}?${queryString}`)
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(new Error('Ошибка сервера.'));
      }
      console.log('revoked');
      localStorage.clear();
      window.location.assign(window.location.origin);
    })
    .catch((e) => Promise.reject(e.message));
}

const getAccessTokenFromHash = () => {
  const hash = window.location.hash;
  const queryParameters = qs.parse(hash);
  const accessToken = queryParameters['#access_token'];

  return accessToken;
}

const getAccessToken = () => {
  let accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    accessToken = getAccessTokenFromHash();
    
    if (!accessToken) {
      return false;
    }

    localStorage.setItem('accessToken', accessToken);

    return accessToken;
  }

  return accessToken;
}

const verifyToken = (token) => {
  const queryParameters = {
    access_token: token
  };
  const queryString = qs.stringify(queryParameters);
  const tokenVerifivationURL = `${TOKEN_INFO_ENDPOINT}?${queryString}`;

  return fetch(tokenVerifivationURL)
    .then((response) => {
      if (response.status === 400) {
        return Promise.resolve(false);
      } else if (!response.ok) {
        return Promise.reject(new Error('Ошибка сервера.'));
      }

      return response.json();
    })
    .then((tokenData) => {
      if (!tokenData || tokenData.aud !== CLIENT_ID) {
        localStorage.removeItem('accessToken');
        return Promise.resolve(false);
      }

      return Promise.resolve(true);
    })
    .catch((e) => Promise.reject(e.message));
}

export default { 
  oauth2URL,
  revokeUserAuthorization,
  checkUserAuthorization
};