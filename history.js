/* ============================================================
   VIEW: ÔN TẬP CỦA TÔI · LỊCH SỬ · SỔ TAY · CẦN CỦNG CỐ · CÀI ĐẶT
   ============================================================ */
(function (G) {
'use strict';

const C = G.CURRICULUM, ML = G.MathLib, S = G.Store, U = G.UI, esc = ML.esc;

const FILTERS = {
  wrong: { title: 'Câu trả lời sai', pick: wrongLast },
  correct: { title: 'Câu trả lời đúng', pick: rightLast },
  notunderstood: { title: 'Câu chưa hiểu', pick: notUnderstood },
  flagged: { title: 'Câu đã đánh dấu', pick: flagged },
  all: { title: 'Tất cả câu đã làm', pick: attempted },
  undone: { title: 'Câu chưa từng làm', pick: neverDone }
};

function attempted(all) {
  return all.filter(function (q) { return S.attempts.all(q.id).length > 0; });
}
function wrongLast(all) {
  return all.filter(function (q) { const a = S.attempts.all(q.id); return a.length && !a[a.length - 1].correct; });
}
function rightLast(all) {
  return all.filter(function (q) { const a = S.attempts.all(q.id); return a.length && a[a.length - 1].correct; });
}
function notUnderstood(all) {
  return all.filter(function (q) { return S.data().understood[q.id] === false; });
}
function flagged(all) {
  const set = S.flagged.ids();
  return all.filter(function (q) { return set.indexOf(q.id) >= 0; });
}
function neverDone(all) {
  return all.filter(function (q) { return S.attempts.all(q.id).length === 0; });
}

/* ---------- Bộ lọc dùng chung ---------- */
function filterBar(subject, cog, chapterId) {
  const sub = C.getSubject(subject);
  let chOpts = '<option value="">Tất cả chương</option>';
  sub.semesters.forEach(function (sem) {
    sem.chapters.forEach(function (ch) {
      chOpts += '<option value="' + ch.id + '"' + (chapterId === ch.id ? ' selected' : '') + '>' + esc(ch.name) + '</option>';
    });
  });
  const cogOpts = '<option value="ALL">Tất cả mức độ</option>' +
    ['NB', 'TH', 'VD', 'VDC'].map(function (k) {
      return '<option value="' + k + '"' + (cog === k ? ' selected' : '') + '>' + U.COG_LABEL[k] + '</option>';
    }).join('');
  return '<form class="filters" data-act="filterForm">' +
    '<label>Môn<select name="subject">' +
    ['toan', 'ly'].map(function (s) { return '<option value="' + s + '"' + (s === subject ? ' selected' : '') + '>' + C.getSubject(s).name + '</option>'; }).join('') +
    '</select></label>' +
    '<label>Chương<select name="chapter">' + chOpts + '</select></label>' +
    '<label>Mức độ nhận thức<select name="cog">' + cogOpts + '</select></label>' +
    '<input type="hidden" name="kind" value="">' +
    '</form>';
}

/* ---------- Danh sách câu hỏi ---------- */
function qRow(q) {
  const les = C.getLesson(q.lessonId);
  const a = S.attempts.all(q.id);
  const last = a.length ? a[a.length - 1] : null;
  const und = S.data().understood[q.id];
  let stateChip;
  if (!a.length) stateChip = U.chip('Chưa làm', 'neutral');
  else if (last.correct) stateChip = U.chip('Đúng lần gần nhất', 'ok');
  else stateChip = U.chip('Chưa đúng lần gần nhất', 'bad');
  return '<a class="qrow" href="#/question?id=' + q.id + '&mode=review">' +
    '<div class="qrow__main"><div class="qrow__q" data-tex="' + esc(q.question.slice(0, 160)) + '"></div>' +
    '<div class="qrow__meta">' + esc(les ? les.name : q.lessonId) + ' · ' + esc(C.getTopic(q.topicId) ? C.getTopic(q.topicId).name : '') +
    ' · ' + U.COG_LABEL[q.cognitive] + (a.length ? ' · ' + a.length + ' lần làm' : '') + '</div></div>' +
    '<div class="qrow__tags">' + stateChip +
    (und === true ? U.chip('Đã hiểu', 'ok') : '') +
    (und === false ? U.chip('Chưa hiểu', 'warn') : '') +
    (S.flagged.get(q.id) ? U.chip('Đã đánh dấu', 'warn') : '') +
    '</div></a>';
}

/* ---------- Ôn tập của tôi ---------- */
function myView(params) {
  const subject = params.subject === 'ly' ? 'ly' : 'toan';
  const cog = params.cog === 'ALL' ? null : params.cog;
  const chapterId = params.chapter || null;
  const pool = ML.Bank.filter({ subject: subject, chapterId: chapterId, cognitive: cog });

  let h = '';
  h += '<div class="page-head"><h1>Ôn tập của tôi</h1>' +
    '<p class="muted">Toàn bộ câu hỏi bạn đã làm, kèm lựa chọn của lần trước, đáp án đúng và trạng thái ôn tập. Bạn có thể làm lại mà không mất lịch sử cũ.</p></div>';
  h += filterBar(subject, cog || 'ALL', chapterId);
  h += '<div class="segment" style="margin-bottom:14px">' +
    Object.keys(FILTERS).map(function (k) {
      return '<button class="segment__btn' + ((params.kind || 'all') === k ? ' is-active' : '') +
        '" data-act="setKind" data-kind="' + k + '">' + FILTERS[k].title + ' (' + FILTERS[k].pick(pool).length + ')</button>';
    }).join('') + '</div>';

  const kind = params.kind || 'all';
  const list = FILTERS[kind] ? FILTERS[kind].pick(pool) : attempted(pool);
  h += '<div class="btn-row"><a class="btn btn--primary" href="#/review?kind=wrong&subject=' + subject + '">Luyện riêng: chỉ câu sai</a>' +
    '<a class="btn" href="#/review?kind=notunderstood&subject=' + subject + '">Câu chưa hiểu</a>' +
    '<a class="btn" href="#/review?kind=flagged&subject=' + subject + '">Câu đã đánh dấu</a></div>';

  if (!list.length) {
    h += U.empty('Chưa có câu nào trong nhóm này',
      'Nhóm "' + (FILTERS[kind] ? FILTERS[kind].title : '') + '" hiện chưa có câu phù hợp với bộ lọc của bạn.',
      '<a class="btn btn--primary" href="#/practice?subject=' + subject + '">Đi luyện tập</a>');
  } else {
    h += U.card(FILTERS[kind] ? FILTERS[kind].title : 'Danh sách câu hỏi',
      '<div class="list">' + list.slice(0, 60).map(qRow).join('') + '</div>' +
      (list.length > 60 ? '<p class="muted small">Hiển thị 60/' + list.length + ' câu. Hãy thu hẹp bộ lọc để xem đầy đủ hơn.</p>' : ''),
      { flush: true, bodyClass: 'card__body card__body--list' });
  }
  return h;
}
/* ---------- Lịch sử luyện tập: mọi lần làm đều được giữ riêng ---------- */
function historyView(params) {
  const subject = params.subject;
  let attempts = ML.Bank.all().filter(function (q) { return S.attempts.all(q.id).length > 0; });
  if (subject) attempts = attempts.filter(function (q) { return q.subject === subject; });
  attempts.sort(function (a, b) {
    const ta = S.attempts.all(a.id).slice(-1)[0].at;
    const tb = S.attempts.all(b.id).slice(-1)[0].at;
    return tb - ta;
  });

  let h = '';
  h += '<div class="page-head"><h1>Lịch sử luyện tập</h1>' +
    '<p class="muted">Mỗi lần làm bài được lưu riêng, không bị gộp thành một kết quả duy nhất — nên bạn phân biệt được lần trả lời trước với lần sau.</p></div>';
  h += '<div class="segment" style="margin-bottom:14px">' +
    ['', 'toan', 'ly'].map(function (s) {
      return '<button class="segment__btn' + ((params.subject || '') === s ? ' is-active' : '') +
        '" data-route="#/history' + (s ? '?subject=' + s : '') + '">' + (s ? C.getSubject(s).name : 'Cả hai môn') + '</button>';
    }).join('') + '</div>';

  const sessions = S.sessions.all();
  if (sessions.length) {
    h += U.card('Các phiên luyện tập gần đây',
      '<div class="list">' + sessions.slice(0, 10).map(function (ss) {
        return '<div class="sess"><div><b>' + esc(C.getSubject(ss.subject) ? C.getSubject(ss.subject).name : ss.subject) + '</b>' +
          ' — ' + ss.ids.length + ' câu<div class="muted small">' + esc(ss.label || '') + ' · ' + U.fmtDate(ss.at) + '</div></div></div>';
      }).join('') + '</div>');
  }

  if (!attempts.length) {
    h += U.empty('Chưa có lịch sử làm bài', 'Mỗi câu bạn làm đều được ghi lại tại đây kèm đầy đủ giải thích và trạng thái ôn tập.',
      '<a class="btn btn--primary" href="#/practice?subject=toan">Bắt đầu luyện tập</a>');
    return h;
  }

  h += U.card('Câu hỏi đã làm (' + attempts.length + ')',
    '<div class="list">' + attempts.slice(0, 50).map(function (q) {
      const les = C.getLesson(q.lessonId);
      const log = S.attempts.all(q.id);
      const last = log[log.length - 1];
      return '<div class="hist">' +
        '<div class="hist__main"><a href="#/question?id=' + q.id + '&mode=review"><b>' + esc(les ? les.name : q.lessonId) + '</b></a>' +
        '<div class="qrow__q" data-tex="' + esc(q.question.slice(0, 140)) + '"></div></div>' +
        '<div class="hist__log">' +
        (last.correct ? U.chip('Đúng lần gần nhất', 'ok') : U.chip('Chưa đúng lần gần nhất', 'bad')) +
        U.chip(log.length + ' lần làm', 'neutral') +
        '<span class="muted small">Lần gần nhất: ' + U.fmtDate(last.at) + '</span>' +
        '</div>' +
        '<div class="hist__prev"><span class="muted small">Các lần trả lời trước:</span><ol>' +
        log.slice(0, -1).slice(-4).map(function (a) {
          return '<li class="muted small">' + U.fmtDate(a.at) + ' — ' + (a.correct ? 'đúng' : 'chưa đúng') +
            (a.mode === 'review' ? ' (làm lại)' : '') + '</li>';
        }).join('') + '</ol></div>' +
        '<div class="hist__actions"><a class="btn btn--sm" href="#/question?id=' + q.id + '&mode=review">Mở lại &amp; làm lại</a></div>' +
        '</div>';
    }).join('') + '</div>', { flush: true, bodyClass: 'card__body card__body--list' });
  return h;
}
/* ================= SỔ TAY KIẾN THỨC ================= */
function notesView(params) {
  const formulaKeys = S.formulas.all();
  const noteKeys = S.notes.allKeys();
  const wrongMany = ML.Bank.all().filter(function (q) { return S.attempts.wrongCount(q.id) >= 2; });
  const flaggedLessons = S.theory.flaggedIds().map(function (id) { return C.getLesson(id); }).filter(Boolean);
  const qNotUnderstood = ML.Bank.all().filter(function (q) { return S.data().understood[q.id] === false; });

  let h = '';
  h += '<div class="page-head"><h1>Sổ tay kiến thức</h1>' +
    '<p class="muted">Nơi tự động gom lại công thức bạn đã lưu, các khái niệm dễ nhầm, câu làm sai nhiều lần và chủ đề cần ôn. Bạn cũng có thể tự thêm ghi chú.</p></div>';

  /* 1. Công thức đã lưu */
  h += U.card('Công thức đã lưu (' + formulaKeys.length + ')',
    formulaKeys.length
      ? '<div class="list">' + formulaKeys.map(function (f) {
          const les = C.getLesson(f.key.split('::')[0]);
          return '<div class="notecard"><div class="notecard__head"><b>' + esc(f.title) + '</b>' +
            (les ? '<a class="btn btn--sm btn--ghost" href="#/theory/lesson?id=' + les.id + '">Mở bài: ' + esc(les.name) + '</a>' : '') +
            '<button class="btn btn--sm btn--danger" data-act="formulaDel" data-key="' + esc(f.key) + '">Xóa</button></div>' +
            '<div class="notecard__tex" data-tex="' + esc(f.tex) + '" data-display="1"></div></div>';
        }).join('') + '</div>'
      : '<p class="muted">Chưa có công thức nào. Khi đọc bài lý thuyết, bấm <b>“Lưu vào sổ tay”</b> ở công thức quan trọng.</p>');

  /* 2. Bài đã đánh dấu cần ôn lại */
  h += U.card('Bài lý thuyết được đánh dấu (' + flaggedLessons.length + ')',
    flaggedLessons.length
      ? '<div class="list">' + flaggedLessons.map(function (l) {
          return '<a class="list__item" href="#/theory/lesson?id=' + l.id + '">' +
            '<div class="list__main"><div class="list__title">' + esc(l.name) + '</div>' +
            '<div class="list__sub">' + esc(l.chapterName) + '</div></div>' +
            '<div class="list__meta">' + U.chip('Cần ôn lại', 'warn') + '</div></a>';
        }).join('') + '</div>'
      : '<p class="muted">Chưa có bài nào được đánh dấu. Trong trang bài học, nút <b>“Cần ôn lại”</b> sẽ lưu bài vào đây.</p>');

  /* 3. Câu làm sai nhiều lần */
  h += U.card('Câu làm sai nhiều lần (' + wrongMany.length + ')',
    wrongMany.length
      ? '<div class="list">' + wrongMany.slice(0, 40).map(function (q) {
          return '<a class="list__item" href="#/question?id=' + q.id + '&mode=review">' +
            '<div class="list__main"><div class="list__title" data-tex="' + esc(q.question.slice(0, 120)) + '"></div>' +
            '<div class="list__sub">' + esc(C.getTopic(q.topicId) ? C.getTopic(q.topicId).name : '') + ' · sai ' + S.attempts.wrongCount(q.id) + ' lần</div></div>' +
            '<div class="list__meta">' + U.chip('Làm lại', 'bad') + '</div></a>';
        }).join('') + '</div>'
      : '<p class="muted">Chưa có câu nào bị sai từ hai lần trở lên. Hãy tiếp tục luyện các bài mới.</p>');

  /* 4. Câu chưa hiểu sau lời giải */
  h += U.card('Câu đã xem lời giải nhưng vẫn chưa hiểu (' + qNotUnderstood.length + ')',
    qNotUnderstood.length
      ? '<div class="list">' + qNotUnderstood.slice(0, 40).map(function (q) {
          const les = C.getLesson(q.lessonId);
          return '<a class="list__item" href="#/question?id=' + q.id + '&mode=review">' +
            '<div class="list__main"><div class="list__title">' + esc(les ? les.name : q.lessonId) + '</div>' +
            '<div class="list__sub">' + esc(C.getTopic(q.topicId) ? C.getTopic(q.topicId).name : '') + '</div></div>' +
            '<div class="list__meta"><a class="btn btn--sm" href="#/theory/lesson?id=' + q.lessonId + '">Xem lý thuyết</a></div></a>';
        }).join('') + '</div>'
      : '<p class="muted">Chưa có câu nào được đánh dấu “tôi vẫn chưa hiểu”.</p>');

  /* 5. Ghi chú cá nhân */
  let notesHtml = '<p class="muted">Chưa có ghi chú. Trong mỗi bài lý thuyết có mục “Ghi chú của bạn cho bài này”.</p>';
  if (noteKeys.length) {
    notesHtml = '<div class="list">' + noteKeys.map(function (key) {
      const les = C.getLesson(key);
      return '<div class="notecard"><div class="notecard__head"><b>' + esc(les ? les.name : key) + '</b>' +
        (les ? '<a class="btn btn--sm btn--ghost" href="#/theory/lesson?id=' + key + '">Mở nội dung gốc</a>' : '') + '</div>' +
        '<ul class="notes">' + S.notes.list(key).map(function (n, i) {
          return '<li><div class="notes__text">' + esc(n.text) + '</div>' +
            '<div class="notes__meta"><span class="muted small">' + U.fmtDate(n.at) + '</span>' +
            '<button class="btn btn--sm btn--ghost" data-act="noteEdit" data-key="' + esc(key) + '" data-i="' + i + '">Sửa</button>' +
            '<button class="btn btn--sm btn--ghost" data-act="noteDel" data-key="' + esc(key) + '" data-i="' + i + '">Xóa</button></div></li>';
        }).join('') + '</ul></div>';
    }).join('') + '</div>';
  }
  h += U.card('Ghi chú do bạn tự nhập (' + noteKeys.length + ' bài)', notesHtml);
  return h;
}
/*__MISC2__*/


G.VIEWS = G.VIEWS || {};
G.VIEWS.history = historyView;
G.VIEWS.my = myView;

})(typeof window !== 'undefined' ? window : globalThis);