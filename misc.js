/* ============================================================
   VIEW PHỤ: Sổ tay kiến thức · Chủ đề cần củng cố · Cài đặt
   ============================================================ */
(function (G) {
'use strict';

const C = G.CURRICULUM, ML = G.MathLib, S = G.Store, U = G.UI, esc = ML.esc;

/* ---------- SỔ TAY KIẾN THỨC ---------- */
function lessonMeta(id) {
  const les = C.getLesson(id);
  return les ? (les.name + ' — ' + les.chapterName) : id;
}

function bookmarkedCard() {
  const ids = S.theory.bookmarkedIds();
  if (!ids.length) return '';
  const items = ids.map(function (id) {
    const les = C.getLesson(id);
    return '<li><a href="#/lesson/' + esc(id) + '">' + esc(les ? les.name : id) + '</a>' +
      ' <span class="muted">· ' + esc(les ? les.chapterName : '') + '</span></li>';
  }).join('');
  return U.card('Bài lý thuyết đã đánh dấu (' + ids.length + ')', '<ul class="link-list">' + items + '</ul>');
}

function notesView(params) {
  const keys = S.notes.allKeys();
  const saved = S.formulas.all();

  let list;
  if (keys.length) {
    list = keys.map(function (k) {
      const items = S.notes.list(k).map(function (n, i) {
        return '<li class="note-item"><div class="note-item__text">' + esc(n.text).replace(/\n/g, '<br>') + '</div>' +
          '<div class="note-item__foot"><span>' + U.fmtDate(n.at) + '</span>' +
          '<button type="button" class="btn btn--sm btn--danger" data-act="note-del" data-key="' + esc(k) + '" data-i="' + i + '">Xóa</button>' +
          '</div></li>';
      }).join('');
      return '<section class="card"><div class="card__head"><h2 class="card__title">' + esc(lessonMeta(k)) + '</h2>' +
        '<a class="btn btn--sm btn--ghost" href="#/lesson/' + esc(k) + '">Mở bài học</a></div>' +
        '<div class="card__body"><ul class="note-list">' + items + '</ul></div></section>';
    }).join('');
  } else {
    list = U.card('Ghi chú của bạn',
      '<p>Bạn chưa có ghi chú nào. Khi đọc lý thuyết, hãy dùng ô <strong>Thêm ghi chú</strong> ở cuối bài để lưu lại điều quan trọng.</p>' +
      '<a class="btn btn--primary" href="#/theory?subject=toan">Đến ôn tập lý thuyết</a>');
  }

  let formulaList = '';
  if (saved.length) {
    formulaList = U.card('Công thức đã lưu (' + saved.length + ')',
      '<div class="grid grid--2">' + saved.map(function (f) {
        return '<div class="formula-save"><div class="formula-save__title">' + esc(f.title) + '</div>' +
          '<div class="formula-save__tex" data-tex="' + esc(f.tex) + '" data-display="1"></div>' +
          '<button type="button" class="btn btn--sm btn--danger" data-act="formula-del" data-key="' + esc(f.key) + '">Bỏ lưu</button></div>';
      }).join('') + '</div>');
  }

  return '<div class="page-head"><h1>Sổ tay kiến thức</h1>' +
    '<p class="muted">Nơi tự động gom ghi chú, công thức đã lưu, bài đã đánh dấu và các chủ đề cần ôn.</p></div>' +
    formulaList + list + bookmarkedCard();
}
/* ---------- CHỦ ĐỀ CẦN CỦNG CỐ ---------- */
function qLine(q, metaExtra) {
  const les = C.getLesson(q.lessonId);
  const tp = C.getTopic(q.topicId);
  return '<a class="list__item" href="#/question?id=' + q.id + '&mode=review">' +
    '<div class="list__main"><div class="list__title" data-tex="' + esc(q.question.slice(0, 140)) + '"></div>' +
    '<div class="list__sub">' + esc(les ? les.name : q.lessonId) + ' · ' + esc(tp ? tp.name : '') +
    ' · ' + U.COG_LABEL[q.cognitive] + (metaExtra ? ' · ' + metaExtra(q) : '') + '</div></div>' +
    '<div class="list__meta">' + U.chip('Làm lại', 'bad') + '</div></a>';
}

function reinforceView(params) {
  const all = ML.Bank.all();
  const notU = all.filter(function (q) { return S.data().understood[q.id] === false; });
  const wrongMany = all.filter(function (q) { return S.attempts.wrongCount(q.id) >= 2; });
  const flaggedQ = S.flagged.ids().map(function (id) { return all.find(function (q) { return q.id === id; }); }).filter(Boolean);
  const flaggedL = S.theory.flaggedIds().map(function (id) { return C.getLesson(id); }).filter(Boolean);

  const topicStats = {};
  all.forEach(function (q) {
    const a = S.attempts.all(q.id);
    if (!a.length) return;
    const t = topicStats[q.topicId] || (topicStats[q.topicId] = { lessonId: q.lessonId, done: 0, wrong: 0 });
    t.done++;
    if (!a[a.length - 1].correct) t.wrong++;
  });
  const weakTopics = Object.keys(topicStats).map(function (k) { return { topicId: k, lessonId: topicStats[k].lessonId, done: topicStats[k].done, wrong: topicStats[k].wrong }; })
    .filter(function (t) { return t.wrong > 0; })
    .sort(function (a, b) { return b.wrong - a.wrong || b.done - a.done; })
    .slice(0, 12);

  let h = '';
  h += '<div class="page-head"><h1>Chủ đề cần củng cố</h1>' +
    '<p class="muted">Danh sách tự động tổng hợp từ lịch sử học tập: câu đánh dấu “tôi vẫn chưa hiểu”, câu làm sai nhiều lần và chủ đề còn trả lời sai ở lần gần nhất. Đây không phải phán xét năng lực — chỉ giúp bạn biết nên quay lại phần nào.</p></div>';

  const groupBtn = function (ids, label) {
    if (!ids.length) return '';
    return '<button class="btn btn--sm btn--primary" data-act="startGroup" data-ids="' + esc(ids.slice(0, 20).join(',')) + '">' + label + '</button>';
  };

  h += U.card('Câu “tôi vẫn chưa hiểu” (' + notU.length + ')',
    notU.length
      ? '<div class="list">' + notU.slice(0, 30).map(function (q) { return qLine(q); }).join('') + '</div>' +
        '<div class="btn-row" style="margin-top:10px">' + groupBtn(notU.map(function (q) { return q.id; }), 'Luyện tập nhóm câu này →') + '</div>'
      : '<p>Chưa có câu nào được đánh dấu “tôi vẫn chưa hiểu”. Sau khi đọc lời giải, nếu cảm thấy chưa đủ sáng tỏ, hãy bấm nút tương ứng trong trang câu hỏi — câu đó sẽ xuất hiện tại đây.</p>');

  h += U.card('Câu làm sai từ hai lần trở lên (' + wrongMany.length + ')',
    wrongMany.length
      ? '<div class="list">' + wrongMany.slice(0, 30).map(function (q) {
          return qLine(q, function (x) { return 'sai ' + S.attempts.wrongCount(x.id) + ' lần'; });
        }).join('') + '</div>' +
        '<div class="btn-row" style="margin-top:10px">' + groupBtn(wrongMany.map(function (q) { return q.id; }), 'Ôn lại nhóm câu này →') + '</div>'
      : '<p>Chưa có câu nào bị sai từ hai lần trở lên. Hãy tiếp tục luyện tập — nếu có, chúng sẽ tự động hiện ở đây.</p>');

  h += U.card('Câu đã đánh dấu cần ôn lại (' + flaggedQ.length + ')',
    flaggedQ.length
      ? '<div class="list">' + flaggedQ.slice(0, 30).map(function (q) { return qLine(q); }).join('') + '</div>' +
        '<div class="btn-row" style="margin-top:10px">' + groupBtn(flaggedQ.map(function (q) { return q.id; }), 'Ôn các câu đã đánh dấu →') + '</div>'
      : '<p>Chưa có câu nào được đánh dấu. Nút <b>“Đánh dấu để ôn lại”</b> trong trang câu hỏi sẽ lưu câu vào đây.</p>');

  h += U.card('Bài lý thuyết được đánh dấu “cần ôn lại” (' + flaggedL.length + ')',
    flaggedL.length
      ? '<div class="list">' + flaggedL.map(function (l) {
          return '<a class="list__item" href="#/theory/lesson?id=' + l.id + '">' +
            '<div class="list__main"><div class="list__title">' + esc(l.name) + '</div>' +
            '<div class="list__sub">' + esc(l.chapterName) + '</div></div>' +
            '<div class="list__meta">' + U.chip('Cần ôn lại', 'warn') + '</div></a>';
        }).join('') + '</div>'
      : '<p>Chưa có bài nào được đánh dấu. Trang bài lý thuyết có nút <b>“Cần ôn lại”</b> ở thanh hành động.</p>');

  h += U.card('Chủ đề còn trả lời sai ở lần gần nhất (' + weakTopics.length + ' chủ đề)',
    weakTopics.length
      ? '<div class="list">' + weakTopics.map(function (t) {
          const les = C.getLesson(t.lessonId);
          const tp = C.getTopic(t.topicId);
          const nQ = ML.Bank.filter({ topicId: t.topicId }).length;
          return '<a class="list__item" href="#/practice?lesson=' + t.lessonId + '">' +
            '<div class="list__main"><div class="list__title">' + esc(tp ? tp.name : t.topicId) + '</div>' +
            '<div class="list__sub">' + esc(les ? les.name : t.lessonId) + ' · đã làm ' + t.done + '/' + nQ + ' câu · lần gần nhất sai ' + t.wrong + '</div></div>' +
            '<div class="list__meta">' + U.chip('Luyện chủ đề này', 'warn') + '</div></a>';
        }).join('') + '</div>'
      : '<p>Chưa có chủ đề nào cần củng cố — hoặc bạn chưa làm bài nào. Trang <a href="#/practice?subject=toan">Luyện tập ứng dụng</a> giúp bạn bắt đầu.</p>');

  return h;
}

/* ---------- LUYỆN RIÊNG (nhóm câu đặc biệt) ---------- */
function reviewView(params) {
  const kind = params.kind || 'wrong';
  const subject = params.subject || null;
  const LABEL = { wrong: 'chỉ câu sai', notunderstood: 'câu chưa hiểu', flagged: 'câu đã đánh dấu', all: 'tất cả câu đã làm' };
  const pool = ML.Bank.filter({ subject: subject });
  let pick;
  if (kind === 'wrong') {
    pick = pool.filter(function (q) { const a = S.attempts.all(q.id); return a.length && !a[a.length - 1].correct; });
  } else if (kind === 'notunderstood') {
    pick = pool.filter(function (q) { return S.data().understood[q.id] === false; });
  } else if (kind === 'flagged') {
    const set = S.flagged.ids();
    pick = pool.filter(function (q) { return set.indexOf(q.id) >= 0; });
  } else {
    pick = pool.filter(function (q) { return S.attempts.all(q.id).length > 0; });
  }
  if (!pick.length) {
    return U.empty('Không có câu nào để luyện trong nhóm này',
      'Hiện chưa có câu phù hợp với yêu cầu “' + (LABEL[kind] || kind) + '”. Hãy làm thêm bài tập — kết quả sẽ tự động cập nhật.',
      '<a class="btn btn--primary" href="#/my?subject=' + (subject || 'toan') + '">Về Ôn tập của tôi</a>');
  }
  const ids = ML.Bank.shuffle(pick).map(function (q) { return q.id; });
  const subj = subject || (pick[0] ? pick[0].subject : 'toan');
  G.Session.set({ ids: ids, index: 0, subject: subj, label: 'Ôn lại: ' + (LABEL[kind] || kind) });
  S.sessions.add({ id: 's' + Date.now(), subject: subj, ids: ids, at: Date.now(), label: 'Ôn lại: ' + (LABEL[kind] || kind) });
  return G.VIEWS.run(params);
}

/* ---------- CÀI ĐẶT & DỮ LIỆU CÁ NHÂN ---------- */
function settingsView() {
  const d = S.data();
  const attempted = Object.keys(d.attempts).length;
  const totalAttempts = Object.keys(d.attempts).reduce(function (n, k) { return n + d.attempts[k].length; }, 0);
  const notesCount = S.notes.allKeys().length;
  const formulaCount = S.formulas.all().length;
  const toanQ = ML.Bank.bySubject('toan').length;
  const lyQ = ML.Bank.bySubject('ly').length;
  const theoryCount = Object.keys(G.THEORY || {}).length;
  const dark = !!S.settings.get('dark');

  let h = '';
  h += '<div class="page-head"><h1>Cài đặt &amp; dữ liệu</h1>' +
    '<p class="muted">Website ôn tập này không có tài khoản, không gửi dữ liệu lên máy chủ và không dùng điểm số hay bảng xếp hạng. Tiến độ của bạn lưu ngay trong trình duyệt trên máy này.</p></div>';

  h += U.card('Giao diện',
    '<div class="btn-row"><button class="btn" data-act="toggleDark">' + (dark ? '☀️ Chuyển sang giao diện sáng' : '🌙 Chuyển sang giao diện tối') + '</button></div>' +
    '<p class="muted small">Giao diện tối hiển thị đồng bộ công thức toán — nếu công thức khó đọc, hãy quay lại giao diện sáng.</p>');

  h += U.card('Dữ liệu cá nhân trên máy này',
    '<div class="grid grid--4">' +
    '<div class="stat"><div class="stat__value">' + attempted + '</div><div class="stat__label">câu đã làm</div></div>' +
    '<div class="stat"><div class="stat__value">' + totalAttempts + '</div><div class="stat__label">lần trả lời</div></div>' +
    '<div class="stat"><div class="stat__value">' + notesCount + '</div><div class="stat__label">bài có ghi chú</div></div>' +
    '<div class="stat"><div class="stat__value">' + formulaCount + '</div><div class="stat__label">công thức đã lưu</div></div>' +
    '</div>' +
    '<div class="btn-row" style="margin-top:14px">' +
    '<button class="btn btn--primary" data-act="export">⬇️ Xuất tệp sao lưu (.json)</button>' +
    '<label class="btn" for="importFile">⬆️ Nhập từ tệp sao lưu</label>' +
    '<input type="file" id="importFile" accept="application/json,.json" hidden>' +
    '<button class="btn btn--danger" data-act="reset">🗑️ Xóa toàn bộ dữ liệu</button></div>' +
    '<p class="muted small">Dữ liệu lưu bằng <b>localStorage</b> của trình duyệt (khóa “ontap12.v1”). Nếu bạn dọn dữ liệu trình duyệt hoặc đổi máy, tiến độ sẽ mất — hãy xuất tệp sao lưu định kỳ. Không có chế độ đồng bộ giữa các thiết bị vì website không dùng máy chủ.</p>');

  const formatList = [
    ['mc1', 'Một đáp án'], ['mcq', 'Nhiều đáp án'], ['tf', 'Đúng / Sai'],
    ['short', 'Trả lời ngắn'], ['numeric', 'Điền đáp số']
  ];
  const allQuestions = ML.Bank.all();
  const typeCounts = { toan: {}, ly: {} };
  allQuestions.forEach(function (q) { typeCounts[q.subject][q.type] = (typeCounts[q.subject][q.type] || 0) + 1; });
  const formatTable = '<div class="tbl--wrap"><table class="table"><thead><tr><th>Hình thức câu hỏi</th><th class="num">Toán 12</th><th class="num">Vật lí 12</th></tr></thead><tbody>' +
    formatList.map(function (x) { return '<tr><td>' + x[1] + '</td><td class="num"><b>' + (typeCounts.toan[x[0]] || 0) + '</b></td><td class="num"><b>' + (typeCounts.ly[x[0]] || 0) + '</b></td></tr>'; }).join('') +
    '</tbody></table></div>';
  const generatedStats = G.GENERATED_BANK_STATS || { generatedToan: 0, generatedLy: 0 };
  h += U.card('Ngân hàng câu hỏi',
    '<div class="grid grid--3">' +
    '<div class="stat"><div class="stat__value">' + (toanQ + lyQ).toLocaleString('vi-VN') + '</div><div class="stat__label">tổng câu hỏi</div></div>' +
    '<div class="stat"><div class="stat__value">' + toanQ.toLocaleString('vi-VN') + '</div><div class="stat__label">Toán 12</div></div>' +
    '<div class="stat"><div class="stat__value">' + lyQ.toLocaleString('vi-VN') + '</div><div class="stat__label">Vật lí 12</div></div>' +
    '</div>' + formatTable +
    '<p class="muted small">Mỗi hình thức có ít nhất 200 câu cho từng môn. Trong đó ' + (generatedStats.generatedToan + generatedStats.generatedLy).toLocaleString('vi-VN') + ' câu là biến thể tham số hóa được sinh từ mẫu, có đáp án và lời giải. Nên rà soát câu hỏi và lời giải trước khi dùng cho bài kiểm tra chính thức.</p>');
  h += U.card('Phạm vi học liệu',
    '<ul>' +
    '<li>Học liệu lý thuyết có nội dung cho <b>' + theoryCount + '</b> bài; những bài còn lại hiển thị trạng thái <b>“đang biên soạn”</b> thay vì nội dung giả.</li>' +
    '<li>Bộ sách định hướng: <b>Kết nối tri thức với cuộc sống</b>. Các câu hỏi được liên kết theo chương, bài, chủ đề và mức độ nhận thức.</li>' +
    '<li>Tiến độ học được lưu cục bộ bằng <b>localStorage</b>; website không có tài khoản, không gửi dữ liệu học tập lên máy chủ và không tự đồng bộ giữa nhiều thiết bị.</li>' +
    '</ul>');

  h += U.card('Hướng dẫn chạy dự án',
    '<ul>' +
    '<li><b>Cách nhanh:</b> mở tệp <code>index.html</code> trực tiếp bằng trình duyệt (Chrome/Edge/Firefox).</li>' +
    '<li><b>Cách khuyến nghị:</b> chạy máy chủ tĩnh trong thư mục dự án, ví dụ <code>python -m http.server 8000</code> rồi truy cập <code>http://localhost:8000</code>.</li>' +
    '<li>Cần có kết nối internet để tải KaTeX và font chữ từ CDN; khi mất mạng, phần chữ vẫn đọc được nhưng công thức hiển thị dạng văn bản thô.</li>' +
    '<li>Chạy kiểm thử logic &amp; dữ liệu: <code>node test/run-tests.js</code>.</li>' +
    '</ul>');

  return h;
}

G.VIEWS = G.VIEWS || {};
G.VIEWS.notes = notesView;
G.VIEWS.reinforce = reinforceView;
G.VIEWS.review = reviewView;
G.VIEWS.settings = settingsView;

})(typeof window !== 'undefined' ? window : globalThis);