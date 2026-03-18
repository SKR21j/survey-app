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
  active: { en: 'Active', bg: 'Активна' },
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
  fillSurvey: { en: 'Fill Survey', bg: 'Попълни анкета' },
  fillThisSurvey: { en: 'Fill this survey', bg: 'Попълни тази анкета' },
  checkResponses: { en: 'Check Responses', bg: 'Виж отговорите' },
  delete: { en: 'Delete', bg: 'Изтрий' },
  confirm: { en: 'Confirm', bg: 'Потвърди' },
  cancel: { en: 'Cancel', bg: 'Отказ' },
  back: { en: 'Back', bg: 'Назад' },
  failedDeleteSurvey: { en: 'Failed to delete survey', bg: 'Неуспешно изтриване на анкетата' },
  editSurvey: { en: 'Edit Survey', bg: 'Редакция на анкета' },
  createSurveyPlain: { en: 'Create Survey', bg: 'Създай анкета' },
  title: { en: 'Title', bg: 'Заглавие' },
  titleRequired: { en: 'Title is required', bg: 'Заглавието е задължително' },
  surveyTitlePlaceholder: { en: 'Survey title', bg: 'Заглавие на анкетата' },
  description: { en: 'Description', bg: 'Описание' },
  describeSurvey: { en: 'Describe your survey...', bg: 'Опишете вашата анкета...' },
  status: { en: 'Status', bg: 'Статус' },
  addQuestion: { en: '+ Add Question', bg: '+ Добави въпрос' },
  noQuestionsYetLong: { en: 'No questions yet. Click "+ Add Question" to start.', bg: 'Все още няма въпроси. Натиснете "+ Добави въпрос", за да започнете.' },
  saving: { en: 'Saving...', bg: 'Записване...' },
  saveChanges: { en: 'Save Changes', bg: 'Запази промените' },
  questionText: { en: 'Question text', bg: 'Текст на въпроса' },
  remove: { en: 'Remove', bg: 'Премахни' },
  required: { en: 'Required', bg: 'Задължителен' },
  options: { en: 'Options', bg: 'Опции' },
  addOption: { en: '+ Add option', bg: '+ Добави опция' },
  signInTitle: { en: 'Sign in to your account', bg: 'Влезте в профила си' },
  welcomeBack: { en: 'Welcome back!', bg: 'Добре дошли отново!' },
  username: { en: 'Username', bg: 'Потребителско име' },
  usernameRequired: { en: 'Username is required', bg: 'Потребителското име е задължително' },
  password: { en: 'Password', bg: 'Парола' },
  passwordRequired: { en: 'Password is required', bg: 'Паролата е задължителна' },
  passwordMin: { en: 'Password must be at least 8 characters', bg: 'Паролата трябва да е поне 8 символа' },
  signingIn: { en: 'Signing in...', bg: 'Влизане...' },
  signIn: { en: 'Sign in', bg: 'Вход' },
  noAccount: { en: "Don't have an account?", bg: 'Нямате профил?' },
  invalidCredentials: { en: 'Invalid username or password', bg: 'Невалидно потребителско име или парола' },
  createAccountTitle: { en: 'Create an account', bg: 'Създайте профил' },
  joinToday: { en: 'Join Survey App today', bg: 'Присъединете се към Survey App днес' },
  email: { en: 'Email', bg: 'Имейл' },
  emailRequired: { en: 'Email is required', bg: 'Имейлът е задължителен' },
  creatingAccount: { en: 'Creating account...', bg: 'Създаване на профил...' },
  createAccount: { en: 'Create account', bg: 'Създай профил' },
  haveAccount: { en: 'Already have an account?', bg: 'Вече имате профил?' },
  registrationFailed: { en: 'Registration failed. Please try again.', bg: 'Регистрацията беше неуспешна. Опитайте отново.' },
  submitResponse: { en: 'Submit Response', bg: 'Изпрати отговор' },
  submitting: { en: 'Submitting...', bg: 'Изпращане...' },
  failedSubmitResponse: { en: 'Failed to submit response. Please try again.', bg: 'Неуспешно изпращане на отговор. Опитайте отново.' },
  thankYou: { en: 'Thank you!', bg: 'Благодарим!' },
  responseSubmittedSuccess: { en: 'Your response has been submitted successfully.', bg: 'Вашият отговор беше изпратен успешно.' },
  rateSurveyOptional: { en: 'Rate this survey (optional)', bg: 'Оценете тази анкета (по избор)' },
  submitRating: { en: 'Submit rating', bg: 'Изпрати оценка' },
  submittingRating: { en: 'Submitting rating...', bg: 'Изпращане на оценка...' },
  skip: { en: 'Skip', bg: 'Пропусни' },
  thanksForRating: { en: 'Thanks for rating this survey.', bg: 'Благодарим, че оценихте тази анкета.' },
  backToSurveys: { en: 'Back to surveys', bg: 'Обратно към анкетите' },
  selectStarRating: { en: 'Please select a star rating from 1 to 5, or skip this step.', bg: 'Моля, изберете оценка от 1 до 5 звезди или пропуснете тази стъпка.' },
  failedSubmitRating: { en: 'Failed to submit rating. Please try again.', bg: 'Неуспешно изпращане на оценка. Опитайте отново.' },
  answerPrompt: { en: 'Please answer: "{question}"', bg: 'Моля, отговорете на: "{question}"' },
  invalidSurveyId: { en: 'Invalid survey id.', bg: 'Невалиден идентификатор на анкета.' },
  loadingResponses: { en: 'Loading responses...', bg: 'Зареждане на отговорите...' },
  onlyViewCreatedResponses: { en: 'You can only view responses for surveys you created.', bg: 'Можете да виждате отговорите само за анкети, които сте създали.' },
  backToDashboard: { en: 'Back to Dashboard', bg: 'Обратно към таблото' },
  responseOverview: { en: 'Response overview', bg: 'Преглед на отговорите' },
  exportCsv: { en: 'Export CSV', bg: 'Експорт CSV' },
  exportJson: { en: 'Export JSON', bg: 'Експорт JSON' },
  noResponsesToExport: { en: 'No responses to export yet.', bg: 'Все още няма отговори за експорт.' },
  pageNotFound: { en: 'Page Not Found', bg: 'Страницата не е намерена' },
  pageMissing: { en: "The page you're looking for doesn't exist or has been moved.", bg: 'Страницата, която търсите, не съществува или е преместена.' },
  goHome: { en: 'Go Home', bg: 'Към началото' },
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

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) {
        return;
      }

      if (event.newValue === 'en' || event.newValue === 'bg') {
        setLanguage(event.newValue);
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

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