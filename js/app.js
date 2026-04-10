/* =============================================
   Personal Dashboard — app.js
   Module Pattern, no framework, no build step
   ============================================= */

'use strict';

/* --------------------------------------------------
   StorageModule — implemented in task 2
-------------------------------------------------- */
const StorageModule = {
  KEYS: {
    NAME: 'pd_name',
    DURATION: 'pd_duration',
    TASKS: 'pd_tasks',
    LINKS: 'pd_links',
    THEME: 'pd_theme',
  },
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`StorageModule.set: failed to save key "${key}"`, e);
    }
  },
};

/* --------------------------------------------------
   ThemeModule — implemented in task 3
   Requirements: 7.1, 7.2, 7.3, 7.4
-------------------------------------------------- */
const ThemeModule = {
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = theme === 'light' ? '🌙' : '☀️';
    }
  },
  init() {
    const saved = StorageModule.get(StorageModule.KEYS.THEME, null);
    if (saved === 'light' || saved === 'dark') {
      this.apply(saved);
      return;
    }
    // Fallback to OS preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.apply('dark');
    } else {
      this.apply('light');
    }
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    StorageModule.set(StorageModule.KEYS.THEME, next);
    this.apply(next);
  },
};

/* --------------------------------------------------
   GreetingModule — skeleton (implemented in task 4)
-------------------------------------------------- */
const GreetingModule = {
  getGreeting(hour) {
    if (hour >= 5 && hour <= 11) return 'Good morning';
    if (hour >= 12 && hour <= 17) return 'Good afternoon';
    if (hour >= 18 && hour <= 21) return 'Good evening';
    return 'Good night'; // 22–23 and 0–4
  },
  formatTime(date) {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  },
  formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${day} ${month} ${year}`;
  },
  _name: null,
  _intervalId: null,
  _render() {
    const now = new Date();
    const greeting = this.getGreeting(now.getHours());
    const greetingText = this._name ? `${greeting}, ${this._name}` : greeting;

    const greetingEl = document.getElementById('greeting-text');
    const timeEl     = document.getElementById('greeting-time');
    const dateEl     = document.getElementById('greeting-date');

    if (greetingEl) greetingEl.textContent = greetingText;
    if (timeEl)     timeEl.textContent     = this.formatTime(now);
    if (dateEl)     dateEl.textContent     = this.formatDate(now);
  },
  init(savedName) {
    const trimmed = savedName ? savedName.trim() : '';
    this._name = trimmed || null;

    this._render();

    this._intervalId = setInterval(() => this._render(), 60000);

    const input  = document.getElementById('name-input');
    const submit = document.getElementById('name-submit');

    if (input && this._name) {
      input.value = this._name;
    }

    if (submit) {
      submit.addEventListener('click', () => this.setName(input ? input.value : ''));
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.setName(input.value);
      });
    }
  },
  setName(name) {
    const trimmed = name ? name.trim() : '';
    if (trimmed === '') {
      this._name = null;
      StorageModule.set(StorageModule.KEYS.NAME, null);
    } else {
      this._name = trimmed;
      StorageModule.set(StorageModule.KEYS.NAME, trimmed);
    }
    this._render();
  },
};

/* --------------------------------------------------
   TimerModule — skeleton (implemented in task 5)
-------------------------------------------------- */
const TimerModule = {
  _duration: 25 * 60,   // default 1500 seconds
  _remaining: 25 * 60,  // default same as _duration
  _intervalId: null,
  _running: false,

  formatTime(seconds) {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  },

  setDuration(minutes) {
    // Validate: must be an integer in [1, 120]
    if (
      typeof minutes !== 'number' ||
      isNaN(minutes) ||
      !Number.isInteger(minutes) ||
      minutes < 1 ||
      minutes > 120
    ) {
      return; // reject — keep current _duration unchanged
    }
    this._duration = minutes * 60;
    this._remaining = this._duration;
    const display = document.getElementById('timer-display');
    if (display) display.textContent = this.formatTime(this._duration);
    StorageModule.set(StorageModule.KEYS.DURATION, minutes);
  },

  _updateDisplay() {
    const display = document.getElementById('timer-display');
    if (display) display.textContent = this.formatTime(this._remaining);
  },

  _updateControls() {
    const startBtn    = document.getElementById('timer-start');
    const stopBtn     = document.getElementById('timer-stop');
    const resetBtn    = document.getElementById('timer-reset');
    const durationInput = document.getElementById('timer-duration-input');
    const durationSet = document.getElementById('timer-duration-set');

    if (this._running) {
      if (startBtn)      startBtn.disabled      = true;
      if (stopBtn)       stopBtn.disabled       = false;
      if (resetBtn)      resetBtn.disabled      = false;
      if (durationInput) durationInput.disabled = true;
      if (durationSet)   durationSet.disabled   = true;
    } else {
      if (startBtn)      startBtn.disabled      = false;
      if (stopBtn)       stopBtn.disabled       = true;
      if (durationInput) durationInput.disabled = false;
      if (durationSet)   durationSet.disabled   = false;
    }
  },

  init(savedDuration) {
    const parsed = parseInt(savedDuration, 10);
    const validDuration = Number.isInteger(parsed) && parsed >= 1 && parsed <= 120
      ? parsed
      : 25;

    this._duration  = validDuration * 60;
    this._remaining = this._duration;

    this._updateDisplay();
    this._updateControls();

    // Wire duration input value
    const durationInput = document.getElementById('timer-duration-input');
    if (durationInput) durationInput.value = validDuration;

    // Wire buttons
    const startBtn = document.getElementById('timer-start');
    const stopBtn  = document.getElementById('timer-stop');
    const resetBtn = document.getElementById('timer-reset');
    if (startBtn) startBtn.addEventListener('click', () => this.start());
    if (stopBtn)  stopBtn.addEventListener('click',  () => this.stop());
    if (resetBtn) resetBtn.addEventListener('click', () => this.reset());

    // Wire duration set button
    const durationSet = document.getElementById('timer-duration-set');
    const applyDuration = () => {
      const val = parseInt(durationInput ? durationInput.value : '', 10);
      this.setDuration(val);
    };
    if (durationSet)   durationSet.addEventListener('click', applyDuration);
    if (durationInput) durationInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') applyDuration();
    });
  },

  start() {
    if (this._running) return;
    this._running = true;
    this._intervalId = setInterval(() => this.tick(), 1000);
    this._updateControls();
  },

  stop() {
    if (!this._running) return;
    clearInterval(this._intervalId);
    this._intervalId = null;
    this._running = false;
    this._updateControls();
  },

  reset() {
    clearInterval(this._intervalId);
    this._intervalId = null;
    this._running = false;
    this._remaining = this._duration;
    this._updateDisplay();
    this._updateControls();
  },

  tick() {
    this._remaining -= 1;
    this._updateDisplay();
    if (this._remaining <= 0) {
      this.stop();
      this.notify();
    }
  },

  notify() {
    const display = document.getElementById('timer-display');
    if (display) {
      display.classList.add('timer-done');
      setTimeout(() => display.classList.remove('timer-done'), 3000);
    }
  },
};

/* --------------------------------------------------
   TodoModule — skeleton (implemented in task 7)
-------------------------------------------------- */
const TodoModule = {
  _tasks: [],

  save() {
    StorageModule.set(StorageModule.KEYS.TASKS, this._tasks);
  },

  addTask(title) {
    const trimmed = title ? title.trim() : '';
    if (trimmed === '') return;
    this._tasks.push({ id: Date.now().toString(), title: trimmed, completed: false });
    this.save();
    this.render();
  },

  toggleTask(id) {
    const task = this._tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    this.save();
    this.render();
  },

  editTask(id, newTitle) {
    const trimmed = newTitle ? newTitle.trim() : '';
    if (trimmed === '') return;
    const task = this._tasks.find(t => t.id === id);
    if (!task) return;
    task.title = trimmed;
    this.save();
    this.render();
  },

  deleteTask(id) {
    this._tasks = this._tasks.filter(t => t.id !== id);
    this.save();
    this.render();
  },

  init(savedTasks) {
    const validatedTasks = Array.isArray(savedTasks) ? savedTasks : [];
    this._tasks = validatedTasks;
    this.render();

    const input     = document.getElementById('todo-input');
    const submitBtn = document.getElementById('todo-submit');
    const errorEl   = document.getElementById('todo-error');

    const attemptAdd = () => {
      const val = input ? input.value : '';
      if (!val || val.trim() === '') {
        if (errorEl) errorEl.textContent = 'Task title cannot be empty.';
        return;
      }
      if (errorEl) errorEl.textContent = '';
      this.addTask(val);
      if (input) input.value = '';
    };

    if (submitBtn) {
      submitBtn.addEventListener('click', attemptAdd);
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') attemptAdd();
      });
    }
  },

  render() {
    const list = document.getElementById('todo-list');
    if (!list) return;
    list.innerHTML = '';

    if (this._tasks.length === 0) {
      const placeholder = document.createElement('li');
      placeholder.className = 'todo-empty';
      placeholder.textContent = 'No tasks yet';
      list.appendChild(placeholder);
      return;
    }

    this._tasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = 'todo-item';

      // Toggle button
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'todo-toggle';
      toggleBtn.setAttribute('aria-label', task.completed ? 'Mark incomplete' : 'Mark complete');
      toggleBtn.textContent = task.completed ? '✓' : '○';
      toggleBtn.addEventListener('click', () => this.toggleTask(task.id));

      // Title span
      const titleSpan = document.createElement('span');
      titleSpan.className = 'todo-title' + (task.completed ? ' completed' : '');
      titleSpan.textContent = task.title;

      // Edit button
      const editBtn = document.createElement('button');
      editBtn.className = 'todo-edit';
      editBtn.setAttribute('aria-label', 'Edit task');
      editBtn.textContent = '✏️';
      editBtn.addEventListener('click', () => {
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'todo-edit-input';
        editInput.value = task.title;

        const confirmEdit = () => {
          const newVal = editInput.value;
          if (newVal && newVal.trim() !== '') {
            this.editTask(task.id, newVal);
          } else {
            this.render(); // cancel — restore original
          }
        };

        editInput.addEventListener('blur', confirmEdit);
        editInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            editInput.removeEventListener('blur', confirmEdit);
            confirmEdit();
          } else if (e.key === 'Escape') {
            editInput.removeEventListener('blur', confirmEdit);
            this.render();
          }
        });

        li.replaceChild(editInput, titleSpan);
        editInput.focus();
      });

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'todo-delete';
      deleteBtn.setAttribute('aria-label', 'Delete task');
      deleteBtn.textContent = '🗑️';
      deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

      li.appendChild(toggleBtn);
      li.appendChild(titleSpan);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  },
};

/* --------------------------------------------------
   LinksModule — skeleton (implemented in task 8)
-------------------------------------------------- */
const LinksModule = {
  _links: [],

  save() {
    StorageModule.set(StorageModule.KEYS.LINKS, this._links);
  },

  isValidUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (e) {
      return false;
    }
  },

  addLink(label, url) {
    const trimmedLabel = label ? label.trim() : '';
    const trimmedUrl   = url   ? url.trim()   : '';
    if (trimmedLabel === '' || !this.isValidUrl(trimmedUrl)) return;
    this._links.push({ id: Date.now().toString(), label: trimmedLabel, url: trimmedUrl });
    this.save();
    this.render();
  },

  deleteLink(id) {
    this._links = this._links.filter(l => l.id !== id);
    this.save();
    this.render();
  },

  init(savedLinks) {
    const validatedLinks = Array.isArray(savedLinks) ? savedLinks : [];
    this._links = validatedLinks;
    this.render();

    const labelInput = document.getElementById('link-label-input');
    const urlInput   = document.getElementById('link-url-input');
    const submitBtn  = document.getElementById('link-submit');
    const errorEl    = document.getElementById('link-error');

    const attemptAdd = () => {
      const label = labelInput ? labelInput.value : '';
      const url   = urlInput   ? urlInput.value   : '';

      if (!label || label.trim() === '') {
        if (errorEl) errorEl.textContent = 'Label is required';
        return;
      }
      if (!this.isValidUrl(url ? url.trim() : '')) {
        if (errorEl) errorEl.textContent = 'Please enter a valid URL (https://...)';
        return;
      }

      if (errorEl) errorEl.textContent = '';
      this.addLink(label, url);
      if (labelInput) labelInput.value = '';
      if (urlInput)   urlInput.value   = '';
    };

    if (submitBtn) {
      submitBtn.addEventListener('click', attemptAdd);
    }

    if (labelInput) {
      labelInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') attemptAdd();
      });
    }

    if (urlInput) {
      urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') attemptAdd();
      });
    }
  },

  render() {
    const list = document.getElementById('links-list');
    if (!list) return;
    list.innerHTML = '';

    if (this._links.length === 0) {
      const placeholder = document.createElement('li');
      placeholder.className = 'links-empty';
      placeholder.textContent = 'No links yet';
      list.appendChild(placeholder);
      return;
    }

    this._links.forEach((link) => {
      const li = document.createElement('li');
      li.className = 'link-item';

      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = link.label;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'link-delete';
      deleteBtn.setAttribute('aria-label', 'Delete link');
      deleteBtn.textContent = '🗑️';
      deleteBtn.addEventListener('click', () => this.deleteLink(link.id));

      li.appendChild(a);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  },
};

/* --------------------------------------------------
   Entry Point — DOMContentLoaded (wired in task 9)
-------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Load all persisted data once
  const savedName     = StorageModule.get(StorageModule.KEYS.NAME, null);
  const savedDuration = StorageModule.get(StorageModule.KEYS.DURATION, 25);
  const savedTasks    = StorageModule.get(StorageModule.KEYS.TASKS, []);
  const savedLinks    = StorageModule.get(StorageModule.KEYS.LINKS, []);

  // Initialise modules
  ThemeModule.init();
  GreetingModule.init(savedName);
  TimerModule.init(savedDuration);
  TodoModule.init(savedTasks);
  LinksModule.init(savedLinks);

  // Theme toggle
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => ThemeModule.toggle());
  }
});
