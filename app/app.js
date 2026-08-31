// \u2500\u2500 State \u2500\u2500
let progress = { xp: 0, streak: 0, lastDate: null, completed: {}, scores: {}, mastery: {}, teachCount: 0, reviewCursor: 0, taughtOrder: [] };
let currentStrand = null;
let currentTopic = null;
let currentProfileId = null;

const $ = id => document.getElementById(id);
const views = document.querySelectorAll('.view');

// \u2500\u2500 Profile & Progress API \u2500\u2500

async function loadProgress() {
  if (!currentProfileId) return;
  try {
    const res = await fetch('/api/profiles/' + currentProfileId);
    if (res.ok) progress = await res.json();
  } catch (e) { console.warn('Could not load progress', e); }
  FLOW.ensureMastery(progress);
  updateStreak();
  renderHeader();
}

async function saveProgress() {
  if (!currentProfileId) return;
  try {
    await fetch('/api/profiles/' + currentProfileId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progress)
    });
  } catch (e) { console.warn('Could not save progress', e); }
}

async function showProfileScreen() {
  showView('view-profile');
  $('back-btn').classList.add('hidden');
  $('header-title').textContent = 'Maths Pathway';

  // Load existing profiles
  try {
    const res = await fetch('/api/profiles');
    const data = await res.json();
    const profiles = data.profiles || [];

    if (profiles.length > 0) {
      $('profile-existing').classList.remove('hidden');
      $('profile-list').innerHTML = profiles.map(function(p) {
        var initial = (p.name || '?')[0].toUpperCase();
        var meta = p.xp + ' XP';
        if (p.lastDate) meta += ' \u00b7 last active ' + p.lastDate;
        return '<div class="profile-card" onclick="selectProfile(\'' + p.id + '\')">' +
          '<div class="profile-avatar">' + initial + '</div>' +
          '<div class="profile-card-info">' +
            '<div class="profile-card-name">' + p.name + '</div>' +
            '<div class="profile-card-meta">' + meta + '</div>' +
          '</div>' +
          '<div class="topic-arrow">\u203a</div>' +
        '</div>';
      }).join('');
    } else {
      $('profile-existing').classList.add('hidden');
    }
  } catch (e) {
    $('profile-existing').classList.add('hidden');
  }
}

async function selectProfile(id) {
  currentProfileId = id;
  localStorage.setItem('maths-pathway-profile', id);
  await loadProgress();
  renderHome();
}

async function createAndSelectProfile() {
  var name = $('profile-name').value.trim();
  if (!name) { $('profile-name').focus(); return; }

  try {
    var res = await fetch('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name })
    });
    var data = await res.json();
    if (data.profile) {
      currentProfileId = data.profile.id;
      progress = data.profile;
      localStorage.setItem('maths-pathway-profile', currentProfileId);
      FLOW.ensureMastery(progress);
      renderHeader();
      renderHome();
    }
  } catch (e) { console.error('Could not create profile', e); }
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

// \u2500\u2500 Rendering \u2500\u2500
function renderHeader() {
  $('xp-count').textContent = progress.xp;
  $('streak-count').textContent = progress.streak;
  var profileEl = $('header-profile');
  if (profileEl) {
    profileEl.textContent = progress.name || currentProfileId || '';
    profileEl.style.display = currentProfileId ? '' : 'none';
  }
}

function showView(id) {
  views.forEach(v => v.classList.remove('active'));
  $(id).classList.add('active');
  $('back-btn').classList.toggle('hidden', id === 'view-home');
  window.scrollTo(0, 0);
}

function getCompletedCount(strand) {
  return strand.topics.filter(t => FLOW.getMasteryLevel(progress, t.id) >= FLOW.MASTERY_THRESHOLD).length;
}

function getTotalTopics() {
  return STRANDS.reduce((sum, s) => sum + s.topics.length, 0);
}

function getTotalCompleted() {
  return STRANDS.reduce((sum, s) => sum + getCompletedCount(s), 0);
}

function masteryColor(level) {
  if (level >= FLOW.MASTERY_THRESHOLD) return 'high';
  if (level >= 0.3) return 'mid';
  return 'low';
}

