export const getResponse = (request) => request.then(
  response => response.json()
);

export const makeRequest = (url, config) => {
  return fetch(url, config).then(
    response => resolveResponse(response)
  ).catch(error => {
    // Redirect unauthorized user
    if (error.status === 401) {
      window.location.replace('/');
    }

    return rejectResponse(error);
  });
};

export const getRequest = (config = {}) => {
  config.headers = new Headers(config.headers);
  config.headers.append('Accept', 'application/json');

  return config;
};

export const postRequest = (config = {}) => {
  config.headers = new Headers(config.headers);
  config.headers.append('Accept', 'application/json');
  config.headers.append('Content-Type', 'application/json');
  config.method = 'post';

  config.body = JSON.stringify(config.body);

  return config;
};

export const deleteRequest = (config = {}) => {
  config.headers = new Headers(config.headers);
  config.method = 'delete';

  return config;
};

export const putRequest = (config = {}) => {
  config.headers = new Headers(config.headers);
  config.headers.append('Content-Type', 'application/json');
  config.method = 'put';

  config.body = JSON.stringify(config.body);

  return config;
};

export const resolveResponse = (response) => {
  return response.ok ? Promise.resolve(response) : Promise.reject(response);
};

export const rejectResponse = (response) => {
  Promise.reject(response.json());
};
