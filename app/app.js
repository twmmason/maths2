// ── State ──
let progress = { xp: 0, streak: 0, lastDate: null, completed: {}, scores: {} };
let currentStrand = null;
let currentTopic = null;

// ── DOM refs ──
const $ = id => document.getElementById(id);
const views = document.querySelectorAll('.view');

// ── Progress API ──
async function loadProgress() {
  try {
    const res = await fetch('/api/progress');
    if (res.ok) progress = await res.json();
  } catch (e) { console.warn('Could not load progress', e); }
  updateStreak();
  renderHeader();
}

async function saveProgress() {
  try {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progress)
    });
  } catch (e) { console.warn('Could not save progress', e); }
}

function updateStreak() {
  const today = new Date().toISOString().split('T')[0];
  if (!progress.lastDate) return;
  const last = new Date(progress.lastDate);
  const diff = Math.floor((new Date(today) - last) / 86400000);
  if (diff > 1) progress.streak = 0;
}

function recordActivity() {
  const today = new Date().toISOString().split('T')[0];
  if (progress.lastDate !== today) {
    const last = progress.lastDate ? new Date(progress.lastDate) : null;
    const diff = last ? Math.floor((new Date(today) - last) / 86400000) : 999;
    progress.streak = diff === 1 ? progress.streak + 1 : 1;
    progress.lastDate = today;
  }
}

// ── Rendering ──
function renderHeader() {
  $('xp-count').textContent = progress.xp;
  $('streak-count').textContent = progress.streak;
}

function showView(id) {
  views.forEach(v => v.classList.remove('active'));
  $(id).classList.add('active');
  $('back-btn').classList.toggle('hidden', id === 'view-home');
  window.scrollTo(0, 0);
}

function getCompletedCount(strand) {
  return strand.topics.filter(t => progress.completed[t.id]).length;
}

function getTotalTopics() {
  return STRANDS.reduce((sum, s) => sum + s.topics.length, 0);
}

function getTotalCompleted() {
  return STRANDS.reduce((sum, s) => sum + getCompletedCount(s), 0);
}

function renderHome() {
  const total = getTotalTopics();
  const done = getTotalCompleted();
  const pct = total ? Math.round((done / total) * 100) : 0;
  $('global-progress').style.width = pct + '%';
  $('global-pct').textContent = pct;
  $('header-title').textContent = 'Maths Pathway';

  const list = $('strand-list');
  list.innerHTML = STRANDS.map(s => {
    const count = s.topics.length;
    const completed = getCompletedCount(s);
    const pct = count ? Math.round((completed / count) * 100) : 0;
    const circ = 2 * Math.PI * 18;
    const offset = circ - (circ * pct / 100);
    return `
      <div class="strand-card" onclick="openStrand('${s.id}')">
        <div class="strand-icon" style="background:${s.color}15;color:${s.color}">${s.icon}</div>
        <div class="strand-info">
          <div class="strand-name">${s.name}</div>
          <div class="strand-meta">${count} topics · ${completed} done</div>
        </div>
        <div class="strand-progress">
          <svg viewBox="0 0 40 40">
            <circle class="track" cx="20" cy="20" r="18" fill="none" stroke-width="3"/>
            <circle class="fill" cx="20" cy="20" r="18" fill="none" stroke-width="3"
              stroke-dasharray="${circ}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
          </svg>
          <div class="strand-progress-text">${pct}%</div>
        </div>
      </div>`;
  }).join('');
  showView('view-home');
}

function openStrand(id) {
  currentStrand = STRANDS.find(s => s.id === id);
  if (!currentStrand) return;
  $('header-title').textContent = currentStrand.name;
  $('strand-title').textContent = currentStrand.name;
  $('strand-desc').textContent = currentStrand.desc;

  $('topic-list').innerHTML = currentStrand.topics.map(t => {
    const done = progress.completed[t.id];
    const score = progress.scores[t.id];
    const meta = score ? `${score.score}/${score.total}` : '';
    return `
      <div class="topic-card" onclick="openTopic('${t.id}')">
        <div class="topic-status ${done ? 'done' : ''}">${done ? '✓' : ''}</div>
        <div class="topic-info">
          <div class="topic-name">${t.name}</div>
          <div class="topic-code">${t.code}${meta ? ' · ' + meta : ''}</div>
        </div>
        <div class="topic-arrow">›</div>
      </div>`;
  }).join('');
  showView('view-strand');
}

function openTopic(id) {
  for (const s of STRANDS) {
    const t = s.topics.find(t => t.id === id);
    if (t) { currentTopic = t; currentStrand = s; break; }
  }
  if (!currentTopic) return;
  $('header-title').textContent = currentTopic.name;

  // Learn tab
  $('lesson-content').innerHTML = currentTopic.learn;

  // Examples tab
  $('lesson-examples').innerHTML = currentTopic.examples.map((ex, i) => `
    <div class="example-card">
      <div class="label">Example ${i + 1}</div>
      <div class="problem">${ex.problem}</div>
      <div class="solution">${ex.solution}</div>
    </div>`).join('');

  // Practice tab
  renderQuiz();

  // Reset tabs
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelector('.tab[data-tab="learn"]').classList.add('active');
  $('tab-learn').classList.add('active');

  showView('view-lesson');
}

