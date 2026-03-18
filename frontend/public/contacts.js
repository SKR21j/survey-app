(function () {
  const STORAGE_KEY = 'theme';

  function getInitialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
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
    if (toggleButton) {
      toggleButton.textContent = isDark ? 'Light mode' : 'Dark mode';
      toggleButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function setTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  }

  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);

  const toggleButton = document.getElementById('theme-toggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', function () {
      const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  window.addEventListener('storage', function (event) {
    if (event.key !== STORAGE_KEY) {
      return;
    }

    if (event.newValue === 'dark' || event.newValue === 'light') {
      applyTheme(event.newValue);
    }
  });
})();
