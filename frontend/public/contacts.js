(function () {
  const THEME_STORAGE_KEY = 'theme';
  const LANGUAGE_STORAGE_KEY = 'language';
  const AUTH_STORAGE_KEY = 'user';
  const TOKEN_STORAGE_KEY = 'token';
  const API_BASE_URL = 'http://localhost:8081/api';

  const translations = {
    en: {
      brand: 'Survey App',
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
      brand: 'Survey App',
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

  function getStoredUser() {
    try {
      const user = localStorage.getItem(AUTH_STORAGE_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  function getToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  function isAdmin() {
    const user = getStoredUser();
    return user && user.role === 'ADMIN';
  }

  async function fetchMessages() {
    const token = getToken();
    if (!token) {
      console.error('No token found for fetching messages');
      return { content: [], totalElements: 0 };
    }

    try {
      console.log('Fetching messages from:', API_BASE_URL + '/contact/messages');
      const response = await fetch(API_BASE_URL + '/contact/messages?page=0&size=50', {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch messages. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fetch messages: ' + response.status);
      }

      const data = await response.json();
      console.log('Messages fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return { content: [], totalElements: 0 };
    }
  }

  async function deleteMessage(messageId) {
    const token = getToken();
    if (!token) {
      console.error('No token found for deleting message');
      return false;
    }

    try {
      const response = await fetch(API_BASE_URL + '/contact/messages/' + messageId, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Failed to delete message. Status:', response.status);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }

  async function submitContactForm(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    try {
      console.log('Submitting message to:', API_BASE_URL + '/contact/messages');
      const response = await fetch(API_BASE_URL + '/contact/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Submit failed. Status:', response.status, 'Error:', responseData);
        alert('Error: ' + (responseData.message || 'Failed to submit message'));
        return;
      }

      console.log('Message submitted successfully:', responseData);
      form.reset();
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error sending message. Please try again.');
    }
  }

  function renderMessageList() {
    console.log('Rendering message list...');
    fetchMessages().then(data => {
      const formWrap = document.querySelector('.form-wrap');
      if (!formWrap) {
        console.error('Form wrap element not found');
        return;
      }

      const language = getInitialLanguage();
      const messages = data.content || [];

      console.log('Number of messages:', messages.length);

      let html = '<h2 class="messages-title">Messages</h2>';
      
      if (messages.length === 0) {
        html += '<p class="messages-empty">No messages yet.</p>';
      } else {
        html += '<div class="messages-list">';
        messages.forEach((msg) => {
          const dateStr = new Date(msg.createdAt).toLocaleDateString();
          const timeStr = new Date(msg.createdAt).toLocaleTimeString();
          html += `
            <div class="message-card ${msg.read ? 'is-read' : 'is-unread'}">
              <div class="message-head">
                <div class="message-sender">
                  <strong class="message-name">${escapeHtml(msg.name)}</strong>
                  <br/>
                  <small class="message-email">${escapeHtml(msg.email)}</small>
                </div>
                <small class="message-time">${dateStr} ${timeStr}</small>
              </div>
              <div class="message-subject-wrap">
                <strong class="message-subject">${escapeHtml(msg.subject)}</strong>
              </div>
              <div class="message-body">
                ${escapeHtml(msg.message)}
              </div>
              <div class="message-footer">
                ${!msg.read ? '<div class="message-status message-status-unread"><strong>Unread</strong></div>' : '<div class="message-status message-status-read"><strong>Read</strong></div>'}
                <button type="button" class="message-delete-btn" data-message-id="${msg.id}">Delete</button>
              </div>
            </div>
          `;
        });
        html += '</div>';
      }

      formWrap.innerHTML = html;
      applyLanguage(language);
    });
  }

  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
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

  // Handle form submission or show admin view
  document.addEventListener('DOMContentLoaded', function () {
    console.log('Page loaded. Checking if user is admin...');
    console.log('Is Admin:', isAdmin());
    
    if (isAdmin()) {
      console.log('Admin detected. Showing message list...');
      renderMessageList();

      const formWrap = document.querySelector('.form-wrap');
      if (formWrap) {
        formWrap.addEventListener('click', async function (event) {
          const target = event.target;
          if (!(target instanceof HTMLElement)) {
            return;
          }

          const deleteButton = target.closest('.message-delete-btn');
          if (!(deleteButton instanceof HTMLElement)) {
            return;
          }

          const messageId = deleteButton.getAttribute('data-message-id');
          if (!messageId) {
            return;
          }

          const confirmed = window.confirm('Delete this message? This action cannot be undone.');
          if (!confirmed) {
            return;
          }

          deleteButton.setAttribute('disabled', 'disabled');
          const deleted = await deleteMessage(messageId);

          if (deleted) {
            renderMessageList();
          } else {
            deleteButton.removeAttribute('disabled');
            alert('Failed to delete message. Please try again.');
          }
        });
      }
      
      // Auto-refresh message list every 5 seconds for admin
      setInterval(renderMessageList, 5000);
    } else {
      console.log('Regular user detected. Showing contact form...');
      const form = document.querySelector('.form-wrap form');
      if (form) {
        form.addEventListener('submit', submitContactForm);
      } else {
        console.error('Form not found');
      }
    }
  });
})();
