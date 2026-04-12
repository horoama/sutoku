import axios from 'axios';
import { Platform } from 'react-native';

import Constants from 'expo-constants';

// EXPO_PUBLIC_API_URL を環境変数から取得
let API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    API_URL = `http://${window.location.hostname}:3000/api`;
  } else if (Constants.expoConfig?.hostUri) {
    const host = Constants.expoConfig.hostUri.split(':')[0];
    API_URL = `http://${host}:3000/api`;
  } else {
    API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';
  }
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
