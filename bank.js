/* ============================================================
   BANK — ngân hàng câu hỏi tổng hợp + cơ chế chấm điểm
   Hỗ trợ: mc1 (1 đáp án) | mcq (nhiều đáp án, đủ mới đúng)
            tf (Đúng/Sai) | short (điền ngắn) | numeric (điền số)
   ============================================================ */
(function (G) {
'use strict';

/* Tương thích với core.js hiện tại: không ghi đè ngân hàng chuẩn nếu đã được nạp.
   Trước đây hai module Bank khác API có thể khiến shuffle() biến mất tùy thứ tự nạp. */
if (G.MathLib && G.MathLib.Bank) {
  const activeBank = G.MathLib.Bank;
  if (typeof activeBank.shuffle !== 'function' && typeof activeBank.sample === 'function') {
    activeBank.shuffle = function (list) { return activeBank.sample(Array.isArray(list) ? list : activeBank.all()); };
  }
  G.Bank = activeBank;
  return;
}

const ALL = (G.QUESTIONS_TOAN || []).concat(G.QUESTIONS_LY || []);

/* Chuẩn hóa chuỗi để so sánh đáp án ngắn (không phân biệt hoa/thường, dấu cách, dấu thập phân) */
function norm(s) {
  return String(s == null ? '' : s)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/−/g, '-')
    .replace(/[,]/g, '.')
    .replace(/^\s*[,.]/, '')
    .replace(/[,.]\s*$/, '');
}

/* Nhận dạng số: chấp nhận 1,5 hoặc 1.5; phân số a/b; số mũ 2,5.10^3 hoặc 2.5*10^3 */
function parseNumber(raw) {
  if (typeof raw === 'number') return raw;
  let s = String(raw).trim().replace(/\s+/g, '');
  if (!s) return null;
  s = s.replace(/−|–|—/g, '-').replace(/[×·]/g, '*').replace(/10\^/g, 'e');
  const frac = s.match(/^(-?\d+(?:[.,]\d+)?)\/(-?\d+(?:[.,]\d+)?)$/);
  if (frac) {
    const a = Number(frac[1].replace(',', '.'));
    const b = Number(frac[2].replace(',', '.'));
    return b === 0 ? null : a / b;
  }
  if (/^-?\d+(?:[.,]\d+)?(?:e[+-]?\d+)?$/i.test(s)) return Number(s.replace(',', '.'));
  const n = Number(s.replace(',', '.'));
  return isNaN(n) ? null : n;
}

/* ====== CHẤM ĐIỂM ======
   answer: mc1 → index; mcq → mảng index; tf → true/false; short/numeric → chuỗi
   Trả về: { correct, kind: 'ok'|'wrong'|'partial'|'empty', note } */
function grade(q, answer) {
  const t = q.type;

  if (t === 'mc1') {
    if (answer === null || answer === undefined || answer === '') return { correct: false, kind: 'empty', note: 'Bạn chưa chọn đáp án nào.' };
    if (Number(answer) === q.correct) return { correct: true, kind: 'ok', note: 'Chính xác!' };
    return { correct: false, kind: 'wrong', note: 'Đáp án bạn chọn chưa đúng.' };
  }

  if (t === 'mcq') {
    const need = Array.isArray(q.correct) ? q.correct.slice().sort(function (a, b) { return a - b; }) : [];
    const got = Array.isArray(answer) ? answer.slice().sort(function (a, b) { return a - b; }) : [];
    if (!got.length) return { correct: false, kind: 'empty', note: 'Bạn chưa chọn đáp án nào.' };
    const same = need.length === got.length && need.every(function (v, i) { return v === got[i]; });
    if (same) return { correct: true, kind: 'ok', note: 'Chính xác — bạn đã chọn đúng và đủ các phương án.' };
    const hit = got.filter(function (v) { return need.indexOf(v) >= 0; }).length;
    const extra = got.length - hit;
    if (hit > 0) {
      return { correct: false, kind: 'partial',
        note: 'Chọn đúng ' + hit + '/' + need.length + ' phương án' + (extra > 0 ? ' và chọn thừa ' + extra : '') +
              '. Yêu cầu là chọn đầy đủ và không chọn thừa, nên câu này chưa được tính đúng.' };
    }
    return { correct: false, kind: 'wrong', note: 'Chưa có phương án đúng nào được chọn.' };
  }

  if (t === 'tf') {
    if (answer === null || answer === undefined) return { correct: false, kind: 'empty', note: 'Bạn chưa chọn Đúng hay Sai.' };
    if (answer === q.correct) return { correct: true, kind: 'ok', note: 'Chính xác!' };
    return { correct: false, kind: 'wrong', note: 'Đáp án bạn chọn chưa đúng.' };
  }

  if (t === 'short') {
    const s = norm(answer);
    if (!s) return { correct: false, kind: 'empty', note: 'Bạn chưa nhập đáp án.' };
    const num = q.numeric || {};
    const acc = Array.isArray(num.accept) ? num.accept : [num.answer !== undefined ? num.answer : q.correct];
    for (let i = 0; i < acc.length; i++) {
      if (norm(acc[i]) === s) return { correct: true, kind: 'ok', note: 'Chính xác!' };
    }
    return { correct: false, kind: 'wrong', note: 'Đáp án của bạn chưa đúng.' };
  }

  if (t === 'numeric') {
    const raw = String(answer == null ? '' : answer).trim();
    if (!raw) return { correct: false, kind: 'empty', note: 'Bạn chưa nhập kết quả.' };
    const n = parseNumber(raw);
    if (n === null) return { correct: false, kind: 'wrong', note: 'Giá trị bạn nhập không phải là một số hợp lệ.' };
    const num = q.numeric || {};
    const ans = Number(num.answer);
    const tol = num.tolerance === undefined ? 0 : Number(num.tolerance);
    if (Math.abs(n - ans) <= tol) return { correct: true, kind: 'ok', note: 'Chính xác!' };
    return { correct: false, kind: 'wrong', note: 'Kết quả của bạn chưa đúng.' };
  }

  return { correct: false, kind: 'empty', note: 'Dạng câu hỏi chưa được hỗ trợ chấm.' };
}
/* ====== TRUY VẤN ====== */
function all() { return ALL.slice(); }

function byId(id) {
  for (let i = 0; i < ALL.length; i++) if (ALL[i].id === id) return ALL[i];
  return null;
}

function filter(opts) {
  const o = opts || {};
  return ALL.filter(function (q) {
    if (o.subject && q.subject !== o.subject) return false;
    if (o.chapterId && q.chapterId !== o.chapterId) return false;
    if (o.lessonId && q.lessonId !== o.lessonId) return false;
    if (o.topicId && q.topicId !== o.topicId) return false;
    if (o.cognitive && q.cognitive !== o.cognitive) return false;
    if (o.difficulty && Number(o.difficulty) !== Number(q.difficulty)) return false;
    if (o.ids && o.ids.indexOf(q.id) < 0) return false;
    return true;
  });
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

/* Câu hỏi tương tự: cùng chủ đề, ưu tiên cùng mức nhận thức, trừ chính câu vừa làm */
function similar(q, limit) {
  const pool = filter({ topicId: q.topicId }).filter(function (x) { return x.id !== q.id; });
  const sameCog = pool.filter(function (x) { return x.cognitive === q.cognitive; });
  return shuffle(sameCog.length ? sameCog : pool).slice(0, limit || 3);
}

/* Sắp xếp theo mức nhận thức tăng dần để học từ dễ đến khó */
function byLevel(arr) {
  const order = { NB: 0, TH: 1, VD: 2, VDC: 3 };
  return arr.slice().sort(function (a, b) {
    const d = (order[a.cognitive] - order[b.cognitive]) || (a.difficulty - b.difficulty);
    return d || (a.id < b.id ? -1 : 1);
  });
}

function countBy(field) {
  const out = {};
  ALL.forEach(function (q) { out[q[field]] = (out[q[field]] || 0) + 1; });
  return out;
}

function countBySubject(subject) { return ALL.filter(function (q) { return q.subject === subject; }).length; }

function topicHasQuestions(topicId) { return filter({ topicId: topicId }).length > 0; }
function lessonHasQuestions(lessonId) { return filter({ lessonId: lessonId }).length > 0; }

G.Bank = {
  all: all, byId: byId, filter: filter, similar: similar, shuffle: shuffle,
  byLevel: byLevel, countBy: countBy, countBySubject: countBySubject,
  topicHasQuestions: topicHasQuestions, lessonHasQuestions: lessonHasQuestions,
  grade: grade, parseNumber: parseNumber, normalize: norm
};
G.MathLib = G.MathLib || {};
G.MathLib.Bank = G.Bank;
})(typeof window !== 'undefined' ? window : globalThis);