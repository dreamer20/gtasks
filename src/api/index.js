
const apiRoot = 'https://www.googleapis.com/';

export default settings => {
  const queryString = settings.query ? `?${settings.query}` : '';
  const url = `${apiRoot}${settings.path}${queryString}`;
  const accessToken = localStorage.getItem('accessToken');
  const options = {
    method: settings.method || 'GET',
    body: settings.body ? JSON.stringify(settings.body) : null,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json'
    }
  };
  
  return fetch(url, options).then(
    response => {
      if (!response.ok) {
        if (response.status === 401) {
          // if token got expired it's refresh page to the root location;
          window.location.assign(window.location.origin);
        }
        return Promise.reject(new Error(response.statusText));
      }

      if (response.status === 204) {
        return;
      }
      
      return response.json();
    }
  ).then(data => {
    return Promise.resolve(data);
  }).catch(e => Promise.reject(e.message));
};