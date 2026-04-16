// languages/i18n.ts
//This file sets up the i18n instance for our app, loading both English and Tagalog translations and configuring it for use with React Native.

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import tl from "./tagalog.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4", // Required for React Native
  lng: "en", // Default language is English
  fallbackLng: "en", // Fall back to English if a key is missing in Tagalog
  resources: {
    en: {
      translation: en,
    },
    tl: {
      translation: tl,
    },
  },
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
