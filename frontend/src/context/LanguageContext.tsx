import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Language = 'en' | 'bg';

interface LanguageContextValue {
  language: Language;
  isBulgarian: boolean;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const STORAGE_KEY = 'language';

const translations: Record<string, Record<Language, string>> = {
  home: { en: 'Home', bg: 'Начало' },
  contact: { en: 'Contact', bg: 'Контакти' },
  dashboard: { en: 'Dashboard', bg: 'Табло' },
  login: { en: 'Login', bg: 'Вход' },
  register: { en: 'Register', bg: 'Регистрация' },
  logout: { en: 'Logout', bg: 'Изход' },
  light: { en: 'Light', bg: 'Светла' },
  dark: { en: 'Dark', bg: 'Тъмна' },
  welcome: { en: 'Welcome to', bg: 'Добре дошли в' },
  browseAnonymous: { en: 'Browse available surveys and share your opinions.', bg: 'Разгледайте наличните анкети и споделете мнението си.' },
  helloBrowse: { en: 'Hello, {name}! Browse and fill out surveys below.', bg: 'Здравей, {name}! Разгледай и попълни анкетите по-долу.' },
  searchSurveys: { en: 'Search surveys', bg: 'Търсене на анкети' },
  searchActiveSurveys: { en: 'Search active surveys...', bg: 'Търсене на активни анкети...' },
  createSurvey: { en: '+ Create Survey', bg: '+ Създай анкета' },
  allSurveys: { en: 'All Surveys', bg: 'Всички анкети' },
  surveys: { en: 'Surveys', bg: 'Анкети' },
  all: { en: 'All', bg: 'Всички' },
  active: { en: 'Active', bg: 'Активни' },
  draft: { en: 'Draft', bg: 'Чернови' },
  closed: { en: 'Closed', bg: 'Затворени' },
  newestFirst: { en: 'Newest first', bg: 'Най-новите първо' },
  oldestFirst: { en: 'Oldest first', bg: 'Най-старите първо' },
  searchSurveysPlaceholder: { en: 'Search surveys...', bg: 'Търсене на анкети...' },
  noSurveysFound: { en: 'No surveys found.', bg: 'Не са намерени анкети.' },
  adminMenu: { en: 'Admin Menu', bg: 'Админ меню' },
  analytics: { en: 'Analytics', bg: 'Анализи' },
  totalSurveys: { en: 'Total Surveys', bg: 'Общо анкети' },
  totalResponses: { en: 'Total Responses', bg: 'Общо отговори' },
  recentSurveys: { en: 'Recent Surveys', bg: 'Последни анкети' },
  questions: { en: 'questions', bg: 'въпроса' },
  responses: { en: 'responses', bg: 'отговора' },
  edit: { en: 'Edit', bg: 'Редакция' },
  noSurveysYet: { en: 'No surveys yet.', bg: 'Все още няма анкети.' },
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'bg' ? 'bg' : 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    isBulgarian: language === 'bg',
    toggleLanguage: () => setLanguage((current) => (current === 'bg' ? 'en' : 'bg')),
    t: (key: string) => translations[key]?.[language] ?? key,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguageContext(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within LanguageProvider');
  }

  return context;
}