// \u2500\u2500 Study Next \u2500\u2500
function renderStudyNext() {
  const next = FLOW.getNextAction(progress);
  const el = $('study-next');

  if (next.action === 'complete') {
    el.innerHTML = '<div class="study-next-complete"><div class="emoji">\ud83c\udf1f</div><p>You\u2019ve mastered the entire curriculum!</p></div>';
    return;
  }

  let topicName = '';
  for (const s of STRANDS) {
    const t = s.topics.find(t => t.id === next.topicId);
    if (t) { topicName = t.name; break; }
  }

  const label = next.action === 'review' ? 'Review recommended' : 'Study next';
  const btnLabel = next.action === 'review' ? 'Review now \u2192' : 'Start learning \u2192';
  const masteryLvl = FLOW.getMasteryLevel(progress, next.topicId);
  const masteryPct = Math.round(masteryLvl * 100);

  el.innerHTML = `
    <div class="study-next-card" onclick="openTopic('${next.topicId}')">
      <div class="study-next-label">${label}</div>
      <div class="study-next-title">${topicName}</div>
      <div class="study-next-reason">${next.reason}${masteryPct > 0 ? ' \u00b7 ' + masteryPct + '% mastery' : ''}</div>
      <button class="study-next-btn">${btnLabel}</button>
    </div>`;
}


// \u2500\u2500 Home \u2500\u2500
function renderHome() {
  const total = getTotalTopics();
  const done = getTotalCompleted();
  const pct = FLOW.getOverallMastery(progress);
  $('global-progress').style.width = pct + '%';
  $('global-pct').textContent = pct;
  $('header-title').textContent = 'Maths Pathway';

  renderStudyNext();

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
          <div class="strand-meta">${count} topics \u00b7 ${completed} mastered</div>
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
    const status = FLOW.getTopicStatus(progress, t.id);
    const locked = !status.unlocked;
    const lvl = status.level;
    const pct = Math.round(lvl * 100);
    const color = masteryColor(lvl);

    let lockMsg = '';
    if (locked) {
      lockMsg = '<div class="lock-reason">\ud83d\udd12 Requires: ' + status.unmetNames.join(', ') + '</div>';
    }

    return `
      <div class="topic-card ${locked ? 'locked' : ''}" ${locked ? '' : 'onclick="openTopic(\'' + t.id + '\')"'}>
        <div class="topic-status ${status.mastered ? 'done' : ''}">${locked ? '\ud83d\udd12' : status.mastered ? '\u2713' : ''}</div>
        <div class="topic-info">
          <div class="topic-name">${t.name}</div>
          <div class="topic-code">${t.code} \u00b7 ${status.label}</div>
          <div class="mastery-bar"><div class="mastery-bar-fill ${color}" style="width:${pct}%"></div></div>
          ${lockMsg}
        </div>
        <div class="topic-arrow">${locked ? '' : '\u203a'}</div>
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

  // Check if locked
  if (!FLOW.isUnlocked(progress, id)) return;

  $('header-title').textContent = currentTopic.name;
  const status = FLOW.getTopicStatus(progress, id);

  // Learn tab \u2014 add scaffold/review banner + visuals
  let banner = '';
  if (status.scaffold) {
    banner = '<div class="scaffold-banner"><strong>\u26a0 Challenging topic:</strong> Study the examples carefully before practising.</div>';
  }
  const nextAction = FLOW.getNextAction(progress);
  if (nextAction.action === 'review' && nextAction.topicId === id) {
    banner = '<div class="review-banner"><strong>\ud83d\udd01 Spaced review:</strong> ' + nextAction.reason + '</div>';
  }
  const learnViz = (currentTopic.learnVisuals || []).map(v => renderVisual(v)).join('');
  $('lesson-content').innerHTML = banner + learnViz + currentTopic.learn;

  // Examples tab
  $('lesson-examples').innerHTML = currentTopic.examples.map((ex, i) => {
    const viz = typeof renderVisual === 'function' ? renderVisual(ex.visual) : '';
    return `
    <div class="example-card">
      <div class="label">Example ${i + 1}</div>
      ${viz}
      <div class="problem">${ex.problem}</div>
      <div class="solution">${ex.solution}</div>
    </div>`;
  }).join('');

  // Practice tab
  renderQuiz();

  // Reset tabs \u2014 if scaffolding, start on examples tab
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  if (status.scaffold && status.level < 0.3) {
    document.querySelector('.tab[data-tab="examples"]').classList.add('active');
    $('tab-examples').classList.add('active');
  } else {
    document.querySelector('.tab[data-tab="learn"]').classList.add('active');
    $('tab-learn').classList.add('active');
  }

  showView('view-lesson');
}

// \u2500\u2500 Quiz Engine \u2500\u2500
let quizAnswers = {};
let activeQuiz = [];

function renderQuiz() {
  $('quiz-result').classList.add('hidden');
  $('quiz-container').innerHTML =
    '<div class="quiz-loader">' +
      '<div class="quiz-loader-ring"><div></div><div></div><div></div></div>' +
      '<p class="quiz-loader-text">Generating fresh questions\u2026</p>' +
    '</div>';

  var strand = currentStrand ? currentStrand.name : '';
  var diff = FLOW.getDifficulty(currentTopic.id);
  var examples = currentTopic.examples.map(function(e) {
    return { problem: e.problem, solution: e.solution };
  });

  fetch('/api/generate-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topicCode: currentTopic.code,
      topicName: currentTopic.name,
      strand: strand,
      difficulty: diff,
      examples: examples
    })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (data.quiz && data.quiz.length > 0) {
      renderQuizFromQuestions(data.quiz);
    } else {
      renderQuizFromQuestions(currentTopic.quiz);
    }
  })
  .catch(function() {
    renderQuizFromQuestions(currentTopic.quiz);
  });
}

function buildMasteryPanel(topicId) {
  var info = FLOW.getMasteryMessage(progress, topicId);
  var circ = 2 * Math.PI * 22;
  var offset = circ - (circ * info.level / 100);
  var ringClass = info.tier === 'strong' ? 'strong' : info.level >= 75 ? 'high' : info.level >= 30 ? 'mid' : 'low';
  var tierLabel = info.tier === 'strong' ? 'Strong' : info.tier === 'mastered' ? 'Mastered' : info.tier === 'learning' ? 'Learning' : 'New';

  return '<div class="mastery-panel">' +
    '<div class="mastery-ring">' +
      '<svg viewBox="0 0 48 48">' +
        '<circle class="track" cx="24" cy="24" r="22" fill="none" stroke-width="4"/>' +
        '<circle class="fill ' + ringClass + '" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke-dasharray="' + circ + '" stroke-dashoffset="' + offset + '" stroke-linecap="round"/>' +
      '</svg>' +
      '<div class="mastery-ring-pct">' + info.level + '%</div>' +
    '</div>' +
    '<div class="mastery-info">' +
      '<div class="mastery-info-level">' + tierLabel + '</div>' +
      '<div class="mastery-info-msg">' + info.msg + '</div>' +
    '</div>' +
  '</div>';
}

function renderQuizFromQuestions(quiz) {
  activeQuiz = quiz;
  quizAnswers = {};
  $('quiz-result').classList.add('hidden');
  var panel = buildMasteryPanel(currentTopic.id);
  $('quiz-container').innerHTML = panel + quiz.map((q, i) => {
    const viz = typeof renderVisual === 'function' ? renderVisual(q.visual) : '';
    if (q.type === 'mc') {
      return `
        <div class="quiz-question" data-idx="${i}">
          <div class="q-number">Question ${i + 1}</div>
          ${viz}
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
          ${viz}
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
  document.querySelectorAll('.quiz-option[data-q="' + qIdx + '"]').forEach(o => o.classList.remove('selected'));
  const el = document.querySelector('.quiz-option[data-q="' + qIdx + '"][data-opt="' + optIdx + '"]');
  el.classList.add('selected');
  quizAnswers[qIdx] = optIdx;
}


