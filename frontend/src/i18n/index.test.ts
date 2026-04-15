import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { initI18n } from './index';

// Mock expo-localization
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [{ languageTag: 'ja-JP', languageCode: 'ja' }]),
}));

describe('i18n Initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with stored language if available', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('en');

    await initI18n();

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@app_language');
    expect(i18n.language).toBe('en');
  });

  it('should fallback to device locale if no stored language', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    await initI18n();

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@app_language');
    expect(i18n.language).toBe('ja'); // Based on mocked expo-localization
  });

  it('should handle un-supported device locale gracefully', async () => {
     const expoLocalization = require('expo-localization');
     expoLocalization.getLocales.mockReturnValueOnce([{ languageTag: 'fr-FR', languageCode: 'fr' }]);
     (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

     await initI18n();

     // default fallback in config is 'en'
     expect(i18n.language).toBe('en');
  });

  it('should correctly load translation resources', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('en');
    await initI18n();

    expect(i18n.t('settings.title')).toBe('Moteri');

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('ja');
    await initI18n();
    // After reloading, if it doesn't automatically switch due to the mock, let's change it manually
    await i18n.changeLanguage('ja');
    expect(i18n.t('settings.title')).toBe('Moteri');
  });
});
