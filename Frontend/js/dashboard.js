const SUBJECTS = [
  { id: 'Database-SQL', icon: '🗃️', tagline: 'Tables, queries & data management' },
  { id: 'Python', icon: '🐍', tagline: 'Programming fundamentals' },
  { id: 'Math', icon: '🔢', tagline: 'Numbers, algebra & calculus' },
  { id: 'Java', icon: '☕', tagline: 'Object-oriented programming' },
];

let selectedSubject = null;

document.addEventListener('DOMContentLoaded', () => {
  const user = requireAuth(['STUDENT']);
  if (!user) return;

  document.getElementById('user-greeting').textContent = `Hi, ${user.name}`;
  document.getElementById('logout-btn')?.addEventListener('click', logout);

  const grid = document.getElementById('subject-grid');
  const pathPicker = document.getElementById('path-picker');
  const pathSubjectLabel = document.getElementById('path-subject-label');

  SUBJECTS.forEach((sub) => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.dataset.subject = sub.id;
    card.innerHTML = `
      <span class="subject-card__icon">${sub.icon}</span>
      <h3>${sub.id}</h3>
      <p>${sub.tagline}</p>
    `;
    card.addEventListener('click', () => {
      document.querySelectorAll('.subject-card').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedSubject = sub.id;
      pathSubjectLabel.textContent = sub.id;
      pathPicker.classList.add('visible');
      pathPicker.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    grid.appendChild(card);
  });

  document.getElementById('btn-tutor')?.addEventListener('click', () => {
    if (!selectedSubject) return;
    window.location.href = `tutor-request.html?subject=${encodeURIComponent(selectedSubject)}`;
  });

  document.getElementById('btn-ai')?.addEventListener('click', () => {
    if (!selectedSubject) return;
    window.location.href = `ai-assistant.html?subject=${encodeURIComponent(selectedSubject)}`;
  });
});
