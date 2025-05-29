import axios from "axios";

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://reportai-server-168838082437.us-central1.run.app',
  withCredentials: true
});

class ApiService {

  constructor(apiUrl) {
    this.apiUrl = apiUrl
  }


  post(url, objeto) {
    let token = localStorage.getItem('access_token') || '';
    token = token.replace(/^"|"$/g, '');
    const header = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    const requestUrl = `${this.apiUrl}${url}`
    if (token) {
      return httpClient.post(requestUrl, objeto, header)
    } else {
      return httpClient.post(requestUrl, objeto)
    }
  }

  put(url, objeto) {
    let token = localStorage.getItem('access_token') || '';
    token = token.replace(/^"|"$/g, '');
    const header = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
    const requestUrl = `${this.apiUrl}${url}`
    if (token) {
      return httpClient.put(requestUrl, objeto, header)
    } else {
      return httpClient.put(requestUrl, objeto)
    }
  }

  delete(url) {
    let token = localStorage.getItem('access_token') || '';
    token = token.replace(/^"|"$/g, '');
    const header = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
    const requestUrl = `${this.apiUrl}${url}`
    if (token) {
      return httpClient.delete(requestUrl, header)
    } else {
      return httpClient.delete(requestUrl)
    }
  }

  get(url) {

    let token = localStorage.getItem('access_token') || '';
    token = token.replace(/^"|"$/g, '');
    const header = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
    const requestUrl = `${this.apiUrl}${url}`;
    if (token) {
      return httpClient.get(requestUrl, header)
    } else {
      return httpClient.get(requestUrl)
    }

  }


}

export default ApiService