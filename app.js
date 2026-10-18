/* ============================================================
   APP — Router (hash), sidebar, topbar, khởi tạo
   Route:
     #/overview       Tổng quan học tập
     #/theory/:subj   Ôn tập lý thuyết
     #/lesson/:id     Chi tiết một bài lý thuyết
     #/practice       Luyện tập ứng dụng
     #/quiz?...       Màn hình làm bài
     #/my             Ôn tập của tôi (câu đúng/sai/chưa hiểu/đánh dấu)
     #/history        Lịch sử luyện tập
     #/notes          Sổ tay kiến thức
     #/reinforce      Chủ đề cần củng cố
     #/settings       Cài đặt & dữ liệu cá nhân
   ============================================================ */
(function (G) {
'use strict';

const ICONS = {
  overview: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
  theory: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  practice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M9 4h6l1 3H8z"/><path d="M9 13h6"/></svg>',
  my: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M9 12l2 2 4-4"/></svg>',
  history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></svg>',
  notes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  reinforce: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>'
};

const NAV = [
  { group: 'Học tập', items: [
    { route: '#/overview', label: 'Tổng quan học tập', icon: 'overview' },
    { route: '#/theory', label: 'Ôn tập lý thuyết', icon: 'theory' },
    { route: '#/practice', label: 'Luyện tập ứng dụng', icon: 'practice' }
  ]},
  { group: 'Ôn tập của tôi', items: [
    { route: '#/my', label: 'Câu đúng – câu sai', icon: 'my' },
    { route: '#/history', label: 'Lịch sử luyện tập', icon: 'history' },
    { route: '#/notes', label: 'Sổ tay kiến thức', icon: 'notes' },
    { route: '#/reinforce', label: 'Chủ đề cần củng cố', icon: 'reinforce' }
  ]},
  { group: 'Khác', items: [
    { route: '#/settings', label: 'Cài đặt & dữ liệu', icon: 'settings' }
  ]}
];

const TITLES = {
  overview: 'Tổng quan học tập',
  theory: 'Ôn tập lý thuyết',
  lesson: 'Bài học',
  practice: 'Luyện tập ứng dụng',
  run: 'Đang luyện tập',
  question: 'Câu hỏi',
  review: 'Ôn tập của tôi',
  my: 'Ôn tập của tôi',
  history: 'Lịch sử luyện tập',
  notes: 'Sổ tay kiến thức',
  reinforce: 'Chủ đề cần củng cố',
  settings: 'Cài đặt & dữ liệu',
  search: 'Tìm kiếm nội dung'
};

function parseQuery(str) {
  const out = {};
  String(str || '').split('&').forEach(function (kv) {
    if (!kv) return;
    const i = kv.indexOf('=');
    const k = decodeURIComponent(i >= 0 ? kv.slice(0, i) : kv);
    const v = i >= 0 ? decodeURIComponent(kv.slice(i + 1)) : '';
    out[k] = v;
  });
  return out;
}

function currentRoute() {
  const h = location.hash || '#/overview';
  const qi = h.indexOf('?');
  const path = qi >= 0 ? h.slice(0, qi) : h;
  const query = qi >= 0 ? parseQuery(h.slice(qi + 1)) : {};
  const parts = path.replace(/^#\/?/, '').split('/').filter(Boolean);
  return {
    path: path, query: query,
    key: parts[0] || 'overview',
    arg: parts[1] || null,
    arg2: parts[2] || null
  };
}

function go(hash) {
  if (location.hash === hash) render();
  else location.hash = hash;
}

function routeTitle(r) {
  if (r.key === 'review') {
    const labels = { wrong: 'Ôn câu sai', correct: 'Ôn câu đúng', flagged: 'Câu đã đánh dấu', understood: 'Câu đã hiểu', all: 'Ôn tập của tôi' };
    return labels[r.query.kind] || 'Câu cần ôn lại';
  }
  return TITLES[r.key] || 'Ôn tập';
}

function routedReviewActive(active, route) {
  return active === '#/review' && route === '#/my';
}

function renderSidebar() {
  const app = document.getElementById('app');
  let aside = document.getElementById('sidebar');
  if (!aside) {
    aside = document.createElement('aside');
    aside.id = 'sidebar';
    aside.className = 'sidebar';
    app.insertBefore(aside, app.firstChild);
  }
  const active = currentRoute().path;
  aside.innerHTML =
    '<div class="sidebar__brand">' +
      '<div class="sidebar__brand-mark" aria-hidden="true">12<span>+</span></div>' +
      '<div class="sidebar__brand-copy">' +
        '<div class="sidebar__brand-title">Ôn tập Toán 12 &amp; Vật lí 12</div>' +
        '<div class="sidebar__brand-sub">KẾT NỐI TRI THỨC</div>' +
      '</div>' +
    '</div>' +
    '<nav class="nav" aria-label="Điều hướng chính">' +
      NAV.map(function (grp) {
        return '<div class="nav__group">' +
          '<div class="nav__label">' + G.UI.esc(grp.group) + '</div>' +
          grp.items.map(function (it) {
            const on = active === it.route || active.indexOf(it.route + '/') === 0 ||
              (routedReviewActive(active, it.route));
            return '<button type="button" class="nav__item' + (on ? ' is-active' : '') +
              '" data-route="' + it.route + '">' + ICONS[it.icon] +
              '<span>' + G.UI.esc(it.label) + '</span></button>';
          }).join('') +
        '</div>';
      }).join('') +
    '</nav>';
}

function renderTopbar() {
  const bar = document.getElementById('topbar');
  const r = currentRoute();
  const dark = !!G.Store.settings.get('dark');
  bar.innerHTML =
    '<button type="button" class="hamburger" id="btnMenu" aria-label="Mở menu">☰</button>' +
    '<div class="topbar__title">' + G.UI.esc(routeTitle(r)) + '</div>' +
    '<form class="topbar__search" id="globalSearchForm" role="search" aria-label="Tìm kiếm bài học và câu hỏi">' +
      '<span class="topbar__search-icon" aria-hidden="true">⌕</span>' +
      '<input id="globalSearchInput" name="q" type="search" autocomplete="off" placeholder="Tìm bài học, công thức, câu hỏi…" value="' + G.UI.esc(r.key === 'search' ? (r.query.q || '') : '') + '" aria-label="Tìm bài học, công thức, câu hỏi" />' +
      '<kbd>Ctrl K</kbd>' +
    '</form>' +
    '<button type="button" class="btn btn--sm" id="btnDark" aria-pressed="' + dark + '">' +
      (dark ? '☀ Sáng' : '◐ Tối') + '</button>';
  document.getElementById('btnMenu').addEventListener('click', toggleSidebar);
  document.getElementById('globalSearchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const q = document.getElementById('globalSearchInput').value.trim();
    if (q) go('#/search?q=' + encodeURIComponent(q));
  });
  document.getElementById('btnDark').addEventListener('click', function () {
    G.Store.settings.setDark(!dark);
    renderTopbar();
  });
}

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  if (!sb) return;
  const open = sb.classList.toggle('is-open');
  let scrim = document.getElementById('scrim');
  if (open) {
    if (!scrim) {
      scrim = document.createElement('div');
      scrim.id = 'scrim';
      scrim.className = 'scrim';
      document.body.appendChild(scrim);
      scrim.addEventListener('click', toggleSidebar);
    }
    scrim.style.display = 'block';
  } else if (scrim) {
    scrim.style.display = 'none';
  }
}

function render() {
  renderSidebar();
  renderTopbar();
  const r = currentRoute();
  const content = document.getElementById('content');
  content.innerHTML = '<div class="card" style="text-align:center;padding:44px"><span class="spinner"></span></div>';
  if (window.scrollTo) window.scrollTo(0, 0);

  const V = G.VIEWS || {};
  const p = r.query || {};
  let view;
  try {
    switch (r.key) {
      case 'theory':
        view = r.arg === 'lesson'
          ? (V.theoryLesson ? V.theoryLesson(p) : V.overview(p))
          : (V.theory ? V.theory(p) : V.overview(p));
        break;
      case 'lesson':
        /* Dạng ngắn #/lesson/<id> (dùng trong Sổ tay) */
        view = V.theoryLesson ? V.theoryLesson(Object.assign({}, p, { id: r.arg })) : V.overview(p);
        break;
      case 'practice':
        view = r.arg === 'run'
          ? (V.run ? V.run(p) : V.overview(p))
          : (V.practice ? V.practice(p) : V.overview(p));
        break;
      case 'question': view = V.question ? V.question(p) : V.overview(p); break;
      case 'search': view = V.search ? V.search(p) : V.overview(p); break;
      case 'review': view = V.review ? V.review(p) : V.overview(p); break;
      case 'my': view = V.my ? V.my(p) : V.overview(p); break;
      case 'history': view = V.history ? V.history(p) : V.overview(p); break;
      case 'notes': view = V.notes ? V.notes(p) : V.overview(p); break;
      case 'reinforce': view = V.reinforce ? V.reinforce(p) : V.overview(p); break;
      case 'settings': view = V.settings ? V.settings(p) : V.overview(p); break;
      case 'overview':
      default: view = V.overview ? V.overview(p) : G.UI.empty('Thiếu module giao diện', 'Không tải được trang tổng quan.', '');
    }
  } catch (err) {
    console.error(err);
    view = G.UI.empty('Không hiển thị được trang này', err.message,
      '<button type="button" class="btn btn--primary" data-route="#/overview">Về trang tổng quan</button>');
  }
  content.innerHTML = view;
  /* Render công thức: thuộc tính data-tex rồi tới $...$ trong văn bản */
  try {
    G.MathLib.renderInto(content);
    G.MathLib.renderMath(content);
  } catch (errMath) { console.warn('[math]', errMath); }
  if (G.Bind) G.Bind(content, r, go);
  document.title = routeTitle(r) + ' — Toán 12 & Vật lí 12';
}

/* Ủy quyền click cho nút điều hướng */
document.addEventListener('click', function (e) {
  const el = e.target && e.target.closest ? e.target.closest('[data-route]') : null;
  if (!el || el.tagName === 'A') return;
  e.preventDefault();
  go(el.getAttribute('data-route'));
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList.contains('is-open')) toggleSidebar();
});

