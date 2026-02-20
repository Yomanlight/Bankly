import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations from '../constants/translations';

const LANGUAGE_KEY = '@bankup_language';
const SUPPORTED_LANGUAGES = ['fr', 'en', 'es', 'de'];
const DEFAULT_LANGUAGE = 'fr';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((stored) => {
      if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
        setLanguageState(stored);
      }
    });
  }, []);

  const setLanguage = useCallback(async (lang) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) return;
    setLanguageState(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  }, []);

  // t(key) — supports dot notation like 'dashboard.greeting'
  const t = useCallback((key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value == null) break;
      value = value[k];
    }
    // Fallback to French if key missing
    if (value == null) {
      value = translations[DEFAULT_LANGUAGE];
      for (const k of keys) {
        if (value == null) break;
        value = value[k];
      }
    }
    if (typeof value !== 'string') return key;
    // Replace {n} placeholders
    return value.replace(/\{(\w+)\}/g, (_, param) =>
      params[param] !== undefined ? String(params[param]) : `{${param}}`
    );
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
