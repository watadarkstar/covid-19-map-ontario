import Api from '../Api';

class BaseService {
  static http;

  constructor() {
    this.http = Api;
  }
}

export default BaseService;