/* Phím tắt: Ctrl/Cmd+K hoặc / để mở tìm kiếm toàn website. */
document.addEventListener('keydown', function (e) {
  const target = e.target;
  const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    const input = document.getElementById('globalSearchInput');
    if (input) input.focus();
  } else if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    const input = document.getElementById('globalSearchInput');
    if (input) input.focus();
  }
});

/* Kiểm tra tính hợp lệ ngân hàng câu hỏi trước khi dùng */
function validateBank() {
  const problems = [];
  const seen = {};
  G.MathLib.Bank.all().forEach(function (q) {
    if (seen[q.id]) { problems.push(q.id + ': trùng id'); return; }
    seen[q.id] = 1;
    if (!q.question) problems.push(q.id + ': thiếu nội dung câu hỏi');
    if (!q.chapterId || !q.lessonId || !q.topicId) problems.push(q.id + ': thiếu liên kết chương/bài/chủ đề');
    if (q.type === 'mc1') {
      if (!Array.isArray(q.options) || q.options.length < 2) problems.push(q.id + ': mc1 cần ít nhất 2 phương án');
      else if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.options.length) problems.push(q.id + ': đáp án đúng mc1 ngoài phạm vi');
    }
    if (q.type === 'mcq' && !Array.isArray(q.correct)) problems.push(q.id + ': mcq cần mảng đáp án đúng');
    if (q.type === 'numeric' && (!q.numeric || q.numeric.answer === undefined)) problems.push(q.id + ': thiếu đáp số');
    if (!q.explain || !q.explain.correct) problems.push(q.id + ': thiếu giải thích đáp án đúng');
    if (!q.explain || !q.explain.steps || !q.explain.steps.length) problems.push(q.id + ': thiếu lời giải từng bước');
  });
  return problems;
}

function init() {
  G.Store.settings.setDark(!!G.Store.settings.get('dark'));
  if (!location.hash) location.hash = '#/overview';
  window.addEventListener('hashchange', render);
  render();
  const problems = validateBank();
  if (problems.length) console.warn('[validate] ' + problems.length + ' vấn đề dữ liệu:\n' + problems.join('\n'));
  else console.info('[validate] ngân hàng câu hỏi hợp lệ: ' + G.MathLib.Bank.all().length + ' câu');
  if (!window.katex) G.UI.toast('Chưa tải được thư viện KaTeX. Công thức có thể hiển thị dạng văn bản thô.', 'bad');
}

G.App = {
  go: go, render: render, route: currentRoute, parseQuery: parseQuery,
  validateBank: validateBank, toggleSidebar: toggleSidebar
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

})(typeof window !== 'undefined' ? window : globalThis);