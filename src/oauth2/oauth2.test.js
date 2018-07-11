import fetchMock from 'fetch-mock';
import { checkUserAuthorization } from './oauth2';

it('Returns false if token is absent', () => {
  
  return checkUserAuthorization().then((isAuthorized) => {
    expect(isAuthorized).toBe(false);
  });
});

describe('Request to google api for tokeninfo', () => {
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  const TOKEN_INFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v3/tokeninfo';
  
  it('Returns true if token is present and verified', () => {
    location.hash = '#access_token=ya29.GlzqBT7rO--RB2LZql3dAJBlqDYFJLNGz-lt6-T&token_type=Bearer&expires_in=3600'
    const expectedBody = {
      "aud" : "822102553032-ks13fvqvesf5jimq124em0hfndmt7u7q.apps.googleusercontent.com",
      "user_id" : "123456789",
      "scope" : "https://www.googleapis.com/auth/drive.metadata.readonly",
      "expires_in" : 436
    };

    fetchMock.get(`begin:${TOKEN_INFO_ENDPOINT}`, { body: expectedBody });

    return checkUserAuthorization().then((data) => {
      expect(data).toBe(true);
    });
  });

  it('Returns reject promise with string "Ошибка сервера." if network error has ocurred', () => {
    const expectedStatus = 404;
    const configObject = {
      status: expectedStatus
    };

    fetchMock.get(`begin:${TOKEN_INFO_ENDPOINT}`, configObject);
    expect.assertions(1);

    return checkUserAuthorization().catch((e) => {
      expect(e).toBe('Ошибка сервера.');
    });
  });

  it('Returns false if token is invalid', () => {
    const expectedStatus = 400;
    const expectedBody = {
      "error":"invalid_token"
    };
    const configObject = {
      body: expectedBody,
      status: expectedStatus
    };

    fetchMock.get(`begin:${TOKEN_INFO_ENDPOINT}`, configObject);

    return checkUserAuthorization().then((data) => {
      expect(data).toBe(false);
    });
  });

  it('Returns false if client ID isn`t match', () => {
    const expectedBody = {
      "aud" : "ks13fvqvesfjimq124em0hfndmt7u7q.apps.googleusercontent.com",
      "user_id" : "123456789",
      "scope" : "https://www.googleapis.com/auth/drive.metadata.readonly",
      "expires_in" : 436
    };
    const configObject = {
      body: expectedBody
    };

    fetchMock.get(`begin:${TOKEN_INFO_ENDPOINT}`, configObject);

    return checkUserAuthorization().then((data) => {
      expect(data).toBe(false);
    });
  });

});