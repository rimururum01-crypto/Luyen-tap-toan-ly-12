/* ============================================================
   STORE — lưu trạng thái học tập bằng localStorage
   Mọi dữ liệu cá nhân (tiến độ, ghi chú, flashcard) lưu ở đây.
   ============================================================ */
(function (G) {
'use strict';

const KEY = 'ontap1212.v1';

const DEFAULTS = {
  version: 1,
  dark: false,
  attempts: {},        // questionId -> mảng các lần làm {answer, correct, at}
  understood: {},      // questionId -> true
  notUnderstood: {},   // questionId -> true
  marked: {},          // questionId -> true
  bookmarks: {},       // lessonId -> true
  notes: {},           // key -> {text, at}
  flashcards: {},      // questionId -> {front, back}
  lastRoute: null,
  lastSubject: 'toan',
  filters: {}
};

let cache = null;

function load() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = Object.assign({}, DEFAULTS, raw ? JSON.parse(raw) : {});
  } catch (err) {
    console.warn('[store] dữ liệu hỏng, khởi tạo lại:', err);
    cache = Object.assign({}, DEFAULTS);
  }
  return cache;
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(cache)); }
  catch (err) { console.error('[store] không thể lưu:', err); G.UI.toast('Không thể lưu dữ liệu — bộ nhớ trình duyệt đầy?', 'bad'); }
}

function touch() { load(); save(); }

/* ====== TIẾN ĐỘ CÂU HỎI ====== */
function recordAttempt(questionId, answer, correct) {
  touch();
  const list = cache.attempts[questionId] || (cache.attempts[questionId] = []);
  list.push({ answer: answer, correct: !!correct, at: Date.now() });
  if (list.length > 60) list.shift();
  save();
}

function attemptsOf(questionId) { return load().attempts[questionId] || []; }

function statsOf(questionId) {
  const list = attemptsOf(questionId);
  let right = 0;
  list.forEach(function (a) { if (a.correct) right++; });
  return { total: list.length, right: right, wrong: list.length - right, last: list.length ? list[list.length - 1] : null };
}

function allAttempts() {
  const out = [];
  const data = load().attempts;
  Object.keys(data).forEach(function (qid) {
    data[qid].forEach(function (a) {
      out.push({ questionId: qid, answer: a.answer, correct: a.correct, at: a.at });
    });
  });
  out.sort(function (a, b) { return b.at - a.at; });
  return out;
}

/* ====== TRẠNG THÁI ====== */
function setFlag(store, id, value) {
  touch();
  if (value) cache[store][id] = Date.now(); else delete cache[store][id];
  save();
}
function getFlag(store, id) { return !!load()[store][id]; }

function statusOf(questionId) {
  const d = load();
  const s = statsOf(questionId);
  if (d.notUnderstood[questionId]) return 'chua-hieu';
  if (s.total && s.right === s.total && d.understood[questionId]) return 'nam-vung';
  if (s.total && s.right > 0 && s.right < s.total) return 'dang-co-cung';
  if (s.total === 0) return 'chua-hoc';
  if (s.right === 0) return 'can-hoc';
  return 'dang-co-cung';
}

const STATUS_LABEL = {
  'chua-hoc': 'Chưa học',
  'can-hoc': 'Cần học',
  'dang-co-cung': 'Đang củng cố',
  'nam-vung': 'Đã nắm vững',
  'chua-hieu': 'Chưa hiểu'
};

/* ====== CÀI ĐẶT ====== */
const settings = {
  get: function (k) { return load()[k]; },
  set: function (k, v) { touch(); cache[k] = v; save(); },
  setDark: function (v) { touch(); cache.dark = !!v; save(); }
};

/* ====== GHI CHÚ ====== */
function setNote(key, text) {
  touch();
  if (text && text.trim()) cache.notes[key] = { text: text, at: Date.now() };
  else delete cache.notes[key];
  save();
}
function getNote(key) { const n = load().notes[key]; return n ? n.text : ''; }
function allNotes() { return load().notes; }

/* ====== FLASHCARD ====== */
function saveCard(questionId, front, back) {
  touch();
  cache.flashcards[questionId] = { front: front, back: back, at: Date.now() };
  save();
}
function removeCard(questionId) { touch(); delete cache.flashcards[questionId]; save(); }
function allCards() { return load().flashcards; }
function getCard(questionId) { return load().flashcards[questionId]; }

/* ====== BỘ LỌC & ROUTE ====== */
function setFilter(k, v) { touch(); cache.filters[k] = v; save(); }
function getFilter(k) { return load().filters[k]; }
function setRoute(r) { touch(); cache.lastRoute = r; save(); }
function setLastSubject(s) { touch(); cache.lastSubject = s; save(); }

/* ====== XOÁ DỮ LIỆU ====== */
function reset() {
  try { localStorage.removeItem(KEY); } catch (err) { console.error(err); }
  cache = Object.assign({}, DEFAULTS);
}
function exportData() { return JSON.stringify(load(), null, 2); }
function importData(json) {
  const obj = JSON.parse(json);
  if (!obj || typeof obj !== 'object') throw new Error('Định dạng không hợp lệ');
  cache = Object.assign({}, DEFAULTS, obj);
  save();
}

G.Store = {
  recordAttempt: recordAttempt,
  attemptsOf: attemptsOf,
  statsOf: statsOf,
  allAttempts: allAttempts,
  setFlag: setFlag,
  getFlag: getFlag,
  isMarked: function (id) { return getFlag('marked', id); },
  isUnderstood: function (id) { return getFlag('understood', id); },
  isNotUnderstood: function (id) { return getFlag('notUnderstood', id); },
  isBookmarked: function (id) { return getFlag('bookmarks', id); },
  statusOf: statusOf,
  STATUS_LABEL: STATUS_LABEL,
  settings: settings,
  setNote: setNote,
  getNote: getNote,
  allNotes: allNotes,
  saveCard: saveCard,
  removeCard: removeCard,
  allCards: allCards,
  getCard: getCard,
  setFilter: setFilter,
  getFilter: getFilter,
  setRoute: setRoute,
  setLastSubject: setLastSubject,
  getLastSubject: function () { return load().lastSubject; },
  reset: reset,
  exportData: exportData,
  importData: importData
};

})(typeof window !== 'undefined' ? window : globalThis);