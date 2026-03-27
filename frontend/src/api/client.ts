import axios from 'axios';
import { Platform } from 'react-native';

// EXPO_PUBLIC_API_URL を環境変数から取得
let API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Webの場合は、現在のホスト名を使用してAPIのURLを動的に生成する
if (!process.env.EXPO_PUBLIC_API_URL && Platform.OS === 'web' && typeof window !== 'undefined') {
  API_URL = `http://${window.location.hostname}:3000/api`;
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
