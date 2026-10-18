/* ============================================================
   UI — hàm tiện ích giao diện: escape, render KaTeX, toast,
   thẻ (chip), bộ chọn (segment), trạng thái rỗng.
   ============================================================ */
(function (G) {
'use strict';

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* Hiển thị một chuỗi có thể chứa công thức $...$ / $$...$$ */
function math(str) {
  if (str == null) return '';
  let s = String(str);
  if (!window.katex) return esc(s);
  try {
    return s
      .replace(/\$\$([\s\S]+?)\$\$/g, function (m, tex) {
        try { return katex.renderToString(tex, { displayMode: true, throwOnError: false }); }
        catch (e) { return '<code>' + esc(m) + '</code>'; }
      })
      .replace(/\$([^\$\n]+?)\$/g, function (m, tex) {
        try { return katex.renderToString(tex, { displayMode: false, throwOnError: false }); }
        catch (e) { return '<code>' + esc(m) + '</code>'; }
      });
  } catch (e) {
    console.warn('[math]', e);
    return esc(s);
  }
}

/* Văn bản nhiều dòng → HTML, xuống dòng tôn trọng, có công thức */
function md(str) {
  return String(str == null ? '' : str)
    .split(/\n{2,}/)
    .map(function (p) { return '<p>' + math(esc(p)).replace(/\n/g, '<br>') + '</p>'; })
    .join('');
}

function list(arr) {
  if (!arr || !arr.length) return '';
  return '<ul>' + arr.map(function (x) { return '<li>' + md(x) + '</li>'; }).join('') + '</ul>';
}

function steps(arr) {
  if (!arr || !arr.length) return '';
  return '<ol class="steps">' + arr.map(function (x) { return '<li>' + math(esc(x)) + '</li>'; }).join('') + '</ol>';
}

/* ---------- Toast ---------- */
function toast(msg, kind) {
  let host = document.getElementById('toasts');
  if (!host) {
    host = document.createElement('div');
    host.id = 'toasts';
    host.className = 'toasts';
    document.body.appendChild(host);
  }
  const el = document.createElement('div');
  el.className = 'toast toast--' + (kind || 'info');
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(function () { el.classList.add('is-out'); }, 3200);
  setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3600);
}

/* ---------- Chip (thẻ nhỏ) ---------- */
function chip(text, kind) {
  return '<span class="chip' + (kind ? ' chip--' + kind : '') + '">' + esc(text) + '</span>';
}

const COG = {
  NB:  { label: 'Nhận biết',      kind: 'cog-nb'  },
  TH:  { label: 'Thông hiểu',     kind: 'cog-th'  },
  VD:  { label: 'Vận dụng',       kind: 'cog-vd'  },
  VDC: { label: 'Vận dụng cao',   kind: 'cog-vdc' }
};
function cogChip(c) {
  const m = COG[c] || { label: c || '?', kind: '' };
  return '<span class="chip ' + m.kind + '">' + esc(m.label) + '</span>';
}
function cogLabel(c) { return (COG[c] || {}).label || c; }

const TYPE = {
  mc1:     'Trắc nghiệm 1 đáp án',
  mcq:     'Trắc nghiệm nhiều đáp án',
  tf:      'Đúng / Sai',
  short:   'Điền đáp án ngắn',
  numeric: 'Điền kết quả số'
};
function typeLabel(t) { return TYPE[t] || t; }

const STATUS = {
  'chua-hoc':       { label: 'Chưa học',        kind: 'st-0' },
  'can-hoc':        { label: 'Cần học',         kind: 'st-1' },
  'dang-co-cung':   { label: 'Đang củng cố',    kind: 'st-2' },
  'nam-vung':       { label: 'Đã nắm vững',     kind: 'st-3' },
  'chua-hieu':      { label: 'Chưa hiểu',       kind: 'st-1' }
};
function statusChip(s) {
  const m = STATUS[s] || { label: s, kind: '' };
  return '<span class="chip ' + m.kind + '">' + esc(m.label) + '</span>';
}

/* ---------- Thanh tiến độ ---------- */
function bar(done, total) {
  const pct = total > 0 ? Math.round(done * 100 / total) : 0;
  return '<div class="bar" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100">' +
    '<div class="bar__fill" style="width:' + pct + '%"></div>' +
    '<span class="bar__text">' + pct + '%</span></div>';
}

/* ---------- Trạng thái rỗng ---------- */
function emptyState(title, desc, action) {
  return '<div class="empty">' +
    '<div class="empty__icon" aria-hidden="true">◔</div>' +
    '<h3>' + esc(title) + '</h3>' +
    (desc ? '<p>' + esc(desc) + '</p>' : '') +
    (action ? '<div class="empty__action">' + action + '</div>' : '') +
  '</div>';
}

/* ---------- Định dạng thời gian ---------- */
function fmtDate(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  const p = function (n) { return n < 10 ? '0' + n : '' + n; };
  return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}
function fmtAgo(ts) {
  if (!ts) return '—';
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'vừa xong';
  if (s < 3600) return Math.floor(s / 60) + ' phút trước';
  if (s < 86400) return Math.floor(s / 3600) + ' giờ trước';
  return Math.floor(s / 86400) + ' ngày trước';
}

G.UI = {
  esc: esc, math: math, md: md, list: list, steps: steps,
  toast: toast, chip: chip, cogChip: cogChip, cogLabel: cogLabel,
  typeLabel: typeLabel, statusChip: statusChip, bar: bar,
  emptyState: emptyState, fmtDate: fmtDate, fmtAgo: fmtAgo,
  COG: COG, TYPE: TYPE, STATUS: STATUS
};

})(typeof window !== 'undefined' ? window : globalThis);