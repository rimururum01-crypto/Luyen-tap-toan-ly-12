/* ============================================================
   HỌC LIỆU LÝ THUYẾT — Toán 12 & Vật lí 12
   key = lessonId (khớp với curriculum.js)
   fields: goal[], core[], defs[], formulas[], meanings[],
           rules[], examples[], mistakes[], tips[], summary[],
           selfCheck[], flashcards[{front,back}]
   ============================================================ */
(function (G) {
'use strict';

const T = {};

function lesson(id, data) { T[id] = data; }

/* ================= TOÁN 12 ================= */

lesson('toan-b1', {
  goal: [
    'Nắm vững quy tắc xét dấu đạo hàm để xét tính đơn điệu của hàm số.',
    'Xác định điểm cực trị, giá trị cực trị và phân biệt cực đại với cực tiểu.',
    'Vận dụng điều kiện để hàm số đồng biến (hoặc nghịch biến) trên một khoảng, đoạn, $\\mathbb{R}$.'
  ],
  core: [
    'Dấu của đạo hàm quyết định chiều biến thiên của hàm số.',
    'Số điểm cực trị được xác định bởi số lần đạo hàm đổi dấu, không phải số nghiệm $y\' = 0$.'
  ],
  defs: [
    { t: 'Hàm số đồng biến trên khoảng $K$', d: '$\\forall x_1, x_2 \\in K$, $x_1 < x_2 \\Rightarrow f(x_1) < f(x_2)$.' },
    { t: 'Điểm cực trị $x_0$', d: 'Tồn tại $h > 0$ sao cho trên $(x_0 - h; x_0 + h)$: $f(x)$ đổi chiều biến thiên khi qua $x_0$.' },
    { t: 'Điều kiện cần của cực trị', d: 'Nếu $f$ có cực trị tại $x_0$ và $f\'(x_0)$ tồn tại thì $f\'(x_0) = 0$.' }
  ],
  formulas: [
    { t: 'Quy tắc xét dấu đạo hàm', f: '\\begin{cases} y\' > 0 \\\\ (\\forall x \\in K) \\Rightarrow y \\\\ \\text{đồng biến trên } K \\\\ y\' < 0 \\\\ (\\forall x \\in K) \\Rightarrow y \\\\ \\text{nghịch biến trên } K \\end{cases}' },
    { t: 'Điều kiện đủ của cực trị', f: '\\begin{cases} f\'(x_0) = 0 \\\\ f\' \\\\ \\text{đổi dấu khi qua } x_0 \\end{cases} \\\\ \\text{(đổi dấu } + \\to - : \\\\ \\text{cực đại; } - \\to + : \\\\ \\text{cực tiểu})' },
    { t: 'Đồng biến trên $\\mathbb{R}$ (hàm bậc 3)', f: 'y = ax^3 + bx^2 + cx + d \\\\ (a > 0), \\\\ \\Delta\' = b^2 - 3ac \\\\le 0' }
  ],
  meanings: [
    { s: '$\\Delta\'$', m: 'Nửa biệt biến của phương trình $y\' = 0$; quyết định đạo hàm có đổi dấu hay không.' },
    { s: '$x_0$', m: 'Hoành độ điểm cực trị — nơi đồ thị "quay đầu".' }
  ],
  rules: [
    'Muốn xét đơn điệu: tìm $y\'$, giải $y\' = 0$, lập bảng xét dấu.',
    'Nghiệm kép của $y\' = 0$ thường KHÔNG phải điểm cực trị (đạo hàm không đổi dấu).',
    'Muốn tìm tham số để hàm số đơn điệu trên $\\mathbb{R}$: dùng $\\Delta\' \\le 0$ kết hợp điều kiện hệ số.'
  ],
  examples: [
    {
      q: 'Khảo sát sự biến thiên và tìm cực trị của $y = x^3 - 3x$.',
      steps: [
        'Tập xác định: $\\mathbb{R}$.',
        '$y\' = 3x^2 - 3 = 3(x-1)(x+1)$; $y\' = 0 \\Leftrightarrow x = \\pm 1$.',
        'Bảng biến thiên: $y\' > 0$ trên $(-\\infty; -1)$ và $(1; +\\infty)$; $y\' < 0$ trên $(-1; 1)$.',
        '$x = -1$: $y\'$ đổi dấu $+ \\to -$ → cực đại, $y_{CĐ} = y(-1) = 2$.',
        '$x = 1$: $y\'$ đổi dấu $- \\to +$ → cực tiểu, $y_{CT} = y(1) = -2$.'
      ]
    }
  ],
  mistakes: [
    'Cho rằng mọi nghiệm $y\' = 0$ đều là điểm cực trị.',
    'Chỉ xét dấu $y\'$ tại một điểm rồi kết luận cho cả khoảng.',
    'Nhầm chiều đổi dấu nên kết luận ngược cực đại và cực tiểu.'
  ],
  tips: [
    'Với hàm bậc 3: $\\Delta\' > 0$ → 2 điểm cực trị; $\\Delta\' \\le 0$ → không có cực trị.',
    'Nhớ câu: "cùng dấu rồi khác dấu là cực tiểu; khác dấu rồi cùng dấu là cực đại".'
  ],
  summary: [
    '$y\' > 0 \\to$ đồng biến, $y\' < 0 \\to$ nghịch biến.',
    'Cực trị xét qua sự đổi dấu của $y\'$.',
    'Đơn điệu trên $\\mathbb{R}$ với bậc 3: $a > 0$ và $\\Delta\' \\le 0$.'
  ],
  selfCheck: [
    'Tại sao $y = x^3$ không có điểm cực trị dù $y\'(0) = 0$?',
    'Cho $f\'(x) = x(x-2)(x+2)$. Hàm số nghịch biến trên những khoảng nào?'
  ],
  flashcards: [
    { front: 'Quy tắc xét dấu đạo hàm?', back: '$y\' > 0$ trên $K$ → đồng biến trên $K$; $y\' < 0$ → nghịch biến trên $K$.' },
    { front: 'Điều kiện đủ để $x_0$ là điểm cực trị?', back: '$f\'(x_0) = 0$ và $f\'$ đổi dấu khi qua $x_0$.' },
    { front: 'Nhận biết cực đại qua đạo hàm?', back: '$f\'$ đổi dấu từ $+$ sang $-$ khi qua $x_0$.' },
    { front: 'Điều kiện để $y = ax^3 + bx^2 + cx + d$ đồng biến trên $\\mathbb{R}$?', back: '$a > 0$ và $\\Delta\' = b^2 - 3ac \\le 0$.' }
  ]
});
lesson('toan-b4', {
  goal: [
    'Thực hiện đúng quy trình khảo sát hàm số và vẽ đồ thị.',
    'Vận dụng đồ thị để đếm nghiệm của phương trình, giải bất phương trình.',
    'Nhận biết đồ thị hàm số qua các dấu hiệu đặc trưng.'
  ],
  core: [
    'Khảo sát là tổng hợp: tập xác định → tiệm cận → đạo hàm → bảng biến thiên → đồ thị.',
    'Số nghiệm $f(x) = m$ đọc trực tiếp từ bảng biến thiên hoặc số giao điểm của đồ thị với đường $y = m$.'
  ],
  defs: [
    { t: 'Tiệm cận đứng', d: '$x = x_0$ nếu $\\lim_{x \\to x_0^+} f(x) = \\pm\\infty$ hoặc $\\lim_{x \\to x_0^-} f(x) = \\pm\\infty$.' },
    { t: 'Tiệm cận ngang', d: '$y = y_0$ nếu $\\lim_{x \\to +\\infty} f(x) = y_0$ hoặc $\\lim_{x \\to -\\infty} f(x) = y_0$.' },
    { t: 'Tiệm cận xiên', d: '$y = ax + b$ với $a = \\lim_{x \\to \\infty} \\frac{f(x)}{x} \\ne 0$, $b = \\lim_{x \\to \\infty} [f(x) - ax]$.' }
  ],
  formulas: [
    { t: 'Hai giới hạn vô cực khác nhau', f: '\\lim_{x \\to +\\infty} f(x) \\ne \\lim_{x \\to -\\infty} f(x) \\\\Rightarrow \\\\ \\text{có HAI tiệm cận ngang}' },
    { t: 'Đếm nghiệm qua bảng biến thiên', f: '\\text{Số nghiệm } f(x) = m \\\\ = \\\\ \\text{số giao điểm của đồ thị với đường } y = m' },
    { t: 'Quy tắc 3 nghiệm (bậc 3)', f: '\\begin{cases} y_{CĐ} \\\\cdot y_{CT} < 0 \\\\Rightarrow 3 \\\\ \\text{nghiệm} \\\\ y_{CĐ} \\\\cdot y_{CT} = 0 \\\\Rightarrow 2 \\\\ \\text{nghiệm} \\\\ y_{CĐ} \\\\cdot y_{CT} > 0 \\\\Rightarrow 1 \\\\ \\text{nghiệm} \\end{cases}' }
  ],
  meanings: [
    { s: '$a$ trong tiệm cận xiên', m: 'Hệ số góc; cho biết đồ thị "nghiêng" như thế nào khi đi xa về $\\pm\\infty$.' }
  ],
  rules: [
    'Bước 1: Tìm tập xác định, xét tính chẵn lẻ nếu có.',
    'Bước 2: Tìm tiệm cận (đứng, ngang, xiên).',
    'Bước 3: Tính $y\'$, tìm điểm có đạo hàm bằng 0 hoặc không xác định.',
    'Bước 4: Lập bảng biến thiên, xác định cực trị.',
    'Bước 5: Tìm thêm một số điểm đặc biệt rồi vẽ đồ thị.'
  ],
  examples: [
    {
      q: 'Cho $y = x^3 - 3x^2 - 9x + 5$. Phương trình $f(x) = 0$ có mấy nghiệm?',
      steps: [
        '$y\' = 3x^2 - 6x - 9 = 3(x-3)(x+1)$; $y\' = 0$ tại $x = -1, 3$.',
        'Bảng biến thiên: $y\'$ đổi dấu $+ \\to -$ tại $x = -1$ (cực đại), $- \\to +$ tại $x = 3$ (cực tiểu).',
        '$y(-1) = 10 > 0$; $y(3) = -22 < 0$.',
        '$y_{CĐ} \\cdot y_{CT} < 0$ → đồ thị cắt trục hoành 3 lần → phương trình có 3 nghiệm phân biệt.'
      ]
    }
  ],
  mistakes: [
    'Quên xét cả $\\lim_{x \\to +\\infty}$ và $\\lim_{x \\to -\\infty}$ khi tìm tiệm cận ngang.',
    'Sai dấu khi tính giới hạn về $-\\infty$ với biểu thức chứa $\\sqrt{x^2}$ (cần đặt $x = -\\sqrt{x^2}$ với $x < 0$).',
    'Tính nhầm giá trị cực trị dẫn đến kết luận sai về số nghiệm.'
  ],
  tips: [
    'Với $x < 0$: $x = -\\sqrt{x^2}$ — mẹo tránh sai dấu khi tính giới hạn.',
    'Đọc số nghiệm trên bảng biến thiên: đếm số lần đồ thị cắt đường thẳng $y = m$.'
  ],
  summary: [
    'Quy trình 5 bước: TXĐ → tiệm cận → đạo hàm → bảng biến thiên → đồ thị.',
    'Tiệm cận ngang có thể có hai (hai phía $\\pm\\infty$ cho hai giá trị khác nhau).',
    'Đếm nghiệm: xem giao điểm đồ thị với đường thẳng $y = m$.'
  ],
  selfCheck: [
    'Tại sao hàm số có tiệm cận ngang thì không thể có tiệm cận xiên?',
    'Cho $y = \\frac{x-2}{\\sqrt{x^2+1}}$. Có mấy tiệm cận ngang?'
  ],
  flashcards: [
    { front: 'Khi nào có tiệm cận đứng?', back: 'Khi $\\lim_{x \\to x_0^\\pm} f(x) = \\pm\\infty$ tại điểm $x_0$ bất thường.' },
    { front: 'Khi nào có tiệm cận xiên?', back: 'Khi $a = \\lim_{x \\to \\infty} \\frac{f(x)}{x} \\ne 0$.' },
    { front: 'Điều kiện để $f(x) = 0$ có 3 nghiệm (bậc 3)?', back: '$y_{CĐ} > 0$ và $y_{CT} < 0$ (tích âm).' }
  ]
});
/*__NEXT_THEORY__*/

G.THEORY = T;

})(typeof window !== 'undefined' ? window : globalThis);