let subject = '';
let pollTimer = null;
let currentRequestId = null;

const REQUEST_STATE_KEY = 'edubridge_request_state';

function getSubjectFromUrl() {
  return new URLSearchParams(window.location.search).get('subject') || 'Math';
}

function saveRequestState(state) {
  localStorage.setItem(REQUEST_STATE_KEY, JSON.stringify(state));
}

function loadRequestState() {
  const raw = localStorage.getItem(REQUEST_STATE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function statusBadgeClass(status) {
  const map = { PENDING: 'pending', MATCHED: 'matched', COMPLETED: 'completed' };
  return `status-badge status-badge--${map[status] || 'pending'}`;
}

function showStatusCard(data) {
  const card = document.getElementById('status-card');
  card.classList.add('visible');
  document.getElementById('form-section').style.display = 'none';

  document.getElementById('status-value').innerHTML =
    `<span class="${statusBadgeClass(data.status)}">${data.status}</span>`;
  document.getElementById('status-subject').textContent = data.subject || subject;
  document.getElementById('status-desc').textContent = data.description || '—';
  document.getElementById('status-tutor').textContent = data.tutorName || 'Waiting for a tutor…';
  document.getElementById('status-time').textContent =
    data.scheduledTime ? formatDateTime(data.scheduledTime) : 'Not scheduled yet';
}

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

function showOfflineSaved() {
  const card = document.getElementById('status-card');
  card.classList.add('visible');
  document.getElementById('form-section').style.display = 'none';
  document.getElementById('status-value').innerHTML =
    '<span class="status-badge status-badge--pending">QUEUED</span>';
  document.getElementById('status-subject').textContent = subject;
  document.getElementById('status-desc').textContent =
    document.getElementById('description').value;
  document.getElementById('status-tutor').textContent = '—';
  document.getElementById('status-time').textContent =
    'Saved — will send when back online';
}

async function submitRequest(description) {
  const data = await apiFetch('/api/requests', {
    method: 'POST',
    body: JSON.stringify({ subject, description }),
  });
  currentRequestId = data.id;
  saveRequestState({
    requestId: data.id,
    subject,
    description,
    status: data.status,
  });
  showStatusCard({
    status: data.status,
    subject: data.subject,
    description: data.description,
    tutorName: null,
    scheduledTime: null,
  });
  startPolling();
}

function pollStatus() {
  if (!currentRequestId || String(currentRequestId).startsWith('offline_')) return;

  const sessionHint = localStorage.getItem(`edubridge_session_${currentRequestId}`);
  if (sessionHint) {
    const parsed = JSON.parse(sessionHint);
    const state = loadRequestState();
    showStatusCard({
      status: parsed.requestStatus || state?.status || 'PENDING',
      subject: state?.subject || subject,
      description: state?.description || '',
      tutorName: parsed.tutorName,
      scheduledTime: parsed.scheduledTime,
    });
    if (parsed.requestStatus === 'COMPLETED') stopPolling();
  }
}

function startPolling() {
  stopPolling();
  pollStatus();
  pollTimer = setInterval(pollStatus, 3000);
}

function stopPolling() {
  if (pollTimer) clearInterval(pollTimer);
}

async function tryRestoreState() {
  const state = loadRequestState();
  if (!state || state.subject !== subject) return;

  currentRequestId = state.requestId;
  const sessionHint = localStorage.getItem(`edubridge_session_${currentRequestId}`);
  if (sessionHint) {
    const parsed = JSON.parse(sessionHint);
    showStatusCard({
      status: parsed.requestStatus || state.status,
      subject: state.subject,
      description: state.description,
      tutorName: parsed.tutorName,
      scheduledTime: parsed.scheduledTime,
    });
  } else {
    showStatusCard({
      status: state.status || 'PENDING',
      subject: state.subject,
      description: state.description,
      tutorName: null,
      scheduledTime: null,
    });
  }
  if (state.status !== 'COMPLETED') startPolling();
}

document.addEventListener('DOMContentLoaded', () => {
  requireAuth(['STUDENT']);
  subject = getSubjectFromUrl();
  document.getElementById('page-subject').textContent = subject;
  document.getElementById('subject-display').textContent = subject;
  document.getElementById('back-btn').href = 'dashboard.html';
  document.getElementById('logout-btn')?.addEventListener('click', logout);

  tryRestoreState();

  document.getElementById('request-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const descInput = form.description;
    const alertEl = document.getElementById('request-alert');

    hideAlert(alertEl);
    const valid = validateRequired([
      { input: descInput, errorEl: form.querySelector('[data-error="description"]') },
    ]);
    if (!valid) return;

    const description = descInput.value.trim();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    try {
      if (!isOnline()) {
        queueOfflineRequest({ type: 'create_request', payload: { subject, description } });
        saveRequestState({
          requestId: `offline_${Date.now()}`,
          subject,
          description,
          status: 'PENDING',
          offline: true,
        });
        showOfflineSaved();
        return;
      }
      await submitRequest(description);
      showAlert(alertEl, 'Request sent! A tutor will be matched soon.', 'success');
    } catch (err) {
      showAlert(alertEl, err.message);
    } finally {
      btn.disabled = false;
    }
  });

  onOnline(async () => {
    const state = loadRequestState();
    if (state?.offline && state.description) {
      try {
        await submitRequest(state.description);
        showAlert(document.getElementById('request-alert'), 'Request sent successfully!', 'success');
      } catch (err) {
        showAlert(document.getElementById('request-alert'), err.message);
      }
    }
  });

  window.addEventListener('edubridge:queue-synced', (e) => {
    const synced = e.detail?.find((s) => s.type === 'create_request');
    if (!synced) return;
    currentRequestId = synced.result.id;
    saveRequestState({
      requestId: synced.result.id,
      subject: synced.payload.subject,
      description: synced.payload.description,
      status: synced.result.status,
      offline: false,
    });
    showStatusCard({
      status: synced.result.status,
      subject: synced.result.subject,
      description: synced.result.description,
      tutorName: null,
      scheduledTime: null,
    });
    startPolling();
    showAlert(document.getElementById('request-alert'), 'Request sent successfully!', 'success');
  });

  /* Cross-tab updates when tutor accepts in another tab (demo-friendly) */
  window.addEventListener('storage', (e) => {
    if (e.key?.startsWith('edubridge_session_')) pollStatus();
  });
});
