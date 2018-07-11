
const apiRoot = 'https://www.googleapis.com/';

export default settings => {
  const queryString = settings.query ? `?${settings.query}` : '';
  const url = `${apiRoot}${settings.path}${queryString}`;
  const accessToken = localStorage.getItem('accessToken');
  const options = {
    method: settings.method || 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  };
  
  return fetch(url, options).then(
    response => {
      if (!response.ok) {
        return Promise.reject(new Error(response.statusText));
      }
      return response.json();
    }
  ).then(data => {
    return Promise.resolve(data);
  }).catch(e => Promise.reject(e.message));
};