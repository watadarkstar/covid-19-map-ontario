class OntarioService {
  constructor() {
    this.resourceId = '455fd63b-603d-4608-8216-7d8647f43350';
  }

  // get
  getQueryUrl() {
    return `/datastore_search?resource_id=${this.resourceId}`;
  }

  // create
  getCreateUrl() {
    return `/datastore_create`;
  }

  // update or insert
  getUpdateUrl() {
    return `/datastore_upsert`;
  }
}

export default new OntarioService();
