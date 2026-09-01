let slides = [];
let activeSlideIndex = 0;
let subject = '';
let apiSubject = '';

function cacheKey(type) {
  return `edubridge_cache_${type}_${apiSubject.toLowerCase()}`;
}

function getSubjectFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('subject') || 'Math';
}

function renderSlideList() {
  const list = document.getElementById('slide-list');
  list.innerHTML = '';

  if (!slides.length) {
    list.innerHTML = '<li class="slide-item" style="opacity:0.6">No slides available</li>';
    return;
  }

  slides.forEach((slide, i) => {
    const li = document.createElement('li');
    li.className = `slide-item${i === activeSlideIndex ? ' active' : ''}`;
    li.innerHTML = `<span class="slide-item__num">${slide.slideNumber}</span>${slide.title}`;
    li.addEventListener('click', () => showSlide(i));
    list.appendChild(li);
  });
}

function showSlide(index) {
  activeSlideIndex = index;
  const slide = slides[index];
  if (!slide) return;

  document.getElementById('slide-title').textContent = slide.title;
  document.getElementById('slide-num').textContent = slide.slideNumber;
  document.getElementById('slide-body').textContent = slide.contentText;
  renderSlideList();
}

async function loadSlides() {
  const cacheKeySlides = cacheKey('slides');
  const loadingEl = document.getElementById('slide-loading');

  if (!isOnline()) {
    slides = getCachedData(cacheKeySlides) || [];
    if (slides.length) {
      showSlide(0);
      addSystemMessage('Showing cached slides (offline mode)');
    } else {
      document.getElementById('slide-body').textContent =
        'No cached slides for this subject. Connect to the internet to load content.';
    }
    return;
  }

  try {
    loadingEl && (loadingEl.style.display = 'block');
    slides = await apiFetch(`/api/ai/slides/${encodeURIComponent(apiSubject)}`);
    cacheData(cacheKeySlides, slides);
    if (slides.length) showSlide(0);
    else document.getElementById('slide-body').textContent = 'No slides found for this subject yet.';
  } catch (err) {
    slides = getCachedData(cacheKeySlides) || [];
    if (slides.length) {
      showSlide(0);
      addSystemMessage('Could not refresh — showing cached slides.');
    } else {
      document.getElementById('slide-body').textContent = `Error: ${err.message}`;
    }
  } finally {
    loadingEl && (loadingEl.style.display = 'none');
  }
}

async function loadFaq() {
  if (!isOnline()) return;
  try {
    const faq = await apiFetch(`/api/ai/faq/${encodeURIComponent(apiSubject)}`);
    cacheData(cacheKey('faq'), faq);
  } catch {
    /* FAQ cache is optional; ask endpoint still works online */
  }
}

function addChatBubble(text, type, extraClass = '') {
  const container = document.getElementById('chat-messages');
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble chat-bubble--${type} ${extraClass}`.trim();
  const label = type === 'user' ? 'You' : 'AI Assistant';
  bubble.innerHTML = `<div class="chat-bubble__label">${label}</div>${escapeHtml(text)}`;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function addSystemMessage(text) {
  addChatBubble(text, 'ai', 'offline-hint');
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function findOfflineAnswer(question) {
  const faq = getCachedData(cacheKey('faq')) || [];
  const words = question.toLowerCase().split(/\W+/).filter((w) => w.length >= 3);
  if (!words.length) return null;

  let best = null;
  let bestScore = 0;

  faq.forEach((entry) => {
    const keywords = (entry.keywords || '').toLowerCase().split(/[,\s]+/);
    let score = 0;
    words.forEach((w) => {
      if (keywords.some((k) => k.includes(w) || w.includes(k))) score++;
    });
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  });

  return bestScore > 0 ? best.answer : null;
}

async function handleAsk(question) {
  if (!question.trim()) return;

  addChatBubble(question, 'user');
  document.getElementById('chat-input').value = '';

  if (!isOnline()) {
    const cached = findOfflineAnswer(question);
    if (cached) {
      addChatBubble(cached, 'ai', 'offline-hint');
    } else {
      addChatBubble(
        'No saved answer found offline. Connect to the internet or ask a tutor.',
        'ai',
        'offline-hint'
      );
    }
    return;
  }

  try {
    const res = await apiFetch('/api/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ subject: apiSubject, question }),
    });
    addChatBubble(res.answer, 'ai', res.matched ? '' : 'offline-hint');
  } catch (err) {
    const cached = findOfflineAnswer(question);
    if (cached) {
      addChatBubble(cached, 'ai', 'offline-hint');
    } else {
      addChatBubble(`Error: ${err.message}`, 'ai', 'offline-hint');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  requireAuth(['STUDENT']);
  subject = getSubjectFromUrl();
  apiSubject = subject;
  document.getElementById('page-subject').textContent = subject;
  document.getElementById('back-btn').href = 'dashboard.html';
  document.getElementById('logout-btn')?.addEventListener('click', logout);

  loadSlides();
  loadFaq();

  document.getElementById('chat-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    handleAsk(input.value);
  });

  onOnline(() => {
    loadSlides();
    loadFaq();
  });
});
