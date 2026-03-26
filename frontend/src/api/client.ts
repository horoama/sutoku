import axios from 'axios';

// For local testing in Android Emulator, you often need 10.0.2.2 instead of localhost
// Since we are running on web or the same machine, localhost is fine.
const API_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
