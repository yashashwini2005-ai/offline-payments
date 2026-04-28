import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('janpay_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('janpay_lang', language);
  }, [language]);

  const t = (key, params = {}) => {
    let text = translations[language][key] || translations['en'][key] || key;
    
    // Simple template replacement for {{param}}
    Object.keys(params).forEach(param => {
      text = text.replace(`{{${param}}}`, params[param]);
    });
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
