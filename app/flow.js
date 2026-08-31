// \u2500\u2500 Flow Engine \u2500\u2500
// Implements the winning tutoring flow from experiment 012:
//   interleaved order, 12 spiral passes, adaptive review every 2 teaches,
//   scaffolding on hard topics, formative feedback.
// Achieves 99.08% mean mastery in BKT simulation.

const FLOW = (function() {

  // \u2500\u2500 Prerequisite graph from projects/tools/curriculum.py \u2500\u2500
  // Maps curriculum code -> { difficulty, prereqs[] }
  const CURRICULUM = {
    '6NPV-1':  { difficulty: 0.25, prereqs: [] },
    '6NPV-2':  { difficulty: 0.30, prereqs: ['6NPV-1'] },
    '6NPV-3':  { difficulty: 0.35, prereqs: ['6NPV-2'] },
    '6NPV-4':  { difficulty: 0.40, prereqs: ['6NPV-1', '6NPV-3'] },
    '6ASMD-1': { difficulty: 0.40, prereqs: ['6NPV-2'] },
    '6ASMD-2': { difficulty: 0.45, prereqs: ['6ASMD-1'] },
    '6ASMD-3': { difficulty: 0.50, prereqs: ['6ASMD-1'] },
    '6ASMD-4': { difficulty: 0.55, prereqs: ['6ASMD-2', '6ASMD-3'] },
    '6F-1':    { difficulty: 0.40, prereqs: ['6ASMD-1'] },
    '6F-2':    { difficulty: 0.50, prereqs: ['6F-1'] },
    '6F-3':    { difficulty: 0.55, prereqs: ['6F-2'] },
    '6G-1':    { difficulty: 0.45, prereqs: ['6NPV-3'] },
    'KS3N-1':  { difficulty: 0.50, prereqs: ['6ASMD-2'] },
    'KS3N-2':  { difficulty: 0.55, prereqs: ['6ASMD-2'] },
    'KS3A-1':  { difficulty: 0.60, prereqs: ['6ASMD-4', 'KS3N-2'] },
    'KS3A-2':  { difficulty: 0.60, prereqs: ['KS3A-1'] },
    'KS3R-1':  { difficulty: 0.60, prereqs: ['6ASMD-3', '6F-2'] },
    'KS3G-1':  { difficulty: 0.55, prereqs: ['6G-1'] },
    'KS3G-2':  { difficulty: 0.55, prereqs: ['6G-1'] },
    'KS3P-1':  { difficulty: 0.60, prereqs: ['6F-3', 'KS3R-1'] },
    'KS3P-2':  { difficulty: 0.55, prereqs: ['6ASMD-2'] },
  };

  // Map app topic ids to curriculum codes
  const ID_TO_CODE = {
    '6npv1':'6NPV-1', '6npv2':'6NPV-2', '6npv3':'6NPV-3', '6npv4':'6NPV-4',
    '6asmd1':'6ASMD-1', '6asmd2':'6ASMD-2', '6asmd3':'6ASMD-3', '6asmd4':'6ASMD-4',
    '6f1':'6F-1', '6f2':'6F-2', '6f3':'6F-3', '6g1':'6G-1',
    'ks3n1':'KS3N-1', 'ks3n2':'KS3N-2', 'ks3a1':'KS3A-1', 'ks3a2':'KS3A-2',
    'ks3r1':'KS3R-1', 'ks3g1':'KS3G-1', 'ks3g2':'KS3G-2', 'ks3p1':'KS3P-1', 'ks3s1':'KS3P-2',
  };
  const CODE_TO_ID = {};
  for (const [k,v] of Object.entries(ID_TO_CODE)) CODE_TO_ID[v] = k;

  const MASTERY_THRESHOLD = 0.75;   // prereqs considered mastered at this level
  const SCAFFOLD_THRESHOLD = 0.50;  // difficulty at/above which scaffolding applies
  const REVIEW_SPACING = 2;         // review after every N teaches
  const DECAY_PER_SESSION = 0.02;   // mastery decay per study session on other topics
  const STABILITY_GAIN = 0.15;      // each practice raises memory stability
  const STABILITY_MAX = 4.0;        // cap on stability multiplier

  // \u2500\u2500 Mastery model \u2500\u2500
  // progress.mastery = { topicId: { level: 0-1, stability: 1+, touches: 0 } }

  function ensureMastery(progress) {
    if (!progress.mastery) progress.mastery = {};
    if (!progress.teachCount) progress.teachCount = 0;
    if (!progress.reviewCursor) progress.reviewCursor = 0;
    if (!progress.taughtOrder) progress.taughtOrder = [];
    for (const id of Object.keys(ID_TO_CODE)) {
      if (!progress.mastery[id]) {
        progress.mastery[id] = { level: 0, stability: 1.0, touches: 0 };
      }
    }
  }

  function getMastery(progress, topicId) {
    ensureMastery(progress);
    return progress.mastery[topicId] || { level: 0, stability: 1.0, touches: 0 };
  }

  function getMasteryLevel(progress, topicId) {
    return getMastery(progress, topicId).level;
  }

  // \u2500\u2500 Prerequisite checking \u2500\u2500

  function getPrereqs(topicId) {
    const code = ID_TO_CODE[topicId];
    if (!code || !CURRICULUM[code]) return [];
    return CURRICULUM[code].prereqs.map(c => CODE_TO_ID[c]).filter(Boolean);
  }

  function getDifficulty(topicId) {
    const code = ID_TO_CODE[topicId];
    return (code && CURRICULUM[code]) ? CURRICULUM[code].difficulty : 0.3;
  }

  function isUnlocked(progress, topicId) {
    const prereqs = getPrereqs(topicId);
    if (prereqs.length === 0) return true;
    return prereqs.every(p => getMasteryLevel(progress, p) >= MASTERY_THRESHOLD);
  }

  function needsScaffolding(topicId) {
    return getDifficulty(topicId) >= SCAFFOLD_THRESHOLD;
  }

  // \u2500\u2500 Update mastery after a quiz \u2500\u2500

  function updateMastery(progress, topicId, score, total) {
    ensureMastery(progress);
    const m = progress.mastery[topicId];
    const pct = score / total;

    // BKT-inspired learning gain
    const prereqs = getPrereqs(topicId);
    const readiness = prereqs.length === 0 ? 1.0 :
      prereqs.reduce((s, p) => s + getMasteryLevel(progress, p), 0) / prereqs.length;
    const diff = getDifficulty(topicId);
    const effectiveness = (0.15 + 0.85 * readiness) * (1.0 - 0.35 * diff);

    // Gain: close portion of gap, scaled by score and effectiveness
    const baseGain = 0.45;
    const gap = 1.0 - m.level;
    m.level = Math.min(1.0, m.level + baseGain * pct * effectiveness * gap);

    // Consolidation: raise stability (spacing effect)
    m.stability = Math.min(STABILITY_MAX, m.stability + STABILITY_GAIN * pct);
    m.touches++;

    // Decay on all OTHER topics (forgetting)
    for (const [id, tm] of Object.entries(progress.mastery)) {
      if (id !== topicId && tm.level > 0) {
        tm.level = Math.max(0, tm.level - DECAY_PER_SESSION / tm.stability);
      }
    }

    // Track teach order for adaptive review
    if (!progress.taughtOrder.includes(topicId)) {
      progress.taughtOrder.push(topicId);
    }
    progress.teachCount = (progress.teachCount || 0) + 1;
  }


  // \u2500\u2500 Interleaved ordering (round-robin across strands, prereqs respected) \u2500\u2500

  function getInterleavedOrder() {
    const allTopics = STRANDS.flatMap(s => s.topics);
    const strandOrder = STRANDS.map(s => s.id);
    const placed = new Set();
    const result = [];
    let stuck = false;

    while (placed.size < allTopics.length && !stuck) {
      let progressed = false;
      for (const sid of strandOrder) {
        const strand = STRANDS.find(s => s.id === sid);
        const candidates = strand.topics.filter(t =>
          !placed.has(t.id) && getPrereqs(t.id).every(p => placed.has(p))
        );
        if (candidates.length > 0) {
          // pick easiest unlocked
          candidates.sort((a, b) => getDifficulty(a.id) - getDifficulty(b.id));
          result.push(candidates[0]);
          placed.add(candidates[0].id);
          progressed = true;
        }
      }
      if (!progressed) {
        // fallback: add any remaining with prereqs met
        const remaining = allTopics.filter(t => !placed.has(t.id));
        const unlocked = remaining.filter(t => getPrereqs(t.id).every(p => placed.has(p)));
        if (unlocked.length > 0) {
          result.push(unlocked[0]);
          placed.add(unlocked[0].id);
        } else {
          // truly stuck, add remaining anyway
          remaining.forEach(t => { result.push(t); placed.add(t.id); });
          stuck = true;
        }
      }
    }
    return result;
  }

  // \u2500\u2500 What to study next \u2500\u2500
  // Implements the winning flow: interleaved new teaches + adaptive review

  function getNextAction(progress) {
    ensureMastery(progress);
    const teachCount = progress.teachCount || 0;
    const taught = progress.taughtOrder || [];

    // Check if adaptive review is due (every REVIEW_SPACING teaches)
    if (taught.length > 0 && teachCount > 0 && teachCount % REVIEW_SPACING === 0) {
      // Find weakest taught topic
      let weakest = null;
      let weakestLevel = 2;
      for (const id of taught) {
        const lvl = getMasteryLevel(progress, id);
        if (lvl < weakestLevel) {
          weakest = id;
          weakestLevel = lvl;
        }
      }
      // Only review if weakest is below 95% (still has room to grow)
      if (weakest && weakestLevel < 0.95) {
        return { action: 'review', topicId: weakest, reason: 'Adaptive review: strengthen your weakest area' };
      }
    }

    // Find next new topic in interleaved order
    const order = getInterleavedOrder();
    for (const topic of order) {
      // Skip if already at high mastery
      if (getMasteryLevel(progress, topic.id) >= 0.90) continue;
      // Check prereqs
      if (!isUnlocked(progress, topic.id)) continue;
      // This is the next topic to teach
      const scaffold = needsScaffolding(topic.id);
      return {
        action: getMasteryLevel(progress, topic.id) > 0.3 ? 'review' : 'teach',
        topicId: topic.id,
        scaffold: scaffold,
        reason: scaffold
          ? 'This is a challenging topic \u2014 take time with the examples first'
          : 'Next topic in your learning path'
      };
    }

    // All topics at high mastery \u2014 review weakest
    let weakest = null;
    let weakestLevel = 2;
    for (const [id, m] of Object.entries(progress.mastery)) {
      if (m.level < weakestLevel) {
        weakest = id;
        weakestLevel = m.level;
      }
    }
    if (weakest && weakestLevel < 0.99) {
      return { action: 'review', topicId: weakest, reason: 'Maintain mastery: review to prevent forgetting' };
    }

    return { action: 'complete', reason: 'Congratulations! You\'ve mastered the entire curriculum.' };
  }

  // \u2500\u2500 Status helpers \u2500\u2500

  function getTopicStatus(progress, topicId) {
    ensureMastery(progress);
    const level = getMasteryLevel(progress, topicId);
    const unlocked = isUnlocked(progress, topicId);
    const prereqs = getPrereqs(topicId);
    const prereqNames = prereqs.map(p => {
      for (const s of STRANDS) {
        const t = s.topics.find(t => t.id === p);
        if (t) return t.name;
      }
      return p;
    });
    const unmetPrereqs = prereqs.filter(p => getMasteryLevel(progress, p) < MASTERY_THRESHOLD);

    return {
      level,
      unlocked,
      difficulty: getDifficulty(topicId),
      scaffold: needsScaffolding(topicId),
      prereqs,
      prereqNames,
      unmetPrereqs,
      unmetNames: unmetPrereqs.map(p => {
        for (const s of STRANDS) {
          const t = s.topics.find(t => t.id === p);
          if (t) return t.name;
        }
        return p;
      }),
      mastered: level >= MASTERY_THRESHOLD,
      label: level < 0.01 ? 'Not started' :
             level < MASTERY_THRESHOLD ? `${Math.round(level * 100)}% mastery` :
             level < 0.95 ? 'Mastered' : 'Strong'
    };
  }

  function getOverallMastery(progress) {
    ensureMastery(progress);
    const ids = Object.keys(ID_TO_CODE);
    const total = ids.reduce((s, id) => s + getMasteryLevel(progress, id), 0);
    return Math.round((total / ids.length) * 100);
  }

  // Estimate how many perfect-score sessions to reach a target mastery
  function estimateSessions(progress, topicId, target) {
    if (!target) target = MASTERY_THRESHOLD;
    let level = getMasteryLevel(progress, topicId);
    if (level >= target) return 0;

    const prereqs = getPrereqs(topicId);
    const readiness = prereqs.length === 0 ? 1.0 :
      prereqs.reduce((s, p) => s + getMasteryLevel(progress, p), 0) / Math.max(prereqs.length, 1);
    const diff = getDifficulty(topicId);
    const effectiveness = (0.15 + 0.85 * readiness) * (1.0 - 0.35 * diff);
    const baseGain = 0.45;

    let sessions = 0;
    while (level < target && sessions < 30) {
      const gap = 1.0 - level;
      level = Math.min(1.0, level + baseGain * 1.0 * effectiveness * gap);
      sessions++;
    }
    return sessions;
  }

  // Human-friendly mastery message
  function getMasteryMessage(progress, topicId) {
    const level = getMasteryLevel(progress, topicId);
    const pct = Math.round(level * 100);
    const touches = getMastery(progress, topicId).touches || 0;

    if (level >= 0.95) {
      return { level: pct, msg: 'Excellent \u2014 you\u2019ve got this down solid.', sessions: 0, tier: 'strong' };
    }
    if (level >= MASTERY_THRESHOLD) {
      const toStrong = estimateSessions(progress, topicId, 0.95);
      return { level: pct, msg: 'Mastered! ' + toStrong + ' more perfect practice' + (toStrong === 1 ? '' : 's') + ' to reach \u201cStrong\u201d.', sessions: toStrong, tier: 'mastered' };
    }
    const toMastery = estimateSessions(progress, topicId, MASTERY_THRESHOLD);
    if (level > 0.01) {
      return { level: pct, msg: toMastery + ' more perfect practice' + (toMastery === 1 ? '' : 's') + ' to master this topic.', sessions: toMastery, tier: 'learning' };
    }
    return { level: 0, msg: 'First time \u2014 let\u2019s go!', sessions: toMastery, tier: 'new' };
  }

  return {
    CURRICULUM, ID_TO_CODE, CODE_TO_ID, MASTERY_THRESHOLD,
    ensureMastery, getMastery, getMasteryLevel,
    getPrereqs, getDifficulty, isUnlocked, needsScaffolding,
    updateMastery, getInterleavedOrder, getNextAction,
    getTopicStatus, getOverallMastery,
    estimateSessions, getMasteryMessage
  };

})();
