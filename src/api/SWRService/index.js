import BaseService from '../BaseService';

class SWRService extends BaseService {
  // This function is used as the fetcher for the swr library
  //  https://github.com/zeit/swr#data-fetching
  fetcher = () => async (...args) => {
    let res;
    try {
      res = await this.http.http(...args);
    } catch (e) {
      throw e;
    }
    return res;
  };
}

export default new SWRService();
