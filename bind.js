/* ============================================================
   BIND — gắn sự kiện cho các phần tương tác sau khi render view.
   Xử lý tập trung mọi data-act: answerForm, hint, flag, understood,
   bookmark, needReview, ghi chú, công thức, flashcard, tự kiểm tra,
   setupForm, bộ lọc, startGroup, toggleDark, export/reset/import.
   ============================================================ */
(function (G) {
'use strict';

const ML = G.MathLib, S = G.Store, U = G.UI, C = G.CURRICULUM;

/* ---------- Thu thập đáp án theo loại câu ---------- */
function collectAnswer(form, q) {
  if (q.type === 'mc1' || q.type === 'tf') {
    const el = form.querySelector('input[name="ans"]:checked');
    if (!el) return null;
    if (q.type === 'tf') return el.value === 'T';
    return Number(el.value);
  }
  if (q.type === 'mcq') {
    const els = form.querySelectorAll('input[name="ans"]:checked');
    return Array.prototype.map.call(els, function (el) { return Number(el.value); });
  }
  const el = form.querySelector('input[name="ans"]');
  return el ? el.value.trim() : '';
}

function form_lock(root, q, attempt) {
  const form = root.querySelector('#answerForm');
  if (!form) return;
  Array.prototype.forEach.call(form.querySelectorAll('input'), function (el) { el.disabled = true; });
  const btn = form.querySelector('[data-act="check"]');
  if (btn) btn.remove();
  const again = document.createElement('a');
  again.className = 'btn';
  again.href = '#/question?id=' + q.id + '&mode=' + (attempt.mode || 'practice');
  again.textContent = '↻ Làm lại câu này';
  const actions = form.querySelector('.qcard__actions');
  if (actions) actions.appendChild(again);
}

/* ---------- Hiển thị phản hồi sau khi chấm ---------- */
function showFeedback(root, q, attempt) {
  const fb = root.querySelector('#feedback');
  if (!fb) return;
  fb.innerHTML = G.QUESTION.feedbackHTML(q, attempt);
  ML.renderInto(fb);
  ML.renderMath(fb);
  form_lock(root, q, attempt);
  if (fb.scrollIntoView) fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* ---------- Trả lời & chấm điểm ---------- */
function onAnswer(root, form) {
  const qid = form.getAttribute('data-id');
  const mode = form.getAttribute('data-mode') || 'practice';
  const q = ML.Bank.byId(qid);
  if (!q) { U.toast('Không tìm thấy câu hỏi.', 'bad'); return; }
  const answer = collectAnswer(form, q);
  const res = ML.grade(q, answer);
  if (res.state === 'blank' || res.kind === 'empty') { U.toast(res.note || 'Bạn chưa trả lời câu này.', 'warn'); return; }
  const attempt = S.attempts.record(qid, answer, res.correct, mode, { state: res.state, reason: res.reason });
  attempt.state = res.state;
  attempt.reason = res.reason;
  showFeedback(root, q, attempt);
  U.toast(res.correct
    ? 'Đã lưu kết quả: đúng. Đọc phần giải thích để củng cố nhé.'
    : 'Đã lưu kết quả. Hãy đọc kỹ phần giải thích — mỗi câu sai là một cơ hội học.',
    res.correct ? 'ok' : 'warn');
}

/* ---------- Gợi ý ---------- */
function onHint(root, qid) {
  const box = root.querySelector('#hintBox');
  if (!box) return;
  const q = ML.Bank.byId(qid);
  if (q && q.hint && !box.dataset.done) { ML.renderInto(box); box.dataset.done = '1'; }
  box.hidden = !box.hidden;
}

/* ---------- Đánh dấu / đã hiểu (câu hỏi) ---------- */
function onFlag(btn, qid) {
  const on = S.flagged.toggle(qid);
  btn.textContent = on ? 'Bỏ đánh dấu' : 'Đánh dấu';
  U.toast(on ? 'Đã lưu vào danh sách cần ôn lại.' : 'Đã bỏ đánh dấu.', 'ok');
}

function onUnderstood(btn, qid, v) {
  S.understood.mark(qid, v);
  const group = btn.parentElement;
  if (group) {
    Array.prototype.forEach.call(group.querySelectorAll('[data-act="understood"]'), function (b) {
      b.classList.remove('btn--primary', 'btn--danger');
    });
    btn.classList.add(v ? 'btn--primary' : 'btn--danger');
  }
  if (v) U.toast('Đã ghi nhận: bạn đã hiểu câu này.', 'ok');
  else U.toast('Đã thêm vào danh sách cần ôn lại.', 'warn');
}
/* ---------- Bài lý thuyết: đánh dấu trang / cần ôn lại / đã hiểu ---------- */
function onBookmark(btn, id) {
  const on = S.theory.bookmark(id);
  btn.textContent = on ? 'Bỏ đánh dấu trang' : 'Đánh dấu trang';
  U.toast(on ? 'Đã đánh dấu bài để tìm nhanh trong Sổ tay.' : 'Đã bỏ đánh dấu trang.', 'ok');
}
function onNeedReview(btn, id) {
  const cur = S.theory.flaggedIds().indexOf(id) >= 0;
  S.theory.flag(id, !cur);
  btn.textContent = !cur ? 'Bỏ "cần ôn lại"' : 'Cần ôn lại';
  U.toast(!cur ? 'Bài được thêm vào danh sách cần ôn lại.' : 'Đã bỏ khỏi danh sách cần ôn lại.', 'ok');
}
function onTheoryUnderstood(btn, id) {
  S.theory.mark(id, 'mastered');
  U.toast('Đã lưu trạng thái: bạn đã hiểu bài này.', 'ok');
  const bar = btn.closest('.toolbar__state');
  if (bar) bar.innerHTML = U.chip('Trạng thái: Đã hiểu', 'ok');
}

/* ---------- Ghi chú ---------- */
function onNoteSubmit(form) {
  const key = form.getAttribute('data-key');
  const ta = form.querySelector('textarea[name="text"]');
  const text = ta ? ta.value.trim() : '';
  if (!text) { U.toast('Ghi chú rỗng — hãy nhập nội dung trước.', 'warn'); return; }
  S.notes.add(key, text);
  ta.value = '';
  U.toast('Đã lưu ghi chú vào Sổ tay kiến thức.', 'ok');
  const host = form.parentElement;
  if (host && G.VIEWS.renderNotes) {
    const old = host.querySelector('ul.notes, p.muted.small');
    const tmp = document.createElement('div');
    tmp.innerHTML = G.VIEWS.renderNotes(key);
    if (old && tmp.firstElementChild) old.replaceWith(tmp.firstElementChild);
  }
}
function onNoteEdit(btn) {
  const key = btn.getAttribute('data-key');
  const i = Number(btn.getAttribute('data-i'));
  const cur = S.notes.list(key)[i];
  if (!cur) return;
  const text = prompt('Sửa ghi chú:', cur.text);
  if (text === null) return;
  if (!text.trim()) { U.toast('Không lưu ghi chú rỗng.', 'warn'); return; }
  S.notes.edit(key, i, text.trim());
  G.App.render();
  U.toast('Đã cập nhật ghi chú.', 'ok');
}
function onNoteDel(btn) {
  const key = btn.getAttribute('data-key');
  const i = Number(btn.getAttribute('data-i'));
  if (!confirm('Xóa ghi chú này?')) return;
  S.notes.remove(key, i);
  G.App.render();
  U.toast('Đã xóa ghi chú.', 'ok');
}

/* ---------- Lưu công thức vào sổ tay ---------- */
function onSaveFormula(btn) {
  const key = btn.getAttribute('data-key');
  const title = btn.getAttribute('data-title') || 'Công thức';
  const texStr = btn.getAttribute('data-tex') || '';
  S.formulas.save(key, title, texStr);
  btn.textContent = '✓ Đã lưu';
  U.toast('Đã lưu công thức vào Sổ tay kiến thức.', 'ok');
}
function onFormulaDel(btn) {
  S.formulas.remove(btn.getAttribute('data-key'));
  G.App.render();
  U.toast('Đã bỏ lưu công thức.', 'ok');
}

/* ---------- Flashcard lật thẻ ---------- */
function onFlip(el) {
  const on = el.classList.toggle('is-flipped');
  el.setAttribute('aria-expanded', on ? 'true' : 'false');
}

/* ---------- Phiên luyện tập ---------- */
function startSession(params, ids, label, go) {
  if (!ids.length) {
    U.toast('Không có câu hỏi nào phù hợp với lựa chọn. Hãy thử phạm vi khác.', 'warn');
    return false;
  }
  const first = ML.Bank.byId(ids[0]);
  const sess = { ids: ids, index: 0, subject: params.subject || (first ? first.subject : 'toan'), label: label || '', at: Date.now() };
  G.Session.set(sess);
  S.sessions.add({ id: 's' + Date.now(), subject: sess.subject, ids: ids, at: sess.at, label: label || 'Luyện tập', filters: params });
  go('#/practice/run');
  return true;
}

function onSetupSubmit(form, go) {
  const f = {
    subject: form.subject.value,
    chapterId: form.chapter.value || null,
    lessonId: form.lesson.value || null,
    topicId: form.topic ? (form.topic.value || null) : null,
    cognitive: form.cog.value === 'ALL' ? null : form.cog.value
  };
  const count = Number(form.count.value) || 0;
  const mode = form.mode.value;
  let list = ML.Bank.filter(f);
  if (!list.length) { U.toast('Phạm vi này chưa có câu hỏi. Hãy chọn phạm vi khác.', 'warn'); return; }
  list = mode === 'level' ? ML.Bank.byLevel(list) : ML.Bank.shuffle(list);
  const ids = (count > 0 ? list.slice(0, count) : list).map(function (q) { return q.id; });
  const labelParts = [C.getSubject(f.subject).name];
  if (f.lessonId) labelParts.push(C.getLesson(f.lessonId).name);
  else if (f.chapterId) labelParts.push(C.getChapter(f.chapterId).name);
  if (f.topicId) labelParts.push(C.getTopic(f.topicId).name);
  startSession({ subject: f.subject }, ids, labelParts.join(' — '), go);
}

function onStartGroup(btn, go) {
  const ids = (btn.getAttribute('data-ids') || '').split(',').filter(Boolean);
  const list = ML.Bank.shuffle(ids);
  const first = ML.Bank.byId(list[0]);
  startSession({ subject: first ? first.subject : 'toan' }, list, 'Ôn lại nhóm câu', go);
}

/* ---------- Bộ lọc trang Ôn tập của tôi ---------- */
function onSetKind(btn, go) {
  const cur = G.App.parseQuery((location.hash.split('?')[1]) || '');
  cur.kind = btn.getAttribute('data-kind');
  const qs = Object.keys(cur).filter(function (k) { return cur[k]; }).map(function (k) { return k + '=' + encodeURIComponent(cur[k]); }).join('&');
  go('#/my' + (qs ? '?' + qs : ''));
}
function onFilterSubmit(form, go) {
  const cur = G.App.parseQuery((location.hash.split('?')[1]) || '');
  const qs = [
    'subject=' + encodeURIComponent(form.subject.value),
    'chapter=' + encodeURIComponent(form.chapter.value),
    'cog=' + encodeURIComponent(form.cog.value),
    'kind=' + encodeURIComponent(cur.kind || 'all')
  ].join('&');
  go('#/my?' + qs);
}
/* ---------- Gắn tất cả sự kiện cho một trang đã render ---------- */
function bind(root, route, go) {
  /* Form tìm kiếm toàn trang */
  const searchForm = root.querySelector('#searchPageForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = searchForm.querySelector('input[name="q"]');
      const query = input ? input.value.trim() : '';
      if (query) go('#/search?q=' + encodeURIComponent(query));
    });
  }
  /* Form trả lời câu hỏi */
  const answerForm = root.querySelector('#answerForm');
  if (answerForm) {
    answerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      onAnswer(root, answerForm);
    });
  }
  /* Form chọn luyện tập */
  const setupForm = root.querySelector('#setupForm');
  if (setupForm) {
    setupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      onSetupSubmit(setupForm, go);
    });
    function setOptions(select, items, placeholder, getValue, getLabel, selected) {
      if (!select) return;
      const valid = items.some(function (item) { return getValue(item) === selected; });
      select.innerHTML = '<option value="">' + placeholder + '</option>' + items.map(function (item) {
        const value = getValue(item);
        const label = getLabel(item);
        return '<option value="' + ML.esc(value) + '"' + (valid && value === selected ? ' selected' : '') + '>' + ML.esc(label) + '</option>';
      }).join('');
      if (!valid) select.value = '';
    }
    function updatePracticeOptions(level) {
      const subject = setupForm.subject.value;
      const oldChapter = setupForm.chapter.value;
      const oldLesson = setupForm.lesson.value;
      const oldTopic = setupForm.topic ? setupForm.topic.value : '';
      const chapters = [];
      const sub = C.getSubject(subject);
      sub.semesters.forEach(function (sem) { sem.chapters.forEach(function (ch) { chapters.push(ch); }); });
      if (level === 'subject') setOptions(setupForm.chapter, chapters, 'Tất cả chương', x => x.id, x => x.name, '');
      else setOptions(setupForm.chapter, chapters, 'Tất cả chương', x => x.id, x => x.name, oldChapter);
      const chapter = setupForm.chapter.value;
      const lessons = C.allLessons().filter(function (l) { return l.subjectId === subject && (!chapter || l.chapterId === chapter); });
      setOptions(setupForm.lesson, lessons, 'Tất cả bài', x => x.lessonId, x => x.name, level === 'subject' || level === 'chapter' ? '' : oldLesson);
      const lesson = setupForm.lesson.value;
      const topics = C.allTopics().filter(function (t) { return t.subjectId === subject && (!chapter || t.chapterId === chapter) && (!lesson || t.lessonId === lesson); });
      setOptions(setupForm.topic, topics, 'Tất cả chủ đề', x => x.topicId, x => x.name, level === 'subject' || level === 'chapter' || level === 'lesson' ? '' : oldTopic);
    }
    setupForm.addEventListener('change', function (e) {
      if (e.target.name === 'subject') updatePracticeOptions('subject');
      else if (e.target.name === 'chapter') updatePracticeOptions('chapter');
      else if (e.target.name === 'lesson') updatePracticeOptions('lesson');
      /* Các lựa chọn khác được giữ nguyên đến khi người dùng bấm Bắt đầu. */
    });
  }
  /* Form ghi chú lý thuyết */
  Array.prototype.forEach.call(root.querySelectorAll('form[data-act="noteForm"]'), function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); onNoteSubmit(f); });
  });
  /* Form bộ lọc Ôn tập của tôi */
  const filterForm = root.querySelector('form[data-act="filterForm"]');
  if (filterForm) {
    filterForm.addEventListener('submit', function (e) { e.preventDefault(); onFilterSubmit(filterForm, go); });
  }
  /* Nút import dữ liệu */
  const imp = root.querySelector('#importFile');
  if (imp) {
    imp.addEventListener('change', function () {
      if (imp.files && imp.files[0]) S.importJSON(imp.files[0]);
    });
  }

  /* Click cho các nút data-act */
  root.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-act]');
    if (!btn || btn.tagName === 'FORM' || btn.type === 'submit') return;
    const act = btn.getAttribute('data-act');
    const id = btn.getAttribute('data-id');
    switch (act) {
      case 'hint': onHint(root, id); break;
      case 'flag': onFlag(btn, id); break;
      case 'understood':
        if (btn.hasAttribute('data-v')) onUnderstood(btn, id, btn.getAttribute('data-v') === '1');
        else onTheoryUnderstood(btn, id);
        break;
      case 'bookmark': onBookmark(btn, id); break;
      case 'needReview': onNeedReview(btn, id); break;
      case 'noteEdit': onNoteEdit(btn); break;
      case 'noteDel': case 'note-del': onNoteDel(btn); break;
      case 'saveFormula': onSaveFormula(btn); break;
      case 'formulaDel': case 'formula-del': onFormulaDel(btn); break;
      case 'flip': onFlip(btn); break;
      case 'reveal': {
        const ans = btn.parentElement.querySelector('.selfq__a');
        if (ans) { ans.hidden = !ans.hidden; btn.textContent = ans.hidden ? 'Hiện đáp án' : 'Ẩn đáp án'; }
        break;
      }
      case 'setKind': onSetKind(btn, go); break;
      case 'startGroup': onStartGroup(btn, go); break;
      case 'toggleDark':
        S.settings.setDark(!S.settings.get('dark'));
        G.App.render();
        break;
      case 'export': S.exportJSON(); break;
      case 'reset': S.reset(); break;
      default: break;
    }
  });

  /* Phím Enter/Space lật flashcard */
  root.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('flash')) {
      e.preventDefault();
      onFlip(e.target);
    }
  });
}

G.Bind = bind;

})(typeof window !== 'undefined' ? window : globalThis);