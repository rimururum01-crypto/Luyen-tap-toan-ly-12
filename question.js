/* ============================================================
   VIEW: CÂU HỎI & GIẢI THÍCH (mục 6 của yêu cầu)
   A. Kết quả trả lời   B. Đáp án chính xác   C. Vì sao đúng
   D. Vì sao bạn đúng/sai   E. Phân tích từng phương án
   F. Lời giải từng bước   G. Kiến thức cần củng cố   H. Hành động sau
   Không tự động chuyển câu. Không chỉ hiện dấu tích/X.
   ============================================================ */
(function (G) {
'use strict';

const C = G.CURRICULUM, ML = G.MathLib, S = G.Store, U = G.UI, esc = ML.esc;

function findQuestion(id) {
  return ML.Bank.all().find(function (q) { return q.id === id; }) || null;
}

/* ---------- Vùng nhập/chọn đáp án theo loại câu ---------- */
function inputArea(q, disabled) {
  const d = disabled ? ' disabled' : '';
  switch (q.type) {
    case 'mc1':
      return '<ul class="opts" role="radiogroup" aria-label="Các phương án">' +
        q.options.map(function (o, i) {
          return '<li><label class="opt' + (disabled ? ' is-locked' : '') + '">' +
            '<input type="radio" name="ans" value="' + i + '"' + d + '>' +
            '<span class="opt__key">' + 'ABCD'.charAt(i) + '</span>' +
            '<span class="opt__text" data-tex="' + esc(o) + '"></span></label></li>';
        }).join('') + '</ul>';
    case 'mcq':
      return '<ul class="opts" aria-label="Chọn tất cả phương án đúng">' +
        q.options.map(function (o, i) {
          return '<li><label class="opt' + (disabled ? ' is-locked' : '') + '">' +
            '<input type="checkbox" name="ans" value="' + i + '"' + d + '>' +
            '<span class="opt__key">' + 'ABCD'.charAt(i) + '</span>' +
            '<span class="opt__text" data-tex="' + esc(o) + '"></span></label></li>';
        }).join('') + '</ul>' +
        '<p class="muted small">Chọn đầy đủ các phương án đúng. Chọn thừa hoặc thiếu đều bị tính là chưa đúng.</p>';
    case 'tf':
      return '<div class="segment"><label class="opt opt--inline"><input type="radio" name="ans" value="T"' + d + '> <span>Đúng</span></label>' +
        '<label class="opt opt--inline"><input type="radio" name="ans" value="F"' + d + '> <span>Sai</span></label></div>';
    case 'numeric':
      return '<div class="num-input"><input type="text" name="ans" inputmode="decimal" placeholder="Nhập đáp số"' + d + '>' +
        '<span class="num-input__unit">' + esc((q.numeric && q.numeric.unit) || '') + '</span></div>' +
        (q.numeric && q.numeric.unitRequired ? '<p class="muted small">Nhập cả đơn vị vào ô đáp số, ví dụ: <code>12,5 m/s</code>.</p>' : '');
    default:
      return '<input type="text" name="ans" class="text-input" placeholder="Nhập câu trả lời"' + d + '>';
  }
}

/* ---------- Màn hình câu hỏi ---------- */
function view(params) {
  const q = findQuestion(params.id);
  if (!q) {
    return U.card('Không tìm thấy câu hỏi',
      '<p>Câu hỏi "<b>' + esc(params.id || '') + '</b>" không tồn tại trong ngân hàng câu hỏi.</p>' +
      '<a class="btn btn--primary" href="#/practice?subject=toan">Đến luyện tập</a>');
  }
  const tp = C.getTopic(q.topicId);
  const flagged = S.flagged.get(q.id);
  const state = params.checked ? S.attempts.last(q.id) : null;

  let h = '';
  h += '<nav class="crumbs"><a href="#/practice?subject=' + q.subject + '">Luyện tập</a><span>/</span>' +
    '<b title="' + esc(tp ? tp.name : q.topicId) + '">' + esc(tp ? tp.name : q.topicId) + '</b></nav>';

  h += '<section class="qcard">';
  h += '<div class="qcard__meta">' +
    (params.session ? U.chip('Câu ' + (params.index + 1) + '/' + params.total, 'info') : '') +
    U.chip(U.COG_LABEL[q.cognitive] || q.cognitive, q.cognitive === 'VDC' ? 'warn' : 'info') +
    U.chip(U.TYPE_LABEL[q.type], 'neutral') +
    (flagged ? U.chip('Cần ôn lại', 'warn') : '') +
    '</div>';
  /* Đề bài là văn bản có công thức nội tuyến. Không dùng data-display=1 ở đây:
     chế độ display khiến mọi công thức $...$ bị tách thành từng hàng riêng. */
  h += '<div class="qcard__q" data-tex="' + esc(q.question) + '"></div>';
  h += '<form id="answerForm" data-act="answer" data-id="' + q.id + '" data-mode="' + esc(params.mode || 'practice') + '">';
  h += inputArea(q, !!state);
  h += '<div class="qcard__actions">' +
    (state ? '' : '<button class="btn btn--primary" type="submit" data-act="check">Kiểm tra đáp án</button>') +
    '<button class="btn" type="button" data-act="hint" data-id="' + q.id + '">Gợi ý</button>' +
    '<button class="btn" type="button" data-act="flag" data-id="' + q.id + '">' + (flagged ? 'Bỏ đánh dấu' : 'Đánh dấu') + '</button>' +
    '<a class="btn btn--ghost" href="#/theory/lesson?id=' + q.lessonId + '">Lý thuyết</a>' +
    '</div>';
  h += '<div class="hintbox" id="hintBox" hidden><b>Gợi ý:</b> <span data-tex="' + esc(q.hint || '') + '"></span></div>';
  h += '</form>';
  h += '<div id="feedback"></div>';
  if (state) h += explanationHTML(q, state);
  h += '</section>';

  h += '<div class="btn-row btn-row--end">' + nextButtons(q, params) + '</div>';
  return h;
}

function nextButtons(q, params) {
  let h = '';
  const sess = G.Session && G.Session.get();
  if (params.session && sess && sess.ids.length) {
    if (sess.index >= sess.ids.length - 1) {
      h += '<a class="btn btn--primary" href="#/practice/run?done=1">Hoàn thành phiên →</a>';
    } else {
      h += '<a class="btn btn--primary" href="#/practice/run?next=1">Câu tiếp theo →</a>';
    }
  }
  const similar = ML.Bank.filter({ topicId: q.topicId }).filter(function (x) { return x.id !== q.id; });
  if (similar.length) {
    h += '<a class="btn" href="#/question?id=' + ML.Bank.sample(similar, 1)[0].id + '&mode=similar">Làm một câu tương tự</a>';
  }
  h += '<a class="btn" href="#/practice?lesson=' + q.lessonId + '">Ôn lại toàn bộ bài này</a>';
  h += '<a class="btn btn--ghost" href="#/overview">Trang tổng quan</a>';
  return h;
}
/* ============ A + B: kết quả trả lời và đáp án chính xác ============ */
function answerText(q, ans) {
  if (ans === null || ans === undefined || ans === '' || (Array.isArray(ans) && !ans.length)) return '<i>chưa có</i>';
  if (q.type === 'mc1' || q.type === 'mcq') {
    const list = Array.isArray(ans) ? ans : [ans];
    return list.map(function (i) {
      return '<b>' + 'ABCD'.charAt(Number(i)) + '</b>. <span data-tex="' + esc(q.options[Number(i)] || '') + '"></span>';
    }).join('<br>');
  }
  if (q.type === 'tf') return (ans === 'T' || ans === true || ans === 'true') ? 'Đúng' : 'Sai';
  return '<span data-tex="' + esc(String(ans)) + '"></span>';
}

function resultBanner(q, attempt) {
  let kind, stateText;
  if (attempt.state === 'blank') { kind = 'warn'; stateText = 'Bạn chưa trả lời câu này.'; }
  else if (attempt.correct) { kind = 'ok'; stateText = 'Trả lời đúng.'; }
  else { kind = 'bad'; stateText = 'Trả lời chưa đúng.'; }

  let extra = '';
  if (attempt.state === 'blank') {
    extra = '<p class="fb__note">Hãy chọn một phương án hoặc nhập đáp số rồi bấm "Kiểm tra đáp án". Phần lời giải bên dưới vẫn có sẵn nếu bạn muốn đọc trước.</p>';
  } else if (attempt.state === 'wrong' && q.type === 'mcq') {
    const r = ML.grade(q, attempt.answer);
    extra = '<p class="fb__note">Câu này cần chọn <b>đầy đủ</b> các đáp án đúng.' +
      (r.missing && r.missing.length ? ' Bạn còn thiếu: <b>' + r.missing.map(function (i) { return 'ABCD'.charAt(i); }).join(', ') + '</b>.' : '') +
      (r.extra && r.extra.length ? ' Bạn chọn thừa: <b>' + r.extra.map(function (i) { return 'ABCD'.charAt(i); }).join(', ') + '</b>.' : '') + '</p>';
  } else if (attempt.state === 'wrong' && attempt.reason) {
    extra = '<p class="fb__note">' + esc(attempt.reason) + '</p>';
  }

  const badge = attempt.state === 'blank' ? '• Chưa trả lời' : (attempt.correct ? '✓ Đúng' : '✕ Chưa đúng');
  return '<div class="fb fb--' + kind + '">' +
    '<div class="fb__badge">' + badge + '</div>' +
    '<div class="fb__body"><div class="fb__state">' + esc(stateText) + '</div>' + extra +
    '<dl class="fb__answers">' +
    '<div><dt>Bạn đã chọn</dt><dd>' + (attempt.state === 'blank' ? '<i>chưa có</i>' : answerText(q, attempt.answer)) + '</dd></div>' +
    '<div><dt>Đáp án chính xác</dt><dd class="tx-ok"><b>' + answerText(q, q.correct) + '</b></dd></div>' +
    '</dl>' +
    '</div></div>';
}
/* ============ C + D: giải thích cốt lõi, ngắn gọn như giáo viên ============ */
function whyHTML(q, attempt) {
  const e = q.explain || {};
  let h = '';
  if (e.correct) {
    h += '<div class="exp"><div class="exp__h">Vì sao đáp án này đúng</div><p>' + e.correct + '</p></div>';
  }
  if (attempt.state === 'wrong' && e.wrong) {
    h += '<div class="exp exp--warn"><div class="exp__h">Vì sao câu trả lời của bạn chưa đúng</div><p>' + e.wrong + '</p></div>';
  } else if (attempt.correct) {
    h += '<p class="teacher-note">Tốt. Hãy kiểm tra các bước giải để chắc rằng bạn hiểu cách làm, không chỉ nhớ đáp án.</p>';
  }
  return h;
}

function optionAnalysisHTML(q) {
  const e = q.explain || {};
  if (!e.perOption || !e.perOption.length || (q.type !== 'mc1' && q.type !== 'mcq')) return '';
  return '<div class="exp"><div class="exp__h">Phân tích phương án</div><ul class="anlys">' +
    e.perOption.slice(0, q.options ? q.options.length : 0).map(function (t) { return '<li>' + t + '</li>'; }).join('') +
    '</ul></div>';
}

/* ============ F: lời giải từng bước ============ */
function stepsHTML(q) {
  const st = (q.explain && q.explain.steps) || [];
  if (!st.length) return '';
  return '<div class="exp"><div class="exp__h">Lời giải từng bước</div><ol class="steps">' +
    st.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol></div>';
}
/* ============ G: kiến thức cần củng cố ============ */
function reinforceHTML(q) {
  const e = q.explain || {};
  const tp = C.getTopic(q.topicId);
  const les = C.getLesson(q.lessonId);
  return '<div class="reinf">' +
    '<div class="reinf__col"><h4>Kiến thức liên quan</h4><p>' + (e.related || '') +
    (les ? ' <a href="#/theory/lesson?id=' + les.id + '">Mở bài: ' + esc(les.name) + '</a>' +
      (tp ? ' — chủ đề "' + esc(tp.name) + '"' : '') : '') + '</p></div>' +
    '<div class="reinf__col"><h4>Lỗi dễ mắc</h4><p>' + (e.mistake || '') + '</p></div>' +
    '<div class="reinf__col"><h4>Mẹo ghi nhớ</h4><p>' + (e.tip || '') + '</p></div>' +
    '<div class="reinf__col"><h4>Bạn nên làm gì tiếp theo</h4><p>' + (e.next || '') +
    ' <a href="#/theory/lesson?id=' + q.lessonId + '">Xem lại lý thuyết liên quan</a>.</p></div>' +
    '</div>';
}

/* ============ H: hành động sau khi xem lời giải ============ */
function actionsHTML(q) {
  const und = S.understood.get(q.id);
  const similar = ML.Bank.filter({ topicId: q.topicId }).filter(function (x) { return x.id !== q.id; });
  const simId = similar.length ? ML.Bank.sample(similar, 1)[0].id : '';
  let h = '<div class="fb-actions"><span class="fb-actions__label">Bạn đã hiểu cách giải?</span>' +
    '<button class="btn' + (und === true ? ' btn--primary' : '') + '" type="button" data-act="understood" data-id="' + q.id + '" data-v="1">Đã hiểu</button>' +
    '<button class="btn' + (und === false ? ' btn--danger' : '') + '" type="button" data-act="understood" data-id="' + q.id + '" data-v="0">Cần ôn thêm</button>' +
    '<button class="btn btn--ghost" type="button" data-act="flag" data-id="' + q.id + '">' + (S.flagged.get(q.id) ? 'Bỏ đánh dấu' : 'Đánh dấu') + '</button>' +
    '<a class="btn btn--ghost" href="#/theory/lesson?id=' + q.lessonId + '">Lý thuyết</a>';
  if (simId) h += '<a class="btn btn--ghost" href="#/question?id=' + simId + '&mode=similar">Câu tương tự →</a>';
  return h + '</div>';
}

function detailsHTML(q) {
  const hasMore = (q.explain && q.explain.perOption && q.explain.perOption.length) ||
    (q.explain && (q.explain.related || q.explain.mistake || q.explain.tip || q.explain.next));
  if (!hasMore) return '';
  return '<details class="teacher-more"><summary>Xem phân tích thêm và kiến thức cần nhớ</summary>' +
    '<div class="teacher-more__body">' + optionAnalysisHTML(q) + reinforceHTML(q) + '</div></details>';
}

function explanationHTML(q, attempt) {
  return '<div class="exp-wrap">' + resultBanner(q, attempt) + whyHTML(q, attempt) +
    stepsHTML(q) + detailsHTML(q) + actionsHTML(q) + '</div>';
}

function feedbackHTML(q, attempt) {
  return '<div class="exp-wrap">' + resultBanner(q, attempt) + whyHTML(q, attempt) +
    stepsHTML(q) + detailsHTML(q) + actionsHTML(q) + '</div>';
}

G.QUESTION = { feedbackHTML: feedbackHTML, explanationHTML: explanationHTML, resultBanner: resultBanner, find: findQuestion };

G.VIEWS = G.VIEWS || {};
G.VIEWS.question = view;

})(typeof window !== 'undefined' ? window : globalThis);