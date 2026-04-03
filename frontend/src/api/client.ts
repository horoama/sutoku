import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// EXPO_PUBLIC_API_URL を環境変数から取得
let API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

if (!process.env.EXPO_PUBLIC_API_URL) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    // Webの場合は、現在のホスト名を使用してAPIのURLを動的に生成する
    API_URL = `http://${window.location.hostname}:3000/api`;
  } else if (Constants.expoConfig?.hostUri) {
    // Expo Goなどのネイティブアプリの場合は、開発マシンのIPアドレスを取得する
    const host = Constants.expoConfig.hostUri.split(':')[0];
    API_URL = `http://${host}:3000/api`;
  }
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
