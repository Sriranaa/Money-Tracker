import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { translations } from "../translations";

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const storedLanguage = localStorage.getItem("mt_language");
  const [language, setLanguageState] = useState(storedLanguage || "en");
  const [isLanguageSelected, setIsLanguageSelected] = useState(Boolean(storedLanguage));

  const setLanguage = useCallback((value) => {
    localStorage.setItem("mt_language", value);
    setLanguageState(value);
    setIsLanguageSelected(true);
  }, []);

  const t = useCallback((key) => translations[language]?.[key] || translations.en[key] || key, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t, isLanguageSelected }),
    [language, setLanguage, t, isLanguageSelected]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