// ── Quiz Engine ──
let quizAnswers = {};

function renderQuiz() {
  quizAnswers = {};
  $('quiz-result').classList.add('hidden');
  const quiz = currentTopic.quiz;
  $('quiz-container').innerHTML = quiz.map((q, i) => {
    if (q.type === 'mc') {
      return `
        <div class="quiz-question" data-idx="${i}">
          <div class="q-number">Question ${i + 1}</div>
          <div class="q-text">${q.q}</div>
          <div class="quiz-options">
            ${q.options.map((opt, j) => `
              <div class="quiz-option" data-q="${i}" data-opt="${j}" onclick="selectOption(${i},${j})">
                <div class="radio"></div>
                <span>${opt}</span>
              </div>`).join('')}
          </div>
          <div class="quiz-feedback" id="fb-${i}" style="display:none"></div>
        </div>`;
    } else {
      return `
        <div class="quiz-question" data-idx="${i}">
          <div class="q-number">Question ${i + 1}</div>
          <div class="q-text">${q.q}</div>
          <div class="quiz-input-wrap">
            <input class="quiz-input" id="input-${i}" type="text" placeholder="Your answer" autocomplete="off">
          </div>
          <div class="quiz-feedback" id="fb-${i}" style="display:none"></div>
        </div>`;
    }
  }).join('') + '<button class="btn submit-btn" onclick="submitQuiz()">Check Answers</button>';
}

function selectOption(qIdx, optIdx) {
  // Deselect others
  document.querySelectorAll(`.quiz-option[data-q="${qIdx}"]`).forEach(o => o.classList.remove('selected'));
  // Select this
  const el = document.querySelector(`.quiz-option[data-q="${qIdx}"][data-opt="${optIdx}"]`);
  el.classList.add('selected');
  quizAnswers[qIdx] = optIdx;
}

function submitQuiz() {
  const quiz = currentTopic.quiz;
  let correct = 0;

  quiz.forEach((q, i) => {
    const fb = $(`fb-${i}`);
    fb.style.display = 'block';

    if (q.type === 'mc') {
      const selected = quizAnswers[i];
      document.querySelectorAll(`.quiz-option[data-q="${i}"]`).forEach(o => {
        o.classList.add('disabled');
        const optIdx = parseInt(o.dataset.opt);
        if (optIdx === q.answer) o.classList.add('correct');
        if (optIdx === selected && selected !== q.answer) o.classList.add('incorrect');
      });
      if (selected === q.answer) {
        correct++;
        fb.className = 'quiz-feedback correct';
        fb.textContent = 'Correct!';
      } else {
        fb.className = 'quiz-feedback incorrect';
        fb.textContent = `Incorrect. Answer: ${q.options[q.answer]}`;
      }
    } else {
      const input = $(`input-${i}`);
      const val = input.value.trim().replace(/,/g, '');
      const expected = q.answer.replace(/,/g, '');
      input.readOnly = true;
      if (val === expected) {
        correct++;
        input.classList.add('correct');
        fb.className = 'quiz-feedback correct';
        fb.textContent = 'Correct!';
      } else {
        input.classList.add('incorrect');
        fb.className = 'quiz-feedback incorrect';
        fb.textContent = `Incorrect. Answer: ${q.answer}`;
      }
    }
  });

  // Hide submit button
  document.querySelector('.submit-btn').style.display = 'none';

  // Show result
  const total = quiz.length;
  const pct = Math.round((correct / total) * 100);
  const resultEl = $('quiz-result');
  resultEl.classList.remove('hidden');
  $('quiz-score').innerHTML = `${pct}%<div class="score-label">${correct} of ${total} correct</div>`;

  // Award XP & mark complete
  const xpEarned = correct * 10;
  progress.xp += xpEarned;
  recordActivity();

  // Save best score
  const prev = progress.scores[currentTopic.id];
  if (!prev || correct > prev.score) {
    progress.scores[currentTopic.id] = { score: correct, total, date: new Date().toISOString() };
  }

  // Mark complete if >= 75%
  if (pct >= 75) {
    progress.completed[currentTopic.id] = true;
  }

  renderHeader();
  saveProgress();
}

// ── Navigation ──
$('back-btn').addEventListener('click', () => {
  if (document.querySelector('#view-lesson.active')) {
    openStrand(currentStrand.id);
  } else if (document.querySelector('#view-strand.active')) {
    renderHome();
  }
});

$('retry-btn').addEventListener('click', () => {
  renderQuiz();
});

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    $('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// ── Init ──
loadProgress().then(() => renderHome());
