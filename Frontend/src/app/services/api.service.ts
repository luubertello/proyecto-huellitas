import axios from 'axios';

export class ApiService {
  private baseURL = 'http://localhost:3000'; // tu backend
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  get(endpoint: string) {
    return axios.get(this.baseURL + endpoint, { headers: this.getHeaders() });
  }

  post(endpoint: string, data: any) {
    return axios.post(this.baseURL + endpoint, data, { headers: this.getHeaders() });
  }

  put(endpoint: string, data: any) {
    return axios.put(this.baseURL + endpoint, data, { headers: this.getHeaders() });
  }

  patch(endpoint: string, data: any) {
    return axios.patch(this.baseURL + endpoint, data, { headers: this.getHeaders() });
  }

  delete(endpoint: string) {
    return axios.delete(this.baseURL + endpoint, { headers: this.getHeaders() });
  }
}
