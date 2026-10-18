/* ============================================================
   VIEW: LUYỆN TẬP ỨNG DỤNG
   - /practice       : chọn môn, chương, bài, chủ đề, mức độ, chế độ
   - /practice/run   : làm bài (session)
   - /question       : 1 câu + giải thích đầy đủ
   ============================================================ */
(function (G) {
'use strict';

const C = G.CURRICULUM, ML = G.MathLib, S = G.Store, U = G.UI, esc = ML.esc;

function notFound(title, desc, back) {
  return U.card(title, '<p>' + desc + '</p><a class="btn btn--primary" href="' + (back || '#/overview') + '">Quay lại</a>');
}

function subjectSelect(active) {
  return '<div class="segment" role="tablist" aria-label="Chọn môn học">' +
    ['toan', 'ly'].map(function (s) {
      return '<button class="segment__btn' + (s === active ? ' is-active' : '') + '" role="tab" ' +
        'aria-selected="' + (s === active) + '" data-route="#/practice?subject=' + s + '">' +
        C.getSubject(s).name + '</button>';
    }).join('') + '</div>';
}

function setupView(params) {
  const subject = params.subject === 'ly' ? 'ly' : 'toan';
  const sub = C.getSubject(subject);
  const cog = params.cog || 'ALL';
  const chapterId = params.chapter || '';
  const lessonId = params.lesson || '';
  const topicId = params.topic || '';
  const mode = params.mode || 'mixed';

  /* Nút ngẫu nhiên khởi tạo một phiên thật, không chỉ đổi bộ lọc. */
  if (params.random === '1') {
    const randomList = ML.Bank.shuffle(ML.Bank.filter({ subject: subject })).slice(0, 10);
    if (randomList.length) {
      const ids = randomList.map(function (q) { return q.id; });
      G.Session.set({ ids: ids, index: 0, subject: subject, label: '10 câu ngẫu nhiên', at: Date.now() });
      S.sessions.add({ id: 's' + Date.now(), subject: subject, ids: ids, at: Date.now(), label: '10 câu ngẫu nhiên', filters: { subject: subject, random: true } });
      return G.VIEWS.run({});
    }
  }

  let h = '';
  h += '<div class="page-head"><h1>Luyện tập ứng dụng</h1>' +
       '<p class="muted">Làm bài từ dễ đến khó. Sau mỗi câu, bạn luôn nhận được giải thích đầy đủ — dù trả lời đúng hay sai.</p></div>';
  h += subjectSelect(subject);

  let chOpts = '<option value="">Tất cả chương</option>';
  sub.semesters.forEach(function (sem) {
    sem.chapters.forEach(function (ch) {
      chOpts += '<option value="' + ch.id + '"' + (chapterId === ch.id ? ' selected' : '') + '>' + esc(ch.name) + '</option>';
    });
  });
  let lesOpts = '<option value="">Tất cả bài</option>';
  C.allLessons().filter(function (l) { return l.subjectId === subject && (!chapterId || l.chapterId === chapterId); })
    .forEach(function (l) {
      const n = ML.Bank.filter({ lessonId: l.lessonId }).length;
      lesOpts += '<option value="' + l.lessonId + '"' + (lessonId === l.lessonId ? ' selected' : '') + '>' +
        esc(l.name) + (n ? ' (' + n + ')' : ' (0)') + '</option>';
    });
  const cogOpts = '<option value="ALL">Tất cả mức độ</option>' +
    ['NB', 'TH', 'VD', 'VDC'].map(function (k) {
      return '<option value="' + k + '"' + (cog === k ? ' selected' : '') + '>' + U.COG_LABEL[k] + '</option>';
    }).join('');
  let topicOpts = '<option value="">Tất cả chủ đề</option>';
  C.allTopics().filter(function (t) {
    return t.subjectId === subject && (!chapterId || t.chapterId === chapterId) && (!lessonId || t.lessonId === lessonId);
  }).forEach(function (t) {
    const n = ML.Bank.filter({ topicId: t.topicId }).length;
    topicOpts += '<option value="' + t.topicId + '"' + (topicId === t.topicId ? ' selected' : '') + '>' + esc(t.name) + ' (' + n + ' câu)</option>';
  });

  h += U.card('Chọn nội dung luyện tập',
    '<form id="setupForm" class="setup">' +
    '<div class="setup__row"><label>Môn<select name="subject">' +
      ['toan', 'ly'].map(function (s) { return '<option value="' + s + '"' + (s === subject ? ' selected' : '') + '>' + C.getSubject(s).name + '</option>'; }).join('') +
      '</select></label>' +
    '<label>Chương<select name="chapter">' + chOpts + '</select></label>' +
    '<label>Bài học<select name="lesson">' + lesOpts + '</select></label></div>' +
    '<div class="setup__row"><label>Chủ đề<select name="topic">' + topicOpts + '</select></label>' +
    '<label>Mức độ nhận thức<select name="cog">' + cogOpts + '</select></label>' +
    '<label>Số câu<select name="count">' +
      [5, 8, 10, 15, 20, 0].map(function (n) { return '<option value="' + n + '">' + (n === 0 ? 'Tất cả câu phù hợp' : n + ' câu') + '</option>'; }).join('') +
      '</select></label>' +
    '<label>Chế độ<select name="mode"><option value="mixed"' + (mode === 'mixed' ? ' selected' : '') + '>Hỗn hợp (xếp từ dễ đến khó)</option>' +
      '<option value="level"' + (mode === 'level' ? ' selected' : '') + '>Luyện theo từng mức độ</option></select></label></div>' +
    '<div class="setup__actions"><button class="btn btn--primary" type="submit">Bắt đầu luyện tập</button>' +
    '<button class="btn" type="button" data-route="#/practice?subject=' + subject + '&random=1">Chọn ngẫu nhiên 10 câu</button></div>' +
    '</form>' + coverageNote(subject, { chapterId: chapterId, lessonId: lessonId, topicId: topicId, cog: cog }));
  return h;
}
/* Ghi rõ mức độ bao phủ thực tế, trung thực khi thiếu câu */
function coverageNote(subject, f) {
  const list = ML.Bank.filter({ subject: subject, chapterId: f.chapterId || null, lessonId: f.lessonId || null, topicId: f.topicId || null, cognitive: f.cog || null });
  if (!list.length) {
    return U.card('Khu vực này chưa có câu hỏi',
      '<p>Phạm vi bạn chọn chưa được biên soạn câu hỏi. Bạn có thể chọn phạm vi khác hoặc xem ' +
      '<a href="#/theory?subject=' + subject + '">lý thuyết</a> để học trước.</p>' +
      '<p class="muted small">Các bài chưa có câu hỏi được thể hiện rõ ở trang tổng quan. Chúng tôi không tạo câu hỏi giả để lấp chỗ trống.</p>');
  }
  const byCog = {}, byType = {};
  list.forEach(function (q) { byCog[q.cognitive] = (byCog[q.cognitive] || 0) + 1; byType[q.type] = (byType[q.type] || 0) + 1; });
  return U.card('Có ' + list.length + ' câu phù hợp',
    '<div class="cov">' + ['NB', 'TH', 'VD', 'VDC'].map(function (k) {
      return '<div class="cov__item"><b>' + (byCog[k] || 0) + '</b><span>' + U.COG_LABEL[k] + '</span></div>';
    }).join('') + '</div>' +
    '<div class="bank-types">' + [['mc1','Một đáp án'],['mcq','Nhiều đáp án'],['tf','Đúng / Sai'],['short','Trả lời ngắn'],['numeric','Điền số']].map(function (x) { return '<span><b>' + (byType[x[0]] || 0) + '</b> ' + x[1] + '</span>'; }).join('') + '</div>' +
    '<p class="muted small">Bạn được quyền bắt đầu từ bất kỳ mức nào, không bị ép tăng độ khó chỉ vì đã trả lời đúng một vài câu.</p>',
    { headExtra: '<span class="muted small">mức độ bao phủ thực tế</span>' });
}

/* ---------- Màn hình làm bài ---------- */
function runView(params) {
  let sess = G.Session.get();
  if (!sess || !sess.ids.length) {
    return U.empty('Chưa có phiên luyện tập', 'Hãy chọn chương, bài hoặc chủ đề để bắt đầu.',
      '<a class="btn btn--primary" href="#/practice?subject=toan">Bắt đầu luyện tập</a>');
  }
  if (params.next) {
    sess.index = Math.min(sess.index + 1, sess.ids.length);
    G.Session.set(sess);
  }
  if (params.done || sess.index >= sess.ids.length) return summaryView(sess);
  const id = sess.ids[sess.index];
  return G.VIEWS.question({ id: id, mode: params.mode || 'practice', session: true, index: sess.index, total: sess.ids.length });
}

/* ---------- Tổng kết phiên ---------- */
function summaryView(sess) {
  const res = sess.ids.map(function (id) {
    const q = ML.Bank.all().find(function (x) { return x.id === id; });
    const last = S.attempts.last(id);
    return { q: q, ok: !!(last && last.correct) };
  });
  const right = res.filter(function (r) { return r.ok; }).length;
  let h = '';
  h += '<div class="page-head"><h1>Kết thúc phiên luyện tập</h1>' +
       '<p class="muted">Bạn đã làm ' + res.length + ' câu, trong đó ' + right + ' câu trả lời đúng ở lần gần nhất. ' +
       'Đây chỉ là trạng thái học tập để bạn biết cần ôn gì tiếp theo, không phải điểm số.</p></div>';
  const need = res.filter(function (r) { return !r.ok; });
  if (need.length) {
    h += U.card('Nên ôn lại những câu sau',
      '<div class="list">' + need.map(function (r) {
        const les = C.getLesson(r.q.lessonId);
        return '<a class="list__item" href="#/question?id=' + r.q.id + '&mode=review">' +
          '<div class="list__main"><div class="list__title">' + esc(les ? les.name : r.q.lessonId) + '</div>' +
          '<div class="list__sub">' + esc(C.getTopic(r.q.topicId) ? C.getTopic(r.q.topicId).name : '') + ' · ' + U.COG_LABEL[r.q.cognitive] + '</div></div>' +
          '<div class="list__meta">' + U.chip('Làm lại', 'bad') + '</div></a>';
      }).join('') + '</div>');
  } else {
    h += U.card('Tất cả câu trong phiên này đã đúng ở lần gần nhất',
      '<p>Hãy kiểm tra lại bằng cách xem lời giải của từng câu và xác nhận "tôi đã hiểu" — làm đúng chưa chắc đã hiểu sâu.</p>');
  }
  h += '<div class="btn-row"><a class="btn btn--primary" href="#/practice?subject=' + (res[0] ? res[0].q.subject : 'toan') + '">Luyện tiếp</a>' +
       '<a class="btn" href="#/history">Xem lịch sử luyện tập</a>' +
       '<a class="btn" href="#/overview">Về trang tổng quan</a></div>';
  return h;
}

G.VIEWS = G.VIEWS || {};
G.VIEWS.practice = setupView;
G.VIEWS.practiceSetup = setupView;
G.VIEWS.run = runView;
G.VIEWS.summary = summaryView;
G.VIEWS.notFound = notFound;

G.Session = {
  get: function () { return S.session.get(); },
  set: function (s) { S.session.set(s); },
  clear: function () { S.session.clear(); }
};

})(typeof window !== 'undefined' ? window : globalThis);