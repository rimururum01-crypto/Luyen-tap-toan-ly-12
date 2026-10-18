/* ============================================================
   LÕI HỆ THỐNG: MathLib (KaTeX + chấm điểm) · Store (localStorage)
   ============================================================ */
(function (G) {
'use strict';

/* ================= MathLib: KaTeX + so sánh đáp án ================= */
function tex(str, display) {
  if (str == null || str === '') return '';
  const s = String(str);
  try {
    /* Chuỗi hỗn hợp: giữ nguyên văn bản thường (đã escape) và render công thức $...$ */
    if (s.indexOf('$') >= 0) {
      let out = '', last = 0, m;
      const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
      while ((m = re.exec(s))) {
        out += esc(s.slice(last, m.index));
        const isDisplay = m[1] !== undefined;
        out += window.katex.renderToString(isDisplay ? m[1] : m[2],
          { displayMode: isDisplay || !!display, throwOnError: false, strict: false });
        last = m.index + m[0].length;
      }
      out += esc(s.slice(last));
      return out;
    }
    return window.katex.renderToString(s, { displayMode: !!display, throwOnError: false, strict: false });
  }
  catch (e) { return '<code>' + esc(s) + '</code>'; }
}
/* Quét các node văn bản còn chứa $...$ (phần giải thích, lý thuyết) và render */
function renderMath(root) {
  if (!root || !window.katex || typeof document === 'undefined' || !document.createTreeWalker) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) {
      if (!n.nodeValue || n.nodeValue.indexOf('$') < 0) return NodeFilter.FILTER_REJECT;
      let el = n.parentElement;
      while (el) {
        if (el.nodeType === 1 && (el.hasAttribute('data-tex') || el.classList.contains('katex') ||
          /^(SCRIPT|STYLE|TEXTAREA|CODE|PRE)$/i.test(el.tagName))) return NodeFilter.FILTER_REJECT;
        el = el.parentElement;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(function (n) {
    const span = document.createElement('span');
    span.innerHTML = tex(n.nodeValue, false);
    n.parentNode.replaceChild(span, n);
  });
}
function renderInto(el) {
  if (!el) return;
  el.querySelectorAll('[data-tex]').forEach(function (n) {
    if (n.dataset.texDone) return;
    n.innerHTML = tex(n.getAttribute('data-tex'), n.getAttribute('data-display') === '1');
    n.dataset.texDone = '1';
  });
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
  });
}

/* Chuẩn hóa số: chấp nhận 0.5 / ,5 / 1/2 / -2e3 */
function parseNum(s) {
  if (s === null || s === undefined) return NaN;
  let t = String(s).trim().replace(/\s+/g, '').replace(/,/g, '.');
  if (t === '') return NaN;
  const frac = t.match(/^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/);
  if (frac) return parseFloat(frac[1]) / parseFloat(frac[2]);
  return parseFloat(t);
}
function checkNumeric(input, numeric) {
  const v = parseNum(input);
  if (isNaN(v)) return { ok: false, reason: 'Đáp án không phải là một số hợp lệ.' };
  const tol = (numeric && numeric.tolerance !== undefined) ? numeric.tolerance : 0;
  if (Math.abs(v - numeric.answer) > tol + 1e-9) return { ok: false, reason: 'Kết quả chưa đúng so với đáp số chuẩn.' };
  if (numeric.unitRequired && numeric.unit) {
    const has = new RegExp(numeric.unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(String(input));
    if (!has) return { ok: false, reason: 'Thiếu đơn vị yêu cầu (' + numeric.unit + ').' };
  }
  return { ok: true };
}

/* So sánh đáp án theo loại câu: mc1 | mcq | tf | short | numeric */
function grade(q, answer) {
  if (answer === null || answer === undefined || answer === '' ||
      (Array.isArray(answer) && answer.length === 0)) {
    return { state: 'blank', correct: false };
  }
  switch (q.type) {
    case 'mc1': {
      const i = Number(answer);
      const ok = i === q.correct;
      return { state: ok ? 'correct' : 'wrong', correct: ok, chosen: i };
    }
    case 'mcq': {
      const chosen = (Array.isArray(answer) ? answer.slice() : [answer]).map(Number).sort(function (a, b) { return a - b; });
      const want = (Array.isArray(q.correct) ? q.correct : [q.correct]).slice().map(Number).sort(function (a, b) { return a - b; });
      const ok = chosen.length === want.length && chosen.every(function (v, k) { return v === want[k]; });
      return { state: ok ? 'correct' : 'wrong', correct: ok, chosen: chosen, want: want,
               missing: want.filter(function (x) { return chosen.indexOf(x) < 0; }),
               extra: chosen.filter(function (x) { return want.indexOf(x) < 0; }) };
    }
    case 'tf': {
      const ok = String(answer) === String(q.correct);
      return { state: ok ? 'correct' : 'wrong', correct: ok };
    }
    case 'short': {
      const norm = function (s) { return String(s).trim().toLowerCase().replace(/\s+/g, ' ').replace(/,/g, '.'); };
      const accept = [q.correct].concat(q.numeric && q.numeric.accept ? q.numeric.accept : []);
      const ok = accept.some(function (a) { return norm(a) === norm(answer); });
      return { state: ok ? 'correct' : 'wrong', correct: ok };
    }
    case 'numeric': {
      const r = checkNumeric(answer, q.numeric);
      return { state: r.ok ? 'correct' : 'wrong', correct: r.ok, reason: r.reason };
    }
    default:
      return { state: 'wrong', correct: false };
  }
}

/* Tập câu hỏi: gộp một lần để tránh cấp phát lại mảng lớn ở mỗi lần lọc. */
let allQuestionsCache = null;
const Bank = {
  all: function () {
    if (!allQuestionsCache) allQuestionsCache = (G.QUESTIONS_TOAN || []).concat(G.QUESTIONS_LY || []);
    return allQuestionsCache;
  },
  byId: function (id) {
    const all = Bank.all();
    for (let i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  },
  bySubject: function (s) { return Bank.all().filter(function (q) { return q.subject === s; }); },
  countByTopic: function (s) {
    const m = {};
    Bank.bySubject(s).forEach(function (q) { m[q.topicId] = (m[q.topicId] || 0) + 1; });
    return m;
  },
  filter: function (f) {
    f = f || {};
    return Bank.all().filter(function (q) {
      if (f.subject && q.subject !== f.subject) return false;
      if (f.chapterId && q.chapterId !== f.chapterId) return false;
      if (f.lessonId && q.lessonId !== f.lessonId) return false;
      if (f.topicId && q.topicId !== f.topicId) return false;
      if (f.cognitive && f.cognitive !== 'ALL' && q.cognitive !== f.cognitive) return false;
      if (f.ids && f.ids.indexOf(q.id) < 0) return false;
      if (f.type && q.type !== f.type) return false;
      if (f.difficulty !== undefined && f.difficulty !== null && f.difficulty !== '' && Number(q.difficulty) !== Number(f.difficulty)) return false;
      return true;
    });
  },
  sample: function (list, n) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return n && n > 0 ? a.slice(0, n) : a;
  },
  /* API tên shuffle được các màn hình sử dụng; dùng cùng thuật toán Fisher–Yates. */
  shuffle: function (list) { return Bank.sample(Array.isArray(list) ? list : Bank.all()); },
  /* Xếp theo mức độ nhận thức tăng dần (học từ dễ đến khó) */
  byLevel: function (arr) {
    const order = { NB: 0, TH: 1, VD: 2, VDC: 3 };
    return (arr || Bank.all()).slice().sort(function (a, b) {
      const d = (order[a.cognitive] - order[b.cognitive]) || (a.difficulty - b.difficulty);
      return d || (a.id < b.id ? -1 : 1);
    });
  },
  similar: function (q, limit) {
    const pool = Bank.filter({ topicId: q.topicId }).filter(function (x) { return x.id !== q.id; });
    const sameCog = pool.filter(function (x) { return x.cognitive === q.cognitive; });
    return Bank.sample(sameCog.length ? sameCog : pool, limit || 3);
  }
};

G.MathLib = { tex: tex, renderInto: renderInto, renderMath: renderMath, esc: esc, parseNum: parseNum, checkNumeric: checkNumeric, grade: grade, Bank: Bank };

/* ================= UI helpers ================= */
function toast(msg, kind) {
  if (typeof document === 'undefined' || !document.getElementById) return;
  const wrap = document.getElementById('toastWrap');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = 'toast toast--' + (kind || 'info');
  el.innerHTML = esc(msg);
  wrap.appendChild(el);
  setTimeout(function () { el.classList.add('is-out'); setTimeout(function () { el.remove(); }, 300); }, 2600);
}
function chip(text, kind) {
  return '<span class="chip chip--' + (kind || 'neutral') + '">' + esc(text) + '</span>';
}
function card(title, body, opts) {
  opts = opts || {};
  let h = '<section class="card' + (opts.flush ? ' card--flush' : '') + '">';
  if (title) h += '<div class="card__head"><h2 class="card__title">' + title + '</h2>' + (opts.headExtra || '') + '</div>';
  h += '<div class="' + (opts.bodyClass || 'card__body') + '">' + body + '</div></section>';
  return h;
}
function empty(title, desc, action) {
  return '<div class="empty"><div class="empty__icon" aria-hidden="true">🗒️</div>' +
    '<h3>' + esc(title) + '</h3><p>' + esc(desc) + '</p>' + (action || '') + '</div>';
}
function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}
const COG_LABEL = { NB: 'Nhận biết', TH: 'Thông hiểu', VD: 'Vận dụng', VDC: 'Vận dụng cao' };
const TYPE_LABEL = { mc1: 'Một đáp án', mcq: 'Nhiều đáp án', tf: 'Đúng/Sai', short: 'Điền ngắn', numeric: 'Điền đáp số' };

G.UI = {
  toast: toast, chip: chip, card: card, empty: empty, emptyState: empty,
  fmtDate: fmtDate, esc: esc, tex: tex, renderInto: renderInto, renderMath: renderMath,
  COG_LABEL: COG_LABEL, TYPE_LABEL: TYPE_LABEL
};
/* ================= Store: localStorage + tiến độ học tập ================= */
const KEY = 'ontap12.v1';

const defaultData = {
  version: 1,
  settings: { dark: false, theme: 'blue' },
  attempts: {},        /* questionId -> [ {answer, correct, at, mode, understood} ] */
  status: {},          /* questionId -> 'new' | 'learning' | 'mastered' */
  understood: {},      /* questionId -> true (đã hiểu sau lời giải) */
  flagged: {},         /* questionId -> true (đánh dấu ôn lại) */
  theoryStatus: {},    /* lessonId -> 'new' | 'learning' | 'mastered' */
  theoryFlagged: {},   /* lessonId -> true */
  bookmarks: {},       /* lessonId -> true */
  notes: {},           /* key -> [{text, at}] */
  formulaSaves: {},    /* formulaKey -> {title, tex, at} */
  sessions: [],        /* [{id, subject, filters, ids, at, done}] */
  currentSession: null /* phiên luyện tập đang dở: {ids, index, subject, label} */
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return JSON.parse(JSON.stringify(defaultData));
    const d = JSON.parse(raw);
    return Object.assign(JSON.parse(JSON.stringify(defaultData)), d);
  } catch (e) { console.warn('[store] lỗi đọc dữ liệu, dùng mặc định', e); return JSON.parse(JSON.stringify(defaultData)); }
}
let data = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(data)); }
  catch (e) { G.UI && G.UI.toast('Không lưu được dữ liệu cục bộ (bộ nhớ có thể đã đầy).', 'bad'); }
}
function reset() {
  if (typeof confirm === 'function' && !confirm('Xóa toàn bộ tiến độ học tập, ghi chú và dữ liệu cá nhân trên máy này? Thao tác không hoàn tác được.')) return;
  data = JSON.parse(JSON.stringify(defaultData));
  save();
  G.UI.toast('Đã xóa toàn bộ dữ liệu học tập.');
  if (G.App && G.App.render) G.App.render();
}
function exportJSON() {
  if (typeof document === 'undefined') { G.UI.toast('Xuất tệp chỉ khả dụng trong trình duyệt.', 'warn'); return; }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ontap-toan-ly-12-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
  G.UI.toast('Đã xuất dữ liệu học tập.');
}
function importJSON(file) {
  const r = new FileReader();
  r.onload = function () {
    try {
      const d = JSON.parse(r.result);
      if (!d || typeof d !== 'object' || !d.attempts) throw new Error('Sai định dạng');
      data = Object.assign(JSON.parse(JSON.stringify(defaultData)), d);
      save();
      G.UI.toast('Đã nhập dữ liệu học tập.');
      G.App.render();
    } catch (e) { G.UI.toast('Tệp không hợp lệ: ' + e.message, 'bad'); }
  };
  r.readAsText(file);
}