function submitQuiz() {
  const quiz = activeQuiz;
  let correct = 0;

  quiz.forEach((q, i) => {
    const fb = $('fb-' + i);
    fb.style.display = 'block';

    if (q.type === 'mc') {
      const selected = quizAnswers[i];
      document.querySelectorAll('.quiz-option[data-q="' + i + '"]').forEach(o => {
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
        fb.textContent = 'Incorrect. Answer: ' + q.options[q.answer];
      }
    } else {
      const input = $('input-' + i);
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
        fb.textContent = 'Incorrect. Answer: ' + q.answer;
      }
    }
  });

  document.querySelector('.submit-btn').style.display = 'none';

  const total = quiz.length;
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= 75;

  // Capture mastery BEFORE update
  var beforeLevel = Math.round(FLOW.getMasteryLevel(progress, currentTopic.id) * 100);
  var beforeInfo = FLOW.getMasteryMessage(progress, currentTopic.id);

  // \u2500\u2500 Update mastery via flow engine \u2500\u2500
  FLOW.updateMastery(progress, currentTopic.id, correct, total);

  // Capture mastery AFTER update
  var afterLevel = Math.round(FLOW.getMasteryLevel(progress, currentTopic.id) * 100);
  var afterInfo = FLOW.getMasteryMessage(progress, currentTopic.id);
  var gained = afterLevel - beforeLevel;

  // Build result display
  var emoji = pct === 100 ? '\ud83c\udfaf' : passed ? '\u2705' : '\u274c';
  var barColor = afterLevel >= 95 ? '#6366f1' : afterLevel >= 75 ? '#22c55e' : afterLevel >= 30 ? '#f59e0b' : '#ef4444';

  var masteryUpdate =
    '<div class="mastery-update">' +
      '<div class="mastery-update-row">' +
        '<div class="mastery-update-label">Before</div>' +
        '<div class="mastery-update-bar"><div class="mastery-update-bar-fill" style="width:' + beforeLevel + '%;background:var(--text-dim)"></div></div>' +
        '<div class="mastery-update-val">' + beforeLevel + '%</div>' +
      '</div>' +
      '<div class="mastery-update-row">' +
        '<div class="mastery-update-label">After</div>' +
        '<div class="mastery-update-bar"><div class="mastery-update-bar-fill" style="width:' + afterLevel + '%;background:' + barColor + '"></div></div>' +
        '<div class="mastery-update-val" style="color:' + barColor + '">' + afterLevel + '%</div>' +
      '</div>' +
      (gained > 0 ? '<div class="mastery-update-msg">+' + gained + '% mastery gained</div>' : '') +
      '<div class="mastery-update-msg">' + afterInfo.msg + '</div>' +
    '</div>';

  const resultEl = $('quiz-result');
  resultEl.classList.remove('hidden');
  $('quiz-score').innerHTML = emoji + '<br>' + pct + '%<div class="score-label">' + correct + ' of ' + total + ' correct</div>' + masteryUpdate;

  // XP
  var xpEarned = correct * 10;
  progress.xp += xpEarned;
  recordActivity();

  // Save best score
  var prev = progress.scores[currentTopic.id];
  if (!prev || correct > prev.score) {
    progress.scores[currentTopic.id] = { score: correct, total: total, date: new Date().toISOString() };
  }

  // Mark complete if mastered
  if (FLOW.getMasteryLevel(progress, currentTopic.id) >= FLOW.MASTERY_THRESHOLD) {
    progress.completed[currentTopic.id] = true;
  }

  renderHeader();
  saveProgress();

  // Actions
  var nextAction = FLOW.getNextAction(progress);
  var actions = '';
  if (passed && nextAction.action !== 'complete') {
    var nextName = '';
    for (var si = 0; si < STRANDS.length; si++) {
      var tt = STRANDS[si].topics.find(function(t) { return t.id === nextAction.topicId; });
      if (tt) { nextName = tt.name; break; }
    }
    var btnText = nextAction.action === 'review' ? '\ud83d\udd01 Review: ' + nextName : 'Next: ' + nextName + ' \u2192';
    actions += '<button class="btn" onclick="openTopic(\'' + nextAction.topicId + '\')" style="width:100%;margin-bottom:8px">' + btnText + '</button>';
    actions += '<button class="btn btn-outline" onclick="renderQuiz()" style="width:100%">Practice Again</button>';
  } else if (passed) {
    actions += '<button class="btn" onclick="renderHome()" style="width:100%;margin-bottom:8px">\ud83c\udf1f All mastered!</button>';
    actions += '<button class="btn btn-outline" onclick="renderQuiz()" style="width:100%">Practice Again</button>';
  } else {
    actions += '<button class="btn" onclick="renderQuiz()" style="width:100%">Try Again</button>';
  }
  $('quiz-actions').innerHTML = actions;
}

// \u2500\u2500 Navigation \u2500\u2500
$('back-btn').addEventListener('click', function() {
  if (document.querySelector('#view-lesson.active')) {
    openStrand(currentStrand.id);
  } else if (document.querySelector('#view-strand.active')) {
    renderHome();
  }
});

document.querySelectorAll('.tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active');
    $('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// \u2500\u2500 Init \u2500\u2500

// Profile create button + enter key
$('profile-create-btn').addEventListener('click', createAndSelectProfile);
$('profile-name').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') createAndSelectProfile();
});

// Check if we have a remembered profile
(async function init() {
  var savedId = localStorage.getItem('maths-pathway-profile');
  if (savedId) {
    // Verify it still exists
    try {
      var res = await fetch('/api/profiles/' + savedId);
      if (res.ok) {
        currentProfileId = savedId;
        await loadProgress();
        renderHome();
        return;
      }
    } catch {}
  }
  // No saved profile or it's gone — show profile screen
  showProfileScreen();
})();
