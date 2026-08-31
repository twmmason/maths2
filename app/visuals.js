// SVG visual generators for quiz questions
// Each returns an HTML string (inline SVG)

const VIZ = {

  // ── Place Value Chart ──
  // shows digits in columns with one highlighted
  placeValue(opts) {
    const { number, highlight } = opts;
    const str = String(number).replace(/,/g, '');
    const cols = ['10M','M','100K','10K','K','H','T','O','.','t','h'];
    // find decimal point
    const dotIdx = str.indexOf('.');
    const intPart = dotIdx >= 0 ? str.slice(0, dotIdx) : str;
    const decPart = dotIdx >= 0 ? str.slice(dotIdx + 1) : '';
    // pad int to 8 digits
    const padded = intPart.padStart(8, ' ');
    const digits = [...padded, ...(decPart ? ['.', ...decPart.padEnd(2,' ')] : [])];
    const headers = cols.slice(0, digits.length);
    const w = digits.length * 48 + 16;
    let svg = `<svg viewBox="0 0 ${w} 70" class="viz">`;
    digits.forEach((d, i) => {
      const x = 8 + i * 48;
      const isHl = highlight !== undefined && i === highlight;
      // header
      svg += `<text x="${x+24}" y="14" text-anchor="middle" fill="#71717a" font-size="9" font-family="sans-serif">${headers[i] || ''}</text>`;
      // cell
      svg += `<rect x="${x}" y="20" width="44" height="40" rx="6" fill="${isHl ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)'}" stroke="${isHl ? '#6366f1' : '#2a2a2d'}" stroke-width="1.5"/>`;
      svg += `<text x="${x+22}" y="47" text-anchor="middle" fill="${isHl ? '#6366f1' : '#e4e4e7'}" font-size="18" font-weight="600" font-family="monospace">${d === ' ' ? '' : d}</text>`;
    });
    svg += '</svg>';
    return svg;
  },

  // ── Number Line ──
  numberLine(opts) {
    const { min, max, marks, arrow, label } = opts;
    const w = 420, h = 70, pad = 40;
    const range = max - min;
    const toX = v => pad + ((v - min) / range) * (w - 2 * pad);
    let svg = `<svg viewBox="0 0 ${w} ${h}" class="viz">`;
    // line
    svg += `<line x1="${pad}" y1="40" x2="${w-pad}" y2="40" stroke="#3f3f46" stroke-width="2"/>`;
    // end ticks + labels
    svg += `<line x1="${pad}" y1="34" x2="${pad}" y2="46" stroke="#71717a" stroke-width="2"/>`;
    svg += `<text x="${pad}" y="60" text-anchor="middle" fill="#71717a" font-size="11" font-family="monospace">${min.toLocaleString()}</text>`;
    svg += `<line x1="${w-pad}" y1="34" x2="${w-pad}" y2="46" stroke="#71717a" stroke-width="2"/>`;
    svg += `<text x="${w-pad}" y="60" text-anchor="middle" fill="#71717a" font-size="11" font-family="monospace">${max.toLocaleString()}</text>`;
    // marks
    if (marks) marks.forEach(m => {
      const x = toX(m.value);
      svg += `<line x1="${x}" y1="34" x2="${x}" y2="46" stroke="${m.color || '#6366f1'}" stroke-width="2"/>`;
      if (m.label) svg += `<text x="${x}" y="${m.above ? 22 : 60}" text-anchor="middle" fill="${m.color || '#6366f1'}" font-size="10" font-family="monospace">${m.label}</text>`;
    });
    // arrow
    if (arrow) {
      const ax = toX(arrow);
      svg += `<polygon points="${ax-6},28 ${ax+6},28 ${ax},36" fill="#f59e0b"/>`;
      if (label) svg += `<text x="${ax}" y="20" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="600" font-family="monospace">${label}</text>`;
    }
    svg += '</svg>';
    return svg;
  },

  // ── Scale / Ruler ──
  scale(opts) {
    const { min, max, divisions, highlight } = opts;
    const w = 420, h = 60, pad = 30;
    const step = (max - min) / divisions;
    let svg = `<svg viewBox="0 0 ${w} ${h}" class="viz">`;
    svg += `<line x1="${pad}" y1="30" x2="${w-pad}" y2="30" stroke="#3f3f46" stroke-width="2"/>`;
    for (let i = 0; i <= divisions; i++) {
      const x = pad + (i / divisions) * (w - 2 * pad);
      const val = min + step * i;
      const isHl = highlight !== undefined && i === highlight;
      svg += `<line x1="${x}" y1="22" x2="${x}" y2="38" stroke="${isHl ? '#6366f1' : '#71717a'}" stroke-width="${isHl ? 3 : 1.5}"/>`;
      svg += `<text x="${x}" y="52" text-anchor="middle" fill="${isHl ? '#6366f1' : '#71717a'}" font-size="10" font-family="monospace">${typeof val === 'number' && val >= 1000 ? (val/1000)+'k' : val}</text>`;
    }
    svg += '</svg>';
    return svg;
  },

  // ── Fraction Bar ──
  fractionBar(opts) {
    const { numerator, denominator, color, compare } = opts;
    const w = 360, h = compare ? 70 : 44, pad = 10, barH = 26;
    let svg = `<svg viewBox="0 0 ${w} ${h}" class="viz">`;
    // first bar
    const bw = w - 2 * pad;
    const partW = bw / denominator;
    for (let i = 0; i < denominator; i++) {
      const filled = i < numerator;
      svg += `<rect x="${pad + i * partW}" y="${pad}" width="${partW - 2}" height="${barH}" rx="4" fill="${filled ? (color || 'rgba(99,102,241,0.35)') : 'rgba(255,255,255,0.06)'}" stroke="#3f3f46" stroke-width="1"/>`;
    }
    svg += `<text x="${w - 4}" y="${pad + 18}" text-anchor="end" fill="#71717a" font-size="12" font-family="monospace">${numerator}/${denominator}</text>`;
    // compare bar
    if (compare) {
      const { n2, d2, color2 } = compare;
      const partW2 = bw / d2;
      for (let i = 0; i < d2; i++) {
        const filled = i < n2;
        svg += `<rect x="${pad + i * partW2}" y="${pad + barH + 6}" width="${partW2 - 2}" height="${barH}" rx="4" fill="${filled ? (color2 || 'rgba(236,72,153,0.35)') : 'rgba(255,255,255,0.06)'}" stroke="#3f3f46" stroke-width="1"/>`;
      }
      svg += `<text x="${w - 4}" y="${pad + barH + 24}" text-anchor="end" fill="#71717a" font-size="12" font-family="monospace">${n2}/${d2}</text>`;
    }
    svg += '</svg>';
    return svg;
  },


  // ── Shape ──
  shape(opts) {
    const { type, w: sw, h: sh, labels, angles } = opts;
    const w = 300, h = 180, cx = 150, cy = 90;
    let svg = `<svg viewBox="0 0 ${w} ${h}" class="viz">`;
    if (type === 'rectangle') {
      const rw = Math.min(sw * 12, 220), rh = Math.min(sh * 12, 120);
      const rx = cx - rw/2, ry = cy - rh/2;
      svg += `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="rgba(20,184,166,0.12)" stroke="#14b8a6" stroke-width="2" rx="2"/>`;
      svg += `<text x="${cx}" y="${ry - 6}" text-anchor="middle" fill="#14b8a6" font-size="12" font-weight="600" font-family="monospace">${sw}cm</text>`;
      svg += `<text x="${rx - 8}" y="${cy + 4}" text-anchor="end" fill="#14b8a6" font-size="12" font-weight="600" font-family="monospace">${sh}cm</text>`;
    } else if (type === 'triangle') {
      const base = Math.min(sw * 12, 200), ht = Math.min(sh * 12, 130);
      const x1 = cx - base/2, y1 = cy + ht/2;
      const x2 = cx + base/2, y2 = cy + ht/2;
      const x3 = cx, y3 = cy - ht/2;
      svg += `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="rgba(99,102,241,0.12)" stroke="#6366f1" stroke-width="2"/>`;
      svg += `<text x="${cx}" y="${y1 + 16}" text-anchor="middle" fill="#6366f1" font-size="12" font-weight="600" font-family="monospace">${sw}cm</text>`;
      // height dashed line
      svg += `<line x1="${cx}" y1="${y3}" x2="${cx}" y2="${y1}" stroke="#6366f1" stroke-width="1" stroke-dasharray="4,3"/>`;
      svg += `<text x="${cx + 10}" y="${cy + 4}" fill="#6366f1" font-size="11" font-family="monospace">${sh}cm</text>`;
    } else if (type === 'circle') {
      const r = Math.min((sw || sh || 7) * 8, 70);
      svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" stroke-width="2"/>`;
      svg += `<line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,3"/>`;
      svg += `<text x="${cx + r/2}" y="${cy - 6}" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="600" font-family="monospace">${labels && labels.d ? 'd='+labels.d+'cm' : 'r='+sw+'cm'}</text>`;
    } else if (type === 'trapezium') {
      const { a, b, ht: trap_h } = labels;
      const topW = Math.min(a * 14, 140), botW = Math.min(b * 14, 240), trap_ht = Math.min(trap_h * 14, 120);
      const x1 = cx - botW/2, y1 = cy + trap_ht/2;
      const x2 = cx + botW/2, y2 = y1;
      const x3 = cx + topW/2, y3 = cy - trap_ht/2;
      const x4 = cx - topW/2, y4 = y3;
      svg += `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}" fill="rgba(236,72,153,0.12)" stroke="#ec4899" stroke-width="2"/>`;
      svg += `<text x="${cx}" y="${y3 - 6}" text-anchor="middle" fill="#ec4899" font-size="11" font-family="monospace">${a}cm</text>`;
      svg += `<text x="${cx}" y="${y1 + 16}" text-anchor="middle" fill="#ec4899" font-size="11" font-family="monospace">${b}cm</text>`;
      svg += `<text x="${x1 - 10}" y="${cy + 4}" text-anchor="end" fill="#ec4899" font-size="11" font-family="monospace">${trap_h}cm</text>`;
    } else if (type === 'square') {
      const side = Math.min((sw || 8) * 12, 140);
      const rx = cx - side/2, ry = cy - side/2;
      svg += `<rect x="${rx}" y="${ry}" width="${side}" height="${side}" fill="rgba(34,197,94,0.1)" stroke="#22c55e" stroke-width="2" rx="2"/>`;
      svg += `<text x="${cx}" y="${ry - 6}" text-anchor="middle" fill="#22c55e" font-size="12" font-weight="600" font-family="monospace">?</text>`;
    }
    // angles
    if (angles) {
      angles.forEach(a => {
        svg += `<text x="${a.x || 60}" y="${a.y || 30}" fill="${a.color || '#f59e0b'}" font-size="13" font-weight="600" font-family="monospace">${a.label}</text>`;
      });
    }
    svg += '</svg>';
    return svg;
  },

  // ── Angle on Line ──
  angleLine(opts) {
    const { angle1, angle2, type } = opts;
    const w = 300, h = 120;
    let svg = `<svg viewBox="0 0 ${w} ${h}" class="viz">`;
    if (type === 'straight') {
      // straight line with two angles
      svg += `<line x1="20" y1="80" x2="280" y2="80" stroke="#3f3f46" stroke-width="2"/>`;
      svg += `<line x1="150" y1="80" x2="90" y2="20" stroke="#6366f1" stroke-width="2"/>`;
      // arc for angle1
      svg += `<path d="M 120,80 A 30,30 0 0,1 112,58" fill="none" stroke="#f59e0b" stroke-width="1.5"/>`;
      svg += `<text x="96" y="70" fill="#f59e0b" font-size="13" font-weight="600" font-family="monospace">${angle1}°</text>`;
      // arc for angle2
      svg += `<path d="M 180,80 A 30,30 0 0,0 112,58" fill="none" stroke="#71717a" stroke-width="1.5"/>`;
      svg += `<text x="170" y="58" fill="#71717a" font-size="13" font-family="monospace">${angle2 || '?'}°</text>`;
    } else if (type === 'vertically_opposite') {
      // two crossing lines
      svg += `<line x1="20" y1="100" x2="280" y2="20" stroke="#3f3f46" stroke-width="2"/>`;
      svg += `<line x1="20" y1="20" x2="280" y2="100" stroke="#3f3f46" stroke-width="2"/>`;
      svg += `<text x="130" y="40" fill="#f59e0b" font-size="13" font-weight="600" font-family="monospace">${angle1}°</text>`;
      svg += `<text x="140" y="90" fill="#71717a" font-size="13" font-family="monospace">?°</text>`;
    } else if (type === 'triangle') {
      svg += `<polygon points="150,15 50,100 250,100" fill="none" stroke="#6366f1" stroke-width="2"/>`;
      svg += `<text x="150" y="12" text-anchor="middle" fill="#f59e0b" font-size="12" font-family="monospace">?°</text>`;
    } else if (type === 'polygon') {
      // generic polygon label
      const sides = opts.sides || 6;
      const r = 45, cx = 150, cy = 55;
      let points = '';
      for (let i = 0; i < sides; i++) {
        const a = (Math.PI * 2 * i / sides) - Math.PI / 2;
        points += `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)} `;
      }
      svg += `<polygon points="${points}" fill="rgba(99,102,241,0.1)" stroke="#6366f1" stroke-width="2"/>`;
      svg += `<text x="${cx}" y="${cy + r + 20}" text-anchor="middle" fill="#71717a" font-size="11" font-family="monospace">${sides} sides</text>`;
    }
    svg += '</svg>';
    return svg;
  },

  // ── Bar Model (ratio / comparison) ──
  barModel(opts) {
    const { groups, colors, labels } = opts;
    const w = 380, pad = 10, barH = 32;
    const total = groups.reduce((s, g) => s + g, 0);
    const h = pad * 2 + barH + 24;
    let svg = `<svg viewBox="0 0 ${w} ${h}" class="viz">`;
    let x = pad;
    groups.forEach((count, gi) => {
      const gw = ((w - 2 * pad) * count) / total;
      svg += `<rect x="${x}" y="${pad}" width="${gw - 2}" height="${barH}" rx="6" fill="${colors[gi] || 'rgba(99,102,241,0.25)'}" stroke="#3f3f46" stroke-width="1"/>`;
      svg += `<text x="${x + gw/2}" y="${pad + 21}" text-anchor="middle" fill="#e4e4e7" font-size="13" font-weight="600" font-family="monospace">${labels ? labels[gi] : count}</text>`;
      x += gw;
    });
    svg += '</svg>';
    return svg;
  },

  // ── Dice ──
  dice(opts) {
    const { face } = opts;
    const s = 56;
    const dots = {
      1: [[28,28]], 2: [[16,16],[40,40]], 3: [[16,16],[28,28],[40,40]],
      4: [[16,16],[40,16],[16,40],[40,40]], 5: [[16,16],[40,16],[28,28],[16,40],[40,40]],
      6: [[16,16],[40,16],[16,28],[40,28],[16,40],[40,40]]
    };
    let svg = `<svg viewBox="0 0 ${s} ${s}" class="viz" style="max-width:56px">`;
    svg += `<rect x="2" y="2" width="${s-4}" height="${s-4}" rx="8" fill="rgba(255,255,255,0.06)" stroke="#3f3f46" stroke-width="2"/>`;
    (dots[face] || dots[1]).forEach(([cx,cy]) => {
      svg += `<circle cx="${cx}" cy="${cy}" r="5" fill="#e4e4e7"/>`;
    });
    svg += '</svg>';
    return svg;
  },

  // ── Coin ──
  coin() {
    let svg = '<svg viewBox="0 0 60 60" class="viz" style="max-width:60px">';
    svg += '<circle cx="30" cy="30" r="26" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="2"/>';
    svg += '<text x="30" y="36" text-anchor="middle" fill="#f59e0b" font-size="16" font-weight="700" font-family="serif">H/T</text>';
    svg += '</svg>';
    return svg;
  },

  // ── Bag of marbles ──
  bag(opts) {
    const { red, blue, green } = opts;
    const items = [];
    for (let i = 0; i < (red||0); i++) items.push('#ef4444');
    for (let i = 0; i < (blue||0); i++) items.push('#3b82f6');
    for (let i = 0; i < (green||0); i++) items.push('#22c55e');
    const w = Math.max(items.length * 28 + 20, 120), h = 60;
    let svg = `<svg viewBox="0 0 ${w} ${h}" class="viz">`;
    items.forEach((c, i) => {
      svg += `<circle cx="${20 + i * 28}" cy="30" r="11" fill="${c}" opacity="0.7"/>`;
      svg += `<circle cx="${20 + i * 28}" cy="30" r="11" fill="none" stroke="${c}" stroke-width="2"/>`;
    });
    svg += '</svg>';
    return svg;
  },

  // ── Data set visual (bar chart for averages) ──
  dataSet(opts) {
    const { values, highlight } = opts;
    const w = 320, h = 90, pad = 20;
    const max = Math.max(...values);
    const barW = (w - 2 * pad) / values.length - 4;
    let svg = `<svg viewBox="0 0 ${w} ${h}" class="viz">`;
    values.forEach((v, i) => {
      const x = pad + i * (barW + 4);
      const bh = (v / max) * (h - 2 * pad - 10);
      const y = h - pad - bh;
      const isHl = highlight !== undefined && i === highlight;
      svg += `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="3" fill="${isHl ? '#6366f1' : 'rgba(99,102,241,0.3)'}" />`;
      svg += `<text x="${x + barW/2}" y="${h - 6}" text-anchor="middle" fill="#71717a" font-size="11" font-family="monospace">${v}</text>`;
    });
    svg += '</svg>';
    return svg;
  },

  // ── Arrow multiplication visual ──
  multiply(opts) {
    const { a, op, b } = opts;
    const w = 280, h = 50;
    let svg = `<svg viewBox="0 0 ${w} ${h}" class="viz">`;
    svg += `<text x="40" y="32" text-anchor="middle" fill="#e4e4e7" font-size="20" font-weight="700" font-family="monospace">${a}</text>`;
    svg += `<text x="100" y="32" text-anchor="middle" fill="#6366f1" font-size="20" font-weight="700" font-family="monospace">${op}</text>`;
    svg += `<text x="160" y="32" text-anchor="middle" fill="#e4e4e7" font-size="20" font-weight="700" font-family="monospace">${b}</text>`;
    svg += `<text x="205" y="32" text-anchor="middle" fill="#71717a" font-size="20" font-family="monospace">=</text>`;
    svg += `<text x="245" y="32" text-anchor="middle" fill="#f59e0b" font-size="20" font-weight="700" font-family="monospace">?</text>`;
    svg += '</svg>';
    return svg;
  },

  // ── Sequence visual ──
  sequence(opts) {
    const { terms, arrows } = opts;
    const w = terms.length * 64 + 20, h = 60;
    let svg = `<svg viewBox="0 0 ${w} ${h}" class="viz">`;
    terms.forEach((t, i) => {
      const x = 10 + i * 64;
      svg += `<rect x="${x}" y="16" width="52" height="34" rx="8" fill="${t === '?' ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.12)'}" stroke="${t === '?' ? '#f59e0b' : '#3f3f46'}" stroke-width="1.5"/>`;
      svg += `<text x="${x+26}" y="39" text-anchor="middle" fill="${t === '?' ? '#f59e0b' : '#e4e4e7'}" font-size="15" font-weight="600" font-family="monospace">${t}</text>`;
      if (i < terms.length - 1 && arrows) {
        svg += `<text x="${x + 56}" y="38" fill="#71717a" font-size="14" font-family="monospace">→</text>`;
      }
    });
    svg += '</svg>';
    return svg;
  },

  // ── Two coins ──
  twoCoins() {
    let svg = '<svg viewBox="0 0 130 60" class="viz" style="max-width:130px">';
    [30, 90].forEach(cx => {
      svg += `<circle cx="${cx}" cy="30" r="24" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" stroke-width="2"/>`;
      svg += `<text x="${cx}" y="36" text-anchor="middle" fill="#f59e0b" font-size="14" font-weight="700" font-family="serif">H/T</text>`;
    });
    svg += '</svg>';
    return svg;
  },

  // ── Equation visual ──
  equation(opts) {
    const { text } = opts;
    const w = 340, h = 44;
    let svg = `<svg viewBox="0 0 ${w} ${h}" class="viz">`;
    svg += `<rect x="4" y="4" width="${w-8}" height="${h-8}" rx="8" fill="rgba(99,102,241,0.08)" stroke="#3f3f46" stroke-width="1"/>`;
    svg += `<text x="${w/2}" y="29" text-anchor="middle" fill="#e4e4e7" font-size="17" font-weight="600" font-family="monospace">${text}</text>`;
    svg += '</svg>';
    return svg;
  },

  // ── Percentage bar ──
  percentBar(opts) {
    const { total, percent, label } = opts;
    const w = 340, h = 50, pad = 10;
    const barW = w - 2 * pad;
    const fillW = barW * (percent / 100);
    let svg = `<svg viewBox="0 0 ${w} ${h}" class="viz">`;
    svg += `<rect x="${pad}" y="12" width="${barW}" height="24" rx="6" fill="rgba(255,255,255,0.05)" stroke="#2a2a2d" stroke-width="1"/>`;
    svg += `<rect x="${pad}" y="12" width="${fillW}" height="24" rx="6" fill="rgba(99,102,241,0.35)"/>`;
    svg += `<text x="${pad + barW/2}" y="29" text-anchor="middle" fill="#e4e4e7" font-size="12" font-weight="600" font-family="monospace">${label || percent+'%'}</text>`;
    svg += `<text x="${pad}" y="48" fill="#71717a" font-size="10" font-family="monospace">0</text>`;
    svg += `<text x="${pad + barW}" y="48" text-anchor="end" fill="#71717a" font-size="10" font-family="monospace">${total}</text>`;
    svg += '</svg>';
    return svg;
  }

};

function renderVisual(v) {
  if (!v) return '';
  const fn = VIZ[v.fn];
  if (!fn) return '';
  return '<div class="quiz-visual">' + fn(v.opts) + '</div>';
}
