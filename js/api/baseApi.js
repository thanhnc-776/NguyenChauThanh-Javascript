import fetchClient from './fetchClient.js';
import AppConstants from '../appConstants.js';

export default class BaseApi {
  getResourceName() {
    throw new Error('Please implement this method');
  }

  getAll(obj) {
    const str = `_page=${obj._page}&_limit=${obj._limit}`;
    const url = `${AppConstants.API_URL}/${this.getResourceName()}/?${str}&_sort=updatedAt&_order=desc`;
    return fetchClient.get(url);
  }

  getDetail(id) {
    const url = `${AppConstants.API_URL}/${this.getResourceName()}/${id}`;
    return fetchClient.get(url);
  }
  // payload: thông tin truyền vào
  add(payload) {
    const url = `${AppConstants.API_URL}/${this.getResourceName()}`;
    return fetchClient.post(url, payload);
  }

  update(payload) {
    const url = `${AppConstants.API_URL}/${this.getResourceName()}/${payload.id}`;
    return fetchClient.patch(url, payload);
  }

  remove(id) {
    const url = `${AppConstants.API_URL}/${this.getResourceName()}/${id}`;
    return fetchClient.delete(url);
  }
}
