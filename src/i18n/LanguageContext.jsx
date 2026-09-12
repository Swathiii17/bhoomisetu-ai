import React, { createContext, useContext, useEffect } from 'react';
import en from './en.json';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const lang = 'en';

  useEffect(() => {
    localStorage.removeItem('bhoomisetu_language');
    document.documentElement.lang = 'en';
  }, []);

  const t = (keyPath) => {
    const keys = keyPath.split('.');
    let result = en;
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        return keyPath; // fallback to key
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ lang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
