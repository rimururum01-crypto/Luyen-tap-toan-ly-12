/* ============================================================
   VIEW: TRANG TỔNG QUAN HỌC TẬP
   Không dùng điểm số — dùng trạng thái: Cần học / Đang củng cố / Đã nắm vững
   ============================================================ */
(function (G) {
'use strict';

const C = G.CURRICULUM, ML = G.MathLib, S = G.Store, U = G.UI, esc = ML.esc, card = U.card;

/* Trạng thái chủ đề: dựa trên số câu đã làm, đúng lần gần nhất và xác nhận đã hiểu */
function topicState(subject, topicId) {
  const qs = ML.Bank.filter({ subject: subject, topicId: topicId });
  if (!qs.length) return 'nodata';
  let done = 0, correct = 0, wrong = 0, understood = 0;
  qs.forEach(function (q) {
    const a = S.attempts.all(q.id);
    if (!a.length) return;
    done++;
    if (a[a.length - 1].correct) correct++; else wrong++;
    if (S.understood.get(q.id)) understood++;
  });
  if (done === 0) return 'new';
  if (wrong === 0 && correct === qs.length && understood >= Math.ceil(qs.length / 2)) return 'mastered';
  return 'learning';
}
const STATE_TEXT = { new: 'Cần học', learning: 'Đang củng cố', mastered: 'Đã nắm vững', nodata: 'Chưa có câu hỏi' };

function view() {
  const doneIds = Object.keys(S.data().attempts);
  const done = doneIds.length;
  const correctLast = doneIds.filter(function (id) { const a = S.attempts.all(id); return a.length && a[a.length - 1].correct; }).length;
  const wrongLast = done - correctLast;
  const u = S.data().understood;
  const understoodCount = Object.keys(u).filter(function (k) { return u[k] && S.attempts.all(k).length; }).length;
  const notUnderstood = Object.keys(u).filter(function (k) { return u[k] === false && S.attempts.all(k).length; }).length;
  const flagged = S.flagged.ids().length;
  const allLessons = C.allLessons();
  const tMastered = allLessons.filter(function (l) { return S.theory.get(l.lessonId) === 'mastered'; }).length;

  let h = '';
  h += '<div class="page-head overview-hero"><div><div class="eyebrow">GÓC HỌC TẬP CÁ NHÂN</div><h1>Trang tổng quan học tập</h1>' +
       '<p class="muted">Theo dõi tiến độ theo bài học chứ không theo điểm số. Bạn luôn được quyền ôn lại bất kỳ chủ đề nào.</p></div>' +
       '<div class="overview-actions"><a class="btn btn--primary" href="#/practice?subject=toan&random=1">Luyện nhanh Toán</a>' +
       '<a class="btn" href="#/practice?subject=ly&random=1">Luyện nhanh Vật lí</a><a class="btn btn--ghost" href="#/search">Tìm nội dung</a></div></div>';

  h += '<div class="grid grid--4">' +
    stat(ML.Bank.all().length, 'Câu hỏi trong ngân hàng') +
    stat(done, 'Câu đã từng làm') +
    stat(flagged, 'Câu đã đánh dấu ôn') +
    stat(notUnderstood, 'Câu báo "chưa hiểu"') +
    '</div>';
  const generatedStats = G.GENERATED_BANK_STATS || { generatedToan: 0, generatedLy: 0 };
  const generatedCount = generatedStats.generatedToan + generatedStats.generatedLy;
  const originalCount = Math.max(0, ML.Bank.all().length - generatedCount);
  h += '<p class="muted small bank-provenance">Ngân hàng gồm <b>' + generatedCount.toLocaleString('vi-VN') + '</b> biến thể sinh tự động từ mẫu tham số và <b>' + originalCount.toLocaleString('vi-VN') + '</b> câu dữ liệu ban đầu. Các biến thể có thể dùng chung cấu trúc kiến thức; hãy rà soát trước khi sử dụng cho bài kiểm tra chính thức.</p>';
  h += '<div class="grid grid--2">' +
    card('Trạng thái trả lời', '' +
      '<ul class="kv">' +
      kv('Đúng ở lần gần nhất', correctLast + ' câu', 'ok') +
      kv('Chưa đúng ở lần gần nhất', wrongLast + ' câu', 'bad') +
      kv('Đã xác nhận "tôi đã hiểu"', understoodCount + ' câu', 'ok') +
      '</ul>' +
      '<p class="muted small">Đây là trạng thái học tập, không phải điểm số. Một câu trả lời đúng chưa chứng tỏ đã thành thạo — hãy thử câu tương tự để kiểm chứng.</p>' +
      '<div class="btn-row"><a class="btn btn--primary" href="#/review?kind=wrong">Ôn lại câu làm sai</a>' +
      '<a class="btn" href="#/review?kind=notunderstood">Câu chưa hiểu</a>' +
      '<a class="btn" href="#/review?kind=flagged">Câu đã đánh dấu</a></div>') +
    card('Học liệu lý thuyết', '' +
      '<ul class="kv">' +
      kv('Bài đã đọc', theoryTouchedCount() + '/' + allLessons.length + ' bài') +
      kv('Bài ghi nhận "Đã hiểu"', tMastered + ' bài') +
      kv('Bài cần ôn lại', S.theory.flaggedIds().length + ' bài') +
      kv('Bài đã đánh dấu trang', S.theory.bookmarkedIds().length + ' bài') +
      '</ul>' +
      '<p class="muted small">Chủ đề chỉ được xem là "Đã nắm vững" khi bạn làm đúng các câu của chủ đề đó và tự xác nhận đã hiểu.</p>' +
      '<div class="btn-row"><a class="btn btn--primary" href="#/theory">Vào ôn tập lý thuyết</a>' +
      '<a class="btn" href="#/notes">Sổ tay kiến thức</a></div>') +
    '</div>';

  const next = suggestNext();
  if (!next.length) {
    h += card('Nên ôn tiếp theo',
      '<p class="muted">Hiện chưa có câu nào cần ôn lại. Hãy bắt đầu bằng ' +
      '<a href="#/practice?subject=toan">luyện tập Toán 12</a> hoặc <a href="#/practice?subject=ly">luyện tập Vật lí 12</a>.</p>');
  } else {
    h += card('Nên ôn tiếp theo',
      '<div class="list">' + next.map(function (n) {
        return '<a class="list__item" href="' + n.href + '">' +
          '<div class="list__main"><div class="list__title">' + esc(n.title) + '</div>' +
          '<div class="list__sub">' + esc(n.sub) + '</div></div>' +
          '<div class="list__meta">' + U.chip(n.tag, n.kind) + '</div></a>';
      }).join('') + '</div>',
      { headExtra: '<span class="muted small">ưu tiên câu sai nhiều lần và câu chưa xác nhận đã hiểu</span>' });
  }

  ['toan', 'ly'].forEach(function (subj) {
    const sub = C.getSubject(subj);
    let rows = '';
    sub.semesters.forEach(function (sem) {
      sem.chapters.forEach(function (ch) {
        const topics = C.allTopics().filter(function (t) { return t.chapterId === ch.id; });
        const stats = topics.map(function (t) { return topicState(subj, t.topicId); });
        const total = topics.length || 1;
        const mastered = stats.filter(function (s) { return s === 'mastered'; }).length;
        const learning = stats.filter(function (s) { return s === 'learning'; }).length;
        const nodata = stats.filter(function (s) { return s === 'nodata'; }).length;
        const pct = Math.round(mastered / total * 100);
        rows += '<tr><td><a href="#/theory?subject=' + subj + '&chapter=' + ch.id + '">' + esc(ch.name) + '</a>' +
          '<div class="muted small">' + sem.name + ' · ' + topics.length + ' chủ đề' + (nodata ? ' · ' + nodata + ' chưa có câu hỏi' : '') + '</div></td>' +
          '<td class="num">' + mastered + '/' + topics.length + '</td>' +
          '<td class="num">' + learning + '</td>' +
          '<td><div class="bar" title="' + pct + '% chủ đề đã nắm vững"><div class="bar__fill" style="width:' + pct + '%"></div></div></td></tr>';
      });
    });
    h += card(sub.name + ' — tiến độ theo chương',
      '<table class="table"><thead><tr><th>Chương</th><th class="num">Đã nắm</th><th class="num">Đang củng cố</th><th>Mức độ</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table>' +
      '<p class="muted small">Cách xác định trạng thái: "Đã nắm vững" khi bạn làm đúng tất cả câu của chủ đề và xác nhận đã hiểu ít nhất một nửa số câu.</p>',
      { flush: true, bodyClass: 'card__body card__body--table' });
  });
  return h;
}
function stat(v, l) {
  return '<div class="stat"><div class="stat__value">' + v + '</div><div class="stat__label">' + esc(l) + '</div></div>';
}
function kv(k, v, kind) {
  return '<li class="kv__row"><span>' + esc(k) + '</span><b class="' + (kind ? 'tx-' + kind : '') + '">' + esc(String(v)) + '</b></li>';
}
function theoryTouchedCount() {
  return C.allLessons().filter(function (l) { const s = S.theory.get(l.lessonId); return s === 'mastered' || s === 'learning'; }).length;
}
function suggestNext() {
  const out = [];
  const score = {};
  const all = ML.Bank.all();
  Object.keys(S.data().attempts).forEach(function (id) {
    const q = all.find(function (x) { return x.id === id; });
    if (!q) return;
    const a = S.attempts.all(id);
    const wrongs = a.filter(function (x) { return !x.correct; }).length;
    if (S.data().understood[id] === false) score[id] = 100 + wrongs * 10;
    else if (wrongs > 0) score[id] = 50 + wrongs * 10;
    else if (!S.understood.get(id)) score[id] = 20;
  });
  S.flagged.ids().forEach(function (id) { score[id] = (score[id] || 0) + 30; });
  Object.keys(score).sort(function (a, b) { return score[b] - score[a]; }).slice(0, 8).forEach(function (id) {
    const q = all.find(function (x) { return x.id === id; });
    if (!q) return;
    const les = C.getLesson(q.lessonId);
    const tp = C.getTopic(q.topicId);
    const notUnd = S.data().understood[id] === false;
    out.push({
      title: (les ? les.name : q.lessonId) + (tp ? ' — ' + tp.name : ''),
      sub: notUnd ? 'Bạn đã báo "chưa hiểu" sau khi xem lời giải' : 'Câu này từng làm sai hoặc chưa xác nhận đã hiểu',
      href: '#/question?id=' + id + '&mode=review',
      tag: notUnd ? 'Cần ôn gấp' : 'Cần ôn',
      kind: notUnd ? 'bad' : 'warn'
    });
  });
  return out;
}

G.VIEWS = G.VIEWS || {};
G.VIEWS.overview = view;
G.TopicState = { get: topicState, text: STATE_TEXT };

})(typeof window !== 'undefined' ? window : globalThis);