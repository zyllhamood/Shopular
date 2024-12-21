// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation files
const resources = {
    en: {
        translation: {
            homeSell: "Start Selling Digital Products Now",
            // Add other text translations here
        }
    },
    ar: {
        translation: {
            homeSell: "ابدا ببيع منتجات رقمية الان",
            // Add other text translations here
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        fallbackLng: "en", // fallback language if the current language translation is not available
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
