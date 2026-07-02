/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "../lib/translations/en";
import { vi } from "../lib/translations/vi";

type Language = "en" | "vi";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof en; // Type-safe autocompletes using the core 'en' structure
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Pull language preference from localStorage, default to 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("henry_fit_language");
    return (saved === "vi" || saved === "en") ? (saved as Language) : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("henry_fit_language", lang);
  };

  // Compute active translation dictionary
  const t = language === "vi" ? (vi as unknown as typeof en) : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
