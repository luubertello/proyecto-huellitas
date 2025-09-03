import axios from 'axios';

export class AuthService {
  private baseURL = 'http://localhost:3000/auth';
  private token: string | null = null;

  async login(email: string, password: string) {
    const res = await axios.post(`${this.baseURL}/login`, { email, password });
    this.token = res.data.access_token;
    return res.data;
  }

  getToken() {
    return this.token;
  }
}
