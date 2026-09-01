const API_BASE = 'http://localhost:8080';

const STORAGE_KEYS = {
  token: 'edubridge_token',
  user: 'edubridge_user',
};

function getToken() {
  return localStorage.getItem(STORAGE_KEYS.token);
}

function getUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  return raw ? JSON.parse(raw) : null;
}

function setAuth(token, user) {
  localStorage.setItem(STORAGE_KEYS.token, token);
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
}

function authHeaders() {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

async function apiFetch(path, options = {}) {
  const isAuthRoute = path.startsWith('/api/auth/');
  const headers = isAuthRoute
    ? { 'Content-Type': 'application/json', ...(options.headers || {}) }
    : { ...authHeaders(), ...(options.headers || {}) };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

async function detectRole(token) {
  const res = await fetch(`${API_BASE}/api/requests/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok ? 'TUTOR' : 'STUDENT';
}

function requireAuth(allowedRoles) {
  const token = getToken();
  const user = getUser();
  if (!token || !user) {
    window.location.href = 'index.html';
    return null;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    window.location.href = user.role === 'TUTOR' ? 'tutor-panel.html' : 'dashboard.html';
    return null;
  }
  return user;
}

function logout() {
  clearAuth();
  window.location.href = 'index.html';
}

function redirectByRole(role) {
  window.location.href = role === 'TUTOR' ? 'tutor-panel.html' : 'dashboard.html';
}

function showAlert(el, message, type = 'error') {
  if (!el) return;
  el.textContent = message;
  el.className = `alert alert-${type} visible`;
}

function hideAlert(el) {
  if (!el) return;
  el.className = 'alert';
  el.textContent = '';
}

function validateRequired(fields) {
  let valid = true;
  fields.forEach(({ input, errorEl, message }) => {
    const empty = !input.value.trim();
    input.classList.toggle('error', empty);
    if (errorEl) {
      errorEl.textContent = message || 'This field is required';
      errorEl.classList.toggle('visible', empty);
    }
    if (empty) valid = false;
  });
  return valid;
}

async function handleSignup(form, alertEl) {
  hideAlert(alertEl);
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const role = form.querySelector('input[name="role"]:checked')?.value;

  const valid = validateRequired([
    { input: form.name, errorEl: form.querySelector('[data-error="name"]') },
    { input: form.email, errorEl: form.querySelector('[data-error="email"]') },
    { input: form.password, errorEl: form.querySelector('[data-error="password"]') },
  ]);
  if (!valid || !role) {
    showAlert(alertEl, 'Please fill in all fields and select a role.');
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    const data = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    setAuth(data.token, { name, email, role });
    redirectByRole(role);
  } catch (err) {
    showAlert(alertEl, err.message);
  } finally {
    btn.disabled = false;
  }
}

async function handleLogin(form, alertEl) {
  hideAlert(alertEl);
  const email = form.email.value.trim();
  const password = form.password.value;

  const valid = validateRequired([
    { input: form.email, errorEl: form.querySelector('[data-error="email"]') },
    { input: form.password, errorEl: form.querySelector('[data-error="password"]') },
  ]);
  if (!valid) return;

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const role = await detectRole(data.token);
    const stored = getUser();
    const name = stored?.email === email ? stored.name : email.split('@')[0];
    setAuth(data.token, { name, email, role });
    redirectByRole(role);
  } catch (err) {
    showAlert(alertEl, err.message);
  } finally {
    btn.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('auth-page')) return;

  const token = getToken();
  const user = getUser();
  if (token && user) redirectByRole(user.role);

  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      forms.forEach((f) => f.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.form).classList.add('active');
    });
  });

  const signupForm = document.getElementById('signup-form-el');
  const loginForm = document.getElementById('login-form-el');
  const alertEl = document.getElementById('auth-alert');

  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSignup(signupForm, alertEl);
  });

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin(loginForm, alertEl);
  });
});
