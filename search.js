/* ============================================================
   TÌM KIẾM TOÀN WEBSITE — chương, bài học, chủ đề, câu hỏi, công thức
   ============================================================ */
(function (G) {
'use strict';

const C = G.CURRICULUM, ML = G.MathLib, U = G.UI, esc = ML.esc;

function norm(value) {
  return String(value == null ? '' : value).normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
}
function includes(hay, needle) { return norm(hay).includes(norm(needle)); }
function link(route, title, meta, type) {
  return '<a class="search-result" href="' + esc(route) + '">' +
    '<span class="search-result__icon" aria-hidden="true">' + esc(type) + '</span>' +
    '<span class="search-result__main"><b>' + esc(title) + '</b><small>' + esc(meta) + '</small></span>' +
    '<span class="search-result__arrow" aria-hidden="true">↗</span></a>';
}

function searchView(params) {
  const query = String(params.q || '').trim();
  if (!query) {
    return '<div class="page-head search-hero"><div class="eyebrow">THƯ VIỆN HỌC TẬP</div><h1>Tìm nhanh kiến thức bạn cần</h1>' +
      '<p class="muted">Tìm trong bài học, chủ đề, công thức và ngân hàng câu hỏi Toán 12 – Vật lí 12.</p>' +
      '<form class="search-inline" id="searchPageForm"><input name="q" type="search" placeholder="Ví dụ: đạo hàm, xác suất, dao động điều hòa…" aria-label="Từ khóa tìm kiếm" required><button class="btn btn--primary" type="submit">Tìm kiếm</button></form>' +
      '<div class="search-suggestions"><span>Gợi ý:</span> <a href="#/search?q=đạo hàm">Đạo hàm</a><a href="#/search?q=xác suất">Xác suất</a><a href="#/search?q=dao động điều hòa">Dao động điều hòa</a><a href="#/search?q=điện từ trường">Điện từ trường</a></div></div>' +
      U.card('Bắt đầu từ đâu?', '<div class="grid grid--2"><a class="search-shortcut" href="#/theory?subject=toan"><b>Ôn lý thuyết Toán 12</b><span>Xem theo chương và bài học →</span></a><a class="search-shortcut" href="#/theory?subject=ly"><b>Ôn lý thuyết Vật lí 12</b><span>Khái niệm, công thức và ví dụ →</span></a><a class="search-shortcut" href="#/practice?subject=toan"><b>Luyện tập Toán</b><span>Chọn dạng bài, mức độ và số câu →</span></a><a class="search-shortcut" href="#/practice?subject=ly"><b>Luyện tập Vật lí</b><span>Làm bài và xem lời giải từng bước →</span></a></div>');
  }

  const qn = norm(query);
  const chapters = [];
  C.SUBJECTS.forEach(function (s) { s.semesters.forEach(function (sem) { sem.chapters.forEach(function (ch) {
    if (includes(ch.name, query) || includes(s.name, query)) chapters.push({ id: ch.id, name: ch.name, subject: s.name, semester: sem.name });
  }); }); });
  const lessons = C.allLessons().filter(function (l) {
    return includes(l.name, query) || includes(l.chapterName, query) || includes(C.getSubject(l.subjectId).name, query);
  });
  const topics = C.allTopics().filter(function (t) {
    return includes(t.name, query) || includes(t.lessonName, query) || includes(t.chapterName, query);
  });
  const questionHits = ML.Bank.all().map(function (q) {
    const topic = C.getTopic(q.topicId), lesson = C.getLesson(q.lessonId), chapter = C.getChapter(q.chapterId);
    const corpus = [q.question, q.explain && q.explain.correct, q.explain && q.explain.related,
      q.explain && q.explain.mistake, q.explain && q.explain.next,
      topic && topic.name, lesson && lesson.name, chapter && chapter.name,
      q.options && q.options.join(' ')].join(' ');
    if (!includes(corpus, query)) return null;
    let score = 0;
    if (includes(q.question, query)) score += 5;
    if (topic && includes(topic.name, query)) score += 3;
    if (lesson && includes(lesson.name, query)) score += 2;
    return { q: q, topic: topic, lesson: lesson, chapter: chapter, score: score };
  }).filter(Boolean).sort(function (a, b) { return b.score - a.score || a.q.id.localeCompare(b.q.id); });

  const total = chapters.length + lessons.length + topics.length + questionHits.length;
  let h = '<div class="page-head search-head"><div class="eyebrow">KẾT QUẢ TÌM KIẾM</div><h1>“' + esc(query) + '”</h1>' +
    '<p class="muted">Tìm thấy ' + total + ' kết quả trong chương trình và ngân hàng câu hỏi. Tìm kiếm không phân biệt chữ hoa, chữ thường hoặc dấu tiếng Việt.</p></div>';
  h += '<form class="search-inline search-inline--compact" id="searchPageForm"><input name="q" type="search" value="' + esc(query) + '" aria-label="Từ khóa tìm kiếm" required><button class="btn btn--primary" type="submit">Tìm lại</button><a class="btn btn--ghost" href="#/search">Xóa</a></form>';

  if (!total) return h + U.empty('Chưa tìm thấy nội dung phù hợp', 'Thử một từ khóa ngắn hơn hoặc tìm theo tên chương, tên bài, công thức hay khái niệm.', '<a class="btn btn--primary" href="#/theory">Duyệt danh sách bài học</a>');

  function section(title, count, body, more) {
    return '<section class="card search-section"><div class="card__head"><h2 class="card__title">' + title + '</h2><span class="search-count">' + count + '</span></div><div class="card__body card__body--search">' + body + (more || '') + '</div></section>';
  }
  if (chapters.length) h += section('Chương', chapters.length, chapters.slice(0, 8).map(function (x) {
    return link('#/theory?subject=' + (x.id.indexOf('ly-') === 0 ? 'ly' : 'toan') + '&chapter=' + x.id, x.name, x.subject + ' · ' + x.semester, 'CH');
  }).join(''));
  if (lessons.length) h += section('Bài học', lessons.length, lessons.slice(0, 12).map(function (x) {
    return link('#/lesson/' + x.lessonId, x.name, x.chapterName + ' · ' + C.getSubject(x.subjectId).name, 'BÀI');
  }).join(''));
  if (topics.length) h += section('Chủ đề', topics.length, topics.slice(0, 12).map(function (x) {
    return link('#/practice?subject=' + x.subjectId + '&chapter=' + x.chapterId + '&lesson=' + x.lessonId + '&topic=' + x.topicId, x.name, x.lessonName + ' · ' + x.chapterName, 'CHỦ');
  }).join(''));
  if (questionHits.length) h += section('Câu hỏi luyện tập', questionHits.length, questionHits.slice(0, 30).map(function (x) {
    const q = x.q;
    const typeLabel = (U.TYPE_LABEL && U.TYPE_LABEL[q.type]) || q.type;
    return '<a class="search-result search-result--question" href="#/question?id=' + encodeURIComponent(q.id) + '&mode=review"><span class="search-result__icon">' + (q.subject === 'toan' ? '∑' : 'Φ') + '</span>' +
      '<span class="search-result__main"><b data-tex="' + esc(q.question) + '"></b><small>' + esc((x.lesson ? x.lesson.name : q.lessonId) + ' · ' + (x.topic ? x.topic.name : '') + ' · ' + typeLabel + ' · ' + (U.COG_LABEL[q.cognitive] || q.cognitive)) + '</small></span><span class="search-result__arrow">↗</span></a>';
  }).join(''), questionHits.length > 30 ? '<p class="muted small search-limit">Đang hiển thị 30 trong ' + questionHits.length + ' câu phù hợp. Hãy thêm từ khóa cụ thể hơn để thu hẹp kết quả.</p>' : '');

  return h;
}

G.VIEWS = G.VIEWS || {};
G.VIEWS.search = searchView;
})(typeof window !== 'undefined' ? window : globalThis);
