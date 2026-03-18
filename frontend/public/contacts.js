(function () {
  const THEME_STORAGE_KEY = 'theme';
  const LANGUAGE_STORAGE_KEY = 'language';

  const translations = {
    en: {
      'contacts.title': 'Let us hear from you',
      'contacts.subtitle': 'Questions, feedback, and partnership ideas are all welcome.',
      'contacts.backToApp': 'Back to app',
      'contacts.getInTouch': 'Get in touch',
      'contacts.chooseChannel': 'Choose the channel that works best for your team.',
      'contacts.email': 'Email',
      'contacts.phone': 'Phone',
      'contacts.office': 'Office',
      'contacts.supportHours': 'Support hours',
      'contacts.supportHoursValue': 'Mon-Fri: 10:00 - 17:00 CET',
      'contacts.sendMessage': 'Send a message',
      'contacts.fullName': 'Full name',
      'contacts.subject': 'Subject',
      'contacts.message': 'Message',
      'contacts.namePlaceholder': 'Jane Doe',
      'contacts.emailPlaceholder': 'jane@company.com',
      'contacts.subjectPlaceholder': 'How can we collaborate?',
      'contacts.messagePlaceholder': 'Write your message here...',
      'contacts.sendMessageButton': 'Send message',
      themeLight: 'Light mode',
      themeDark: 'Dark mode',
      themeLightAria: 'Switch to light mode',
      themeDarkAria: 'Switch to dark mode',
      languageButton: 'БГ',
      languageAria: 'Switch language to Bulgarian'
    },
    bg: {
      'contacts.title': 'Свържете се с нас',
      'contacts.subtitle': 'Въпроси, обратна връзка и идеи за партньорство са добре дошли.',
      'contacts.backToApp': 'Обратно към приложението',
      'contacts.getInTouch': 'Свържете се с нас',
      'contacts.chooseChannel': 'Изберете канала, който е най-удобен за вас.',
      'contacts.email': 'Имейл',
      'contacts.phone': 'Телефон',
      'contacts.office': 'Офис',
      'contacts.supportHours': 'Работно време',
      'contacts.supportHoursValue': 'Пон-Пет: 10:00 - 17:00 CET',
      'contacts.sendMessage': 'Изпратете съобщение',
      'contacts.fullName': 'Име и фамилия',
      'contacts.subject': 'Тема',
      'contacts.message': 'Съобщение',
      'contacts.namePlaceholder': 'Иван Иванов',
      'contacts.emailPlaceholder': 'ivan@example.com',
      'contacts.subjectPlaceholder': 'Как можем да си партнираме?',
      'contacts.messagePlaceholder': 'Напишете съобщението си тук...',
      'contacts.sendMessageButton': 'Изпрати съобщение',
      themeLight: 'Светъл режим',
      themeDark: 'Тъмен режим',
      themeLightAria: 'Превключи към светъл режим',
      themeDarkAria: 'Превключи към тъмен режим',
      languageButton: 'EN',
      languageAria: 'Switch language to English'
    }
  };

  function getInitialLanguage() {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === 'bg' ? 'bg' : 'en';
  }

  function getInitialTheme() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = theme;

    const toggleButton = document.getElementById('theme-toggle');
    const language = getInitialLanguage();
    if (toggleButton) {
      toggleButton.textContent = isDark ? translations[language].themeLight : translations[language].themeDark;
      toggleButton.setAttribute('aria-label', isDark ? translations[language].themeLightAria : translations[language].themeDarkAria);
    }
  }

  function applyLanguage(language) {
    document.documentElement.lang = language;

    document.querySelectorAll('[data-i18n]').forEach(function (element) {
      const key = element.getAttribute('data-i18n');
      if (!key) {
        return;
      }

      const translated = translations[language][key];
      if (!translated) {
        return;
      }

      element.childNodes[0].nodeValue = translated;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (element) {
      const key = element.getAttribute('data-i18n-placeholder');
      if (!key) {
        return;
      }

      const translated = translations[language][key];
      if (!translated) {
        return;
      }

      element.setAttribute('placeholder', translated);
    });

    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
      languageToggle.textContent = translations[language].languageButton;
      languageToggle.setAttribute('aria-label', translations[language].languageAria);
    }

    applyTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  }

  function setTheme(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
  }

  function setLanguage(language) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    applyLanguage(language);
  }

  const initialTheme = getInitialTheme();
  const initialLanguage = getInitialLanguage();
  applyLanguage(initialLanguage);
  applyTheme(initialTheme);

  const toggleButton = document.getElementById('theme-toggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', function () {
      const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  const languageToggle = document.getElementById('language-toggle');
  if (languageToggle) {
    languageToggle.addEventListener('click', function () {
      const current = getInitialLanguage();
      setLanguage(current === 'bg' ? 'en' : 'bg');
    });
  }

  window.addEventListener('storage', function (event) {
    if (event.key === THEME_STORAGE_KEY && (event.newValue === 'dark' || event.newValue === 'light')) {
      applyTheme(event.newValue);
    }

    if (event.key === LANGUAGE_STORAGE_KEY && (event.newValue === 'en' || event.newValue === 'bg')) {
      applyLanguage(event.newValue);
    }
  });
})();
