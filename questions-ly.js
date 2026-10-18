/* ============================================================
   NGÂN HÀNG CÂU HỎI — VẬT LÍ 12 (Kết nối tri thức với cuộc sống)
   Mỗi công thức đều có: ý nghĩa, đơn vị, điều kiện áp dụng,
   giải thích đúng/sai, lời giải từng bước và kiểm tra đơn vị.
   id: ly-<bai>-<topic>-q<n>
   ============================================================ */
(function (G) {
'use strict';

const Q = [];

function q(id, type, diff, cog, question, options, correct, extra) {
  const parts = id.split('-');
  const lessonId = parts[0] + '-' + parts[1];
  const topicId = parts[0] + '-' + parts[1] + '-' + parts[2];
  const e = (extra && extra.explain) || {};
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

/* ============ CHƯƠNG I — VẬT LÍ NHIỆT ============ */

/* --- Bài 3. Nhiệt độ, thang nhiệt độ --- */
q('ly-b3-t1-q1', 'mc1', 1, 'NB',
  'Nhiệt độ $25^{\\circ}C$ ứng với nhiệt độ bao nhiêu trên thang Kenvin?',
  ['$273{,}15\\ K$', '$298{,}15\\ K$', '$248{,}15\\ K$', '$273\\ K$'],
  1,
  {
    hint: 'Dùng công thức chuyển đổi $T(K) = t(^{\\circ}C) + 273{,}15$.',
    explain: {
      correct: 'Công thức chuyển đổi: $T(K) = t(^{\\circ}C) + 273{,}15$. Với $t = 25^{\\circ}C$: $T = 25 + 273{,}15 = 298{,}15\\ K$.',
      wrong: 'Nếu chọn $273{,}15\\ K$: đó là nhiệt độ của $0^{\\circ}C$. Nếu chọn $248{,}15\\ K$: đã trừ thay vì cộng 273,15.',
      perOption: [
        'Sai — $273{,}15\\ K$ ứng với $0^{\\circ}C$.',
        'Đúng — $25 + 273{,}15 = 298{,}15\\ K$.',
        'Sai — do trừ 273,15 thay vì cộng.',
        'Sai — thiếu $0{,}15$ do làm tròn sai.'
      ],
      steps: [
        '1. Dữ kiện: $t = 25^{\\circ}C$.',
        '2. Công thức: $T = t + 273{,}15$.',
        '3. Thay số: $T = 25 + 273{,}15 = 298{,}15\\ K$.',
        '4. Kiểm tra: $T$ lớn hơn $t$ một khoảng cố định $273{,}15$ — hợp lí ✓.',
        '5. Kết luận: $298{,}15\\ K$.'
      ],
      related: 'Thang Kenvin là thang nhiệt độ tuyệt đối; $0\\ K = -273{,}15^{\\circ}C$ (độ không tuyệt đối).',
      mistake: 'Nhầm công thức thành $T = t - 273{,}15$, hoặc dùng 273 thay cho 273,15 khi đề yêu cầu chính xác.',
      tip: 'Nhớ nhanh: độ Kenvin luôn lớn hơn độ Celsius một khoảng $273{,}15$ — nếu kết quả nhỏ hơn thì bạn đã trừ nhầm.',
      next: 'Luyện thêm đổi ngược từ K sang °C trong Bài 3.'
    }
  });
/* --- Bài 4. Nhiệt dung riêng --- */
q('ly-b4-t1-q1', 'numeric', 2, 'VD',
  'Cho khối lượng $m = 2\\ kg$ nước có nhiệt dung riêng $c = 4200\\ J/(kg.K)$. Tính nhiệt lượng cần cung cấp để làm nóng nước từ $20^{\\circ}C$ đến $80^{\\circ}C$. (Nhập số nguyên, đơn vị J)',
  null, '504000',
  {
    hint: 'Dùng $Q = mc\\Delta t$, trong đó $\\Delta t$ tính bằng °C hay K đều cho cùng độ biến thiên.',
    explain: {
      correct: '$\\Delta t = 80 - 20 = 60\\ K$. $Q = mc\\Delta t = 2 \\cdot 4200 \\cdot 60 = 504000\\ J$.',
      wrong: 'Nếu bạn ra $8400000$: đã dùng $\\Delta t = 100$ thay vì 60. Nếu ra $8400$: quên nhân với $\\Delta t$.',
      steps: [
        '1. Dữ kiện: $m = 2\\ kg$; $c = 4200\\ J/(kg.K)$; $t_1 = 20^{\\circ}C$; $t_2 = 80^{\\circ}C$.',
        '2. Yêu cầu: nhiệt lượng $Q$ cần cung cấp.',
        '3. Công thức: $Q = mc\\Delta t$ với $\\Delta t = t_2 - t_1$.',
        '4. Lý do chọn: nước chỉ thay đổi nhiệt độ, không chuyển thể nên nhiệt nóng chảy/hóa hơi bằng 0.',
        '5. Tính: $\\Delta t = 60\\ K$; $Q = 2 \\cdot 4200 \\cdot 60 = 504000\\ J$.',
        '6. Kiểm tra đơn vị: $kg \\cdot \\frac{J}{kg.K} \\cdot K = J$ ✓. Kiểm tra hợp lí: $Q > 0$ → nước thu nhiệt ✓.',
        '7. Kết luận: $Q = 504000\\ J = 504\\ kJ$.'
      ],
      related: 'Nhiệt dung riêng $c$: nhiệt lượng cần để làm 1 kg chất tăng 1 độ. Nước có $c$ lớn nên cần nhiều nhiệt lượng.',
      mistake: 'Quên đổi gam sang kg, hoặc dùng $c = 4{,}2$ thay vì $4200\\ J/(kg.K)$ gây sai 1000 lần.',
      tip: 'Với bài có chuyển thể, nhớ cộng thêm $Q_{nóng\\ chảy} = m\\lambda$ hoặc $Q_{hóa\\ hơi} = mL$.',
      next: 'Làm tiếp bài toán cân bằng nhiệt (Bài 4, chủ đề 2).'
    },
    numeric: { answer: 504000, tolerance: 0, unit: 'J', unitRequired: false }
  });

q('ly-b4-t2-q1', 'mc1', 3, 'VD',
  'Ngâm khối nhôm $m_1 = 0{,}5\\ kg$ ở $100^{\\circ}C$ vào $m_2 = 2\\ kg$ nước ở $20^{\\circ}C$. Bỏ qua toả nhiệt ra môi trường. Nhiệt độ cân bằng là ($c_{Al} = 880\\ J/(kg.K)$; $c_n = 4200\\ J/(kg.K)$)',
  ['Khoảng $24^{\\circ}C$', 'Khoảng $60^{\\circ}C$', 'Khoảng $40^{\\circ}C$', 'Đúng $60^{\\circ}C$'],
  0,
  {
    hint: 'Dùng phương trình cân bằng nhiệt: nhiệt lượng nhôm toả ra = nhiệt lượng nước thu vào.',
    explain: {
      correct: '$Q_{toả} = Q_{thu}$: $m_1c_{Al}(100 - t) = m_2c_n(t - 20)$. Thay số: $0{,}5 \\cdot 880(100-t) = 2 \\cdot 4200(t-20)$ → $440(100-t) = 8400(t-20)$ → $44000 - 440t = 8400t - 168000$ → $t = \\frac{212000}{8840} \\approx 24^{\\circ}C$.',
      wrong: 'Nếu chọn 60°C: đã coi hai chất có cùng nhiệt dung riêng. Nước có $mc$ lớn hơn nhiều nên nhiệt độ cuối lệch gần 20°C.',
      perOption: [
        'Đúng — giải phương trình cân bằng nhiệt cho $t \\approx 24^{\\circ}C$.',
        'Sai — chỉ đúng nếu hai chất có cùng nhiệt dung riêng.',
        'Sai — tính sai dấu hoặc nhầm hệ số nhiệt dung.',
        'Sai — trung bình cộng không có nghĩa vật lí khi nhiệt dung khác nhau.'
      ],
      steps: [
        '1. Dữ kiện: $m_1 = 0{,}5\\ kg$, $t_1 = 100^{\\circ}C$, $c_1 = 880$; $m_2 = 2\\ kg$, $t_2 = 20^{\\circ}C$, $c_2 = 4200$.',
        '2. Nhôm nóng hơn nên nhôm toả nhiệt, nước thu nhiệt: $Q_{toả} = Q_{thu}$.',
        '3. $Q_{toả} = m_1c_1(100 - t)$; $Q_{thu} = m_2c_2(t - 20)$.',
        '4. Phương trình: $440(100 - t) = 8400(t - 20)$.',
        '5. Giải: $44000 - 440t = 8400t - 168000 \\Rightarrow t = \\frac{212000}{8840} \\approx 24^{\\circ}C$.',
        '6. Kiểm tra: $20 < 24 < 100$ ✓ (nằm giữa hai nhiệt độ đầu).',
        '7. Kết luận: nhiệt độ cân bằng khoảng $24^{\\circ}C$.'
      ],
      related: 'Phương trình cân bằng nhiệt $\\sum Q_{toả} = \\sum Q_{thu}$ — hệ quả của bảo toàn năng lượng khi bỏ qua thất thoát.',
      mistake: 'Gán nhầm chiều toả/thu nhiệt làm $\\Delta t$ âm; hoặc quên rằng chất có $mc$ lớn hơn sẽ "kéo" nhiệt độ cuối về phía mình.',
      tip: 'Kiểm tra nhanh: nhiệt độ cuối phải nằm giữa hai nhiệt độ ban đầu và lệch về phía chất có $mc$ lớn hơn.',
      next: 'Luyện thêm bài có 3 chất trong bài tập về nhiệt (Bài 7).'
    }
  });
/* --- Bài 1. Cấu trúc chất, sự chuyển thể --- */
q('ly-b1-t1-q1', 'mc1', 1, 'NB',
  'Lực liên kết giữa các phân tử mạnh nhất trong thể trạng thái nào sau đây?',
  ['Thể rắn', 'Thể lỏng', 'Thể khí', 'Cả ba như nhau'],
  0,
  {
    hint: 'Sức cản của vật chất đối với biến dạng phản ánh mức độ mạnh yếu của lực liên kết.',
    explain: {
      correct: 'Trong thể rắn, các phân tử sắp xếp có trật tự và lực liên kết giữa chúng mạnh nhất, nên rắn giữ được hình dạng và thể tích.',
      wrong: 'Nếu chọn thể lỏng: lực liên kết yếu hơn rắn nên lỏng không giữ hình dạng. Nếu chọn thể khí: liên kết rất yếu.',
      perOption: [
        'Đúng — rắn có lực liên kết mạnh nhất.',
        'Sai — lỏng yếu hơn rắn, chỉ giữ thể tích.',
        'Sai — khí có liên kết rất yếu, không giữ cả hình dạng lẫn thể tích.',
        'Sai — lực liên kết thay đổi rõ rệt giữa các thể.'
      ],
      steps: [
        '1. Nhớ hệ thống phân tử: rắn (trật tự cao, liên kết mạnh) → lỏng (trật tự thấp hơn) → khí (hỗn loạn, liên kết rất yếu).',
        '2. Hệ quả về tính chất: rắn giữ hình dạng và thể tích; lỏng giữ thể tích; khí không giữ cả hai.',
        '3. Kết luận: rắn có lực liên kết mạnh nhất.'
      ],
      related: 'Sự chuyển thể (nóng chảy, đông đặc, bay hơi, ngưng kết, thăng hoa) là hệ quả của sự thay đổi lực liên kết khi nhiệt độ thay đổi.',
      mistake: 'Nhầm rằng lực liên kết phụ thuộc khối lượng riêng; thực tế nó phụ thuộc bản chất chất và nhiệt độ.',
      tip: 'Nhớ chuỗi 3 thể: rắn "giữ cả hai", lỏng "giữ thể tích", khí "không giữ gì".',
      next: 'Xem sơ đồ chuyển thể ở chủ đề 2 của Bài 1.'
    }
  });

q('ly-b1-t2-q1', 'mc1', 2, 'TH',
  'Sơ đồ chuyển thể nào sau đây diễn tả đúng quá trình "thăng hoa"?',
  ['Rắn → Lỏng', 'Lỏng → Khí ở mọi nhiệt độ', 'Khí → Lỏng', 'Rắn → Khí'],
  3,
  {
    hint: 'Thăng hoa là quá trình chuyển từ thể rắn trực tiếp sang thể khí.',
    explain: {
      correct: 'Thăng hoa là quá trình RẮN → KHÍ, không qua thể lỏng (ví dụ: naphthalen bay hơi, iốt nóng lên, long não).',
      wrong: 'Nếu chọn "Rắn → Lỏng": đó là nóng chảy. Nếu chọn "Lỏng → Khí": đó là bay hơi (hay hóa hơi khi sôi). Nếu chọn "Khí → Lỏng": đó là ngưng kết.',
      perOption: [
        'Sai — Rắn → Lỏng là nóng chảy.',
        'Sai — Lỏng → Khí là bay hơi (hay hóa hơi ở nhiệt độ sôi), khác với thăng hoa.',
        'Sai — Khí → Lỏng là ngưng kết.',
        'Đúng — thăng hoa chính là Rắn → Khí, bỏ qua thể lỏng.'
      ],
      steps: [
        '1. Phân biệt: nóng chảy (R→L), bay hơi (L→K, mọi nhiệt độ), hóa hơi (L→K, ở nhiệt độ sôi), thăng hoa (R→K).',
        '2. Thăng hoa không qua thể lỏng — đây là dấu hiệu nhận biết quan trọng.',
        '3. Kết luận: Rắn → Khí.'
      ],
      related: 'Sơ đồ chuyển thể: nóng chảy/đông đặc (R↔L), bay hơi–hóa hơi/ngưng kết (L↔K), thăng hoa/tống khí (R↔K).',
      mistake: 'Nhầm thăng hoa với bay hơi; cả hai đều cho khí nhưng thăng hoa xuất phát từ rắn.',
      tip: 'Nhớ "thăng hoa = rắn nhảy cóc qua lỏng để thành khí".',
      next: 'Luyện tiếp dạng tính nhiệt lượng gồm nhiều chặng (nhiệt độ + chuyển thể) trong Bài 4–6.'
    }
  });

/* --- Bài 5. Nhiệt nóng chảy riêng --- */
q('ly-b5-t1-q1', 'mc1', 2, 'VD',
  'Nhiệt nóng chảy riêng của nước đá là $\\lambda = 3{,}34 \\cdot 10^5\\ J/kg$. Nhiệt lượng cần để làm tan chảy hoàn toàn $m = 200\\ g$ nước đá ở $0^{\\circ}C$ là',
  ['$66{,}8\\ kJ$', '$66{,}8\\ J$', '$6{,}68\\ J$', '$668\\ kJ$'],
  0,
  {
    hint: 'Dùng $Q = m\\lambda$; chú ý đổi gam sang kg.',
    explain: {
      correct: '$Q = m\\lambda = 0{,}2 \\cdot 3{,}34 \\cdot 10^5 = 6{,}68 \\cdot 10^4\\ J = 66{,}8\\ kJ$.',
      wrong: 'Nếu ra 66,8 J: quên đổi 200 g = 0,2 kg. Nếu ra 668 kJ: nhân thừa 10.',
      perOption: [
        'Đúng — $0{,}2 \\cdot 334000 = 66800\\ J = 66{,}8\\ kJ$.',
        'Sai — thiếu đổi đơn vị khối lượng.',
        'Sai — sai cả đổi đơn vị và phép nhân.',
        'Sai — lệch một bậc 10.'
      ],
      steps: [
        '1. Dữ kiện: $\\lambda = 3{,}34 \\cdot 10^5\\ J/kg$; $m = 200\\ g = 0{,}2\\ kg$; nhiệt độ $0^{\\circ}C$ (đúng điểm nóng chảy nên chỉ cần nhiệt để phá liên kết).',
        '2. Công thức: $Q = m\\lambda$.',
        '3. Lý do: ở $0^{\\circ}C$ đá và nước cùng tồn tại; nhiệt lượng cung cấp chỉ dùng để chuyển thể, không làm tăng nhiệt độ.',
        '4. Tính: $Q = 0{,}2 \\cdot 334000 = 66800\\ J$.',
        '5. Kiểm tra đơn vị: $kg \\cdot J/kg = J$ ✓.',
        '6. Kết luận: $66{,}8\\ kJ$.'
      ],
      related: 'Nhiệt nóng chảy riêng $\\lambda$: nhiệt lượng để nóng chảy hoàn toàn 1 kg chất rắn thành chất lỏng ở nhiệt độ nóng chảy.',
      mistake: 'Cộng thêm $Q = mc\\Delta t$ không cần thiết khi đề cho sẵn đá ở đúng $0^{\\circ}C$.',
      tip: 'Gặp chuyển thể: chia bài thành nhiều chặng (nhiệt độ → chuyển thể → nhiệt độ) rồi cộng dồn.',
      next: 'Luyện tiếp nhiệt hóa hơi riêng (Bài 6) và bài tổng hợp (Bài 7).'
    }
  });
/* --- Bài 6. Nhiệt hóa hơi riêng --- */
q('ly-b6-t1-q1', 'numeric', 3, 'VD',
  'Nhiệt hóa hơi riêng của nước $L = 2{,}26 \\cdot 10^6\\ J/kg$. Tính nhiệt lượng để đun sôi cạn $500\\ g$ nước đang ở $100^{\\circ}C$. (Nhập số nguyên, đơn vị J)',
  null, '1130000',
  {
    hint: 'Dùng $Q = mL$; chú ý đổi gam sang kg.',
    explain: {
      correct: '$Q = mL = 0{,}5 \\cdot 2{,}26 \\cdot 10^6 = 1{,}13 \\cdot 10^6\\ J$.',
      wrong: 'Nếu ra $1{,}13 \\cdot 10^9$: quên đổi 500 g = 0,5 kg. Nếu ra 113000: nhân sai hệ số 10.',
      steps: [
        '1. Dữ kiện: $L = 2{,}26 \\cdot 10^6\\ J/kg$; $m = 500\\ g = 0{,}5\\ kg$; nước ở đúng $100^{\\circ}C$ (nhiệt độ sôi ở 1 atm).',
        '2. Công thức: $Q = mL$.',
        '3. Lý do: nước đã ở nhiệt độ sôi nên toàn bộ nhiệt lượng dùng để chuyển thể, không cần $Q = mc\\Delta t$.',
        '4. Tính: $Q = 0{,}5 \\cdot 2260000 = 1130000\\ J$.',
        '5. Kiểm tra đơn vị: $kg \\cdot J/kg = J$ ✓.',
        '6. Kết luận: $1{,}13 \\cdot 10^6\\ J = 1130\\ kJ$.'
      ],
      related: 'Nhiệt hóa hơi riêng $L$: nhiệt lượng để làm 1 kg chất lỏng thành khí ở nhiệt độ sôi. $L$ của nước rất lớn nên nước khó sôi cạn.',
      mistake: 'Thêm $Q = mc\\Delta t$ khi nhiệt độ đã bằng nhiệt độ sôi; hoặc sai đơn vị khối lượng.',
      tip: 'So sánh: $L \\approx 5{,}4 \\lambda$ với nước — làm bay hơi cần nhiều nhiệt hơn tan cháy (cùng khối lượng).',
      next: 'Làm bài tổng hợp nhiều chặng ở Bài 7.'
    },
    numeric: { answer: 1130000, tolerance: 0, unit: 'J', unitRequired: false }
  });

/* --- Bài 2. Nội năng, định luật I --- */
q('ly-b2-t1-q1', 'mc1', 2, 'TH',
  'Nội năng của một vật phụ thuộc vào',
  ['Động năng của vật và thế năng của vật trong trọng trường', 'Nhiệt độ và thể tích của vật', 'Vận tốc chuyển động của vật', 'Độ cao của vật so với mốc thế năng'],
  1,
  {
    hint: 'Nội năng gắn với chuyển động nhiệt và tương tác phân tử bên trong vật.',
    explain: {
      correct: 'Nội năng là tổng động năng và thế năng của các phân tử cấu tạo nên vật. Động năng phân tử phụ thuộc nhiệt độ; thế năng phân tử phụ thuộc khoảng cách giữa các phân tử, tức phụ thuộc thể tích (và thể tích phụ thuộc nhiệt độ).',
      wrong: 'Nếu chọn đáp án về động năng/thế năng của vật: đó là cơ năng, không phải nội năng. Đây là nhầm lẫn kinh điển.',
      perOption: [
        'Sai — đây là cơ năng (động năng + thế năng) của vật chuyển động trong trường lực bên ngoài.',
        'Đúng — nội năng phụ thuộc nhiệt độ (động năng phân tử) và thể tích (thế năng phân tử).',
        'Sai — vận tốc của vật không làm thay đổi chuyển động nhiệt bên trong.',
        'Sai — độ cao chỉ ảnh hưởng thế năng của vật trong trọng trường.'
      ],
      steps: [
        '1. Định nghĩa: nội năng $U$ = tổng động năng phân tử + tổng thế năng phân tử.',
        '2. Động năng phân tử tăng khi nhiệt độ tăng → $U$ tăng.',
        '3. Thế năng phân tử đổi khi khoảng cách phân tử đổi → khi dãn nở (nhiệt độ/thể tích đổi) thì $U$ đổi.',
        '4. Kết luận: $U$ phụ thuộc nhiệt độ và thể tích.'
      ],
      related: 'Nội năng không đo trực tiếp được; ta chỉ đo được SỰ THAY ĐỔI nội năng $\\Delta U$.',
      mistake: 'Trộn lẫn nội năng (U) với cơ năng (W) — phân biệt bằng đối tượng: phân tử bên trong hay vật chuyển động.',
      tip: 'Nhớ: "nội" = bên trong phân tử; mọi thứ bên ngoài (vận tốc vật, độ cao) đều không thuộc nội năng.',
      next: 'Luyện tiếp định luật I nhiệt động lực học ở chủ đề 2 Bài 2.'
    }
  });

q('ly-b2-t2-q1', 'mc1', 3, 'VD',
  'Một khí nhận $A = 200\\ J$ công và toả ra nhiệt $|Q| = 80\\ J$ ra môi trường. Biến thiên nội năng của khí là',
  ['$120\\ J$', '$280\\ J$', '$-120\\ J$', '$80\\ J$'],
  0,
  {
    hint: 'Dùng $\\Delta U = A + Q$ với quy ước dấu: khí NHẬN nhiệt thì $Q > 0$, khí TOẢ nhiệt thì $Q < 0$.',
    explain: {
      correct: 'Khí toả nhiệt nên $Q = -80\\ J$; nhận công nên $A = +200\\ J$. $\\Delta U = A + Q = 200 - 80 = 120\\ J$. Nội năng tăng.',
      wrong: 'Nếu chọn 280 J: đã cộng cả hai (quên quy ước dấu của nhiệt toả ra). Nếu chọn -120 J: đổi nhầm vai trò A và Q.',
      perOption: [
        'Đúng — $\\Delta U = 200 + (-80) = 120\\ J$.',
        'Sai — cộng cả hai mà không xét dấu.',
        'Sai — đổi nhầm dấu của công và nhiệt.',
        'Sai — chỉ xét một thành phần năng lượng.'
      ],
      steps: [
        '1. Dữ kiện: $A = +200\\ J$ (khí nhận công); khí toả nhiệt $|Q| = 80\\ J$ → $Q = -80\\ J$.',
        '2. Công thức: $\\Delta U = A + Q$ (định luật I nhiệt động lực học).',
        '3. Thay số: $\\Delta U = 200 + (-80) = 120\\ J$.',
        '4. Kiểm tra: $\\Delta U > 0$ → nội năng tăng, hợp lí vì nhận công nhiều hơn toả nhiệt ✓.',
        '5. Kết luận: $120\\ J$.'
      ],
      related: 'Định luật I: $\\Delta U = A + Q$. Quy ước dấu: vật nhận nhiệt/công → dương; vật toả nhiệt/thực hiện công → âm.',
      mistake: 'Bỏ quy ước dấu — nguyên nhân số 1 gây sai trong chủ đề này.',
      tip: 'Viết ngay dấu của Q và A vào giấy nháp trước khi thay số.',
      next: 'Luyện tiếp dạng khí thực hiện công trong bài tập về nhiệt (Bài 7).'
    }
  });
/* ============ CHƯƠNG II — KHÍ LÍ TƯỞNG ============ */

/* --- Bài 8. Mô hình động học phân tử --- */
q('ly-b8-t1-q1', 'mc1', 2, 'TH',
  'Theo mô hình động học phân tử, áp suất lên thành bình chứa khí được giải thích là do',
  ['Khí có trọng lượng đè lên thành bình', 'Các phân tử khí va chạm vào thành bình', 'Các phân tử khí liên kết với thành bình', 'Khí bị thành bình hút vào'],
  1,
  {
    hint: 'Áp suất khí là kết quả của va chạm phân tử với bề mặt thành bình.',
    explain: {
      correct: 'Áp suất là lực tác dụng lên một đơn vị diện tích. Các phân tử khí chuyển động hỗn loạn không ngừng và liên tục va chạm vào thành bình; lực va chạm đó (trên diện tích thành) tạo nên áp suất.',
      wrong: 'Nếu chọn "khí có trọng lượng": trọng lượng khí rất nhỏ và không phải nguyên nhân của áp suất — áp suất trong bình kín phụ thuộc va chạm, không phải trọng lực.',
      perOption: [
        'Sai — áp suất trong bình kín không do trọng lượng gây ra.',
        'Đúng — va chạm phân tử vào thành tạo lực, chia cho diện tích cho áp suất.',
        'Sai — phân tử khí không bị "hút" bởi thành bình.',
        'Sai — phân tử khí tự do, không liên kết với thành.'
      ],
      steps: [
        '1. Mô hình: khí gồm rất nhiều phân tử chuyển động hỗn loạn không ngừng.',
        '2. Mỗi phân tử va chạm thành bình → đổi động lượng → tác dụng lực lên thành.',
        '3. Trên một đơn vị diện tích, tổng lực đó chính là áp suất.',
        '4. Kết luận: áp suất do va chạm phân tử gây ra.'
      ],
      related: 'Động năng trung bình phân tử tỉ lệ thuận với nhiệt độ tuyệt đối → nhiệt độ càng cao, va chạm càng mạnh, áp suất càng lớn.',
      mistake: 'Nhầm áp suất với "sức nặng của khí"; điều này chỉ đúng với khí trong khí quyền chứ không phải khí trong bình kín.',
      tip: 'Nhớ mô hình "bong bóng đạn": hàng tỉ viên đạn li ti đập vào tường liên tục = áp suất.',
      next: 'Luyện tiếp công thức áp suất theo mô hình động học (Bài 12).'
    }
  });

q('ly-b8-t2-q1', 'mc1', 3, 'VD',
  'Khi nhiệt độ tuyệt đối của một lượng khí tăng lên 2 lần (thể tích không đổi), động năng trung bình của một phân tử khí',
  ['tăng 2 lần', 'tăng 4 lần', 'giảm 2 lần', 'không đổi'],
  0,
  {
    hint: 'Mỗi phân tử có 3 bậc tự do: $\\langle W_{td} \\rangle = \\frac{3}{2}kT$.',
    explain: {
      correct: '$\\langle W_{td} \\rangle = \\frac{3}{2}kT$ với $k = 1{,}38 \\cdot 10^{-23}\\ J/K$. Vì $T \\to 2T$ nên $\\langle W_{td} \\rangle \\to 2\\langle W_{td} \\rangle$: tăng 2 lần.',
      wrong: 'Nếu chọn "tăng 4 lần": đã nhầm với mối quan hệ bậc 2 (như $W = mv^2/2$ liên hệ với $v^2$, không phải với $T$). Nếu chọn "không đổi": sai vì động năng phụ thuộc nhiệt độ.',
      perOption: [
        'Đúng — $\\langle W_{td} \\rangle$ tỉ lệ thuận với $T$.',
        'Sai — quan hệ tuyến tính, không phải bậc 2.',
        'Sai — $T$ tăng thì động năng tăng, không giảm.',
        'Sai — chỉ đúng khi $T$ không đổi.'
      ],
      steps: [
        '1. Công thức: $\\langle W_{td} \\rangle = \\frac{3}{2}kT$.',
        '2. Ý nghĩa: động năng chuyển động nhiệt trung bình của một phân tử chỉ phụ thuộc nhiệt độ tuyệt đối.',
        '3. Cho $T\' = 2T$ → $\\langle W_{td} \\rangle\' = \\frac{3}{2}k(2T) = 2 \\cdot \\frac{3}{2}kT$.',
        '4. Kết luận: tăng 2 lần.'
      ],
      related: 'Nhiệt độ là thước đo động năng trung bình của phân tử — đây là ý nghĩa vi mô của nhiệt độ.',
      mistake: 'Nhầm quan hệ tuyến tính $W_{td} \\sim T$ với quan hệ bậc 2 $W = mv^2/2$; cần phân biệt $W \\sim v^2$ nhưng $W \\sim T$ (tuyến tính).',
      tip: 'Nhớ công thức duy nhất cần thuộc: $\\langle W_{td} \\rangle = \\frac{3}{2}kT$. Mọi bài đều quy về đây.',
      next: 'Luyện tiếp bài về áp suất theo động năng phân tử (Bài 12, chủ đề 2).'
    }
  });

/* --- Bài 9. Định luật Boyle --- */
q('ly-b9-t1-q1', 'mc1', 2, 'VD',
  'Một lượng khí nhất định giữ nguyên nhiệt độ. Khi thể tích giảm còn một nửa thì áp suất của khí',
  ['giảm một nửa', 'tăng gấp đôi', 'tăng gấp bốn', 'không đổi'],
  1,
  {
    hint: 'Quá trình đẳng nhiệt: $pV = const$.',
    explain: {
      correct: 'Đẳng nhiệt: $p_1V_1 = p_2V_2$. Nếu $V_2 = \\frac{V_1}{2}$ thì $p_2 = \\frac{p_1V_1}{V_2} = 2p_1$: áp suất tăng gấp đôi.',
      wrong: 'Nếu chọn "tăng gấp bốn": đã nhầm với quan hệ $V^3$ hay nghĩ $p$ tỉ lệ nghịch bậc 2. Nếu chọn "giảm một nửa": hiểu ngược quan hệ nghịch.',
      perOption: [
        'Sai — đây là quan hệ thuận, trái với định luật Boyle.',
        'Đúng — $p \\sim 1/V$ nên $V$ giảm nửa thì $p$ tăng đôi.',
        'Sai — không có quan hệ bậc 2 giữa $p$ và $V$ trong đẳng nhiệt.',
        'Sai — chỉ đúng khi nhiệt độ, khối lượng đổi để bù trừ.'
      ],
      steps: [
        '1. Điều kiện: lượng khí không đổi, nhiệt độ không đổi → quá trình đẳng nhiệt.',
        '2. Phương trình: $p_1V_1 = p_2V_2$.',
        '3. Cho $V_2 = V_1/2$ → $p_2 = p_1V_1/(V_1/2) = 2p_1$.',
        '4. Kiểm tra: $pV$ không đổi ✓ (đẳng nhiệt).',
        '5. Kết luận: áp suất tăng gấp đôi.'
      ],
      related: 'Đường đẳng nhiệt trên đồ thị $(p, V)$ là hyperbol — sản phẩm $pV$ không đổi dọc theo đường cong.',
      mistake: 'Nhầm đẳng nhiệt với đẳng tích ($p/T = const$) hay đẳng áp ($V/T = const$).',
      tip: 'Ba định luật: đẳng nhiệt $pV$, đẳng tích $p/T$, đẳng áp $V/T$ — đều là quan hệ giữa hai đại lượng còn lại.',
      next: 'Luyện tiếp định luật Charles (Bài 10) và phương trình trạng thái (Bài 11).'
    }
  });
/* --- Bài 11. Phương trình trạng thái --- */
q('ly-b11-t1-q1', 'numeric', 3, 'VD',
  'Một lượng khí có $p_1 = 2 \\cdot 10^5\\ Pa$, $V_1 = 3\\ lít$, $t_1 = 27^{\\circ}C$. Giữ nguyên áp suất, nung nóng đến $t_2 = 127^{\\circ}C$. Thể tích mới bằng bao nhiêu lít? (Nhập số thập phân)',
  null, '4',
  {
    hint: 'Đẳng áp: $\\frac{V_1}{T_1} = \\frac{V_2}{T_2}$, với $T$ là nhiệt độ Kenvin tuyệt đối.',
    explain: {
      correct: 'Đổi ra Kenvin: $T_1 = 27 + 273 = 300\\ K$, $T_2 = 127 + 273 = 400\\ K$. Đẳng áp: $\\frac{V_1}{T_1} = \\frac{V_2}{T_2} \\Rightarrow V_2 = \\frac{V_1T_2}{T_1} = \\frac{3 \\cdot 400}{300} = 4$ lít.',
      wrong: 'Nếu ra 14 lít: đã dùng độ Celsius trực tiếp ($\\frac{3 \\cdot 127}{27} \\approx 14{,}1$) — SAI vì phải dùng nhiệt độ tuyệt đối. Nếu ra 3,225: quên cộng 273.',
      steps: [
        '1. Dữ kiện: $p_1 = p_2 = 2 \\cdot 10^5\\ Pa$; $V_1 = 3\\ lít$; $t_1 = 27^{\\circ}C$; $t_2 = 127^{\\circ}C$.',
        '2. Điều kiện: áp suất không đổi → quá trình đẳng áp.',
        '3. Chuyển về Kenvin (bắt buộc!): $T_1 = 300\\ K$, $T_2 = 400\\ K$.',
        '4. Công thức: $\\frac{V_1}{T_1} = \\frac{V_2}{T_2}$.',
        '5. Giải: $V_2 = \\frac{3 \\cdot 400}{300} = 4$ lít.',
        '6. Kiểm tra: $T$ tăng 400/300 ≈ 1,33 lần → $V$ tăng cùng tỉ lệ ✓. Thể tích lớn hơn → hợp lí ✓.',
        '7. Kết luận: $V_2 = 4$ lít.'
      ],
      related: 'Định luật Charles: đẳng áp thì $\\frac{V}{T} = const$. Luôn dùng Kenvin khi có chữ $T$ trong công thức.',
      mistake: 'Thay độ Celsius vào công thức — đây là lỗi phổ biến nhất. Chỉ nhiều độ tuyệt đối mới có quan hệ tỉ lệ.',
      tip: 'Quy tắc vàng: thấy $T$ → đổi K; thấy $t$ → giữ °C. Công thức đẳng nhiệt/đẳng áp chỉ nhận $T$.',
      next: 'Luyện tiếp phương trình trạng thái tổng quát $\\frac{pV}{T} = const$ (Bài 11, bài tập).'
    },
    numeric: { answer: 4, tolerance: 0.01, unit: 'lít', unitRequired: false }
  });

/* --- Bài 12. Áp suất theo động học phân tử --- */
q('ly-b12-t1-q1', 'mc1', 3, 'VDC',
  'Cùng một lượng khí ở cùng nhiệt độ nhưng bình chứa lớn gấp đôi về thể tích. Áp suất khí trong bình sẽ',
  ['giảm một nửa', 'tăng gấp đôi', 'không đổi', 'giảm gấp bốn'],
  0,
  {
    hint: 'Áp suất tỉ lệ nghịch với thể tích: $p = \\frac{2}{3}n\\langle W_{td}\\rangle$.',
    explain: {
      correct: 'Công thức $p = \\frac{2}{3}n\\langle W_{td}\\rangle$ với $n = \\frac{N}{V}$ là mật độ phân tử. Với $N, T$ không đổi, $V \\to 2V$ thì $n \\to n/2$ nên $p \\to p/2$: áp suất giảm một nửa. Đúng như định luật Boyle.',
      wrong: 'Nếu chọn "không đổi": đã bỏ qua yếu tố mật độ phân tử. Nếu chọn "tăng gấp đôi": hiểu ngược mối quan hệ.',
      perOption: [
        'Đúng — mật độ phân tử giảm một nửa → áp suất giảm một nửa.',
        'Sai — quan hệ nghịch, không thuận.',
        'Sai — chỉ đúng nếu mật độ phân tử không đổi.',
        'Sai — không có quan hệ bậc 2 ở đây.'
      ],
      steps: [
        '1. Công thức: $p = \\frac{2}{3}n\\langle W_{td}\\rangle$, $n = \\frac{N}{V}$.',
        '2. $N$ không đổi, $T$ không đổi → $\\langle W_{td}\\rangle$ không đổi.',
        '3. $V \\to 2V$ → $n \\to \\frac{N}{2V} = \\frac{n}{2}$.',
        '4. Do đó $p \\to \\frac{p}{2}$.',
        '5. Kiểm tra: $pV = const$ ✓ (đẳng nhiệt, vì $T$ không đổi).',
        '6. Kết luận: áp suất giảm một nửa.'
      ],
      related: 'Từ $p = \\frac{2}{3}n\\langle W_{td}\\rangle$ suy ra phương trình trạng thái $pV = NkT$ — hai cách diễn đạt cùng một nội dung.',
      mistake: 'Nhầm lẫn vai trò của mật độ phân tử: thể tích tăng làm phân tử "thưa" ra, ít va chạm hơn.',
      tip: 'Nhớ cấu trúc: $p$ phụ thuộc 2 yếu tố — số đạn (mật độ) và sức đạn (động năng = nhiệt độ).',
      next: 'Luyện tiếp quan hệ động năng – nhiệt độ (Bài 12, chủ đề 2).'
    }
  });

q('ly-b12-t2-q1', 'mc1', 3, 'VD',
  'Hai khí lí tưởng khác nhau ở cùng nhiệt độ $27^{\\circ}C$ có',
  ['động năng trung bình phân tử như nhau', 'khối lượng phân tử như nhau', 'vận tốc phân tử như nhau', 'áp suất như nhau'],
  0,
  {
    hint: 'Động năng trung bình chỉ phụ thuộc nhiệt độ tuyệt đối, không phụ thuộc bản chất khí.',
    explain: {
      correct: '$\\langle W_{td}\\rangle = \\frac{3}{2}kT$ chỉ phụ thuộc $T$. Cùng $T$ thì cùng động năng trung bình, dù là khí gì (hiđro, oxi...).',
      wrong: 'Nếu chọn "vận tốc như nhau": vận tốc căn bậc hai $\\sqrt{\\langle v^2\\rangle} = \\sqrt{\\frac{3kT}{m_0}}$ phụ thuộc khối lượng phân tử $m_0$ — khí nhẹ chuyển động nhanh hơn.',
      perOption: [
        'Đúng — $\\langle W_{td}\\rangle = \\frac{3}{2}kT$, chỉ phụ thuộc $T$.',
        'Sai — khí khác nhau có khối lượng phân tử khác nhau.',
        'Sai — vận tốc phụ thuộc cả $T$ và $m_0$.',
        'Sai — áp suất còn phụ thuộc mật độ phân tử và thể tích.'
      ],
      steps: [
        '1. Công thức: $\\langle W_{td}\\rangle = \\frac{3}{2}kT$ — độc lập với bản chất khí.',
        '2. Vận tốc: $\\langle v^2\\rangle = \\frac{3kT}{m_0}$ → phụ thuộc khối lượng phân tử.',
        '3. Vậy cùng $T$: động năng như nhau nhưng vận tốc khác nhau (khí nhẹ nhanh hơn).',
        '4. Kết luận: đáp án đúng là động năng trung bình phân tử như nhau.'
      ],
      related: 'Đây là hệ quả quan trọng: nhiệt độ đo bằng động năng trung bình phân tử, không phân biệt loại khí.',
      mistake: 'Nhầm "động năng như nhau" với "vận tốc như nhau"; chỉ tương đương khi cùng khối lượng phân tử.',
      tip: 'Nhiệt độ = năng lượng chuyển động nhiệt; khối lượng phân tử = thứ quyết định vận tốc.',
      next: 'Luyện tiếp bài tập khí lí tưởng (Bài 13).'
    }
  });
/* --- Bài 10. Định luật Charles --- */
q('ly-b10-t1-q1', 'mc1', 2, 'VD',
  'Một lượng khí giữ nguyên áp suất, ở nhiệt độ $27^{\\circ}C$ có thể tích $V_1$. Khi nung đến nhiệt độ $327^{\\circ}C$ thì thể tích là',
  ['$2V_1$', '$\\frac{327}{27}V_1$', '$\\frac{1}{2}V_1$', '$12V_1$'],
  0,
  {
    hint: 'Đẳng áp: $\\frac{V_1}{T_1} = \\frac{V_2}{T_2}$; nhớ đổi sang Kenvin.',
    explain: {
      correct: '$T_1 = 300\\ K$, $T_2 = 600\\ K$. $\\frac{V_1}{300} = \\frac{V_2}{600} \\Rightarrow V_2 = 2V_1$.',
      wrong: 'Nếu chọn $\\frac{327}{27}V_1$: đã dùng độ Celsius trực tiếp — sai. Nếu chọn $12V_1$: vừa sai đơn vị vừa sai phép tính.',
      perOption: [
        'Đúng — $\\frac{600}{300} = 2$.',
        'Sai — dùng °C thay vì K.',
        'Sai — ngược chiều biến thiên.',
        'Sai — sai cả công thức và đơn vị.'
      ],
      steps: [
        '1. Điều kiện: $p$ không đổi → đẳng áp.',
        '2. Đổi nhiệt độ: $T_1 = 300\\ K$, $T_2 = 600\\ K$.',
        '3. $\\frac{V_1}{T_1} = \\frac{V_2}{T_2} \\Rightarrow V_2 = V_1 \\cdot \\frac{T_2}{T_1} = 2V_1$.',
        '4. Kiểm tra: $T$ tăng gấp đôi → $V$ tăng gấp đôi ✓.',
        '5. Kết luận: $V_2 = 2V_1$.'
      ],
      related: 'Định luật Charles: $\\frac{V}{T} = const$ (đẳng áp).',
      mistake: 'Thay °C vào công thức — phải dùng Kenvin vì tỉ lệ chỉ đúng trên thang tuyệt đối.',
      tip: 'Nhớ quy tắc: thấy $T$ (chữ in hoa) trong công thức thì buộc phải là Kenvin.',
      next: 'Luyện tiếp phương trình trạng thái tổng quát (Bài 11).'
    }
  });

/* --- Bài 13. Bài tập khí lí tưởng --- */
q('ly-b13-t1-q1', 'numeric', 4, 'VDC',
  'Một xilanh chứa khí có $p_1 = 10^5\\ Pa$, $V_1 = 2\\ lít$, $t_1 = 27^{\\circ}C$. Nén khí đến $V_2 = 1\\ lít$ và nung đến $t_2 = 227^{\\circ}C$. Áp suất cuối bằng bao nhiêu Pa? (Nhập số nguyên)',
  null, '333333',
  {
    hint: 'Dùng $\\frac{p_1V_1}{T_1} = \\frac{p_2V_2}{T_2}$; đổi nhiệt độ sang Kenvin trước.',
    explain: {
      correct: '$T_1 = 300\\ K$, $T_2 = 500\\ K$. $p_2 = \\frac{p_1V_1T_2}{T_1V_2} = \\frac{10^5 \\cdot 2 \\cdot 500}{300 \\cdot 1} = \\frac{10^8}{300} \\approx 333333\\ Pa$.',
      wrong: 'Nếu bạn ra $166667\\ Pa$: đã đảo ngược tỉ số $V_2/V_1$ (thay $\\frac{V_2}{V_1}$ cho $\\frac{V_1}{V_2}$). Nếu ra $1200000\\ Pa$: dùng °C thay vì K. Nếu ra $10^5\\ Pa$: quên mất áp suất phải thay đổi khi cả $V$ và $T$ đổi.',
      steps: [
        '1. Dữ kiện: $p_1 = 10^5\\ Pa$; $V_1 = 2$ lít; $t_1 = 27^{\\circ}C$; $V_2 = 1$ lít; $t_2 = 227^{\\circ}C$.',
        '2. Yêu cầu: $p_2$.',
        '3. Công thức: $\\frac{p_1V_1}{T_1} = \\frac{p_2V_2}{T_2}$ (lượng khí không đổi).',
        '4. Đổi nhiệt độ: $T_1 = 300\\ K$; $T_2 = 500\\ K$.',
        '5. Giải: $p_2 = \\frac{10^5 \\cdot 2 \\cdot 500}{300 \\cdot 1} = \\frac{10^8}{300} \\approx 333333\\ Pa$.',
        '6. Kiểm tra: $V$ giảm một nửa → $p$ tăng; $T$ tăng 500/300 → $p$ tăng nữa. Tổng hợp: $p_2 > p_1$ ✓.',
        '7. Kết luận: $p_2 \\approx 3{,}33 \\cdot 10^5\\ Pa$.'
      ],
      related: 'Phương trình trạng thái tổng quát $\\frac{pV}{T} = const$ — kết hợp cả ba định luật Boyle, Charles, Guy-Lussac.',
      mistake: 'Không đổi K, hoặc đổi đơn vị thể tích/p áp suất không nhất quán giữa trạng thái 1 và 2.',
      tip: 'Chỉ cần các đơn vị nhất quán giữa hai trạng thái: nếu $V_1, V_2$ cùng đơn vị lít thì không cần đổi ra m³.',
      next: 'Luyện thêm bài toán bơm hơi, thông hơi trong Bài 13.'
    },
    numeric: { answer: 333333, tolerance: 0.5, unit: 'Pa', unitRequired: false }
  });
/* ============ CHƯƠNG III — TỪ TRƯỜNG ============ */

/* --- Bài 14. Từ trường --- */
q('ly-b14-t1-q1', 'mc1', 1, 'NB',
  'Đường sức từ xung quanh một dây dẫn thẳng dài mang dòng điện có dạng',
  ['những đường tròn đồng tâm với dây dẫn', 'những đường thẳng song song với dây dẫn', 'những đường cong kín đi từ cực này sang cực khác của dây dẫn', 'những đường xoắn ốc dọc theo dây dẫn'],
  0,
  {
    hint: 'Dùng quy tắc nắm tay phải để xác định chiều và hình dạng đường sức từ.',
    explain: {
      correct: 'Đường sức từ của dây dẫn thẳng dài là những đường tròn đồng tâm với dây dẫn, nằm trong mặt phẳng vuông góc với dây dẫn. Chiều xác định bằng quy tắc nắm tay phải: ngón cái choãi theo chiều dòng điện, các ngón tay cuốn lại chỉ chiều đường sức từ.',
      wrong: 'Nếu chọn "đường thẳng song song": chỉ đúng với từ trường bên trong ống dây solenoid, không phải dây dẫn thẳng đơn.',
      perOption: [
        'Đúng — đường tròn đồng tâm, nằm trong mặt phẳng vuông góc với dây.',
        'Sai — đúng cho từ trường trong solenoid, không phải dây dẫn thẳng.',
        'Sai — từ trường không đi "từ cực sang cực" ở dây thẳng (đó là từ trường nam châm).',
        'Sai — không có cấu trúc xoắn ốc.'
      ],
      steps: [
        '1. Chiều dòng điện xác định chiều từ trường (quy tắc nắm tay phải).',
        '2. Các điểm cách dây dẫn một khoảng bằng nhau có vectơ cảm ứng từ cùng độ lớn → các điểm đồng tâm.',
        '3. Tập hợp các điểm đó tạo thành đường tròn đồng tâm, nằm trong mặt phẳng vuông góc với dây.',
        '4. Kết luận: đường tròn đồng tâm với dây dẫn.'
      ],
      related: 'Cảm ứng từ tại điểm cách dây $d$: $B = 2 \\cdot 10^{-7} \\cdot \\frac{I}{d}$ (T).',
      mistake: 'Nhầm từ trường dây dẫn thẳng với từ trường nam châm hoặc solenoid.',
      tip: 'Nhớ quy tắc nắm tay phải: ngón cái = dòng điện, ngón tay cuốn = chiều đường sức từ.',
      next: 'Luyện tiếp lực từ tác dụng lên dòng điện (Bài 15).'
    }
  });

q('ly-b14-t2-q1', 'mc1', 2, 'TH',
  'Từ trường của một thanh nam châm ở phía bên ngoài nam châm',
  ['xuất phát từ cực Nam, đi vào cực Bắc', 'xuất phát từ cực Bắc, đi vào cực Nam', 'song song với thanh, cùng chiều từ Nam sang Bắc', 'vuông góc với thanh nam châm tại cả hai đầu'],
  1,
  {
    hint: 'Nhớ quy ước: đường sức từ luôn đi ra từ cực Bắc và vào lại ở cực Nam.',
    explain: {
      correct: 'Theo quy ước, đường sức từ đi ra từ cực Bắc, đi vào cực Nam, tạo thành đường cong kín (bên trong nam châm đi từ Nam về Bắc).',
      wrong: 'Nếu chọn đáp án 1: đã nhầm chiều. Chiều chuẩn là Bắc → ngoài không gian → Nam.',
      perOption: [
        'Sai — ngược chiều quy ước.',
        'Đúng — từ cực Bắc ra, vào cực Nam ở phía ngoài nam châm.',
        'Sai — đường sức từ không song song với thanh ở hai đầu.',
        'Sai — từ trường không vuông góc với thanh tại hai đầu.'
      ],
      steps: [
        '1. Quy ước: đường sức từ đi ra từ cực Bắc (N), vào cực Nam (S).',
        '2. Bên ngoài nam châm: đường sức từ đi từ N sang S.',
        '3. Bên trong nam châm: đi từ S về N, tạo thành đường cong kín.',
        '4. Kết luận: bên ngoài nam châm, đường sức từ đi từ N sang S.'
      ],
      related: 'Hai cực của nam châm không tách rời được — mọi nam châm đều có cả cực N và S. Hai cực trùng dấu đẩy nhau, khác dấu hút nhau.',
      mistake: 'Nhầm cực Bắc với cực "cực dương"; cần nhớ quy ước Bắc–Nam cố định.',
      tip: 'Nhớ "N ra, S vào" — đường sức từ LUÔN đi ra từ cực Bắc ở phía ngoài không gian.',
      next: 'Luyện tiếp cảm ứng từ trong Bài 15.'
    }
  });
/* --- Bài 15. Lực từ --- */
q('ly-b15-t1-q1', 'numeric', 2, 'VD',
  'Một dây dẫn dài $l = 20\\ cm$ đặt trong từ trường đều $B = 0{,}5\\ T$, vuông góc với vectơ cảm ứng từ, mang dòng điện $I = 2\\ A$. Độ lớn lực từ tác dụng lên dây dẫn bằng bao nhiêu N? (Nhập số thập phân)',
  null, '0.2',
  {
    hint: 'Dùng $F = IlB\\sin\\alpha$; với dây vuông góc từ trường thì $\\alpha = 90^{\\circ}$ nên $\\sin\\alpha = 1$.',
    explain: {
      correct: 'Đổi $l = 20\\ cm = 0{,}2\\ m$. $F = IlB\\sin 90^{\\circ} = 0{,}2 \\cdot 2 \\cdot 0{,}5 = 0{,}2\\ N$.',
      wrong: 'Nếu ra 20 N: quên đổi cm sang m. Nếu ra 0,1 N: nhân sai hệ số. Nếu ra 0: cho rằng dây vuông góc thì lực bằng 0 — thực tế ngược lại, lực LỚN NHẤT khi vuông góc.',
      steps: [
        '1. Dữ kiện: $l = 20\\ cm = 0{,}2\\ m$; $B = 0{,}5\\ T$; $I = 2\\ A$; $\\alpha = 90^{\\circ}$.',
        '2. Công thức: $F = IlB\\sin\\alpha$.',
        '3. Với $\\alpha = 90^{\\circ}$: $\\sin\\alpha = 1$ → $F = IlB$ (lực lớn nhất).',
        '4. Tính: $F = 0{,}2 \\cdot 2 \\cdot 0{,}5 = 0{,}2\\ N$.',
        '5. Kiểm tra đơn vị: $m \\cdot A \\cdot T = N$ ✓.',
        '6. Kết luận: $F = 0{,}2\\ N$.'
      ],
      related: 'Chiều của lực từ xác định bằng quy tắc bàn tay trái: ngón trỏ = chiều dòng điện, lòng bàn tay đón đường sức từ, ngón cái choãi ra chỉ chiều lực từ.',
      mistake: 'Quên đổi cm → m (thiếu $10^{-2}$); hoặc nhầm $\\sin\\alpha = 0$ khi vuông góc.',
      tip: 'Nhớ: vuông góc → lực lớn nhất ($\\sin 90^{\\circ} = 1$); song song → lực bằng 0 ($\\sin 0 = 0$).',
      next: 'Luyện tiếp định nghĩa cảm ứng từ $B = \\frac{F}{Il\\sin\\alpha}$ (Bài 15, chủ đề 2).'
    },
    numeric: { answer: 0.2, tolerance: 0.001, unit: 'N', unitRequired: false }
  });

q('ly-b15-t2-q1', 'mc1', 2, 'TH',
  'Đơn vị của cảm ứng từ trong hệ SI là',
  ['Niuton trên mét (N/m)', 'Tesla (T)', 'Ampe (A)', 'Vôn (V)'],
  1,
  {
    hint: 'Từ $B = \\frac{F}{Il\\sin\\alpha}$, suy ra đơn vị từ đơn vị của các đại lượng thành phần.',
    explain: {
      correct: 'Tesla (T). Từ $B = \\frac{F}{Il\\sin\\alpha}$: đơn vị của $B$ là $\\frac{N}{A \\cdot m}$, được đặt tên là Tesla. $1\\ T = 1\\ \\frac{N}{A \\cdot m}$.',
      wrong: 'Nếu chọn "N/m": đó là đơn vị độ cứng lò xo, không liên quan từ trường. Nếu chọn "A": đó là đơn vị cường độ dòng điện. Nếu chọn "V": đơn vị hiệu điện thế.',
      perOption: [
        'Sai — không phải đơn vị của cảm ứng từ.',
        'Đúng — Tesla, đặt theo tên Nikola Tesla.',
        'Sai — Ampe là đơn vị cường độ dòng điện.',
        'Sai — Vôn là đơn vị hiệu điện thế.'
      ],
      steps: [
        '1. Công thức: $B = \\frac{F}{Il\\sin\\alpha}$.',
        '2. Đơn vị: $[B] = \\frac{[F]}{[I][l]} = \\frac{N}{A \\cdot m}$.',
        '3. Đơn vị này được đặt tên là Tesla (T).',
        '4. Kết luận: Tesla.'
      ],
      related: 'Trong hệ CGS còn dùng Gauss (Gs): $1\\ T = 10^4\\ Gs$.',
      mistake: 'Nhầm Tesla với các đơn vị điện từ khác như Vôn, Ampe, Henrie.',
      tip: 'Nhớ bộ đơn vị: cường độ dòng điện (A), điện tích (C), cảm ứng từ (T), từ thông (Wb).',
      next: 'Luyện tiếp từ thông trong Bài 16.'
    }
  });
/* --- Bài 16. Từ thông, cảm ứng điện từ --- */
q('ly-b16-t1-q1', 'mc1', 2, 'TH',
  'Từ thông qua mạch kín có diện tích $S$ đặt trong từ trường đều $B$, hợp với vectơ pháp tuyến của mặt phẳng mạch góc $\\alpha$, được tính bằng',
  ['$\\Phi = BS\\cos\\alpha$', '$\\Phi = BS\\sin\\alpha$', '$\\Phi = BS\\tan\\alpha$', '$\\Phi = \\frac{BS}{\\alpha}$'],
  0,
  {
    hint: 'Góc $\\alpha$ là góc giữa vectơ cảm ứng từ và PHÁP TUYẾN của mặt phẳng mạch.',
    explain: {
      correct: 'Từ thông: $\\Phi = BS\\cos\\alpha$ với $\\alpha$ là góc giữa vectơ $\\vec{B}$ và vectơ pháp tuyến của mặt phẳng mạch. Đơn vị: Weber (Wb).',
      wrong: 'Nếu chọn $BS\\sin\\alpha$: đã dùng góc với MẶT PHẲNG thay vì góc với PHÁP TUYẾN. Trong bài này góc $\\alpha$ được cho với pháp tuyến nên phải dùng cos.',
      perOption: [
        'Đúng — $\\Phi = BS\\cos\\alpha$ (định nghĩa từ thông).',
        'Sai — chỉ đúng nếu $\\alpha$ là góc với mặt phẳng, không phải với pháp tuyến.',
        'Sai — không có quan hệ tang trong định nghĩa từ thông.',
        'Sai — sai cả cấu trúc công thức.'
      ],
      steps: [
        '1. Định nghĩa: $\\Phi = BS\\cos\\alpha$ với $\\alpha$ = góc giữa $\\vec{B}$ và pháp tuyến của mặt phẳng mạch.',
        '2. Mạch song song với đường sức từ ($\\alpha = 90^{\\circ}$) → $\\Phi = 0$.',
        '3. Mạch vuông góc với đường sức từ ($\\alpha = 0^{\\circ}$) → $\\Phi = BS$ (lớn nhất).',
        '4. Kết luận: $\\Phi = BS\\cos\\alpha$.'
      ],
      related: 'Đơn vị từ thông là Weber (Wb): $1\\ Wb = 1\\ T \\cdot m^2$.',
      mistake: 'Nhầm góc với pháp tuyến và góc với mặt phẳng — đây là lỗi phổ biến nhất của bài này.',
      tip: 'Nhớ: góc tính với PHÁP TUYẾN (đường vuông góc mặt phẳng), nên dùng cos.',
      next: 'Luyện tiếp định luật Faraday-Lenz (Bài 16, chủ đề 2).'
    }
  });

q('ly-b16-t2-q1', 'mc1', 3, 'VD',
  'Từ thông qua một mạch kín biến thiên từ $2\\ Wb$ xuống $0{,}5\\ Wb$ trong thời gian $0{,}1\\ s$. Suất điện động cảm ứng trong mạch có độ lớn là',
  ['$1{,}5\\ V$', '$15\\ V$', '$25\\ V$', '$2\\ V$'],
  1,
  {
    hint: 'Dùng $|e_c| = \\left|\\frac{\\Delta\\Phi}{\\Delta t}\\right|$ (lấy độ lớn, bỏ dấu trừ của Lenz).',
    explain: {
      correct: '$|e_c| = \\frac{|\\Phi_2 - \\Phi_1|}{\\Delta t} = \\frac{|0{,}5 - 2|}{0{,}1} = \\frac{1{,}5}{0{,}1} = 15\\ V$.',
      wrong: 'Nếu chọn 1,5 V: quên chia cho thời gian. Nếu chọn 25 V: lấy tổng thay vì hiệu. Nếu chọn 2 V: chỉ lấy từ thông ban đầu.',
      perOption: [
        'Sai — đây là $|\\Delta\\Phi|$, chưa chia cho $\\Delta t$.',
        'Đúng — $\\frac{1{,}5}{0{,}1} = 15\\ V$.',
        'Sai — lấy tổng $2 + 0{,}5 = 2{,}5$ rồi nhân sai.',
        'Sai — lấy nhầm giá trị từ thông ban đầu.'
      ],
      steps: [
        '1. Dữ kiện: $\\Phi_1 = 2\\ Wb$; $\\Phi_2 = 0{,}5\\ Wb$; $\\Delta t = 0{,}1\\ s$.',
        '2. Công thức: $e_c = -\\frac{\\Delta\\Phi}{\\Delta t}$ (dấu trừ thể hiện chiều dòng cảm ứng theo Lenz).',
        '3. Lấy độ lớn: $|e_c| = \\frac{|\\Delta\\Phi|}{\\Delta t} = \\frac{1{,}5}{0{,}1} = 15\\ V$.',
        '4. Kiểm tra đơn vị: $\\frac{Wb}{s} = \\frac{T \\cdot m^2}{s} = V$ ✓.',
        '5. Kết luận: $|e_c| = 15\\ V$.'
      ],
      related: 'Định luật Faraday-Lenz: suất điện động cảm ứng tỉ lệ với tốc độ biến thiên từ thông; chiều của nó chống lại sự biến thiên từ thông.',
      mistake: 'Quên chia cho thời gian, hoặc nhầm $|\\Delta\\Phi|$ với $|\\Phi_1|$.',
      tip: 'Nhớ bước 1: luôn tính $\\Delta\\Phi = \\Phi_{cuối} - \\Phi_{đầu}$ rồi mới chia $\\Delta t$.',
      next: 'Luyện tiếp máy phát điện xoay chiều (Bài 17).'
    }
  });
/* --- Bài 17. Máy phát điện xoay chiều --- */
q('ly-b17-t1-q1', 'mc1', 3, 'VD',
  'Trong máy phát điện xoay chiều một pha, suất điện động cảm ứng đạt giá trị cực đại khi',
  ['mặt phẳng khung dây song song với vectơ cảm ứng từ', 'mặt phẳng khung dây vuông góc với vectơ cảm ứng từ', 'mặt phẳng khung dây hợp với vectơ cảm ứng từ góc $45^{\\circ}$', 'tốc độ quay bằng 0'],
  0,
  {
    hint: 'Phân tích từ thông $\\Phi = BS\\cos\\omega t$ rồi lấy đạo hàm để ra $e_c$.',
    explain: {
      correct: 'Chọn gốc thời gian lúc khung nằm trong mặt phẳng chứa $\\vec{B}$ (song song): $\\Phi = BS\\cos(\\omega t)$. Khi đó $e_c = -\\Phi\' = BS\\omega\\sin(\\omega t)$; $e_c$ cực đại khi $\\sin(\\omega t) = 1$, tức khi $\\cos(\\omega t) = 0$ → khung VUÔNG GÓC với $\\vec{B}$, tức mặt phẳng khung SONG SONG với $\\vec{B}$.',
      wrong: 'Nếu chọn "vuông góc với $\\vec{B}$": khi đó từ thông cực đại nhưng tốc độ biến thiên từ thông bằng 0 nên $e_c = 0$. Đây là nhầm lẫn kinh điển.',
      perOption: [
        'Đúng — lúc này từ thông bằng 0 nhưng biến thiên nhanh nhất → $e_c$ cực đại.',
        'Sai — lúc này từ thông cực đại, $e_c = 0$ (không đổi).',
        'Sai — không phải vị trí cực trị.',
        'Sai — khi $\\omega = 0$ thì $e_c = 0$.'
      ],
      steps: [
        '1. Chọn gốc thời gian khi khung dây nằm trong mặt phẳng chứa vectơ cảm ứng từ.',
        '2. Từ thông: $\\Phi = BS\\cos(\\omega t)$.',
        '3. Suất điện động: $e_c = -\\frac{\\Delta\\Phi}{\\Delta t} = BS\\omega\\sin(\\omega t)$.',
        '4. $e_c$ cực đại khi $\\sin(\\omega t) = 1$ → $\\cos(\\omega t) = 0$ → từ thông bằng 0.',
        '5. Vị trí khung khi từ thông bằng 0: mặt phẳng khung song song với vectơ $\\vec{B}$.',
        '6. Kết luận: $e_c$ cực đại khi mặt phẳng khung dây song song với $\\vec{B}$.'
      ],
      related: 'Công thức tổng quát: $e_c = e_0\\cos(\\omega t + \\varphi)$, $e_0 = BS\\omega$. Chu kì $T = \\frac{2\\pi}{\\omega}$; tần số $f = \\frac{\\omega}{2\\pi}$.',
      mistake: 'Nhầm "từ thông cực đại" với "suất điện động cực đại" — hai đại lượng này ngược pha nhau $90^{\\circ}$.',
      tip: 'Nhớ câu then chốt: "từ thông đổi nhanh nhất thì $e_c$ lớn nhất" → vị trí từ thông bằng 0.',
      next: 'Luyện tiếp định luật Ohm – Faraday cho toàn mạch (Bài 17, chủ đề 2).'
    }
  });

/* ============ CHƯƠNG IV — HẠT NHÂN ============ */

/* --- Bài 21. Cấu trúc hạt nhân --- */
q('ly-b21-t1-q1', 'mc1', 2, 'TH',
  'Nuclit $^{235}_{92}U$ có',
  ['92 proton và 143 neutron', '143 proton và 92 neutron', '92 electron và 143 neutron', '235 neutron'],
  0,
  {
    hint: 'Số đứng trước là số đơn vị điện tích hạt nhân (số proton), số đứng sau là số khối (proton + neutron).',
    explain: {
      correct: '$Z = 92$ → 92 proton. $A = 235$ → số neutron $N = A - Z = 235 - 92 = 143$.',
      wrong: 'Nếu chọn "143 proton và 92 neutron": đã hoán đổi vai trò của $Z$ và $A - Z$. Nếu chọn "92 electron": hạt nhân chỉ gồm proton và neutron, electron ở vỏ nguyên tử.',
      perOption: [
        'Đúng — $Z = 92$ proton, $N = 235 - 92 = 143$ neutron.',
        'Sai — hoán đổi $Z$ và $N$.',
        'Sai — electron không thuộc hạt nhân.',
        'Sai — 235 là số khối, không phải số neutron.'
      ],
      steps: [
        '1. Ký hiệu $^{A}_{Z}X$: $Z$ = số proton (số hiệu nguyên tử), $A$ = số khối (tổng proton + neutron).',
        '2. $Z = 92$ → 92 proton.',
        '3. Số neutron: $N = A - Z = 235 - 92 = 143$.',
        '4. Kết luận: 92 proton và 143 neutron.'
      ],
      related: 'Đồng vị là các nuclit cùng $Z$ (cùng số proton) nhưng khác $A$. Các hạt nhân có cùng $N$ gọi là đồng vị neutron.',
      mistake: 'Nhầm số khối $A$ với số neutron $N$; hoặc đưa electron vào cấu tạo hạt nhân.',
      tip: 'Nhớ công thức duy nhất: $N = A - Z$. Nói to "235 trừ 92 bằng 143".',
      next: 'Luyện tiếp phản ứng hạt nhân và năng lượng liên kết (Bài 22).'
    }
  });

q('ly-b22-t1-q1', 'mc1', 2, 'VD',
  'Trong một phản ứng hạt nhân, đại lượng nào sau đây LUÔN được bảo toàn?',
  ['Số khối', 'Số neutron', 'Khối lượng nghỉ', 'Thể tích'],
  0,
  {
    hint: 'Hãy nhớ hai định luật bảo toàn cơ bản của phản ứng hạt nhân.',
    explain: {
      correct: 'Trong mọi phản ứng hạt nhân, số nuclon (số khối) và điện tích hạt nhân (số proton) luôn được bảo toàn. Do đó tổng số khối ở hai vế luôn bằng nhau.',
      wrong: 'Nếu chọn "số neutron": neutron có thể biến đổi (ví dụ phân rã beta chuyển neutron thành proton). Nếu chọn "khối lượng nghỉ": khối lượng nghỉ KHÔNG bảo toàn — chính chỗ thiếu hụt khối lượng tạo ra năng lượng phản ứng.',
      perOption: [
        'Đúng — bảo toàn số nuclon và điện tích là hai định luật nền tảng.',
        'Sai — neutron có thể chuyển hóa thành proton trong phân rã beta.',
        'Sai — khối lượng nghỉ không bảo toàn (sai lệch khối lượng = năng lượng giải phóng).',
        'Sai — thể tích không có ý nghĩa trong phản ứng hạt nhân.'
      ],
      steps: [
        '1. Định luật bảo toàn điện tích: tổng số hiệu nguyên tử hai vế bằng nhau.',
        '2. Định luật bảo toàn số nuclon: tổng số khối hai vế bằng nhau.',
        '3. Khối lượng nghỉ KHÔNG bảo toàn — sai lệch $\\Delta m$ liên hệ năng lượng qua $E = \\Delta mc^2$.',
        '4. Kết luận: số khối được bảo toàn.'
      ],
      related: 'Định luật bảo toàn năng lượng toàn năng (năng lượng nghỉ + động năng) vẫn đúng, nhưng khối lượng nghỉ riêng lẻ thì không.',
      mistake: 'Nghĩ rằng mọi thứ đều bảo toàn như trong phản ứng hóa học; phản ứng hạt nhân có quy tắc khác.',
      tip: 'Nhớ hai thứ bảo toàn: "số hiệu nguyên tử" và "số khối". Mọi thứ khác đều có thể đổi.',
      next: 'Luyện tiếp khuyết đắm và năng lượng liên kết (Bài 22, chủ đề 2).'
    }
  });
q('ly-b23-t1-q1', 'numeric', 3, 'VD',
  'Một mẫu chất phóng xạ có chu kỳ bán rã $T = 8$ ngày. Sau bao nhiêu ngày thì khối lượng mẫu còn $\\dfrac{1}{4}$ khối lượng ban đầu? (Nhập số nguyên, đơn vị ngày)',
  null, '16',
  {
    hint: 'Sau mỗi chu kỳ bán rã, khối lượng còn một nửa. Còn 1/4 nghĩa là đã qua 2 chu kỳ.',
    explain: {
      correct: 'Còn $\\frac{1}{4} = \\left(\\frac{1}{2}\\right)^2$ nghĩa là đã qua 2 chu kỳ bán rã. $t = 2T = 2 \\times 8 = 16$ ngày.',
      wrong: 'Nếu bạn nhập 8: mới qua 1 chu kỳ, khối lượng còn 1/2. Nếu nhập 24: nhầm với 3 chu kỳ (còn 1/8).',
      steps: [
        '1. Công thức: $m = m_0\\left(\\frac{1}{2}\\right)^{t/T}$.',
        '2. Yêu cầu $\\frac{m}{m_0} = \\frac{1}{4} = \\left(\\frac{1}{2}\\right)^2$.',
        '3. Suy ra $\\frac{t}{T} = 2 \\Rightarrow t = 2T = 16$ ngày.',
        '4. Kiểm tra: sau 8 ngày còn 1/2; sau 16 ngày còn 1/4 ✓.'
      ],
      related: 'Định luật phóng xạ: $N = N_0 \\cdot 2^{-t/T}$; chu kỳ bán rã $T$ là thời gian phân rã một nửa số hạt nhân ban đầu.',
      mistake: 'Nhầm chu kỳ bán rã với thời gian phân rã hết.',
      tip: 'Còn 1/2 → 1 chu kỳ; 1/4 → 2; 1/8 → 3; 1/16 → 4. Đếm số lần chia đôi là ra số chu kỳ.',
      next: 'Luyện tiếp dạng tính khối lượng còn lại sau thời gian cho trước.'
    },
    numeric: { answer: 16, unit: 'ngày', unitRequired: false, tolerance: 0 }
  });
/* --- Thêm câu hỏi: phủ đủ các chương & đủ 5 dạng bài --- */

G.QUESTIONS_LY = Q;

})(typeof window !== 'undefined' ? window : globalThis);