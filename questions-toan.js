/* ============================================================
   NGÂN HÀNG CÂU HỎI — TOÁN 12 (Kết nối tri thức với cuộc sống)
   Mỗi câu đều có giải thích đầy đủ (đúng & sai), lời giải từng bước.
   id: <mon>-<bai>-<topic>-q<n> → tự suy ra chapter/lesson/topic.
   type: mc1 | mcq | tf | short | numeric
   cognitive: NB | TH | VD | VDC (nhận biết, thông hiểu, vận dụng, vận dụng cao)
   ============================================================ */
(function (G) {
'use strict';

const Q = [];

/* Chuẩn hóa số độc lập (không phụ thuộc core.js vì file dữ liệu nạp trước) */
function parseNum(s) {
  if (s === null || s === undefined) return NaN;
  const t = String(s).trim().replace(/\s+/g, '').replace(/,/g, '.');
  if (t === '') return NaN;
  const frac = t.match(/^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/);
  if (frac) return parseFloat(frac[1]) / parseFloat(frac[2]);
  return parseFloat(t);
}

/* q(id, type, diff, cog, question, options, correct, extra)
   extra = { hint, numeric:{tolerance,unit,unitRequired}, explain:{...} } */
function q(id, type, diff, cog, question, options, correct, extra) {
  const parts = id.split('-');
  const lessonId = parts[0] + '-' + parts[1];
  const topicId = parts[0] + '-' + parts[1] + '-' + parts[2];
  const e = (extra && extra.explain) || {};
  const numeric = extra && extra.numeric ? Object.assign({}, extra.numeric) : null;
  /* Câu tính toán: đáp số lấy từ tham số correct, đơn vị/sai số lấy từ numeric */
  if (type === 'numeric') {
    const n = numeric || {};
    n.answer = parseNum(correct);
    if (n.tolerance === undefined) n.tolerance = 0;
    extra = Object.assign({}, extra, { numeric: n });
  } else if (numeric) {
    extra = Object.assign({}, extra, { numeric: numeric });
  }
  Q.push({
    id: id,
    type: type,
    difficulty: diff,
    cognitive: cog,
    subject: parts[0],
    chapterId: G.CURRICULUM.index.lessons[lessonId] ? G.CURRICULUM.index.lessons[lessonId].chapterId : null,
    lessonId: lessonId,
    topicId: topicId,
    question: question,
    options: options || null,
    correct: correct,
    hint: (extra && extra.hint) || '',
    numeric: (extra && extra.numeric) || null,
    explain: {
      correct: e.correct || '',
      wrong: e.wrong || '',
      perOption: e.perOption || [],
      steps: e.steps || [],
      related: e.related || '',
      mistake: e.mistake || '',
      tip: e.tip || '',
      next: e.next || ''
    }
  });
}

/* ============ CHƯƠNG I — ỨNG DỤNG ĐẠO HÀM ============ */

/* --- Bài 1. Tính đơn điệu và cực trị --- */
q('toan-b1-t1-q1', 'mc1', 1, 'NB',
  'Trong các hàm số sau, hàm số nào đồng biến trên $\\mathbb{R}$?',
  ['$y = x^3 - 3x$', '$y = x^3 + 3x^2$', '$y = x^3 + 3x$', '$y = -x^3 + 3x$'],
  2,
  {
    hint: 'Hãy xét dấu của $y\'$ trên từng khoảng.',
    explain: {
      correct: 'Với $y = x^3 + 3x$ ta có $y\' = 3x^2 + 3 > 0$ với mọi $x$. Theo quy tắc, $y\' > 0$ trên $\\mathbb{R}$ thì hàm số đồng biến trên $\\mathbb{R}$.',
      wrong: 'Nếu bạn chọn $y = x^3 - 3x$ hay $y = x^3 + 3x^2$ thì đã nhầm: hai hàm này có $y\'$ đổi dấu nên không đồng biến trên toàn $\\mathbb{R}$.',
      perOption: [
        '$y = x^3 - 3x \\Rightarrow y\' = 3x^2 - 3$, đổi dấu qua $x = \\pm 1$ → sai.',
        '$y = x^3 + 3x^2 \\Rightarrow y\' = 3x(x + 2)$, đổi dấu qua $x = -2, 0$ → sai.',
        '$y = x^3 + 3x \\Rightarrow y\' = 3x^2 + 3 > 0$ ∀$x$ → đúng.',
        '$y = -x^3 + 3x \\Rightarrow y\' = -3x^2 + 3$, đổi dấu qua $x = \\pm 1$ → sai.'
      ],
      steps: [
        '1. Xét $y = x^3 - 3x$: $y\' = 3x^2 - 3 = 0 \\Leftrightarrow x = \\pm 1$; $y\'$ đổi dấu hai lần.',
        '2. Xét $y = x^3 + 3x^2$: $y\' = 3x(x+2)$; đổi dấu hai lần.',
        '3. Xét $y = x^3 + 3x$: $y\' = 3x^2 + 3 > 0$ với mọi $x$.',
        '4. Xét $y = -x^3 + 3x$: $y\' = 3 - 3x^2$; đổi dấu hai lần.',
        '5. Kết luận: chỉ có $y = x^3 + 3x$ đồng biến trên $\\mathbb{R}$.'
      ],
      related: 'Quy tắc xét dấu đạo hàm: $y\' > 0$ → đồng biến; $y\' < 0$ → nghịch biến.',
      mistake: 'Nhầm lẫn khi chỉ xét đạo hàm tại một điểm thay vì xét dấu trên từng khoảng.',
      tip: 'Với hàm bậc 3 $y = ax^3 + bx^2 + cx + d$: đồng biến trên $\\mathbb{R}$ khi $a > 0$ và $\\Delta\' = b^2 - 3ac \\le 0$.',
      next: 'Ôn lại Bài 1 — Quy tắc xét dấu đạo hàm.'
    }
  });

q('toan-b1-t1-q2', 'mc1', 2, 'TH',
  'Cho hàm số $y = f(x)$ có đạo hàm $f\'(x) = (x - 1)(x - 3)$ với mọi $x \\in \\mathbb{R}$. Hàm số nghịch biến trên khoảng nào sau đây?',
  ['$(-\\infty; 1)$', '$(1; 3)$', '$(3; +\\infty)$', '$(-\\infty; +\\infty)$'],
  1,
  {
    hint: 'Nghịch biến khi $f\'(x) < 0$.',
    explain: {
      correct: '$f\'(x) = (x-1)(x-3) < 0$ khi và chỉ khi $1 < x < 3$. Vậy hàm số nghịch biến trên $(1; 3)$.',
      wrong: 'Nếu chọn $(3; +\\infty)$: tại đó $(x-1)(x-3) > 0$, hàm số đồng biến chứ không nghịch biến.',
      perOption: [
        '$(-\\infty; 1)$: $f\' > 0$ → đồng biến, sai.',
        '$(1; 3)$: $f\' < 0$ → nghịch biến, đúng.',
        '$(3; +\\infty)$: $f\' > 0$ → đồng biến, sai.',
        '$(-\\infty; +\\infty)$: $f\'$ đổi dấu nên không đơn điệu trên $\\mathbb{R}$, sai.'
      ],
      steps: [
        '1. $f\'(x) = 0 \\Leftrightarrow x = 1$ hoặc $x = 3$.',
        '2. Bảng xét dấu: $x < 1 \\Rightarrow f\' > 0$; $1 < x < 3 \\Rightarrow f\' < 0$; $x > 3 \\Rightarrow f\' > 0$.',
        '3. Hàm số nghịch biến trên khoảng $f\' < 0$, tức là $(1; 3)$.'
      ],
      related: 'Quy tắc xét dấu đạo hàm.',
      mistake: 'Quên kiểm tra lại dấu bằng cách thử số thay vì chỉ nhớ thứ tự nghiệm.',
      tip: 'Với tích hai nhị thức $(x-a)(x-b)$: âm giữa hai nghiệm, dương ở hai đầu.',
      next: 'Luyện thêm dạng "cho đạo hàm, xét đơn điệu" trong Bài 1.'
    }
  });
q('toan-b1-t2-q3', 'mc1', 2, 'VD',
  'Cho hàm số $y = x^3 - 3x^2$. Hỏi hàm số có bao nhiêu điểm cực trị?',
  ['1', '2', '3', '0'],
  1,
  {
    hint: 'Tìm $y\'$, giải $y\' = 0$ rồi kiểm tra đổi dấu.',
    explain: {
      correct: '$y\' = 3x^2 - 6x = 3x(x - 2)$, $y\' = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$. $y\'$ đổi dấu khi qua cả hai điểm này, nên hàm số có 2 điểm cực trị.',
      wrong: 'Đếm nghiệm $y\' = 0$ mà không kiểm tra đổi dấu sẽ cho sai kết quả; số điểm cực trị phụ thuộc vào việc đạo hàm có đổi dấu hay không.',
      perOption: [
        '1: bỏ sót một điểm đổi dấu, sai.',
        '2: $y\'$ đổi dấu tại $x = 0$ và $x = 2$ → đúng.',
        '3: nhầm với số nghiệm $y\' = 0$ của hàm khác, sai.',
        '0: chỉ đúng khi $y\'$ không đổi dấu tại các điểm làm nó bằng 0.'
      ],
      steps: [
        '1. $y\' = 3x^2 - 6x$.',
        '2. $y\' = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$.',
        '3. Bảng xét dấu: $x < 0 \\Rightarrow y\' > 0$; $0 < x < 2 \\Rightarrow y\' < 0$; $x > 2 \\Rightarrow y\' > 0$.',
        '4. $y\'$ đổi dấu 2 lần → 2 điểm cực trị.'
      ],
      related: 'Định nghĩa điểm cực trị: $x_0$ là điểm cực trị nếu $y\'$ đổi dấu khi qua $x_0$.',
      mistake: 'Cho rằng mọi nghiệm $y\' = 0$ đều là điểm cực trị (ví dụ $y = x^3$ tại $x = 0$ thì không).',
      tip: 'Với hàm bậc 3 ($a \\ne 0$): có 2 điểm cực trị khi $\\Delta\' > 0$, không có khi $\\Delta\' \\le 0$.',
      next: 'Xem lại lý thuyết Bài 1 — Cực trị.'
    }
  });

q('toan-b1-t2-q4', 'numeric', 2, 'VD',
  'Cho hàm số $y = x^3 - 3x^2 + 2$. Hỏi hàm số đạt cực đại tại $x$ bằng bao nhiêu? (Nhập một số nguyên)',
  null, '0',
  {
    hint: 'Giải $y\' = 0$ rồi lập bảng biến thiên.',
    explain: {
      correct: '$y\' = 3x^2 - 6x = 3x(x-2)$; $y\' = 0$ tại $x = 0, 2$. $y\'$ đổi dấu từ $+$ sang $-$ tại $x = 0$ nên hàm số đạt cực đại tại $x = 0$.',
      wrong: 'Nếu bạn nhập 2: tại $x = 2$, $y\'$ đổi dấu từ $-$ sang $+$, đó là điểm cực tiểu chứ không phải cực đại.',
      steps: [
        '1. $y\' = 3x^2 - 6x = 3x(x - 2)$.',
        '2. $y\' = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$.',
        '3. Bảng biến thiên: $y\'$ đổi dấu $+ \\to -$ tại $x = 0$ (cực đại); $- \\to +$ tại $x = 2$ (cực tiểu).',
        '4. Vậy đạt cực đại tại $x = 0$.'
      ],
      related: 'Điều kiện đủ: $f\'(x_0) = 0$ và $f\'$ đổi dấu $+ \\to -$ tại $x_0$.',
      mistake: 'Nhầm cực đại và cực tiểu do không nhớ chiều đổi dấu của đạo hàm.',
      tip: 'Nhớ: đạo hàm đổi dấu từ dương sang âm → cực đại; từ âm sang dương → cực tiểu.',
      next: 'Làm tiếp dạng "tìm tham số để hàm số có cực trị" ở Bài 2.'
    },
    numeric: { tolerance: 0, unit: '', unitRequired: false }
  });

q('toan-b1-t2-q5', 'mc1', 3, 'VD',
  'Cho hàm số bậc hai $y = x^2 - 2mx + 3$. Hàm số đạt cực tiểu tại $x = 1$ khi',
  ['$m = -1$', '$m = 1$', '$m = 2$', '$m = 0$'],
  1,
  {
    hint: 'Hàm bậc hai đạt cực trị tại đỉnh parabol.',
    explain: {
      correct: 'Đỉnh parabol của $y = x^2 - 2mx + 3$ có hoành độ $x = m$. Để đạt cực tiểu tại $x = 1$ thì $m = 1$.',
      wrong: 'Nếu chọn $m = -1$: đỉnh nằm tại $x = -1$. Nếu chọn $m = 2$: đỉnh tại $x = 2$.',
      perOption: [
        '$m = -1$ → đỉnh $x = -1$, sai.',
        '$m = 1$ → đỉnh $x = 1$, đúng.',
        '$m = 2$ → đỉnh $x = 2$, sai.',
        '$m = 0$ → đỉnh $x = 0$, sai.'
      ],
      steps: [
        '1. $y\' = 2x - 2m$.',
        '2. $y\' = 0 \\Leftrightarrow x = m$ (đỉnh parabol, $y\'\' = 2 > 0$ nên là điểm cực tiểu).',
        '3. Yêu cầu cực tiểu tại $x = 1$ suy ra $m = 1$.'
      ],
      related: 'Hoành độ đỉnh parabol $x = -\\frac{b}{2a}$; đạo hàm bậc nhất cũng cho kết quả tương đương.',
      mistake: 'Nhầm công thức $x = m$ với $x = -m$ do chưa tách hệ số của $x$ cẩn thận.',
      tip: 'Đỉnh $y = ax^2 + bx + c$ nằm tại $x = -b/(2a)$; luôn kiểm tra bằng đạo hàm để tránh nhầm.',
      next: 'Luyện dạng tìm tham số m tại Bài 2.'
    }
  });
q('toan-b1-t3-q6', 'mc1', 3, 'VD',
  'Hàm số $y = x^3 - 3(m+1)x^2 + 3$ đồng biến trên $\\mathbb{R}$ khi',
  ['$m = -1$', '$m = 1$', '$m = 0$', '$m = 2$'],
  0,
  {
    hint: 'Hàm bậc 3 đồng biến trên R khi hệ số $a > 0$ và $\\Delta\' \\le 0$.',
    explain: {
      correct: '$y\' = 3x^2 - 6(m+1)x = 3x\\big[x - 2(m+1)\\big]$. Với hệ số $a = 1 > 0$, điều kiện để $y\' \\ge 0$ với mọi $x$ là $2(m+1) = 0 \\Leftrightarrow m = -1$. Khi đó $y\' = 3x^2 \\ge 0$ ∀$x$ nên hàm số đồng biến trên $\\mathbb{R}$.',
      wrong: 'Với mọi giá trị m khác -1, đạo hàm y-ập có hai nghiệm phân biệt x = 0 và x = 2(m+1) và đổi dấu qua cả hai điểm, nên hàm số không đồng biến trên R.',
      perOption: [
        'm = -1: y-ập = 3x^2 >= 0 với mọi x → đồng biến trên R, đúng.',
        'm = 1: y-ập = 3x(x - 4), đổi dấu hai lần → sai.',
        'm = 0: y-ập = 3x(x - 2), đổi dấu hai lần → sai.',
        'm = 2: y-ập = 3x(x - 6), đổi dấu hai lần → sai.'
      ],
      steps: [
        '1. y-ập = 3x^2 - 6(m+1)x = 3x.[x - 2(m+1)].',
        '2. Điều kiện y-ập >= 0 với mọi x: 2(m+1) = 0 tương đương m = -1.',
        '3. Với m = -1: y-ập = 3x^2 >= 0 với mọi x nên hàm số đồng biến trên R.',
        '4. Với m khác -1: y-ập đổi dấu hai lần nên hàm số không đồng biến trên R.',
        '5. Kết luận: m = -1.'
      ],
      related: 'Điều kiện đồng biến của hàm bậc 3 y = ax^3 + bx^2 + cx + d: a > 0 và biệt số Delta_phay = b^2 - 3ac <= 0.',
      mistake: 'Nhầm rằng chỉ cần a > 0 là đủ; thực tế còn phải kiểm tra Delta_phay <= 0.',
      tip: 'Khi c = 0 thì Delta_phay = b^2 >= 0; điều kiện Delta_phay <= 0 chỉ xảy ra khi b = 0, tức là một giá trị m duy nhất.',
      next: 'Luyện thêm dạng tìm m để hàm số nghịch biến trên R (tương tự, với a < 0).'
    }
  });

q('toan-b2-t1-q1', 'mc1', 2, 'VD',
  'Cho hàm số $y = x^3 - 3x$. Giá trị lớn nhất của hàm số trên đoạn $[0; 2]$ là',
  ['0', '2', '3', '-2'],
  1,
  {
    hint: 'So sánh giá trị tại các điểm cực trị trong đoạn và tại hai đầu mút.',
    explain: {
      correct: 'Trên $[0;2]$, hàm số có cực trị tại $x = 1$ (cực tiểu, $y = -2$). Tại đầu mút: $y(0) = 0$, $y(2) = 8 - 6 = 2$. So sánh $\\{-2; 0; 2\\}$ → GTLN là 2.',
      wrong: 'Nếu chọn 0: đó là giá trị tại $x = 0$, nhưng $y(2) = 2$ lớn hơn. Nếu chọn 3: nhầm vì chưa tính đúng $y(2)$.',
      perOption: [
        '0: giá trị tại đầu mút $x = 0$, sai.',
        '2: giá trị tại đầu mút $x = 2$, là lớn nhất → đúng.',
        '3: nhầm $y(2) = 2^3 - 3 \\cdot 2 = 2$ chứ không phải 3, sai.',
        '-2: đó là GTNN tại $x = 1$, sai.'
      ],
      steps: [
        '1. $y\' = 3x^2 - 3$; trên $[0; 2]$, $y\' = 0$ tại $x = 1$.',
        '2. Bảng biến thiên: $y\'$ đổi dấu $- \\to +$ tại $x = 1$ → cực tiểu, $y(1) = -2$.',
        '3. $y(0) = 0$; $y(2) = 2$.',
        '4. GTLN = $\\max\\{-2; 0; 2\\} = 2$; GTNN = $\\min\\{...\\} = -2$.'
      ],
      related: 'Quy tắc tìm GTLN–GTNN trên đoạn: so sánh giá trị tại điểm cực trị trong đoạn và hai đầu mút.',
      mistake: 'Chỉ xét đầu mút hoặc chỉ xét điểm cực trị mà không so sánh cả hai.',
      tip: 'Luôn viết ra tập hợp các giá trị cần so sánh rồi lấy max/min — tránh bỏ sót.',
      next: 'Làm thêm bài tìm tham số m để GTLN – GTNN đạt giá trị cho trước (Bài 2).'
    }
  });
q('toan-b2-t1-q2', 'numeric', 2, 'VD',
  'Cho hàm số $y = x^3 - 3x^2 + 1$. Giá trị nhỏ nhất của hàm số trên đoạn $[0; 3]$ bằng bao nhiêu?',
  null, '-3',
  {
    hint: 'So sánh giá trị tại điểm cực trị trong đoạn và hai đầu mút.',
    explain: {
      correct: 'Trên $[0;3]$, $y\' = 3x(x-2) = 0$ tại $x = 2$ (cực tiểu, $y(2) = 8 - 12 + 1 = -3$). Còn $y(0) = 1$, $y(3) = 27 - 27 + 1 = 1$. Vậy GTNN = $-3$.',
      wrong: 'Nếu bạn nhập 1: đó là giá trị tại hai đầu mút, nhưng tại $x = 2$ hàm số nhỏ hơn.',
      steps: [
        '1. $y\' = 3x^2 - 6x = 3x(x - 2)$.',
        '2. Trên $[0;3]$, $y\' = 0$ tại $x = 0$ và $x = 2$; $x = 0$ là đầu mút.',
        '3. Bảng biến thiên: $y\'$ đổi dấu $+ \\to -$ tại $x = 0$, $- \\to +$ tại $x = 2$ → cực tiểu tại $x = 2$.',
        '4. $y(2) = -3$; $y(0) = 1$; $y(3) = 1$.',
        '5. GTNN = $-3$ tại $x = 2$.'
      ],
      related: 'Quy tắc tìm GTLN–GTNN trên đoạn.',
      mistake: 'Bỏ sót điểm cực trị nằm trong đoạn khi so sánh.',
      tip: 'Luôn ghi đủ ba giá trị: hai đầu mút và các điểm cực trị nằm trong đoạn.',
      next: 'Luyện dạng tìm tham số m để GTNN đạt giá trị cho trước.'
    },
    numeric: { tolerance: 0, unit: '', unitRequired: false }
  });

q('toan-b2-t2-q3', 'mc1', 3, 'VD',
  'Gọi $M, m$ lần lượt là giá trị lớn nhất và giá trị nhỏ nhất của hàm số $y = x^3 - 3x^2$ trên đoạn $[-1; 3]$. Giá trị của $M - m$ bằng',
  ['4', '0', '2', '-4'],
  0,
  {
    hint: 'Tìm GTLN và GTNN rồi lấy hiệu.',
    explain: {
      correct: '$y\' = 3x(x-2)$; trên $[-1;3]$ có cực trị tại $x = 0$ (cực đại, $y = 0$) và $x = 2$ (cực tiểu, $y = -4$). Đầu mút: $y(-1) = -4$, $y(3) = 0$. Vậy $M = 0$, $m = -4$, suy ra $M - m = 0 - (-4) = 4$.',
      wrong: 'Nếu bạn chọn $-4$: đó là giá trị của $m$ (GTNN), không phải $M - m$. Nếu chọn 0: đó là $M$.',
      perOption: [
        '4: $M - m = 0 - (-4) = 4$ → đúng.',
        '0: đó là $M$, chưa phải hiệu → sai.',
        '2: kết quả của phép tính sai → sai.',
        '-4: đó là $m$ (GTNN) → sai.'
      ],
      steps: [
        '1. $y\' = 3x^2 - 6x = 3x(x-2)$; nghiệm $x = 0, x = 2$ đều thuộc $[-1;3]$.',
        '2. Bảng biến thiên: $y\'$ đổi dấu $+ \\to -$ tại $x = 0$ (cực đại, $y = 0$); $- \\to +$ tại $x = 2$ (cực tiểu, $y = -4$).',
        '3. $y(-1) = -4$; $y(3) = 0$.',
        '4. $M = \\max\\{0; -4; -4; 0\\} = 0$; $m = \\min\\{0; -4; -4; 0\\} = -4$.',
        '5. $M - m = 0 - (-4) = 4$.'
      ],
      related: 'GTLN–GTNN trên đoạn; giá trị tại điểm cực trị có thể trùng với giá trị tại đầu mút.',
      mistake: 'Nhầm lẫn giữa tổng và hiệu của $M, m$ khi đề yêu cầu.',
      tip: 'Ghi rõ đề hỏi $M + m$ hay $M - m$ trước khi tính; cẩn thận dấu khi $m < 0$.',
      next: 'Xem lại Bài 2 — GTLN, GTNN trên đoạn.'
    }
  });
q('toan-b3-t1-q1', 'mc1', 2, 'VD',
  'Đường cong $y = \\dfrac{2x - 1}{x + 2}$ có tiệm cận đứng là đường thẳng có phương trình',
  ['$x = -2$', '$x = 2$', '$y = -2$', '$y = 2$'],
  0,
  {
    hint: 'Tiệm cận đứng xuất hiện tại giá trị làm mẫu số bằng 0 (nếu tử khác 0).',
    explain: {
      correct: 'Mẫu số $x + 2 = 0 \\Leftrightarrow x = -2$. Tại $x = -2$, tử $2x - 1 = -5 \\ne 0$, nên đồ thị có tiệm cận đứng $x = -2$.',
      wrong: 'Nếu chọn $x = 2$: thử thay vào mẫu số cho $4 \\ne 0$ nên không phải tiệm cận. $y = 2$ hoặc $y = -2$ là dạng tiệm cận ngang, không phải đứng.',
      perOption: [
        '$x = -2$: mẫu số triệt tiêu, tử khác 0 → tiệm cận đứng, đúng.',
        '$x = 2$: mẫu số bằng 4, sai.',
        '$y = -2$: dạng tiệm cận ngang, sai.',
        '$y = 2$: dạng tiệm cận ngang, sai.'
      ],
      steps: [
        '1. Điều kiện xác định: $x + 2 \\ne 0 \\Leftrightarrow x \\ne -2$.',
        '2. Xét $\\lim_{x \\to -2^+} \\frac{2x-1}{x+2} = \\frac{-5}{0^+} = -\\infty$.',
        '3. Xét $\\lim_{x \\to -2^-} \\frac{2x-1}{x+2} = \\frac{-5}{0^-} = +\\infty$.',
        '4. Vậy $x = -2$ là tiệm cận đứng.'
      ],
      related: 'Tiệm cận đứng: $x = x_0$ nếu một trong hai giới hạn một phía của $y$ tại $x_0$ là vô cùng.',
      mistake: 'Nhầm tiệm cận đứng với tiệm cận ngang; hoặc quên kiểm tra tử số có triệt tiêu hay không.',
      tip: 'Giải mẫu số bằng 0, rồi kiểm tra tử số có cùng nhân tử để triệt tiến hay không.',
      next: 'Xem lại Bài 3 — Tiệm cận của đồ thị hàm số.'
    }
  });

q('toan-b3-t2-q2', 'mc1', 2, 'VD',
  'Cho hàm số $y = \\dfrac{2x + 1}{x - 3}$. Tiệm cận ngang của đồ thị hàm số là',
  ['$y = 2$', '$y = 3$', '$y = \\dfrac{1}{3}$', '$y = -3$'],
  0,
  {
    hint: 'Xét giới hạn khi x tiến đến dương vô cùng và âm vô cùng.',
    explain: {
      correct: '$\\lim_{x \\to +\\infty} \\dfrac{2x+1}{x-3} = 2$ và $\\lim_{x \\to -\\infty} \\dfrac{2x+1}{x-3} = 2$. Vậy đường thẳng $y = 2$ là tiệm cận ngang.',
      wrong: 'Nếu chọn $y = 3$: 3 là nghiệm của mẫu số, liên quan đến tiệm cận đứng chứ không phải ngang.',
      perOption: [
        '$y = 2$: hệ số của $x$ ở tử chia cho hệ số ở mẫu số → đúng.',
        '$y = 3$: nhầm với nghiệm mẫu số, sai.',
        '$y = \\frac{1}{3}$: lấy nghịch đảo tỉ số hệ số, sai.',
        '$y = -3$: sai hoàn toàn, sai.'
      ],
      steps: [
        '1. $\\lim_{x \\to \\pm\\infty} \\frac{2x+1}{x-3} = \\lim \\frac{2 + 1/x}{1 - 3/x} = \\frac{2}{1} = 2$.',
        '2. Cả hai phía đều cho cùng giới hạn 2.',
        '3. Vậy $y = 2$ là tiệm cận ngang.'
      ],
      related: 'Với $y = \\frac{ax + b}{cx + d}$ ($c \\ne 0$): tiệm cận ngang là $y = \\frac{a}{c}$, tiệm cận đứng là $x = -\\frac{d}{c}$.',
      mistake: 'Lấy $-d/c$ (tiệm cận đứng) nhầm thành tiệm cận ngang.',
      tip: 'Chia cả tử và mẫu cho $x$ rồi lấy giới hạn — an toàn và dễ kiểm tra.',
      next: 'Luyện dạng đồng thời có tiệm cận đứng và ngang trong Bài 3.'
    }
  });

q('toan-b3-t3-q3', 'mc1', 3, 'VD',
  'Đường cong $y = \\dfrac{x^2 - 3x + 4}{x - 1}$ có tiệm cận xiên có phương trình',
  ['$y = x - 2$', '$y = x + 2$', '$y = x - 4$', '$y = -x + 2$'],
  0,
  {
    hint: 'Chia đa thức rồi xét phần tử bậc nhất và hằng số.',
    explain: {
      correct: 'Chia $x^2 - 3x + 4$ cho $x - 1$ được thương $x - 2$, dư 2. Khi $x \\to \\pm\\infty$, phần $\\frac{2}{x-1} \\to 0$ nên đồ thị tiến tới đường thẳng $y = x - 2$.',
      wrong: 'Nếu chọn $y = x + 2$ hoặc $y = x - 4$: đó là kết quả phép chia sai dấu hoặc quên hạ số dư.',
      perOption: [
        '$y = x - 2$: đúng theo phép chia đa thức.',
        '$y = x + 2$: sai dấu hằng số, sai.',
        '$y = x - 4$: nhầm hằng số, sai.',
        '$y = -x + 2$: sai hệ số của $x$, sai.'
      ],
      steps: [
        '1. $\\frac{x^2 - 3x + 4}{x - 1} = x - 2 + \\frac{2}{x - 1}$.',
        '2. $\\lim_{x \\to \\pm\\infty} \\frac{2}{x-1} = 0$.',
        '3. Suy ra đồ thị có tiệm cận xiên $y = x - 2$.'
      ],
      related: 'Khi bậc tử lớn hơn bậc mẫu đúng 1 đơn vị thì có tiệm cận xiên.',
      mistake: 'Không thực hiện phép chia đa thức mà chỉ lấy hệ số cao nhất.',
      tip: 'Nhớ kiểm tra: $y - (ax + b)$ phải tiến về 0 khi $x \\to \\pm\\infty$.',
      next: 'Xem lại Bài 3 — Tiệm cận xiên.'
    }
  });
q('toan-b4-t1-q1', 'mc1', 2, 'TH',
  'Cho hàm số $y = \\dfrac{-x^2 + 4x - 5}{x - 1}$. Trong quá trình khảo sát, sau khi tìm được $y\' = \\dfrac{-x^2 + 2x + 1}{(x-1)^2}$, bước tiếp theo cần làm là',
  ['Giải $y\' = 0$ để tìm điểm cực trị', 'Xét dấu $y$ tại $x = 1$', 'Tính tiệm cận xiên', 'Tìm giao điểm với trục hoành'],
  0,
  {
    hint: 'Hãy nhớ lại thứ tự các bước trong quy trình khảo sát hàm số.',
    explain: {
      correct: 'Sau khi tính đạo hàm, bắt buộc phải giải $y\' = 0$ để xác định điểm có đạo hàm bằng 0, từ đó lập bảng biến thiên (điểm cực trị).',
      wrong: 'Các bước còn lại (tiệm cận, giao điểm trục hoành) đã được thực hiện ở những bước khác của quy trình, không phải bước ngay sau khi tính đạo hàm.',
      perOption: [
        'Giải $y\' = 0$ rồi lập bảng biến thiên → đúng.',
        'Xét dấu $y$ tại $x = 1$: đó là bước xét giới hạn để tìm tiệm cận đứng.',
        'Tính tiệm cận xiên: bước xét giới hạn vô cực.',
        'Tìm giao điểm với trục hoành: bước giải $y = 0$, làm sau khi có bảng biến thiên.'
      ],
      steps: [
        '1. Tìm tập xác định: $x \\ne 1$.',
        '2. Xét giới hạn: tiệm cận đứng $x = 1$, tiệm cận xiên $y = -x + 3$.',
        '3. Tính đạo hàm $y\' = \\frac{-x^2 + 2x + 1}{(x-1)^2}$.',
        '4. Giải $y\' = 0 \\Leftrightarrow -x^2 + 2x + 1 = 0 \\Leftrightarrow x = 1 \\pm \\sqrt{2}$.',
        '5. Lập bảng biến thiên, sau đó mới vẽ đồ thị.'
      ],
      related: 'Quy trình 5 bước: xác định → giới hạn → đạo hàm → bảng biến thiên → đồ thị.',
      mistake: 'Trộn lẫn thứ tự các bước, ví dụ vẽ đồ thị khi chưa có bảng biến thiên.',
      tip: 'Nhớ thứ tự bằng 5 chữ: ĐỊNH – GIỚI – ĐẠO – BẢNG – ĐỒ.',
      next: 'Xem lại Bài 4 — Khảo sát sự biến thiên và vẽ đồ thị hàm số.'
    }
  });

q('toan-b4-t2-q2', 'mc1', 3, 'VD',
  'Cho hàm số $y = x^3 - 3x^2 + 1$. Phương trình $x^3 - 3x^2 + 1 = 0$ có bao nhiêu nghiệm thuộc khoảng $(0; 2)$?',
  ['1', '2', '3', '0'],
  0,
  {
    hint: 'Xét tính đơn điệu trên (0;2) và dấu của y tại hai đầu khoảng.',
    explain: {
      correct: 'Trên $(0;2)$ ta có $y\' = 3x(x-2) < 0$ nên hàm số nghịch biến. Mặt khác $y(0) = 1 > 0$ và $y(2) = 8 - 12 + 1 = -3 < 0$. Hàm số liên tục, nghịch biến và đổi dấu nên phương trình có đúng 1 nghiệm trong $(0;2)$.',
      wrong: 'Nếu bạn chọn 2 hoặc 3: đã nhầm với số nghiệm trên toàn tập xác định. Trên $\mathbb{R}$, phương trình này có 3 nghiệm (một nhỏ hơn 0, một trong $(0;2)$, một lớn hơn 2), nhưng đề chỉ hỏi trong $(0;2)$.',
      perOption: [
        '1: hàm số nghịch biến và đổi dấu trên $(0;2)$ nên đúng 1 nghiệm - đúng.',
        '2: nhầm với số nghiệm của dạng hàm khác - sai.',
        '3: nhầm với tổng số nghiệm trên toàn $\mathbb{R}$ - sai.',
        '0: bỏ qua việc $y$ đổi dấu từ dương sang âm trên khoảng - sai.'
      ],
      steps: [
        '1. $y\' = 3x^2 - 6x = 3x(x - 2)$.',
        '2. Trên $(0;2)$: $x > 0$ và $x - 2 < 0$ nên $y\' < 0$, hàm số nghịch biến.',
        '3. $y(0) = 1 > 0$; $y(2) = -3 < 0$.',
        '4. Hàm số liên tục và nghịch biến trên $(0;2)$ với dấu đổi nên đúng 1 nghiệm.',
        '5. Kết luận: phương trình có 1 nghiệm thuộc $(0;2)$.'
      ],
      related: 'Số nghiệm của phương trình $f(x) = 0$ trên một khoảng được xác định qua số lần đổi dấu của $y$ trên các khoảng đơn điệu.',
      mistake: 'Dùng số nghiệm trên toàn $\mathbb{R}$ để trả lời cho câu hỏi trên một khoảng hữu hạn.',
      tip: 'Xét dấu $y$ tại hai đầu khoảng trước, rồi kết hợp với tính đơn điệu để kết luận số nghiệm.',
      next: 'Luyện thêm dạng đếm nghiệm qua đồ thị trong Bài 4.'
    }
  });
q('toan-b5-t1-q1', 'mc1', 3, 'VD',
  'Một hình chữ nhật có chu vi 24 cm. Diện tích lớn nhất có thể đạt của hình chữ nhật đó bằng',
  ['$36\\text{ cm}^2$', '$32\\text{ cm}^2$', '$24\\text{ cm}^2$', '$48\\text{ cm}^2$'],
  0,
  {
    hint: 'Gọi hai cạnh là x và (12 − x), viết diện tích theo x rồi tìm GTLN.',
    explain: {
      correct: 'Gọi hai cạnh là $x$ và $12 - x$ ($0 < x < 12$). Diện tích $S = x(12 - x) = -x^2 + 12x$ là parabol có đỉnh tại $x = 6$, cho $S_{max} = 36$ cm². Đó là hình vuông cạnh 6 cm.',
      wrong: 'Nếu chọn $32$ hoặc $24$: chưa tìm được điểm cực trị của $S$ mà chỉ thử một vài cặp cạnh bất kì.',
      perOption: [
        '$36$ cm²: đạt tại $x = 6$ (hình vuông), đúng.',
        '$32$ cm²: ví dụ $x = 4$ thì $S = 32$, chưa phải lớn nhất.',
        '$24$ cm²: nhầm với chu vi chia 1, sai.',
        '$48$ cm²: vượt quá giá trị có thể, sai.'
      ],
      steps: [
        '1. Nửa chu vi bằng 12; gọi cạnh thứ nhất $x$, cạnh thứ hai $12 - x$.',
        '2. $S(x) = x(12 - x) = -x^2 + 12x$, điều kiện $0 < x < 12$.',
        '3. $S\'(x) = -2x + 12 = 0 \\Leftrightarrow x = 6$.',
        '4. $S\'(x)$ đổi dấu từ $+$ sang $-$ tại $x = 6$ nên $S$ đạt cực đại.',
        '5. $S_{max} = S(6) = 36$ cm² (hình vuông cạnh 6 cm).',
        '6. Kiểm tra đơn vị: cm × cm = cm², hợp lý.'
      ],
      related: 'Bài toán tối ưu hóa: lập hàm số trên một biến, tìm cực trị bằng đạo hàm.',
      mistake: 'Quên điều kiện $x > 0$ và $12 - x > 0$, hoặc không kiểm tra $x = 6$ có thuộc khoảng xác định.',
      tip: 'Với hình chữ nhật chu vi cố định, diện tích lớn nhất khi đó là hình vuông.',
      next: 'Xem lại Bài 5 — Ứng dụng đạo hàm vào thực tiễn.'
    }
  });

q('toan-b5-t2-q2', 'mc1', 3, 'VD',
  'Một doanh nghiệp sản xuất $x$ tấn sản phẩm ($x > 0$) có hàm chi phí $C(x) = x^3 - 20x^2 + 210x + 100$ (triệu đồng). Hỏi sản xuất bao nhiêu tấn sản phẩm thì chi phí trung bình $\\dfrac{C(x)}{x}$ đạt nhỏ nhất?',
  ['10', '5', '20', '15'],
  0,
  {
    hint: 'Viết hàm chi phí trung bình g(x) = C(x)/x rồi tìm cực tiểu của nó.',
    explain: {
      correct: 'Ta có $g(x) = \\frac{C(x)}{x} = x^2 - 20x + 210 + \\frac{100}{x}$. Lấy đạo hàm: $g\'(x) = 2x - 20 - \\frac{100}{x^2} = \\frac{2x^3 - 20x^2 - 100}{x^2} = \\frac{2(x^3 - 10x^2 - 50)}{x^2}$. Đặt $h(x) = x^3 - 10x^2 - 50$. Khi đó $h\'(x) = 3x^2 - 20x = x(3x - 20)$, nên $h$ nghịch biến trên $\\left(0; \\frac{20}{3}\\right)$ và đồng biến trên $\\left(\\frac{20}{3}; +\\infty\\right)$. Giá trị nhỏ nhất của $h$ là $h\\left(\\frac{20}{3}\\right) = \\frac{8000}{27} - \\frac{4000}{9} - 50 \\approx -119 < 0$. Vì $h(0^+) = -50 < 0$ và $h(x) \\to +\\infty$ khi $x \\to +\\infty$ nên $h(x) = 0$ có đúng một nghiệm dương $x_0$, và $x_0 > \\frac{20}{3}$. Ta có $h(10) = 1000 - 1000 - 50 = -50 < 0$ và $h(11) = 1331 - 1210 - 50 = 71 > 0$, do đó $10 < x_0 < 11$. Trong các đáp án đã cho, $x = 10$ là giá trị phù hợp nhất.',
      wrong: 'Nếu bạn chọn 5: tại đó $h(5) = 125 - 250 - 50 = -175 < 0$ nên $g\'$ vẫn âm, $g$ còn nghịch biến. Nếu chọn 20: $h(20) = 8000 - 4000 - 50 = 3950 > 0$, tức đã qua điểm cực tiểu của $g$.',
      perOption: [
        '10: $h(10) < 0$ còn $h(11) > 0$ nên nghiệm $x_0$ nằm ngay sau 10 — đáp án phù hợp nhất, đúng.',
        '5: $h(5) < 0$, $g\'$ vẫn âm nên $g$ còn nghịch biến, sai.',
        '20: $h(20) > 0$, đã qua điểm cực tiểu của $g$, sai.',
        '15: $h(15) = 3375 - 2250 - 50 = 1075 > 0$, cũng đã qua điểm cực tiểu, sai.'
      ],
      steps: [
        '1. Chi phí trung bình: $g(x) = \\frac{C(x)}{x} = x^2 - 20x + 210 + \\frac{100}{x}$.',
        '2. $g\'(x) = 2x - 20 - \\frac{100}{x^2} = \\frac{2(x^3 - 10x^2 - 50)}{x^2}$.',
        '3. Đặt $h(x) = x^3 - 10x^2 - 50$, khi đó $h\'(x) = x(3x - 20)$.',
        '4. $h$ nghịch biến trên $\\left(0; \\frac{20}{3}\\right)$, đồng biến trên $\\left(\\frac{20}{3}; +\\infty\\right)$ và $h\\left(\\frac{20}{3}\\right) < 0$.',
        '5. Suy ra $h$ có đúng một nghiệm dương $x_0$.',
        '6. $h(10) = -50 < 0$; $h(11) = 71 > 0$ nên $10 < x_0 < 11$.',
        '7. $g\'$ đổi dấu từ $-$ sang $+$ tại $x_0$ nên $g$ đạt cực tiểu tại $x_0$.',
        '8. Trong các phương án, $x = 10$ là giá trị phù hợp nhất.'
      ],
      related: 'Tối ưu hóa trong kinh tế: chi phí trung bình $C(x)/x$, tìm cực trị bằng đạo hàm.',
      mistake: 'Tìm cực trị của tổng chi phí $C(x)$ thay vì chi phí trung bình $C(x)/x$; hoặc thử số mà không kiểm tra đổi dấu của $g\'$.',
      tip: 'Khi $g\'(x) = 0$ cho phương trình bậc ba khó giải, hãy xét tính đơn điệu của tử số để chứng minh có nghiệm duy nhất, rồi khoanh vùng nghiệm bằng cách thử số.',
      next: 'Luyện thêm dạng bài toán doanh thu và lợi nhuận trong Bài 5.'
    }
  });
q('toan-b4-t2-q1', 'numeric', 3, 'VD',
  'Cho hàm số $y = x^3 - 3x^2 - 9x + 5$. Hỏi phương trình $f(x) = 0$ có bao nhiêu nghiệm thực phân biệt? (Nhập số nguyên)',
  null, '3',
  {
    hint: 'Tìm điểm cực trị rồi so sánh giá trị cực trị với 0.',
    explain: {
      correct: '$y\' = 3x^2 - 6x - 9 = 3(x-3)(x+1)$. Cực đại tại $x = -1$: $y_CĐ = 10 > 0$; cực tiểu tại $x = 3$: $y_CT = -22 < 0$. Vì $y_CĐ \\cdot y_CT < 0$, phương trình có 3 nghiệm phân biệt.',
      wrong: 'Nếu bạn đếm 1 hoặc 2: cần kiểm tra dấu của cả hai giá trị cực trị, không chỉ một.',
      steps: [
        '1. $y\' = 3x^2 - 6x - 9 = 3(x-3)(x+1)$; $y\' = 0$ tại $x = -1, 3$.',
        '2. Bảng biến thiên: $y\'$ đổi dấu $+ \\to -$ tại $x = -1$ (cực đại), $- \\to +$ tại $x = 3$ (cực tiểu).',
        '3. $y(-1) = -1 - 3 + 9 + 5 = 10$; $y(3) = 27 - 27 - 27 + 5 = -22$.',
        '4. $y_CĐ > 0 > y_CT$ → đồ thị cắt trục hoành 3 lần → 3 nghiệm.'
      ],
      related: 'Quy tắc đếm nghiệm qua đồ thị: với hàm bậc 3 có 2 điểm cực trị, nếu $y_CĐ \\cdot y_CT < 0$ thì có 3 nghiệm.',
      mistake: 'Tính sai dấu giá trị cực trị dẫn đến kết luận sai về số nghiệm.',
      tip: 'Ghi nhớ bảng: $y_{CĐ} \\cdot y_{CT} < 0$ → 3 nghiệm; $= 0$ → 2 nghiệm; $> 0$ → 1 nghiệm.',
      next: 'Luyện thêm dạng tìm m để phương trình có đúng 3 nghiệm ở Bài 4.'
    },
    numeric: { tolerance: 0, unit: '', unitRequired: false }
  });

q('toan-b5-t2-q1', 'numeric', 3, 'VD',
  'Giá bán mỗi sản phẩm (nghìn đồng) theo số lượng $q$ (sản phẩm) là $p = 20 - 0{,}1q$. Hỏi doanh thu đạt lớn nhất khi bán bao nhiêu sản phẩm? (Nhập số nguyên)',
  null, '100',
  {
    hint: 'Viết doanh thu $R = p \\cdot q$ theo $q$ rồi tìm cực đại.',
    explain: {
      correct: '$R(q) = (20 - 0{,}1q)q = 20q - 0{,}1q^2$ với $q > 0$. $R\' = 20 - 0{,}2q = 0 \\Leftrightarrow q = 100$. $R\'\' = -0{,}2 < 0$ nên doanh thu lớn nhất khi $q = 100$.',
      wrong: 'Nếu bạn nhập 200: đó là giá trị làm $p = 0$, doanh thu bằng 0 chứ không phải lớn nhất.',
      steps: [
        '1. Doanh thu: $R(q) = p \\cdot q = (20 - 0{,}1q)q = 20q - 0{,}1q^2$.',
        '2. Điều kiện: $p > 0 \\Rightarrow 20 - 0{,}1q > 0 \\Leftrightarrow q < 200$; và $q > 0$.',
        '3. $R\'(q) = 20 - 0{,}2q = 0 \\Leftrightarrow q = 100$.',
        '4. $R\'\' = -0{,}2 < 0$ → cực đại. Và $0 < 100 < 200$ nên hợp lệ.',
        '5. Kết luận: bán 100 sản phẩm để doanh thu lớn nhất.'
      ],
      related: 'Bài toán tối ưu trong kinh tế: hàm cầu tuyến tính, doanh thu $R = pq$, lãi $L = R - C$.',
      mistake: 'Quên điều kiện $p \\ge 0$ và $q \u003e 0$ khi xét miền xác định của bài toán thực tế.',
      tip: 'Với $p = a - bq$, doanh thu lớn nhất tại $q = \\frac{a}{2b}$ — đúng một nửa giá trị làm cầu bằng 0.',
      next: 'Luyện thêm bài toán lợi nhuận (cần hàm chi phí) ở Bài 5.'
    },
    numeric: { tolerance: 0, unit: 'sản phẩm', unitRequired: false }
  });

q('toan-b6-t1-q1', 'mc1', 1, 'NB',
  'Cho ba vectơ $\\vec{a}, \\vec{b}, \\vec{c}$ đôi một không cùng phương. Khẳng định nào sau đây đúng?',
  ['Ba vectơ $\\vec{a}, \\vec{b}, \\vec{c}$ tạo thành một hệ cơ sở của không gian', 'Ba vectơ đó luôn đồng phẳng', 'Tổng của chúng bằng vectơ-không', 'Chúng không thể biểu diễn vectơ khác'],
  0,
  {
    hint: 'Nhớ định nghĩa: ba vectơ không cùng phương trong không gian có tính chất gì đặc biệt?',
    explain: {
      correct: 'Ba vectơ đôi một không cùng phương trong không gian thì không đồng phẳng, do đó chúng tạo thành một hệ cơ sở (hệ độc lập tuyến tính sinh ra không gian).',
      wrong: 'Nếu bạn chọn "luôn đồng phẳng": đồng phẳng tương đương ba vectơ cùng phương, điều này mâu thuẫn với giả thiết.',
      perOption: [
        'Đúng — đúng theo định nghĩa cơ sở trong không gian ba chiều.',
        'Sai — nếu đồng phẳng thì chúng cùng phương, trái với giả thiết.',
        'Sai — tổng có thể khác vectơ-không.',
        'Sai — ngược lại, mọi vectơ trong không gian đều biểu diễn được qua chúng.'
      ],
      steps: [
        '1. Giả thiết: $\\vec{a}, \\vec{b}, \\vec{c}$ đôi một không cùng phương.',
        '2. Điều đó suy ra $\\vec{a}$ và $\\vec{b}$ xác định một mặt phẳng $(P)$, còn $\\vec{c}$ không nằm trong $(P)$.',
        '3. Vậy ba vectơ không đồng phẳng → độc lập tuyến tính trong không gian ba chiều.',
        '4. Ba vectơ độc lập tuyến tính sinh ra không gian → tạo thành cơ sở.'
      ],
      related: 'Định nghĩa cơ sở của không gian: ba vectơ không đồng phẳng; mọi vectơ đều biểu diễn duy nhất qua chúng.',
      mistake: 'Nhầm điều kiện "đôi một không cùng phương" với "ba vectơ không đồng phẳng" — thực ra chúng tương đương.',
      tip: 'Ba vectơ không đồng phẳng ⟺ ba vectơ đôi một không cùng phương ⟺ chúng tạo thành một cơ sở.',
      next: 'Xem lý thuyết Bài 6 — Vectơ trong không gian.'
    }
  });

q('toan-b6-t3-q1', 'mc1', 2, 'TH',
  'Cho hai vectơ $\\vec{u}(1; 2; 3)$ và $\\vec{v}(2; 4; 6)$. Khẳng định nào đúng?',
  ['$\\vec{u}$ và $\\vec{v}$ cùng phương', '$\\vec{u}$ và $\\vec{v}$ không cùng phương', '$\\vec{u}$ song song với $\\vec{v}$ và ngược hướng', '$\\vec{u} = \\vec{0}$'],
  0,
  {
    hint: 'Kiểm tra tỉ số các tọa độ tương ứng.',
    explain: {
      correct: 'Các tọa độ tương ứng tỉ lệ: $2/1 = 4/2 = 6/3 = 2$, nên $\\vec{v} = 2\\vec{u}$. Hai vectơ cùng phương.',
      wrong: 'Nếu chọn "không cùng phương": điều đó xảy ra khi tỉ số các tọa độ không bằng nhau.',
      perOption: [
        'Đúng — $\\vec{v} = 2\\vec{u}$, cùng phương và cùng hướng.',
        'Sai — tỉ số tọa độ đều bằng 2.',
        'Sai — chúng cùng hướng (hệ số 2 > 0), không ngược hướng.',
        'Sai — $\\vec{u}$ khác vectơ-không.'
      ],
      steps: [
        '1. Xét tỉ số: $\\frac{2}{1} = 2$, $\\frac{4}{2} = 2$, $\\frac{6}{3} = 2$.',
        '2. Các tỉ số bằng nhau nên $\\vec{v} = 2\\vec{u}$.',
        '3. Vì $2 > 0$: hai vectơ cùng phương và cùng hướng.'
      ],
      related: 'Hai vectơ cùng phương ⟺ tọa độ tương ứng tỉ lệ; cùng hướng khi tỉ số dương, ngược hướng khi âm.',
      mistake: 'Quên xét cả ba thành phần tọa độ; chỉ cần một cặp không tỉ lệ là kết luận được.',
      tip: 'Kiểm tra nhanh: $\\vec{u} = k\\vec{v}$ với $k$ không đổi — đó là tiêu chuẩn cùng phương.',
      next: 'Xem lý thuyết Bài 6 — Điều kiện đồng phẳng của ba vectơ.'
    }
  });
q('toan-b7-t1-q1', 'mc1', 1, 'NB',
  'Trong không gian với hệ trục tọa độ $Oxyz$, trục hoành của mặt phẳng $Oxy$ là trục nào?',
  ['Trục $Ox$', 'Trục $Oy$', 'Trục $Oz$', 'Trục đi qua gốc tọa độ'],
  0,
  {
    hint: 'Mặt phẳng $Oxy$ được tạo bởi hai trục $Ox$ và $Oy$.',
    explain: {
      correct: 'Mặt phẳng $Oxy$ chứa hai trục $Ox$ và $Oy$; trục hoành của nó là $Ox$ (giao tuyến với mặt phẳng $Oxz$).',
      wrong: 'Nếu chọn $Oy$: đó là trục tung của mặt phẳng $Oxy$, không phải trục hoành.',
      perOption: [
        'Đúng — $Ox$ là trục hoành của $(Oxy)$.',
        'Sai — $Oy$ là trục tung.',
        'Sai — $Oz$ là trục đứng (vuông góc với $(Oxy)$).',
        'Sai — chỉ có một gốc tọa độ $O$, không gọi là trục hoành.'
      ],
      steps: [
        '1. Trong mặt phẳng $Oxy$: gốc $O$, trục hoành $Ox$, trục tung $Oy$.',
        '2. Trục $Oz$ vuông góc với mặt phẳng $Oxy$ tại $O$.'
      ],
      related: 'Hệ trục tọa độ $Oxyz$ gồm ba trục đơn vị đôi một vuông góc tại gốc $O$.',
      mistake: 'Nhầm trục hoành với trục tung của mặt phẳng tọa độ.',
      tip: 'Nhớ thứ tự: $(Oxy)$ → hoành $Ox$; $(Oyz)$ → hoành $Oy$; $(Oxz)$ → hoành $Ox$.',
      next: 'Xem lý thuyết Bài 7 — Hệ trục tọa độ trong không gian.'
    }
  });

q('toan-b7-t2-q1', 'numeric', 2, 'VD',
  'Cho hai điểm $A(2; -1; 3)$ và $B(5; 1; 7)$. Tính $\\overrightarrow{AB}$, hãy nhập hoành độ của vectơ $\\overrightarrow{AB}$. (Nhập số nguyên)',
  null, '3',
  {
    hint: 'Hoành độ của $\\overrightarrow{AB}$ bằng $x_B - x_A$.',
    explain: {
      correct: '$\\overrightarrow{AB} = (5 - 2;\\; 1 - (-1);\\; 7 - 3) = (3; 2; 4)$. Hoành độ là 3.',
      wrong: 'Nếu bạn nhập 2: đó là hoành độ điểm $A$, không phải của vectơ $\\overrightarrow{AB}$.',
      steps: [
        '1. Công thức: $\\overrightarrow{AB} = (x_B - x_A;\\; y_B - y_A;\\; z_B - z_A)$.',
        '2. Hoành độ: $x_B - x_A = 5 - 2 = 3$.',
        '3. Tung độ: $1 - (-1) = 2$. Cao độ: $7 - 3 = 4$.',
        '4. Vậy $\\overrightarrow{AB} = (3; 2; 4)$, hoành độ bằng 3.'
      ],
      related: 'Tọa độ vectơ bằng tọa độ điểm cuối trừ tọa độ điểm đầu — luôn nhớ thứ tự này.',
      mistake: 'Đảo ngược trừ (lấy $A$ trừ $B$) cho kết quả đối của vectơ.',
      tip: 'Nhớ: điểm CUỐI trừ điểm ĐẦU.',
      next: 'Luyện tiếp bài toán tích vô hướng hai vectơ ở Bài 8.'
    },
    numeric: { tolerance: 0, unit: '', unitRequired: false }
  });

q('toan-b8-t1-q1', 'numeric', 2, 'VD',
  'Cho $\\vec{a} = (1; -2; 3)$ và $\\vec{b} = (2; 1; -1)$. Tính hoành độ của vectơ $\\vec{u} = 2\\vec{a} - 3\\vec{b}$. (Nhập số nguyên)',
  null, '-4',
  {
    hint: '$\\vec{u} = 2\\vec{a} - 3\\vec{b}$, tính từng thành phần.',
    explain: {
      correct: '$2\\vec{a} = (2; -4; 6)$, $3\\vec{b} = (6; 3; -3)$. Vậy $\\vec{u} = (2 - 6;\\; -4 - 3;\\; 6 + 3) = (-4; -7; 9)$. Hoành độ là $-4$.',
      wrong: 'Nếu bạn nhập -4 đúng rồi nhưng nhớ sai dấu ở câu khác: chú ý $2 \\cdot 1 - 3 \\cdot 2 = 2 - 6 = -4$.',
      steps: [
        '1. $2\\vec{a} = 2(1; -2; 3) = (2; -4; 6)$.',
        '2. $3\\vec{b} = 3(2; 1; -1) = (6; 3; -3)$.',
        '3. $\\vec{u} = 2\\vec{a} - 3\\vec{b} = (2 - 6;\\; -4 - 3;\\; 6 - (-3)) = (-4; -7; 9)$.',
        '4. Hoành độ của $\\vec{u}$ là $-4$.'
      ],
      related: 'Quy tắc biểu thức tọa độ: nhân vô hướng vào từng thành phần rồi cộng/trừ theo thành phần.',
      mistake: 'Quên nhân hệ số vào tất cả các thành phần hoặc trừ sai dấu.',
      tip: 'Viết rõ từng bước nhân vô hướng ra giấy sẽ giúp tránh nhầm dấu.',
      next: 'Luyện thêm tính tích vô hướng ở chủ đề tiếp theo của Bài 8.'
    },
    numeric: { tolerance: 0, unit: '', unitRequired: false }
  });

q('toan-b8-t2-q1', 'numeric', 3, 'VD',
  'Cho $\\vec{a} = (2; -1; 2)$ và $\\vec{b} = (1; 2; -2)$. Tính tích vô hướng $\\vec{a} \\cdot \\vec{b}$. (Nhập số nguyên)',
  null, '-4',
  {
    hint: '$\\vec{a} \\cdot \\vec{b} = a_x b_x + a_y b_y + a_z b_z$.',
    explain: {
      correct: '$\\vec{a} \\cdot \\vec{b} = 2 \\cdot 1 + (-1) \\cdot 2 + 2 \\cdot (-2) = 2 - 2 - 4 = -4$.',
      wrong: 'Nếu bạn nhập 0: có thể đã quên nhân đúng dấu ở thành phần thứ ba.',
      steps: [
        '1. Áp dụng công thức: $\\vec{a} \\cdot \\vec{b} = x_a x_b + y_a y_b + z_a z_b$.',
        '2. Thế số: $= 2 \\cdot 1 + (-1) \\cdot 2 + 2 \\cdot (-2)$.',
        '3. Tính: $= 2 - 2 - 4 = -4$.',
        '4. Vì tích âm nên góc giữa hai vectơ là góc tù.'
      ],
      related: 'Tích vô hướng cũng bằng $|\\vec{a}| \\cdot |\\vec{b}| \\cdot \\cos(\\vec{a}, \\vec{b})$; bằng 0 ⟺ vuông góc.',
      mistake: 'Nhầm công thức tích vô hướng với tích có hướng — hai khái niệm khác nhau hoàn toàn.',
      tip: 'Dấu của tích vô hướng cho biết bản chất góc: dương → góc nhọn, âm → góc tù, bằng 0 → vuông góc.',
      next: 'Luyện thêm dạng tính góc giữa hai vectơ ở Bài 8.'
    },
    numeric: { tolerance: 0, unit: '', unitRequired: false }
  });
q('toan-b9-t1-q1', 'mc1', 2, 'TH',
  'Cho mẫu số liệu ghép nhóm với tần số tích luỹ tại nhóm thứ 2 là $F_2 = 14$, tần số tại nhóm thứ 3 là $f_3 = 6$. Tần số tích luỹ tại nhóm thứ 3 là',
  ['$6$', '$8$', '$20$', '$14$'],
  2,
  {
    hint: 'Tần số tích luỹ cộng dồn: $F_3 = F_2 + f_3$.',
    explain: {
      correct: '$F_3 = F_2 + f_3 = 14 + 6 = 20$.',
      wrong: 'Nếu chọn 6: đó là tần số tại nhóm 3, không phải tích luỹ. Nếu chọn 8: đó là $f_3 - F_2$ (không có nghĩa thống kê).',
      perOption: [
        'Sai — 6 là tần số tại nhóm 3.',
        'Sai — không có công thức nào cho ra 8.',
        'Đúng — $F_3 = 14 + 6 = 20$.',
        'Sai — 14 là $F_2$, tích luỹ đến nhóm 2.'
      ],
      steps: [
        '1. Công thức: $F_i = F_{i-1} + f_i$.',
        '2. $F_3 = F_2 + f_3 = 14 + 6 = 20$.'
      ],
      related: 'Tần số tích luỹ là tổng các tần số từ nhóm đầu đến nhóm đang xét.',
      mistake: 'Nhầm tần số tại nhóm với tần số tích luỹ.',
      tip: 'Ghi chú "tích luỹ = cộng dồn" để không quên công thức.',
      next: 'Xem lý thuyết Bài 9 — Khoảng biến thiên và khoảng tứ phân vị.'
    }
  });

q('toan-b10-t1-q1', 'numeric', 3, 'VD',
  'Cho mẫu số liệu ghép nhóm với các giá trị đại diện và tần số: $(2; 1), (4; 3), (6; 2)$. Tính phương sai của mẫu số liệu, làm tròn đến hàng phần mười. (Ví dụ: nhập 2.4)',
  null, '1.9',
  {
    hint: 'Trung bình $\\bar{x} = \\dfrac{\\sum x_i n_i}{n}$ rồi $s^2 = \\dfrac{\\sum n_i (x_i - \\bar{x})^2}{n}$.',
    explain: {
      correct: '$n = 6$; $\\bar{x} = \\dfrac{2 \\cdot 1 + 4 \\cdot 3 + 6 \\cdot 2}{6} = \\dfrac{26}{6} = \\dfrac{13}{3}$. Suy ra $\\sum n_i (x_i - \\bar{x})^2 = 1\\left(2 - \\frac{13}{3}\\right)^2 + 3\\left(4 - \\frac{13}{3}\\right)^2 + 2\\left(6 - \\frac{13}{3}\\right)^2 = \\frac{49}{9} + \\frac{1}{3} + \\frac{50}{9} = \\frac{102}{9} = \\frac{34}{3}$. Vậy $s^2 = \\dfrac{34/3}{6} = \\dfrac{34}{18} = \\dfrac{17}{9} \\approx 1{,}888... \\approx 1{,}9$.',
      wrong: 'Nếu bạn nhập 2,4: có thể đã dùng công thức phương sai hiệu chỉnh $\\dfrac{17}{7} \\approx 2{,}43$. Nếu nhập 1,4: độ lệch chuẩn $\\approx 1{,}37$ — phương sai phải bình phương của độ lệch chứ.',
      steps: [
        '1. $n = 1 + 3 + 2 = 6$.',
        '2. $\\bar{x} = \\frac{2 \\cdot 1 + 4 \\cdot 3 + 6 \\cdot 2}{6} = \\frac{26}{6} = \\frac{13}{3}$.',
        '3. $\\left(2 - \\frac{13}{3}\\right)^2 = \\left(-\\frac{7}{3}\\right)^2 = \\frac{49}{9}$; $\\left(4 - \\frac{13}{3}\\right)^2 = \\left(-\\frac{1}{3}\\right)^2 = \\frac{1}{9}$; $\\left(6 - \\frac{13}{3}\\right)^2 = \\left(\\frac{5}{3}\\right)^2 = \\frac{25}{9}$.',
        '4. $\\sum n_i(x_i - \\bar{x})^2 = 1 \\cdot \\frac{49}{9} + 3 \\cdot \\frac{1}{9} + 2 \\cdot \\frac{25}{9} = \\frac{49 + 3 + 50}{9} = \\frac{102}{9} = \\frac{34}{3}$.',
        '5. $s^2 = \\frac{34/3}{6} = \\frac{34}{18} = \\frac{17}{9} \\approx 1{,}89 \\to 1{,}9$.'
      ],
      related: 'Phương sai đo mức độ phân tán của mẫu số liệu quanh giá trị trung bình; độ lệch chuẩn là căn bậc hai của phương sai.',
      mistake: 'Chia cho $n - 1$ (đó là phương sai hiệu chỉnh $\\frac{17}{7}$) khi đề yêu cầu phương sai của mẫu số liệu (chia cho $n$).',
      tip: 'Với mẫu số liệu ghép nhóm: luôn dùng giá trị đại diện của nhóm và chia cho tổng tần số $n$.',
      next: 'Xem lý thuyết Bài 10 — Phương sai và độ lệch chuẩn.'
    },
    numeric: { tolerance: 0.05, unit: '', unitRequired: false }
  });
q('toan-b11-t1-q1', 'mc1', 1, 'NB',
  'Trong các khẳng định sau, khẳng định nào đúng về nguyên hàm?',
  ['Mọi hàm số liên tục trên khoảng đều có nguyên hàm trên khoảng đó', 'Hàm số liên tục có duy nhất một nguyên hàm', 'Hai nguyên hàm của cùng một hàm số thì bằng nhau', 'Mọi hàm số đều có nguyên hàm trên R'],
  0,
  {
    hint: 'Nhớ mối liên hệ giữa tính liên tục và sự tồn tại nguyên hàm.',
    explain: {
      correct: 'Định lí: nếu hàm số liên tục trên khoảng thì nó có nguyên hàm trên khoảng đó. Mặt khác, nếu có nguyên hàm thì có vô số, khác nhau một hằng số.',
      wrong: 'Nếu chọn "có duy nhất một nguyên hàm": sai — mọi nguyên hàm của $f$ đều có dạng $F(x) + C$ với $C$ bất kì. Nếu chọn "hai nguyên hàm thì bằng nhau": sai, chúng hằng sai khác.',
      perOption: [
        'Đúng — đây chính là định lí về sự tồn tại nguyên hàm của hàm liên tục.',
        'Sai — có vô số nguyên hàm, khác nhau một hằng số.',
        'Sai — hai nguyên hàm chỉ hằng sai khác, không nhất thiết bằng nhau.',
        'Sai — ví dụ $y = \\frac{1}{x}$ không có nguyên hàm chứa 0.'
      ],
      steps: [
        '1. Nhắc định lí: hàm liên tục trên $(a; b)$ thì có nguyên hàm trên $(a; b)$.',
        '2. Tập hợp nguyên hàm của $f$ là $\\{F(x) + C\\}$ với $C \\in \\mathbb{R}$.',
        '3. Vậy mệnh đề đúng là mệnh đề đầu tiên.'
      ],
      related: 'Định nghĩa nguyên hàm: $F$ là nguyên hàm của $f$ trên $(a;b)$ nếu $F\'(x) = f(x)$ với mọi $x \\in (a;b)$.',
      mistake: 'Nhầm lẫn "nguyên hàm" với "tích phân xác định" — hai khái niệm khác nhau.',
      tip: 'Nhớ: nguyên hàm là HÀM SỐ, tích phân xác định là MỘT SỐ.',
      next: 'Xem lý thuyết Bài 11 — Nguyên hàm.'
    }
  });

q('toan-b11-t2-q1', 'mc1', 2, 'VD',
  'Tìm nguyên hàm của hàm số $f(x) = (2x + 1)^3$.',
  ['$\\frac{(2x+1)^4}{4} + C$', '$\\frac{(2x+1)^4}{8} + C$', '$\\frac{(2x+1)^4}{2} + C$', '$(2x+1)^4 + C$'],
  1,
  {
    hint: 'Đổi biến $u = 2x + 1$, khi đó $du = 2\\,dx$.',
    explain: {
      correct: 'Đặt $u = 2x+1 \\Rightarrow du = 2\\,dx \\Rightarrow dx = \\frac{du}{2}$. Suy ra $\\int (2x+1)^3 dx = \\int u^3 \\cdot \\frac{du}{2} = \\frac{u^4}{8} + C = \\frac{(2x+1)^4}{8} + C$.',
      wrong: 'Nếu chọn $\\frac{(2x+1)^4}{4} + C$: quên chia cho đạo hàm của $u$ theo $x$ (tức 2), đây là lỗi rất phổ biến.',
      perOption: [
        'Sai — chỉ đúng nếu $u\' = 1$, ở đây $u\' = 2$.',
        'Đúng — $\\frac{u^4}{4u\'} = \\frac{(2x+1)^4}{4 \\cdot 2} = \\frac{(2x+1)^4}{8}$.',
        'Sai — nhân thêm 2 thay vì chia.',
        'Sai — quên cả bước lũy thừa tăng và chia.'
      ],
      steps: [
        '1. Đặt $u = 2x + 1$ suy ra $u\' = 2$.',
        '2. $\\int u^3 dx = \\int u^3 \\frac{du}{u\'} = \\frac{1}{2}\\int u^3 du$.',
        '3. $= \\frac{1}{2} \\cdot \\frac{u^4}{4} + C = \\frac{u^4}{8} + C$.',
        '4. Thế lại: $\\frac{(2x+1)^4}{8} + C$.',
        '5. Kiểm tra: đạo hàm của $\\frac{(2x+1)^4}{8}$ là $\\frac{4(2x+1)^3 \\cdot 2}{8} = (2x+1)^3$ ✓.'
      ],
      related: 'Quy tắc đổi biến: nếu đặt $u = ax + b$ thì $\\int f(ax+b)\\,dx = \\frac{1}{a}F(ax+b) + C$ với $F\' = f$.',
      mistake: 'Quên hệ số $1/u\'$ khi đổi biến tuyến tính — lỗi số 1 trong dạng bài này.',
      tip: 'Luôn kiểm tra lại bằng cách lấy đạo hàm của kết quả — nếu thu được $f(x)$ thì đúng.',
      next: 'Luyện thêm đổi biến ở Bài 12 — Tích phân.'
    }
  });
q('toan-b12-t1-q1', 'numeric', 2, 'VD',
  'Tính tích phân $I = \\displaystyle\\int_0^2 (3x^2 + 1)\\,dx$. (Nhập số nguyên)',
  null, '10',
  {
    hint: 'Nguyên hàm của $3x^2 + 1$ là $x^3 + x$; thế cận rồi lấy hiệu.',
    explain: {
      correct: '$\\int_0^2 (3x^2+1)dx = \\left[x^3 + x\\right]_0^2 = (8 + 2) - 0 = 10$.',
      wrong: 'Nếu bạn nhập 6: có thể chỉ tính $x^3$ mà quên $+x$. Nếu nhập 8: quên thêm $x$ tại cận trên.',
      steps: [
        '1. Nguyên hàm: $\\int (3x^2+1)dx = x^3 + x$.',
        '2. Thế cận trên: $F(2) = 2^3 + 2 = 10$.',
        '3. Thế cận dưới: $F(0) = 0$.',
        '4. $I = F(2) - F(0) = 10$.'
      ],
      related: 'Công thức Newton–Leibniz: $\\int_a^b f(x)dx = F(b) - F(a)$ với $F\' = f$.',
      mistake: 'Quên trừ giá trị tại cận dưới — khi $F(0) \\ne 0$ sẽ cho kết quả sai.',
      tip: 'Nhớ thứ tự: trên TRỪ dưới. Luôn viết $F(b) - F(a)$.',
      next: 'Luyện tiếp tích phân với đổi biến ở Bài 12.'
    },
    numeric: { tolerance: 0, unit: '', unitRequired: false }
  });

q('toan-b12-t2-q1', 'numeric', 3, 'VD',
  'Tính tích phân $I = \\displaystyle\\int_0^1 \\dfrac{x}{\\sqrt{x^2 + 1}}\\,dx$, làm tròn đến hàng phần trăm. (Ví dụ: nhập 0.41)',
  null, '0.41',
  {
    hint: 'Đặt $u = x^2 + 1$; nhớ đổi cả hai cận tích phân.',
    explain: {
      correct: 'Đặt $u = x^2+1 \\Rightarrow du = 2x\\,dx$. Khi $x = 0$ thì $u = 1$; khi $x = 1$ thì $u = 2$. Suy ra $I = \\frac{1}{2}\\int_1^2 u^{-1/2}du = \\left[\\sqrt{u}\\right]_1^2 = \\sqrt{2} - 1 \\approx 0{,}414 \\approx 0{,}41$.',
      wrong: 'Nếu bạn nhập 0,5: có thể quên đổi cận tích phân (vẫn tính từ 0 đến 1 theo $u$). Nếu nhập 1,41: quên trừ giá trị tại cận dưới.',
      steps: [
        '1. Đặt $u = x^2 + 1 \\Rightarrow du = 2x\\,dx \\Rightarrow x\\,dx = \\frac{du}{2}$.',
        '2. Đổi cận: $x = 0 \\to u = 1$; $x = 1 \\to u = 2$.',
        '3. $I = \\frac{1}{2}\\int_1^2 u^{-\\frac12}du = \\frac{1}{2}\\left[2\\sqrt{u}\\right]_1^2 = \\left[\\sqrt{u}\\right]_1^2$.',
        '4. $I = \\sqrt{2} - \\sqrt{1} = \\sqrt{2} - 1 \\approx 1{,}414 - 1 = 0{,}414$.',
        '5. Làm tròn: $0{,}41$.'
      ],
      related: 'Khi đổi biến trong tích phân xác định, PHẢI đổi cả hai cận tích phân theo biến mới.',
      mistake: 'Giữ nguyên cận cũ theo $x$ sau khi đổi biến sang $u$ — lỗi rất thường gặp.',
      tip: 'Viết ngay cận mới cạnh tích phân khi đổi biến để không quên.',
      next: 'Luyện thêm bài toán diện tích hình phẳng ở Bài 13.'
    },
    numeric: { tolerance: 0.01, unit: '', unitRequired: false }
  });
q('toan-b13-t1-q1', 'numeric', 3, 'VD',
  'Tính diện tích hình phẳng giới hạn bởi đường thẳng $y = x$, trục hoành và đường thẳng $x = 3$. (Nhập kết quả chính xác, ví dụ 4.5)',
  null, '4.5',
  {
    hint: 'Diện tích bằng $\\displaystyle\\int_0^3 x\\,dx$.',
    explain: {
      correct: '$S = \\int_0^3 x\\,dx = \\left[\\frac{x^2}{2}\\right]_0^3 = \\frac{9}{2} = 4{,}5$. Kiểm tra bằng hình học: tam giác vuông cạnh 3 có diện tích $\\frac{1}{2} \\cdot 3 \\cdot 3 = 4{,}5$ ✓.',
      wrong: 'Nếu bạn nhập 9: đó là tích $3 \\cdot 3$ (diện tích hình vuông), chưa chia 2. Nếu nhập 3: đó chỉ là giá trị $x$ tại cận trên.',
      steps: [
        '1. Nhận dạng: $y = x$ và $y = 0$ cắt nhau tại $x = 0$; giới hạn bên phải bởi $x = 3$.',
        '2. Diện tích: $S = \\int_0^3 \\big(x - 0\\big)dx = \\int_0^3 x\\,dx$.',
        '3. Nguyên hàm: $\\frac{x^2}{2}$.',
        '4. $S = \\frac{9}{2} - 0 = 4{,}5$.',
        '5. Kiểm tra: đúng bằng diện tích tam giác vuông cạnh 3.'
      ],
      related: 'Diện tích hình phẳng $S = \\int_a^b |f(x) - g(x)|dx$ với $f, g$ là hai đường biên.',
      mistake: 'Quên chia 2 khi kiểm chứng bằng hình học, hoặc nhầm cận tích phân.',
      tip: 'Luôn vẽ hình xác định đường biên trên và biên dưới trước khi lập tích phân.',
      next: 'Luyện thêm thể tích vật thể tròn xoay ở Bài 13.'
    },
    numeric: { tolerance: 0.01, unit: '', unitRequired: false }
  });

q('toan-b14-t1-q1', 'mc1', 2, 'VD',
  'Cho mặt phẳng $(P)$ đi qua điểm $M_0(1; 2; 3)$ và có vectơ pháp tuyến $\\vec{n}(2; -1; 4)$. Phương trình nào sau đây là phương trình của $(P)$?',
  ['$2x - y + 4z - 12 = 0$', '$2x - y + 4z - 13 = 0$', '$2x - y + 4z + 12 = 0$', '$x - 2y + 3z - 12 = 0$'],
  0,
  {
    hint: 'Dùng $a(x - x_0) + b(y - y_0) + c(z - z_0) = 0$ rồi khai triển.',
    explain: {
      correct: '$2(x - 1) - (y - 2) + 4(z - 3) = 0 \\Leftrightarrow 2x - 2 - y + 2 + 4z - 12 = 0 \\Leftrightarrow 2x - y + 4z - 12 = 0$.',
      wrong: 'Nếu chọn $-13$: thường do tính sai $2 \\cdot 1 - 1 \\cdot 2 + 4 \\cdot 3 = 2 - 2 + 12 = 12$ thành 13.',
      perOption: [
        'Đúng — $d = -(2 \\cdot 1 - 1 \\cdot 2 + 4 \\cdot 3) = -12$.',
        'Sai — sai số hằng.',
        'Sai — sai dấu số hằng.',
        'Sai — dùng nhầm tọa độ điểm làm vectơ pháp tuyến.'
      ],
      steps: [
        '1. Phương trình mặt phẳng: $a(x-x_0) + b(y-y_0) + c(z-z_0) = 0$.',
        '2. Thế: $2(x-1) - 1(y-2) + 4(z-3) = 0$.',
        '3. Khai triển: $2x - 2 - y + 2 + 4z - 12 = 0$.',
        '4. Thu gọn: $2x - y + 4z - 12 = 0$.',
        '5. Kiểm tra điểm $M_0$: $2 - 2 + 12 - 12 = 0$ ✓.'
      ],
      related: 'Phương trình tổng quát mặt phẳng $ax + by + cz + d = 0$ với $\\vec{n}(a; b; c)$ là vectơ pháp tuyến.',
      mistake: 'Quên đổi dấu khi chuyển từ dạng $a(x-x_0) + ... = 0$ sang dạng $ax+by+cz+d=0$.',
      tip: 'Công thức nhanh: $d = -(ax_0 + by_0 + cz_0)$.',
      next: 'Luyện tiếp vị trí tương đối của hai mặt phẳng ở Bài 14.'
    }
  });
q('toan-b16-t2-q1', 'numeric', 3, 'VD',
  'Cho đường thẳng $d$ có vectơ chỉ phương $\\vec{u}(1; 1; 0)$ và mặt phẳng $(P)$ có vectơ pháp tuyến $\\vec{n}(0; 0; 2)$. Tính $\\sin$ của góc giữa $d$ và $(P)$. (Nhập kết quả, ví dụ 0.71 hoặc 0)',
  null, '0',
  {
    hint: '$\\sin(d, (P)) = |\\cos(\\vec{u}, \\vec{n})|$.',
    explain: {
      correct: '$\\cos(\\vec{u}, \\vec{n}) = \\dfrac{\\vec{u} \\cdot \\vec{n}}{|\\vec{u}| \\cdot |\\vec{n}|} = \\dfrac{0}{\\sqrt{2} \\cdot 2} = 0$. Vậy $\\sin(d, (P)) = 0$ — đường thẳng song song với mặt phẳng.',
      wrong: 'Nếu bạn nhập 0,71: đó là $\\dfrac{\\sqrt{2}}{2}$, tức $\\sin$ của góc giữa $\\vec{u}$ và hình chiếu khi $\\vec{u}$ nghiêng 45°. Ở đây tích vô hướng bằng 0 nên kết quả phải là 0.',
      steps: [
        '1. $\\vec{u} \\cdot \\vec{n} = 1 \\cdot 0 + 1 \\cdot 0 + 0 \\cdot 2 = 0$.',
        '2. Vì tích vô hướng bằng 0 nên $\\vec{u} \\perp \\vec{n}$.',
        '3. $\\sin(d, (P)) = |\\cos(\\vec{u}, \\vec{n})| = 0$.',
        '4. Kết luận: $d \\parallel (P)$.'
      ],
      related: 'Góc giữa đường thẳng và mặt phẳng là góc giữa $\\vec{u}$ và hình chiếu của nó lên $(P)$; $\\sin(d,(P)) = |\\cos(\\vec{u},\\vec{n})|$.',
      mistake: 'Nhầm công thức: dùng $\\cos$ thay vì $\\sin$; hoặc lấy giá trị không lấy trị tuyệt đối.',
      tip: 'Với $\\vec{u} \\perp \\vec{n}$ thì đường thẳng song song với mặt phẳng — dấu hiệu nhận biết rất nhanh.',
      next: 'Luyện thêm góc giữa hai mặt phẳng ở Bài 16.'
    },
    numeric: { tolerance: 0.01, unit: '', unitRequired: false }
  });

q('toan-b17-t1-q1', 'mc1', 2, 'VD',
  'Mặt cầu $(S)$ đi qua điểm $I(1; -2; 3)$ và có bán kính $R = 5$. Phương trình của $(S)$ là',
  ['$(x-1)^2 + (y+2)^2 + (z-3)^2 = 25$', '$(x+1)^2 + (y-2)^2 + (z+3)^2 = 25$', '$(x-1)^2 + (y+2)^2 + (z-3)^2 = 5$', '$(x-1)^2 + (y+2)^2 + (z-3)^2 = -25$'],
  0,
  {
    hint: 'Phương trình mặt cầu tâm $I(a;b;c)$ bán kính $R$ là $(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2$.',
    explain: {
      correct: 'Tâm $I(1; -2; 3)$, $R = 5$ nên $R^2 = 25$. Phương trình: $(x-1)^2 + (y+2)^2 + (z-3)^2 = 25$.',
      wrong: 'Nếu chọn đáp án thứ 2: sai dấu các tọa độ tâm. Nếu chọn đáp án 3: quên bình phương bán kính. Nếu chọn 4: bán kính không thể âm.',
      perOption: [
        'Đúng — đúng tâm và đúng $R^2 = 25$.',
        'Sai — dấu tọa độ tâm bị đảo.',
        'Sai — dùng $R$ thay vì $R^2$.',
        'Sai — vế phải không được âm.'
      ],
      steps: [
        '1. Công thức: $(x - a)^2 + (y - b)^2 + (z - c)^2 = R^2$.',
        '2. Thế $I(1; -2; 3)$: $(x-1)^2 + (y+2)^2 + (z-3)^2$.',
        '3. $R^2 = 5^2 = 25$.',
        '4. Kiểm tra bằng điểm $M(6; -2; 3)$ (cách tâm $I$ đúng 5 đơn vị theo phương $Ox$): $(6-1)^2 + 0 + 0 = 25$ ✓.'
      ],
      related: 'Điểm $M$ thuộc mặt cầu ⟺ $IM = R$; phương trình khai triển có dạng $x^2 + y^2 + z^2 - 2ax - 2by - 2cz + d = 0$.',
      mistake: 'Quên bình phương bán kính hoặc đổi dấu tọa độ tâm khi viết $(x - a)$.',
      tip: 'Dấu trong ngoặc luôn ngược dấu tọa độ tâm: $a = -2$ thì viết $(y + 2)$.',
      next: 'Luyện tiếp vị trí tương đối của đường thẳng với mặt cầu ở Bài 17.'
    }
  });
q('toan-b18-t1-q1', 'mc1', 2, 'TH',
  'Gieo một con xúc xắc cân đối. Biết rằng mặt xuất hiện có số chấm chẵn. Xác suất để mặt đó có số chấm lớn hơn 4 là',
  ['$\\dfrac{1}{6}$', '$\\dfrac{1}{3}$', '$\\dfrac{1}{2}$', '$\\dfrac{2}{3}$'],
  1,
  {
    hint: 'Xét không gian mẫu thu gọn: chỉ các mặt chẵn $\{2; 4; 6\\}$.',
    explain: {
      correct: 'Gọi $A$: mặt chẵn ($n_A = 3$), $B$: mặt $> 4$ trong các mặt chẵn, tức $\\{6\\}$, nên $n_{AB} = 1$. Vậy $P(B|A) = \\frac{P(AB)}{P(A)} = \\frac{1/6}{3/6} = \\frac{1}{3}$.',
      wrong: 'Nếu chọn $\\frac{1}{6}$: đó là xác suất của biến cố $B$ trong không gian mẫu đầy đủ, chưa có điều kiện $A$. Nếu chọn $\\frac{1}{2}$: nhầm khi chỉ xét các mặt $> 4$ là 5, 6 rồi thấy 1 mặt chẵn trong 2.',
      perOption: [
        'Sai — $\\frac{1}{6}$ là xác suất không điều kiện của mặt 6.',
        'Đúng — $\\frac{P(B \\cap A)}{P(A)} = \\frac{1/6}{1/2} = \\frac{1}{3}$.',
        'Sai — sai không gian mẫu thu gọn.',
        'Sai — quá lớn so với 1 mặt thỏa mãn trên 3 mặt chẵn.'
      ],
      steps: [
        '1. Không gian mẫu: $\\Omega = \\{1;2;3;4;5;6\\}$, $n_\\Omega = 6$.',
        '2. $A$: mặt chẵn → $n_A = 3$, $P(A) = \\frac{3}{6} = \\frac{1}{2}$.',
        '3. $B \\cap A$: mặt chẵn và $> 4$ → chỉ $\\{6\\}$, $n_{B\\cap A} = 1$, $P(B\\cap A) = \\frac{1}{6}$.',
        '4. $P(B|A) = \\frac{P(B\\cap A)}{P(A)} = \\frac{1/6}{1/2} = \\frac{1}{3}$.'
      ],
      related: 'Xác suất có điều kiện: $P(B|A) = \\frac{P(B \\cap A)}{P(A)}$ với $P(A) > 0$.',
      mistake: 'Tính xác suất trên toàn bộ không gian mẫu gốc thay vì không gian mẫu thu gọn sau điều kiện.',
      tip: 'Khi đã biết biến cố $A$ xảy ra, coi như không gian mẫu chỉ còn $A$ — đếm trực tiếp sẽ nhanh hơn.',
      next: 'Luyện tiếp tính chất xác suất có điều kiện ở Bài 18.'
    }
  });

q('toan-b19-t1-q1', 'mc1', 3, 'VD',
  'Hộp thứ nhất có 4 bi đỏ và 6 bi xanh; hộp thứ hai có 6 bi đỏ và 4 bi xanh. Chọn ngẫu nhiên một hộp rồi lấy ngẫu nhiên một bi. Xác suất để lấy được bi đỏ là',
  ['$0{,}5$', '$0{,}4$', '$0{,}6$', '$0{,}55$'],
  0,
  {
    hint: 'Dùng công thức xác suất toàn phần với hai giả thết "chọn hộp 1" và "chọn hộp 2".',
    explain: {
      correct: '$P(R) = P(H_1)P(R|H_1) + P(H_2)P(R|H_2) = \\frac{1}{2} \\cdot \\frac{4}{10} + \\frac{1}{2} \\cdot \\frac{6}{10} = \\frac{2}{10} + \\frac{3}{10} = \\frac{5}{10} = 0{,}5$.',
      wrong: 'Nếu chọn 0,4: chỉ tính hộp 1. Nếu chọn 0,6: chỉ tính hộp 2.',
      perOption: [
        'Đúng — $0{,}5$ từ công thức xác suất toàn phần.',
        'Sai — mới chỉ xét hộp thứ nhất.',
        'Sai — mới chỉ xét hộp thứ hai.',
        'Sai — nhầm khi lấy trung bình có trọng số sai.'
      ],
      steps: [
        '1. Giả thuyết: $P(H_1) = P(H_2) = \\frac{1}{2}$.',
        '2. $P(R|H_1) = \\frac{4}{10} = 0{,}4$; $P(R|H_2) = \\frac{6}{10} = 0{,}6$.',
        '3. Công thức xác suất toàn phần: $P(R) = \\frac{1}{2} \\cdot 0{,}4 + \\frac{1}{2} \\cdot 0{,}6 = 0{,}2 + 0{,}3 = 0{,}5$.',
        '4. Kiểm tra: hai giả thuyết có tổng xác suất 1 và $P(R) \\in [0;1]$ ✓.'
      ],
      related: 'Công thức xác suất toàn phần: $P(A) = \\sum P(H_i)P(A|H_i)$ với $\\{H_i\\}$ là hệ thống đầy đủ các giả thuyết.',
      mistake: 'Quên một giả thuyết hoặc dùng sai trọng số $P(H_i)$.',
      tip: 'Luôn kiểm tra $\\sum P(H_i) = 1$ trước khi áp dụng công thức.',
      next: 'Luyện tiếp công thức Bayes ở Bài 19.'
    }
  });

q('toan-b19-t2-q1', 'mc1', 4, 'VDC',
  'Máy $A$ sản xuất 60% sản phẩm, tỉ lệ phế phẩm 2%; máy $B$ sản xuất 40%, tỉ lệ phế phẩm 5%. Lấy ngẫu nhiên một sản phẩm, biết nó là phế phẩm. Xác suất để nó do máy $A$ sản xuất là',
  ['$\\dfrac{3}{8}$', '$\\dfrac{3}{7}$', '$\\dfrac{6}{11}$', '$\\dfrac{2}{7}$'],
  0,
  {
    hint: 'Dùng Bayes: $P(A|PP) = \\dfrac{P(A)P(PP|A)}{P(PP)}$, trong đó $P(PP)$ tính bằng xác suất toàn phần.',
    explain: {
      correct: '$P(PP) = 0{,}6 \\cdot 0{,}02 + 0{,}4 \\cdot 0{,}05 = 0{,}012 + 0{,}02 = 0{,}032$. Vậy $P(A|PP) = \\frac{0{,}6 \\cdot 0{,}02}{0{,}032} = \\frac{0{,}012}{0{,}032} = \\frac{12}{32} = \\frac{3}{8}$.',
      wrong: 'Nếu chọn $\\frac{3}{7}$: đã tính sai mẫu số — có thể đã lấy $0{,}6 \\cdot 0{,}02 + 0{,}4 \\cdot 0{,}02 = 0{,}02$ hoặc tương tự.',
      perOption: [
        'Đúng — $\\frac{0{,}012}{0{,}032} = \\frac{3}{8}$.',
        'Sai — sai mẫu số của Bayes.',
        'Sai — kết quả của $P(B|PP)$ nếu tính ngược nhầm.',
        'Sai — sai cả tử và mẫu.'
      ],
      steps: [
        '1. Giả thuyết: $P(A) = 0{,}6$, $P(B) = 0{,}4$.',
        '2. $P(PP|A) = 0{,}02$; $P(PP|B) = 0{,}05$.',
        '3. $P(PP) = 0{,}6 \\cdot 0{,}02 + 0{,}4 \\cdot 0{,}05 = 0{,}032$.',
        '4. $P(A|PP) = \\frac{0{,}6 \\cdot 0{,}02}{0{,}032} = \\frac{3}{8}$.',
        '5. Kiểm tra: $\\frac{3}{8} + P(B|PP) = 1$ với $P(B|PP) = \\frac{0{,}02}{0{,}032} = \\frac{5}{8}$ ✓.'
      ],
      related: 'Công thức Bayes: $P(H_i|A) = \\frac{P(H_i)P(A|H_i)}{\\sum_j P(H_j)P(A|H_j)}$ — "suy ngược" từ kết quả về nguyên nhân.',
      mistake: 'Nhầm giữa $P(A|PP)$ và $P(PP|A)$ — đây chính là điều Bayes giúp phân biệt.',
      tip: 'Nhớ ý nghĩa: Bayes trả lời "biết kết quả, nguy cơ nào gây ra nó?".',
      next: 'Làm thêm dạng 3 hộp, 3 nhà máy trong Bài 19.'
    }
  });
/* --- Thêm câu hỏi: đủ 5 dạng bài & phủ các bài còn mỏng --- */

q('toan-b1-t1-q7', 'mcq', 3, 'TH',
  'Chọn TẤT CẢ khẳng định ĐÚNG về hàm số $y = f(x)$ có đạo hàm trên $\\mathbb{R}$:',
  [
    'Nếu $f\'(x) > 0$ với mọi $x \\in \\mathbb{R}$ thì $f$ đồng biến trên $\\mathbb{R}$.',
    'Nếu $f$ đồng biến trên $\\mathbb{R}$ thì chỉ cần $f\'(x) \\ge 0$ với mọi $x$ (có thể bằng 0 ở một số điểm).',
    'Nếu $f\'(x) < 0$ với mọi $x \\in (a; b)$ thì $f$ nghịch biến trên $(a; b)$.',
    'Nếu $f$ nghịch biến trên $(a; b)$ thì $f\'(x) < 0$ với mọi $x \\in (a; b)$.'
  ],
  [0, 1, 2],
  {
    hint: 'Nhớ quy tắc xét dấu đạo hàm: $y\'>0$ → đồng biến; $y\'<0$ → nghịch biến. Nhưng điều kiện này là ĐIỀU KIỆN ĐỦ, không phải cần và đủ chặt.',
    explain: {
      correct: 'Cả ba khẳng định 1, 2, 3 đều đúng: $f\'>0$ (hoặc $f\'\\ge 0$ với điều kiện chặt) đủ để suy ra đồng biến; $f\'<0$ đủ để suy ra nghịch biến. Khẳng định 4 SAI: hàm số có thể nghịch biến dù $f\'$ bằng 0 tại một số điểm ví dụ như $y = -x^3$ nghịch biến trên $\\mathbb{R}$ nhưng $f\'(0) = 0$.',
      wrong: 'Lỗi thường gặp là đảo điều kiện: coi $f\' > 0$ là ĐIỀU KIỆN CẦN (thành cần và đủ). Thực tế $f$ đồng biến có thể có $f\'(x_0) = 0$ tại một số điểm rời rạc, như $y = x^3$.',
      perOption: [
        'Đúng — quy tắc xét dấu: $f\'(x) > 0$ trên $\\mathbb{R}$ ⇒ $f$ đồng biến trên $\\mathbb{R}$.',
        'Đúng — $f$ đồng biến chỉ yêu cầu $f\' \\ge 0$ và dấu bằng 0 không xảy ra trên bất kỳ đoạn nào (ví dụ $y = x^3$).',
        'Đúng — $f\'(x) < 0$ trên $(a;b)$ ⇒ $f$ nghịch biến trên $(a;b)$.',
        'SAI — $f$ nghịch biến không suy ra $f\' < 0$ mọi nơi: với $y = -x^3$ thì $f\'(0) = 0$ nhưng $f$ vẫn nghịch biến trên $\\mathbb{R}$.'
      ],
      steps: [
        '1. Quy tắc xét dấu đạo hàm (điều kiện đủ): $f\'(x) > 0$ trên $K$ ⇒ $f$ đồng biến trên $K$; $f\'(x) < 0$ trên $K$ ⇒ $f$ nghịch biến trên $K$.',
        '2. Xét khẳng định 2: hàm số đồng biến thì $f\' \\ge 0$ trên $\\mathbb{R}$; dấu bằng có thể xảy ra tại một số điểm rời rạc mà không ảnh hưởng tính đơn điệu — ví dụ $y = x^3$.',
        '3. Xét khẳng định 4 (phản ví dụ): $y = -x^3$ có $f\'(x) = -3x^2 \\le 0$ và $f\'(0) = 0$; hàm số nghịch biến trên $\\mathbb{R}$ nhưng không thỏa $f\' < 0$ mọi nơi ⇒ khẳng định sai.',
        '4. Kết luận: các khẳng định 1, 2, 3 đúng; khẳng định 4 sai.'
      ],
      related: 'Quy tắc xét dấu đạo hàm và sự khác biệt giữa điều kiện đủ và điều kiện cần và đủ.',
      mistake: 'Đảo chiều logic: "nếu $f\' > 0$ thì đồng biến" không đồng nghĩa "nếu đồng biến thì $f\' > 0$ mọi nơi".',
      tip: 'Khi thấy "với mọi $x$" trong câu khẳng định ngược, hãy nghĩ ngay đến phản ví dụ tại điểm sát biên hoặc điểm đặc biệt như $x^3$ tại 0.',
      next: 'Ôn lại Bài 1 — Quy tắc xét dấu đạo hàm, rồi làm lại câu này.'
    }
  });

q('toan-b1-t1-q8', 'tf', 2, 'TH',
  'Hàm số $y = x^3 - 3x^2 + 4$ đồng biến trên khoảng $[2; +\\infty)$.',
  null, 'true',
  {
    hint: 'Tính $y\'$ rồi xét dấu trên $[2; +\\infty)$. Đúng hay Sai?',
    explain: {
      correct: 'ĐÚNG. $y\' = 3x^2 - 6x = 3x(x - 2)$. Với mọi $x > 2$: $x > 0$ và $x - 2 > 0$ nên $y\' > 0$; tại $x = 2$ thì $y\' = 0$. Vì $y\' \\ge 0$ trên $[2; +\\infty)$ và chỉ bằng 0 tại một điểm duy nhất nên hàm số đồng biến trên $[2; +\\infty)$.',
      wrong: 'Nếu bạn chọn SAI có thể do thấy $y\'(2) = 0$ và cho rằng "bằng 0 thì không đồng biến". Thực tế điều kiện là $y\' \\ge 0$ và dấu bằng 0 chỉ xảy ra tại một điểm rời rạc — hàm số VẪN đồng biến.',
      steps: [
        '1. $y\' = 3x^2 - 6x = 3x(x - 2)$.',
        '2. $y\' = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$.',
        '3. Trên $[2; +\\infty)$: $x \\ge 2 > 0$ và $x - 2 \\ge 0$, nên $y\' = 3x(x-2) \\ge 0$; dấu bằng xảy ra duy nhất tại $x = 2$.',
        '4. $y\' \\ge 0$ và $y\' = 0$ chỉ tại hữu hạn điểm ⇒ $y$ đồng biến trên $[2; +\\infty)$.'
      ],
      related: 'Tính đơn điệu trên khoảng đóng: chấp nhận $y\' = 0$ tại hữu hạn điểm.',
      mistake: 'Nhầm yêu cầu $y\' > 0$ nghiêm ngặt; thực tế $y\' \\ge 0$ với bằng 0 tại hữu hạn điểm là đủ.',
      tip: 'Ghi nhớ: trên đoạn, $y\' \\ge 0$ + không đồng thời 0 trên đoạn con ⇒ đồng biến.',
      next: 'Ôn lại Bài 1 — Tính đơn điệu.'
    }
  });

q('toan-b1-t2-q9', 'short', 3, 'VD',
  'Cho hàm số $y = x^3 - 3x + 1$. Nhập giá trị cực đại của hàm số (một số nguyên).',
  null, '3',
  {
    hint: 'Tìm $y\' = 0$, đối chiếu $y$ tại hai điểm rồi lấy giá trị lớn hơn.',
    explain: {
      correct: '$y\' = 3x^2 - 3 = 3(x-1)(x+1)$; $y\' = 0 \\Leftrightarrow x = \\pm 1$. $y(-1) = -1 + 3 + 1 = 3$ (cực đại vì $y\'$ đổi dấu $+ \\to -$); $y(1) = 1 - 3 + 1 = -1$ (cực tiểu). Giá trị cực đại bằng 3.',
      wrong: 'Nếu bạn nhập $-1$: đó là GIÁ TRỊ CỰC TIỂU tại $x = 1$, không phải cực đại. Nếu nhập $1$: đó là hoành độ cực tiểu chứ không phải giá trị.',
      steps: [
        '1. $y\' = 3x^2 - 3 = 3(x-1)(x+1)$; $y\' = 0 \\Leftrightarrow x = 1$ hoặc $x = -1$.',
        '2. Bảng biến thiên: $y\' > 0$ trên $(-\\infty; -1)$ và $(1; +\\infty)$; $y\' < 0$ trên $(-1; 1)$.',
        '3. Tại $x = -1$: $y\'$ đổi dấu $+ \\to -$ ⇒ cực đại, $y(-1) = (-1)^3 - 3(-1) + 1 = -1 + 3 + 1 = 3$.',
        '4. Tại $x = 1$: $y\'$ đổi dấu $- \\to +$ ⇒ cực tiểu, $y(1) = 1 - 3 + 1 = -1$.',
        '5. Giá trị cực đại của hàm số: $3$.'
      ],
      related: 'Giá trị cực trị = giá trị hàm số tại hoành độ điểm cực trị.',
      mistake: 'Nhầm giữa giá trị cực trị với hoành độ điểm cực trị, hoặc nhầm cực đại với cực tiểu.',
      tip: 'Luôn hỏi lại "cần tìm gì": hoành độ hay giá trị cực trị.',
      next: 'Ôn lại Bài 1 — Cực trị của hàm số.'
    }
  });
/* --- Thêm: Toán 12 — các bài còn mỏng --- */

q('toan-b13-t2-q1', 'mc1', 3, 'VD',
  'Thể tích vật thể tròn xoay sinh bởi đoạn thẳng $y = x$ ($0 \\le x \\le 2$) quay một vòng quanh trục hoành bằng',
  ['$\\dfrac{8\\pi}{3}$', '$4\\pi$', '$2\\pi$', '$8\\pi$'],
  0,
  {
    hint: 'Vật tròn xoay quanh trục hoành: $V = \\pi\\int_a^b [f(x)]^2 dx$.',
    explain: {
      correct: 'Đoạn thẳng $y = x$ quay quanh trục hoành tạo hình nón đáy bán kính 2, chiều cao 2. Theo tích phân: $V = \\pi\\int_0^2 x^2 dx = \\pi \\cdot \\dfrac{x^3}{3}\\Big|_0^2 = \\dfrac{8\\pi}{3}$. Kiểm tra bằng công thức nón: $V = \\dfrac{1}{3}\\pi R^2 h = \\dfrac{1}{3}\\pi \\cdot 4 \\cdot 2 = \\dfrac{8\\pi}{3}$ ✓.',
      wrong: 'Nếu chọn $4\\pi$: đó là $\\pi\\int_0^2 x^2 dx$ với tính nhầm tích phân (dùng $x^2$ thành $x^3$ mà quên /3). Nếu chọn $8\\pi$: quên $1/3$ của nón.',
      perOption: [
        'Đúng — $\\pi \\cdot 8/3 = 8\\pi/3$.',
        'Sai — tính nhầm nguyên hàm hoặc quên $\\pi$.',
        'Sai — kết quả của tích phân $\\int x dx$ không đúng dạng.',
        'Sai — quên chia 3 (công thức thể tích nón).'
      ],
      steps: [
        '1. Vật thể: đoạn $y = x$ trên $[0; 2]$ quay quanh $Ox$ ⇒ nón có đáy bán kính $R = 2$ và chiều cao $h = 2$.',
        '2. Công thức tích phân (quay quanh trục hoành): $V = \\pi\\int_0^2 y^2 dx = \\pi\\int_0^2 x^2 dx$.',
        '3. Nguyên hàm: $\\dfrac{x^3}{3}$.',
        '4. Thế cận: $V = \\pi\\left(\\dfrac{8}{3} - 0\\right) = \\dfrac{8\\pi}{3}$.',
        '5. Đối chiếu công thức nón: $\\frac{1}{3}\\pi R^2 h = \\frac{1}{3}\\pi \\cdot 4 \\cdot 2 = \\frac{8\\pi}{3}$ ✓.'
      ],
      related: 'Thể tích vật thể tròn xoay $V = \\pi\\int_a^b [f(x)]^2 dx$ quanh trục hoành.',
      mistake: 'Quên $\\pi$ hoặc thay $[f(x)]^2$ thành $f(x)$; nhầm công thức quay quanh trục tung.',
      tip: 'Đề hình nón, hình trụ hãy đối chiếu tích phân với công thức hình học để tự kiểm.',
      next: 'Ôn lại Bài 13 — Ứng dụng hình học của tích phân.'
    }
  });

G.QUESTIONS_TOAN = Q;

})(typeof window !== 'undefined' ? window : globalThis);
