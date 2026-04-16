import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const en = require('./locales/en.json');
const ja = require('./locales/ja.json');

const resources = {
  en: { translation: en },
  ja: { translation: ja }
};

const LANGUAGE_KEY = '@app_language';

export const initI18n = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

    let initialLang = 'en';
    if (savedLanguage) {
      initialLang = savedLanguage;
    } else {
      const locales = Localization.getLocales();
      if (locales && locales.length > 0 && locales[0].languageTag?.startsWith('ja')) {
        initialLang = 'ja';
      }
    }

    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: initialLang,
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false
        }
      });
  } catch (error) {
    console.error('Failed to initialize i18n', error);
    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false
        }
      });
  }
};

export const changeLanguage = async (lng: string) => {
  try {
    await i18n.changeLanguage(lng);
    await AsyncStorage.setItem(LANGUAGE_KEY, lng);
  } catch (error) {
    console.error('Failed to change language', error);
  }
};

export default i18n;
