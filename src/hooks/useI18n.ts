import { useState, useEffect, useCallback } from 'react';
import type { Lang, TranslationKey } from '../i18n';
import { TRANSLATIONS, DEFAULT_LANG } from '../i18n';
import { storageAdapter } from '../utils/storage';

export function useI18n() {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Initialization ---
  useEffect(() => {
    const data = storageAdapter.get();
    let initialLang: Lang = DEFAULT_LANG;

    if (data.lang && (data.lang === 'zh' || data.lang === 'en' || data.lang === 'tw')) {
      initialLang = data.lang;
    } else {
      // Browser detection
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'zh' || browserLang === 'en' || browserLang === 'tw') {
        initialLang = browserLang as Lang;
      }
    }

    setLang(initialLang);
    setIsLoaded(true);
  }, []);

  // --- Translation Logic ---
  const t = useCallback((key: TranslationKey, params?: Record<string, string>) => {
    const langTranslations = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];
    let text = (langTranslations as any)[key] || (TRANSLATIONS[DEFAULT_LANG] as any)[key] || key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      });
    }
    return text;
  }, [lang]);

  // --- Actions ---
  const changeLang = useCallback((newLang: Lang) => {
    setLang(newLang);
    
    // Immediate persistence via adapter
    storageAdapter.update({ lang: newLang });
  }, []);

  return {
    lang,
    t,
    isLoaded,
    changeLang
  };
}
