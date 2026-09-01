const activeSessions = {};

function broadcastSessionUpdate(requestId, data) {
  localStorage.setItem(`edubridge_session_${requestId}`, JSON.stringify(data));
}

function statusBadge(status) {
  const cls = { PENDING: 'pending', MATCHED: 'matched', COMPLETED: 'completed' };
  return `<span class="status-badge status-badge--${cls[status] || 'pending'}">${status}</span>`;
}

function formatDateTime(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function toApiDateTime(localDatetime) {
  if (!localDatetime) return null;
  return localDatetime.length === 16 ? `${localDatetime}:00` : localDatetime;
}

async function loadPending() {
  const container = document.getElementById('request-list');
  const empty = document.getElementById('empty-state');

  if (!isOnline()) {
    container.innerHTML = '';
    empty.style.display = 'block';
    empty.querySelector('p').textContent = 'Connect to the internet to view pending requests.';
    return;
  }

  try {
    const requests = await apiFetch('/api/requests/pending');
    container.innerHTML = '';
    empty.style.display = requests.length ? 'none' : 'block';

    requests.forEach((req) => {
      const el = document.createElement('div');
      el.className = 'request-item';
      el.dataset.requestId = req.id;
      el.innerHTML = `
        <div class="request-item__header">
          <div>
            <div class="request-item__subject">${escapeHtml(req.subject)}</div>
            <div class="request-item__meta">From ${escapeHtml(req.studentName)} · ${formatDateTime(req.createdAt)}</div>
          </div>
          ${statusBadge(req.status)}
        </div>
        <p class="request-item__desc">${escapeHtml(req.description)}</p>
        <div class="request-item__actions">
          <button class="btn btn-primary btn-sm btn-accept" data-id="${req.id}">Accept</button>
        </div>
        <div class="session-panel" id="session-panel-${req.id}"></div>
      `;
      container.appendChild(el);

      el.querySelector('.btn-accept').addEventListener('click', () => acceptRequest(req.id, el));
    });
  } catch (err) {
    showAlert(document.getElementById('panel-alert'), err.message);
  }
}

async function loadMySessions() {
  const container = document.getElementById('my-sessions-list');
  const empty = document.getElementById('my-sessions-empty');
  const countEl = document.getElementById('sessions-count');
  if (!container) return;

  if (!isOnline()) {
    empty.style.display = 'block';
    empty.querySelector('h3').textContent = 'Offline';
    empty.querySelector('p').textContent = 'Connect to the internet to view your sessions.';
    countEl.textContent = '';
    return;
  }

  try {
    const sessions = await apiFetch('/api/sessions/my-sessions');
    container.innerHTML = '';
    empty.style.display = sessions.length ? 'none' : 'block';
    countEl.textContent = sessions.length ? `${sessions.length} session${sessions.length === 1 ? '' : 's'}` : '';

    sessions.forEach((session) => {
      container.appendChild(renderSessionCard(session));
    });
  } catch (err) {
    empty.style.display = 'block';
    empty.querySelector('h3').textContent = 'Could not load sessions';
    empty.querySelector('p').textContent = err.message;
    countEl.textContent = '';
  }
}

function renderSessionCard(session) {
  const el = document.createElement('div');
  el.className = 'request-item';
  el.dataset.sessionId = session.id;

  const isComplete = session.status === 'COMPLETED';
  const statusArea = isComplete
    ? '<span class="session-completed">✓ Completed</span>'
    : statusBadge(session.status);

  el.innerHTML = `
    <div class="request-item__header">
      <div>
        <div class="request-item__subject">${escapeHtml(session.subject)}</div>
        <div class="request-item__meta">Student: ${escapeHtml(session.studentName || '—')}</div>
      </div>
      ${statusArea}
    </div>
    <p class="request-item__desc">${escapeHtml(session.description)}</p>
    <div class="session-panel visible" id="my-session-panel-${session.id}">
      <div class="my-session-body"></div>
    </div>
  `;

  const body = el.querySelector('.my-session-body');
  renderSessionBody(body, session);
  return el;
}

function renderSessionBody(body, session) {
  const isComplete = session.status === 'COMPLETED';

  if (isComplete) {
    body.innerHTML = `
      <p class="session-time">Completed session — ${session.scheduledTime ? `was scheduled for ${formatDateTime(session.scheduledTime)}` : ''}</p>
    `;
    return;
  }

  if (session.scheduledTime) {
    body.innerHTML = `
      <div class="request-item__actions">
        <span class="session-time">Scheduled for ${formatDateTime(session.scheduledTime)}</span>
        <button class="btn btn-outline btn-sm btn-complete" data-session="${session.id}">Mark Complete</button>
      </div>
    `;
    body.querySelector('.btn-complete').addEventListener('click', () => completeFromPanel(session.id));
  } else {
    body.innerHTML = `
      <div class="request-item__actions">
        <input type="datetime-local" id="my-schedule-${session.id}" />
        <button class="btn btn-secondary btn-sm btn-schedule" data-session="${session.id}">Schedule</button>
      </div>
    `;
    body.querySelector('.btn-schedule').addEventListener('click', () => scheduleFromPanel(session.id));
  }
}

async function scheduleFromPanel(sessionId) {
  const body = document.querySelector(`#my-session-panel-${sessionId} .my-session-body`);
  const input = document.querySelector(`#my-schedule-${sessionId}`);
  if (!input || !input.value) {
    showAlert(document.getElementById('panel-alert'), 'Please pick a date and time.');
    return;
  }
  try {
    const scheduledTime = toApiDateTime(input.value);
    const session = await apiFetch(`/api/sessions/${sessionId}/schedule`, {
      method: 'PUT',
      body: JSON.stringify({ scheduledTime }),
    });
    broadcastSessionUpdate(session.requestId, {
      tutorName: session.tutorName,
      scheduledTime: session.scheduledTime,
      requestStatus: 'MATCHED',
      sessionStatus: session.status,
      sessionId: session.id,
    });
    renderSessionBody(body, session);
    hideAlert(document.getElementById('panel-alert'));
  } catch (err) {
    showAlert(document.getElementById('panel-alert'), err.message);
  }
}

async function completeFromPanel(sessionId) {
  try {
    const session = await apiFetch(`/api/sessions/${sessionId}/complete`, { method: 'PUT' });
    broadcastSessionUpdate(session.requestId, {
      tutorName: session.tutorName,
      scheduledTime: session.scheduledTime,
      requestStatus: 'COMPLETED',
      sessionStatus: session.status,
      sessionId: session.id,
    });
    const body = document.querySelector(`#my-session-panel-${sessionId} .my-session-body`);
    if (body) renderSessionBody(body, session);
    hideAlert(document.getElementById('panel-alert'));
  } catch (err) {
    showAlert(document.getElementById('panel-alert'), err.message);
  }
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

async function acceptRequest(requestId, cardEl) {
  const btn = cardEl.querySelector('.btn-accept');
  btn.disabled = true;
  try {
    const res = await apiFetch(`/api/requests/${requestId}/accept`, { method: 'PUT' });
    const { request, session } = res;
    activeSessions[requestId] = session;

    broadcastSessionUpdate(requestId, {
      tutorName: session.tutorName,
      scheduledTime: session.scheduledTime,
      requestStatus: request.status,
      sessionStatus: session.status,
      sessionId: session.id,
    });

    cardEl.querySelector('.request-item__actions').innerHTML =
      statusBadge('MATCHED') + ' <span style="color:var(--muted);font-size:0.85rem">Session created</span>';

    const panel = cardEl.querySelector('.session-panel');
    panel.classList.add('visible');
    panel.innerHTML = `
      <p style="margin-bottom:0.75rem;font-size:0.9rem;color:var(--muted)">Session #${session.id} — schedule and complete below:</p>
      <input type="datetime-local" id="schedule-${session.id}" />
      <button class="btn btn-secondary btn-sm btn-schedule" data-session="${session.id}" data-request="${requestId}">Set Schedule</button>
      <button class="btn btn-outline btn-sm btn-complete" data-session="${session.id}" data-request="${requestId}">Mark Complete</button>
      <p id="schedule-msg-${session.id}" style="margin-top:0.5rem;font-size:0.85rem;color:var(--teal-mid)"></p>
    `;

    panel.querySelector('.btn-schedule').addEventListener('click', () =>
      scheduleSession(session.id, requestId, panel)
    );
    panel.querySelector('.btn-complete').addEventListener('click', () =>
      completeSession(session.id, requestId, cardEl)
    );

    loadMySessions();
  } catch (err) {
    showAlert(document.getElementById('panel-alert'), err.message);
    btn.disabled = false;
  }
}

async function scheduleSession(sessionId, requestId, panel) {
  const input = panel.querySelector(`#schedule-${sessionId}`);
  if (!input.value) {
    showAlert(document.getElementById('panel-alert'), 'Please pick a date and time.');
    return;
  }

  try {
    const scheduledTime = toApiDateTime(input.value);
    const session = await apiFetch(`/api/sessions/${sessionId}/schedule`, {
      method: 'PUT',
      body: JSON.stringify({ scheduledTime }),
    });

    broadcastSessionUpdate(requestId, {
      tutorName: session.tutorName,
      scheduledTime: session.scheduledTime,
      requestStatus: 'MATCHED',
      sessionStatus: session.status,
      sessionId: session.id,
    });

    panel.querySelector(`#schedule-msg-${sessionId}`).textContent =
      `Scheduled for ${formatDateTime(session.scheduledTime)}`;
    hideAlert(document.getElementById('panel-alert'));
    loadMySessions();
  } catch (err) {
    showAlert(document.getElementById('panel-alert'), err.message);
  }
}

async function completeSession(sessionId, requestId, cardEl) {
  try {
    const session = await apiFetch(`/api/sessions/${sessionId}/complete`, { method: 'PUT' });

    broadcastSessionUpdate(requestId, {
      tutorName: session.tutorName,
      scheduledTime: session.scheduledTime,
      requestStatus: 'COMPLETED',
      sessionStatus: session.status,
      sessionId: session.id,
    });

    cardEl.style.opacity = '0.55';
    cardEl.querySelector('.session-panel').innerHTML =
      `<p style="color:var(--online);font-weight:600">✓ Session completed</p>`;
    hideAlert(document.getElementById('panel-alert'));
    loadMySessions();
  } catch (err) {
    showAlert(document.getElementById('panel-alert'), err.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  requireAuth(['TUTOR']);
  const user = getUser();
  document.getElementById('user-greeting').textContent = `Tutor Panel — ${user?.name || ''}`;
  document.getElementById('logout-btn')?.addEventListener('click', logout);

  loadPending();
  loadMySessions();
  setInterval(() => { loadPending(); loadMySessions(); }, 30000);

  onOnline(() => { loadPending(); loadMySessions(); });
});
