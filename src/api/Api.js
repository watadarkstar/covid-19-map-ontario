import axios from 'axios';

// `timeout` specifies the number of milliseconds before the request times out.
// If the request takes longer than `timeout`, the request will be aborted.
const TIMEOUT = 20 * 1000;

export class Api {
  static http;

  constructor() {
    const REACT_APP_BACKEND_API = 'https://data.ontario.ca/api/3/action';
    this.http = axios.create({
      baseURL: REACT_APP_BACKEND_API,
      timeout: TIMEOUT,
      method: 'post',
    });
  }

  get(url = '', config = {}) {
    return this.http.get(url, config);
  }

  post(url = '', data = {}, config = {}) {
    return this.http.post(url, data, config);
  }

  put(url = '', data = {}, config = {}) {
    return this.http.put(url, data, config);
  }

  delete(url = '', data = {}, config = {}) {
    return this.http.delete(url, data, config);
  }
}

export default new Api();