const Store = {
  save: save, reset: reset, exportJSON: exportJSON, importJSON: importJSON,
  data: function () { return data; },
  settings: {
    get: function (k) { return data.settings[k]; },
    set: function (k, v) { data.settings[k] = v; save(); },
    setDark: function (on) {
      if (typeof document !== 'undefined' && document.body) document.body.classList.toggle('dark', !!on);
      data.settings.dark = !!on; save();
    }
  },
  attempts: {
    all: function (id) { return data.attempts[id] || []; },
    last: function (id) { const a = data.attempts[id]; return a && a.length ? a[a.length - 1] : null; },
    record: function (id, answer, correct, mode, extra) {
      if (!data.attempts[id]) data.attempts[id] = [];
      const rec = { answer: answer, correct: correct, at: Date.now(), mode: mode || 'practice' };
      if (extra && typeof extra === 'object') Object.assign(rec, extra);
      data.attempts[id].push(rec);
      if (correct) data.status[id] = 'mastered'; else data.status[id] = 'learning';
      save();
      return rec;
    },
    wrongCount: function (id) { return (data.attempts[id] || []).filter(function (a) { return !a.correct; }).length; }
  },
  understood: {
    mark: function (id, v) { data.understood[id] = v !== false; save(); },
    get: function (id) { return !!data.understood[id]; }
  },
  flagged: {
    toggle: function (id) { data.flagged[id] = !data.flagged[id]; save(); return !!data.flagged[id]; },
    get: function (id) { return !!data.flagged[id]; },
    ids: function () { return Object.keys(data.flagged).filter(function (k) { return data.flagged[k]; }); }
  },
  theory: {
    mark: function (lessonId, status) { data.theoryStatus[lessonId] = status; save(); },
    get: function (lessonId) { return data.theoryStatus[lessonId] || 'new'; },
    flag: function (lessonId, v) { data.theoryFlagged[lessonId] = v !== false; save(); },
    flaggedIds: function () { return Object.keys(data.theoryFlagged).filter(function (k) { return data.theoryFlagged[k]; }); },
    bookmark: function (lessonId) { data.bookmarks[lessonId] = !data.bookmarks[lessonId]; save(); return !!data.bookmarks[lessonId]; },
    bookmarkedIds: function () { return Object.keys(data.bookmarks).filter(function (k) { return data.bookmarks[k]; }); }
  },
  notes: {
    list: function (key) { return data.notes[key] || []; },
    add: function (key, text) {
      if (!data.notes[key]) data.notes[key] = [];
      data.notes[key].push({ text: text, at: Date.now() });
      save();
    },
    edit: function (key, i, text) { if (data.notes[key] && data.notes[key][i]) { data.notes[key][i].text = text; save(); } },
    remove: function (key, i) { if (data.notes[key]) { data.notes[key].splice(i, 1); save(); } },
    allKeys: function () { return Object.keys(data.notes).filter(function (k) { return data.notes[k].length; }); }
  },
  formulas: {
    save: function (key, title, texStr) { data.formulaSaves[key] = { title: title, tex: texStr, at: Date.now() }; save(); },
    remove: function (key) { delete data.formulaSaves[key]; save(); },
    has: function (key) { return !!data.formulaSaves[key]; },
    all: function () { return Object.keys(data.formulaSaves).map(function (k) { return Object.assign({ key: k }, data.formulaSaves[k]); }); }
  },
  sessions: {
    add: function (s) { data.sessions.unshift(s); data.sessions = data.sessions.slice(0, 60); save(); },
    all: function () { return data.sessions; }
  },
  session: {
    get: function () { return data.currentSession || null; },
    set: function (s) { data.currentSession = s; save(); },
    clear: function () { data.currentSession = null; save(); }
  }
};

G.Store = Store;
})(typeof window !== 'undefined' ? window : globalThis);