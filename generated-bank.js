/* ============================================================
   NGÂN HÀNG BIẾN THỂ THEO CHƯƠNG TRÌNH
   Mỗi chủ đề có tới 267 cấu hình tham số, đủ 5 hình thức làm bài:
   mc1 (1 đáp án), mcq (nhiều đáp án), tf (đúng/sai), short, numeric.
   Lưu ý: đây là câu hỏi sinh theo mẫu có lời giải, nên giáo viên/người học
   vẫn nên đối chiếu những câu nâng cao với tài liệu chính khóa trước khi dùng.
   ============================================================ */
(function (G) {
'use strict';
const C = G.CURRICULUM;
if (!C || !Array.isArray(G.QUESTIONS_TOAN) || !Array.isArray(G.QUESTIONS_LY)) return;
// Dải tham số mở rộng để tạo các biến thể tính toán khác nhau theo từng chủ đề.
// Các câu sinh theo mẫu được đánh dấu generated:true ở dữ liệu câu hỏi.
const VALUES = Array.from({ length: 300 }, (_, i) => i + 2);
const rnd = (v, n) => Math.round(v * Math.pow(10, n === undefined ? 8 : n)) / Math.pow(10, n === undefined ? 8 : n);
const fmt = (v) => {
  if (typeof v !== 'number' || !isFinite(v)) return String(v);
  const abs = Math.abs(v);
  const precision = abs > 0 && abs < 0.001 ? 8 : (abs < 0.01 ? 6 : 4);
  return String(rnd(v, precision)).replace('.', ',');
};
const unitText = (s) => s ? ' ' + s : '';

function makeProblem(t, i) {
  const a = VALUES[i % VALUES.length];
  const k = i + 1;
  const b = [3, 5, 7, 2, 4, 6, 8, 9][i % 8];
  const id = t.lessonId;
  const topic = t.name;
  const toan = t.subjectId === 'toan';
  let p = { prompt: '', answer: 0, unit: '', formula: '', steps: [], why: '', hint: '', wrongFormula: '' };
  const set = (prompt, answer, formula, steps, unit, hint, wrongFormula) => {
    p = { prompt, answer: rnd(Number(answer)), formula, steps, unit: unit || '',
      why: 'Thay dữ kiện đề bài vào công thức, tính cẩn thận và đối chiếu đơn vị.',
      hint: hint || 'Xác định đại lượng cần tìm, viết công thức phù hợp rồi thay số.',
      wrongFormula: wrongFormula || '' };
  };
  if (toan) {
    switch (id) {
      case 'toan-b1':
        if (t.topicId.endsWith('-t1')) set('Cho $f(x)=x^3-3('+a+')^2x$. Tính $f\'(0)$ để bắt đầu xét tính đơn điệu.', -3*a*a,
          "$f'(x)=3x^2-3a^2$", ['Đạo hàm: $f\'(x)=3x^2-3('+a+')^2$.', 'Thay $x=0$: $f\'(0)=-3\\cdot'+a+'^2='+(-3*a*a)+'$.'], '', 'Lấy đạo hàm trước, sau đó thay x = 0.', "$f'(x)=3x^2+3a^2$");
        else if (t.topicId.endsWith('-t2')) set('Cho $f(x)=x^3-3('+a+')^2x$. Giá trị cực tiểu của hàm số bằng bao nhiêu?', -2*a*a*a,
          "$f'(x)=3(x^2-a^2)$", ['Giải $f\'(x)=0$: $x=\\pm '+a+'$.', 'Đạo hàm đổi dấu từ âm sang dương tại $x='+a+'$, nên đây là điểm cực tiểu.', 'Tính $f('+a+')='+(a*a*a)+'-3\\cdot'+(a*a)+'\\cdot'+a+'=-'+(2*a*a*a)+'$.'], '', 'Xác định điểm cực tiểu rồi thay vào hàm số.', "$f(a)=2a^3$");
        else set('Với $f(x)=x^3+3mx^2+'+(3*a)+'x$, có bao nhiêu giá trị nguyên của $m$ để hàm số đồng biến trên $\\mathbb R$?', 2*Math.floor(Math.sqrt(a))+1,
          "$f'(x)=3(x^2+2mx+"+a+")$", ['Điều kiện để đạo hàm không âm với mọi $x$ là $x^2+2mx+'+a+'\\ge0$ với mọi $x$.', 'Biệt thức là $\\Delta=4m^2-4\\cdot'+a+'\\le0$, nên $m^2\\le'+a+'$.', 'Suy ra $-'+Math.floor(Math.sqrt(a))+'\\le m\\le'+Math.floor(Math.sqrt(a))+'$, có '+(2*Math.floor(Math.sqrt(a))+1)+' giá trị nguyên.'], 'giá trị', 'Dùng điều kiện biệt thức không dương và đếm số nguyên trong khoảng.', "$\\Delta>0$");
        break;
      case 'toan-b2':
        if (t.topicId.endsWith('-t1')) set('Xét $f(x)=-(x-'+a+')^2+'+(a*a)+'$ trên đoạn $[0;'+(2*a)+']$. Giá trị lớn nhất của hàm số là bao nhiêu?', a*a,
          "$f(x)=-(x-a)^2+a^2\\le a^2$", ['Vì $(x-'+a+')^2\\ge0$ nên $-(x-'+a+')^2\\le0$.', 'Do đó $f(x)\\le '+(a*a)+'$.', 'Dấu bằng xảy ra tại $x='+a+'$ thuộc đoạn đã cho, nên GTLN bằng $'+(a*a)+'$.'], '', 'Biểu thức đạt đỉnh tại x = a và hệ số bình phương âm.', "$f_{\\max}=2a^2$");
        else set('Cho $f(x)=x^2-2mx$ trên đoạn $[-'+a+';'+a+']$. Có bao nhiêu giá trị nguyên của $m$ để đỉnh parabol nằm trong đoạn?', 2*a+1,
          "$f(x)=(x-m)^2-m^2$", ['Hoàn thành bình phương: $f(x)=(x-m)^2-m^2$, nên hoành độ đỉnh là $x=m$.', 'Đỉnh nằm trong đoạn khi $-'+a+'\\le m\\le '+a+'$.', 'Các số nguyên từ $-'+a+'$ đến $'+a+'$ có '+(2*a+1)+' giá trị.'], 'giá trị', 'Đưa hàm về dạng bình phương rồi xét hoành độ đỉnh.', "$-a<m<a$");
        break;
      case 'toan-b3':
        if (t.topicId.endsWith('-t1')) set('Đồ thị hàm số $y=\\frac{x+'+a+'}{x-'+a+'}$ có tiệm cận đứng $x=c$. Tìm $c$.', a,
          "$x-a=0\\Rightarrow x=a$", ['Tiệm cận đứng xuất hiện tại nghiệm của mẫu số nếu tử số không đồng thời bằng 0.', 'Giải $x-'+a+'=0$ được $x='+a+'$.'], '', 'Cho mẫu số bằng 0 và kiểm tra tử số tại điểm đó.', "$x+a=0$");
        else if (t.topicId.endsWith('-t2')) set('Xác định tiệm cận ngang của $y=\\frac{'+a+'x+'+b+'}{x+1}$ dưới dạng $y=c$. Tìm $c$.', a,
          "$c=\\frac{\\text{hệ số }x\\text{ ở tử}}{\\text{hệ số }x\\text{ ở mẫu}}$", ['Tử và mẫu cùng bậc một.', 'Tiệm cận ngang bằng tỉ số hệ số bậc cao nhất: $c='+a+'/'+1+'='+a+'$.'], '', 'Với phân thức cùng bậc, lấy tỉ số hệ số bậc cao nhất.', "$c=\\frac{b}{a}$");
        else set('Đồ thị $y=\\frac{x^2+'+a+'x+'+b+'}{x-1}$ có tiệm cận xiên $y=x+c$. Tìm $c$.', a+1,
          "$\\frac{x^2+ax+b}{x-1}=x+(a+1)+\\frac{a+b+1}{x-1}$", ['Chia đa thức tử cho mẫu: thương là $x+'+(a+1)+'$.', 'Phần dư chia cho $x-1$ tiến về 0 khi $x\\to\\pm\\infty$.', 'Vậy tiệm cận xiên là $y=x+'+(a+1)+'$, nên $c='+(a+1)+'$.'], '', 'Chia đa thức tử cho mẫu để tìm phần thương bậc nhất.', "$y=x+a$");
        break;
      case 'toan-b4':
        if (t.topicId.endsWith('-t1')) set('Với $f(x)=x^3-3('+a+')^2x$, phương trình $f\'(x)=0$ có bao nhiêu nghiệm thực phân biệt?', 2,
          "$f'(x)=3(x^2-a^2)=0$", ['Ta có $f\'(x)=3(x^2-'+(a*a)+')$.', 'Suy ra $x=\\pm '+a+'$. Vì '+a+'>0$, hai nghiệm phân biệt.', 'Vậy có 2 nghiệm thực phân biệt.'], 'nghiệm', 'Tính đạo hàm rồi phân tích thành nhân tử.', "$f'(x)=3x^2+3a^2$");
        else set('Đồ thị hàm số $f(x)=x^3-3('+a+')^2x$ cắt trục hoành tại bao nhiêu điểm phân biệt?', 3,
          "$f(x)=x(x^2-3a^2)$", ['Giải $f(x)=0$: $x=0$ hoặc $x^2=3\\cdot'+(a*a)+'='+(3*a*a)+'$.', 'Ba nghiệm là $x=0$, $x='+a+'\\sqrt3$ và $x=-'+a+'\\sqrt3$.', 'Vì $'+a+'>0$, ba nghiệm phân biệt tương ứng ba giao điểm.'], 'điểm', 'Phân tích f(x) thành tích để tìm nghiệm.', "$x(x^2-a^2)=0$");
        break;
      case 'toan-b5':
        if (t.topicId.endsWith('-t1')) set('Một hình chữ nhật có nửa chu vi $P='+(2*a)+'$ đơn vị. Diện tích lớn nhất bằng bao nhiêu?', a*a,
          "$S_{\\max}=P^2/4$", ['Gọi hai cạnh là $x$ và $P-x$.', 'Diện tích $S=x(P-x)=P^2/4-(x-P/2)^2$.', 'Diện tích lớn nhất là $P^2/4=('+ (2*a) +')^2/4='+(a*a)+'$, khi hai cạnh bằng nhau.'], 'đơn vị diện tích', 'Với tổng hai cạnh cố định, tích đạt lớn nhất khi hai cạnh bằng nhau.', "$S_{\\max}=P^2/2$");
        else set('Hàm lợi nhuận (đơn vị quy ước) là $P(x)=-x^2+2('+a+')x$. Lợi nhuận cực đại bằng bao nhiêu?', a*a,
          "$P(x)=-(x-a)^2+a^2$", ['Hoàn thành bình phương: $P(x)=-(x-'+a+')^2+'+(a*a)+'$.', 'Vì $-(x-'+a+')^2\\le0$, giá trị lớn nhất là '+(a*a)+', đạt tại $x='+a+'$.'], '', 'Hoàn thành bình phương hoặc dùng tọa độ đỉnh parabol.', "$P_{\\max}=2a^2$");
        break;
      case 'toan-b6':
        if (t.topicId.endsWith('-t1')) set('Cho $\\vec u=('+a+',0,0)$ và $\\vec v=(0,'+a+',0)$. Tọa độ thứ nhất của $\\vec u+\\vec v$ là bao nhiêu?', a,
          "$\\vec u+\\vec v=(a,a,0)$", ['Cộng từng tọa độ tương ứng: $('+a+'+0,0+'+a+',0+0)$.', 'Tọa độ thứ nhất bằng '+a+'+0='+a+'.'], '', 'Cộng các tọa độ cùng vị trí.', "$\\vec u+\\vec v=(0,0,0)$");
        else if (t.topicId.endsWith('-t2')) set('Vectơ chỉ phương của một đường thẳng là $\\vec u=('+a+',0,0)$. Độ dài vectơ này bằng bao nhiêu?', a,
          "$|\\vec u|=\\sqrt{x^2+y^2+z^2}$", ['Thay tọa độ: $|\\vec u|=\\sqrt{'+a+'^2+0+0}=|'+a+'|$.', 'Độ dài vectơ bằng '+a+'.'], '', 'Độ dài vectơ bằng căn bậc hai tổng bình phương các tọa độ.', "$|\\vec u|=a^2$");
        else set('Cho $\\vec u=(1,0,0)$, $\\vec v=(0,1,0)$ và $\\vec w=('+a+','+b+',0)$. Tích hỗn tạp $[\\vec u,\\vec v,\\vec w]$ bằng bao nhiêu?', 0,
          "$[\\vec u,\\vec v,\\vec w]=\\det\\begin{pmatrix}1&0&a\\0&1&b\\0&0&0\\end{pmatrix}$", ['Cả ba vectơ đều có tọa độ thứ ba bằng 0 nên nằm trong mặt phẳng $Oxy$.', 'Định thức của ba vectơ bằng 0.', 'Do đó tích hỗn tạp bằng 0.'], '', 'Ba vectơ đồng phẳng khi tích hỗn tạp bằng 0.', "$[\\vec u,\\vec v,\\vec w]=1$");
        break;
      case 'toan-b7':
        if (t.topicId.endsWith('-t1')) set('Điểm $A('+a+',0,0)$ nằm trên trục $Ox$. Khoảng cách $OA$ bằng bao nhiêu?', a,
          "$OA=\\sqrt{x_A^2+y_A^2+z_A^2}$", ['Thay tọa độ điểm: $OA=\\sqrt{'+a+'^2}='+a+'$.', 'Vậy $OA='+a+'$.'], '', 'Dùng công thức khoảng cách từ gốc tọa độ.', "$OA=a^2$");
        else set('Cho $A(0,'+a+',1)$ và $B('+a+','+(2*a)+',1)$. Hoành độ của $\\overrightarrow{AB}$ bằng bao nhiêu?', a,
          "$\\overrightarrow{AB}=(x_B-x_A,y_B-y_A,z_B-z_A)$", ['Hoành độ vectơ là $x_B-x_A='+a+'-0$.', 'Kết quả bằng $a='+a+'$.'], '', 'Lấy tọa độ điểm cuối trừ tọa độ điểm đầu.', "$x_A-x_B$");
        break;
      case 'toan-b8':
        if (t.topicId.endsWith('-t1')) set('Cho $\\vec u=('+a+','+(a+1)+',0)$ và $\\vec v=(1,1,0)$. Hoành độ của $\\vec u-\\vec v$ bằng bao nhiêu?', a-1,
          "$\\vec u-\\vec v=(a-1,a,0)$", ['Lấy tọa độ thứ nhất: $'+a+'-1$.', 'Tính được $'+a+'-1='+(a-1)+'$.'], '', 'Trừ từng tọa độ tương ứng.', "$a+1$");
        else set('Cho $\\vec u=('+a+',0,0)$ và $\\vec v=(1,0,0)$. Tích vô hướng $\\vec u\\cdot\\vec v$ bằng bao nhiêu?', a,
          "$\\vec u\\cdot\\vec v=x_1x_2+y_1y_2+z_1z_2$", ['Tích vô hướng bằng '+a+'\\cdot1+0+0.', 'Kết quả là '+a+'.'], '', 'Nhân các tọa độ tương ứng rồi cộng lại.', "$\\vec u\\cdot\\vec v=0$");
        break;
      case 'toan-b9':
        if (i % 2 === 0) set('Mẫu số liệu đã sắp xếp gồm $a, a+'+k+', a+'+(2*k)+', a+'+(3*k)+', a+'+(4*k)+'$. Khoảng biến thiên bằng bao nhiêu?', 4*k,
          "$R=x_{\\max}-x_{\\min}$", ['Giá trị lớn nhất là $a+4k$, nhỏ nhất là $a$.', 'Khoảng biến thiên $R=(a+4k)-a=4k='+ (4*k)+'$.'], '', 'Khoảng biến thiên bằng giá trị lớn nhất trừ giá trị nhỏ nhất.', "$R=x_{\\max}+x_{\\min}$");
        else set('Mẫu số liệu đã sắp xếp gồm $a, a+'+k+', a+'+(2*k)+', a+'+(3*k)+', a+'+(4*k)+'$. Khoảng tứ phân vị bằng bao nhiêu?', 3*k,
          "$IQR=Q_3-Q_1$", ['Bỏ trung vị ở giữa khi chia dữ liệu thành hai nửa: nửa dưới gồm $a$ và $a+k$, nửa trên gồm $a+3k$ và $a+4k$.', 'Do đó $Q_1=a+\\frac{k}{2}$ và $Q_3=a+\\frac{7k}{2}$.', 'Khoảng tứ phân vị $IQR=Q_3-Q_1=3k='+(3*k)+'$.'], '', 'Với 5 số đã sắp xếp, lấy trung vị của nửa dưới và nửa trên để tìm Q1, Q3.', "$IQR=Q_3+Q_1$");
        break;
      case 'toan-b10':
        if (i % 2 === 0) set('Mẫu số liệu gồm $a-'+k+',a-'+k+',a+'+k+',a+'+k+'$. Phương sai của mẫu số liệu bằng bao nhiêu?', k*k,
          "$s^2=\\frac1n\\sum (x_i-\\bar x)^2$", ['Số trung bình là $\\bar x=a$.', 'Mỗi giá trị cách số trung bình một khoảng $k$.', 'Phương sai $s^2=\\frac{(k^2+k^2+k^2+k^2)}4=k^2='+ (k*k)+'$.'], '', 'Tính số trung bình, rồi lấy trung bình các bình phương độ lệch.', "$s^2=2k^2$");
        else set('Mẫu số liệu gồm $a-'+k+',a-'+k+',a+'+k+',a+'+k+'$. Độ lệch chuẩn của mẫu số liệu bằng bao nhiêu?', k,
          "$s=\\sqrt{s^2}$", ['Số trung bình là $\\bar x=a$; mỗi giá trị cách trung bình một khoảng $k$.', 'Phương sai $s^2=k^2$.', 'Độ lệch chuẩn $s=\\sqrt{k^2}=k='+k+'$ vì $k>0$.'], '', 'Độ lệch chuẩn là căn bậc hai không âm của phương sai.', "$s=s^2$");
        break;
      case 'toan-b11':
        if (t.topicId.endsWith('-t1')) set('Cho $f(x)='+(2*a)+'x$. Một nguyên hàm $F(x)$ có dạng $F(x)='+a+'x^2+C$. Hệ số của $x^2$ là bao nhiêu?', a,
          "$\\int 2ax\\,dx=ax^2+C$", ['Dùng công thức $\\int x\\,dx=\\frac{x^2}{2}+C$.', 'Vì $f(x)='+(2*a)+'x$, một nguyên hàm là $F(x)='+a+'x^2+C$.', 'Hệ số của $x^2$ là $'+a+'$; có thể kiểm tra bằng cách lấy đạo hàm.'], '', 'Tìm nguyên hàm rồi kiểm tra bằng đạo hàm.', "$F(x)=2ax^2+C$");
        else set('Tính nguyên hàm $\\int '+a+'x^{'+(a-1)+'}\\,dx$. Số mũ của $x$ trong một nguyên hàm là bao nhiêu?', a,
          "$\\int ax^{a-1}\\,dx=x^a+C$", ['Áp dụng quy tắc lũy thừa: tăng số mũ lên một rồi chia cho số mũ mới.', 'Ta có $\\int '+a+'x^{'+(a-1)+'}\\,dx=x^{'+a+'}+C$.', 'Số mũ của $x$ trong nguyên hàm là '+a+'.'], '', 'Tăng số mũ lên một rồi chia cho số mũ mới.', "$\\int ax^{a-1}\\,dx=ax^a+C$");
        break;
      case 'toan-b12':
        if (t.topicId.endsWith('-t1')) set('Tính $\\int_0^{'+a+'}2x\\,dx$. Giá trị tích phân bằng bao nhiêu?', a*a,
          "$\\int_0^a2x\\,dx=[x^2]_0^a=a^2$", ['Một nguyên hàm của $2x$ là $x^2$.', 'Thay cận: $'+a+'^2-0^2='+(a*a)+'$.'], '', 'Tìm nguyên hàm trước, sau đó thay cận trên trừ cận dưới.', "$\\int_0^a2x\\,dx=2a$");
        else set('Tính $\\int_0^1 '+(2*a*a)+'x\\,dx$. Giá trị tích phân bằng bao nhiêu?', a*a,
          "$\\int_0^1 "+(2*a*a)+"x\\,dx=["+(a*a)+"x^2]_0^1="+(a*a)+"$", ['Một nguyên hàm là $'+(a*a)+'x^2$.', 'Thay cận từ 0 đến 1 được $'+(a*a)+'-0='+(a*a)+'$.'], '', 'Tìm nguyên hàm rồi thay cận trên trừ cận dưới.', "$\\int_0^1 "+(2*a*a)+"x\\,dx="+(2*a*a)+"$");
        break;
      case 'toan-b13':
        if (t.topicId.endsWith('-t1')) set('Diện tích hình phẳng giới hạn bởi $y='+a+'$, trục $Ox$, $x=0$ và $x='+a+'$ bằng bao nhiêu?', a*a,
          "$S=\\int_0^a a\\,dx=a^2$", ['Đây là hình chữ nhật có chiều cao '+a+' và chiều rộng '+a+'.', 'Diện tích $S='+a+'\\cdot'+a+'='+(a*a)+'$.'], '', 'Diện tích bằng tích phân của hàm trên đoạn hoặc diện tích hình chữ nhật.', "$S=2a^2$");
        else set('Quay đoạn đồ thị $y='+a+'$ trên $[0;'+a+']$ quanh trục $Ox$ tạo thành hình trụ. Hệ số $K$ trong $V=K\\pi$ bằng bao nhiêu?', a*a*a,
          "$V=\\pi\\int_0^a y^2\\,dx=\\pi a^3$", ['Bán kính hình trụ là '+a+', chiều cao là '+a+'.', 'Thể tích $V=\\pi\\cdot'+a+'^2\\cdot'+a+'='+(a*a*a)+'\\pi$.', 'Vậy hệ số $K='+(a*a*a)+'$.'], '', 'Dùng công thức thể tích vật thể tròn xoay quanh Ox.', "$V=\\pi a^2$");
        break;
      case 'toan-b14':
        if (t.topicId.endsWith('-t1')) set('Mặt phẳng có phương trình $('+a+')x+0y+0z='+a+'$. Hệ số của $x$ trong vế trái bằng bao nhiêu?', a,
          "$"+a+"x="+a+"$", ['Vectơ pháp tuyến của mặt phẳng là $('+a+',0,0)$.', 'Hệ số đứng trước $x$ trong phương trình đã cho là $'+a+'$.'], '', 'Đọc trực tiếp hệ số đứng trước x.', "$x+"+a+"y="+a+"$");
        else set('Hai mặt phẳng $x+y+z='+a+'$ và $x+y+z='+(2*a)+'$ song song. Độ chênh lệch hai hằng số tự do bằng bao nhiêu?', a,
          "$|2a-a|=a$", ['Hai mặt phẳng có cùng vectơ pháp tuyến nên song song hoặc trùng nhau.', 'Độ chênh lệch hai hằng số tự do là $|'+(2*a)+'-'+a+'|='+a+'$.'], '', 'So sánh vectơ pháp tuyến và hằng số tự do.', "$|2a+a|$");
        break;
      case 'toan-b15':
        if (t.topicId.endsWith('-t1')) set('Đường thẳng qua gốc tọa độ có phương trình tham số $x='+a+'t,y=0,z=0$. Hoành độ tại $t=1$ bằng bao nhiêu?', a,
          "$x=at$", ['Thay $t=1$ vào $x=at$.', 'Suy ra $x='+a+'\\cdot1='+a+'$.'], '', 'Thay giá trị tham số vào phương trình.', "$x=t+'+a+'$");
        else set('Hai đường thẳng song song có vectơ chỉ phương cùng phương trục $Ox$; đường thứ nhất qua $(0,0,0)$, đường thứ hai qua $(0,'+a+',0)$. Khoảng cách giữa hai đường thẳng bằng bao nhiêu?', a,
          "d=|y_2-y_1|", ['Hai đường có cùng phương trục $Ox$ nên song song.', 'Khoảng cách vuông góc giữa chúng là độ chênh tọa độ $y$: $d='+a+'$.'], '', 'Với hai đường song song theo trục Ox, đo khoảng cách theo phương vuông góc với chúng.', "d=0");
        break;
      case 'toan-b16':
        if (t.topicId.endsWith('-t1')) set('Cho $\\vec u=('+a+',0,0)$ và $\\vec v=('+a+',1,0)$. Tích vô hướng $\\vec u\\cdot\\vec v$ (dùng để tính góc giữa hai đường thẳng) bằng bao nhiêu?', a*a,
          "$\\vec u\\cdot\\vec v=x_1x_2+y_1y_2+z_1z_2$", ['Tích vô hướng là '+a+'\\cdot'+a+'+0\\cdot1+0\\cdot0.', 'Kết quả bằng '+a+'^2='+(a*a)+'$.'], '', 'Tính tích vô hướng trước khi dùng công thức cos góc.', "$\\vec u\\cdot\\vec v=0$");
        else if (t.topicId.endsWith('-t2')) set('Một đường thẳng có vectơ chỉ phương $\\vec u=('+a+',0,0)$, còn mặt phẳng $Oxy$ có pháp tuyến $\\vec n=(0,0,1)$. Tích vô hướng $\\vec u\\cdot\\vec n$ bằng bao nhiêu?', 0,
          "$\\vec u\\cdot\\vec n=a\\cdot0+0\\cdot0+0\\cdot1=0$", ['Từng tích tọa độ tương ứng đều bằng 0.', 'Hai vectơ vuông góc nên tích vô hướng bằng 0.'], '', 'Đường thẳng song song với mặt phẳng Oxy; vectơ chỉ phương vuông góc với pháp tuyến.', "$\\vec u\\cdot\\vec n=a$");
        else set('Hai mặt phẳng $\\Pi_1: '+a+'x=0$ và $\\Pi_2: '+a+'y=0$ có các vectơ pháp tuyến lần lượt là $('+a+',0,0)$ và $(0,'+a+',0)$. Góc giữa hai mặt phẳng bằng bao nhiêu độ?', 90,
          "$\\vec n_1\\cdot\\vec n_2="+a+"\\cdot0+0\\cdot"+a+"=0\\Rightarrow\\theta=90^\\circ$", ['Tích vô hướng hai vectơ pháp tuyến bằng 0.', 'Hai vectơ pháp tuyến vuông góc nên hai mặt phẳng vuông góc.', 'Vậy góc giữa hai mặt phẳng là $90^\\circ$.'], 'độ', 'Hai vectơ pháp tuyến vuông góc thì hai mặt phẳng vuông góc.', "$\\theta=0^\\circ$");
        break;
      case 'toan-b17':
        if (t.topicId.endsWith('-t1')) set('Mặt cầu $(x-'+a+')^2+y^2+z^2='+ (a*a)+'$ có bán kính bằng bao nhiêu?', a,
          "$(x-a)^2+y^2+z^2=R^2$", ['So sánh với dạng chuẩn $(x-'+a+')^2+y^2+z^2=R^2$.', 'Ta có $R^2='+(a*a)+'$, nên $R=\\sqrt{'+(a*a)+'}='+a+'$.'], '', 'Bán kính là căn bậc hai của vế phải.', "$R=a^2$");
        else set('Mặt cầu tâm $O$, bán kính $'+a+'$; điểm $P('+(2*a)+',0,0)$. Khoảng cách $OP$ bằng bao nhiêu?', 2*a,
          "$OP=\\sqrt{("+(2*a)+")^2}="+(2*a)+"$", ['Dùng công thức khoảng cách từ gốc tọa độ.', 'Tính $OP=|'+(2*a)+'|='+(2*a)+'$.', 'Vì $OP='+(2*a)+'$ lớn hơn bán kính $'+a+'$, điểm P nằm ngoài mặt cầu.'], '', 'Tính khoảng cách đến tâm rồi so sánh với bán kính.', "$OP="+a+"$");
        break;
      case 'toan-b18':
        // Giữ P(A) trong [0,1] kể cả ở các biến thể tham số lớn.
        if (t.topicId.endsWith('-t1')) set('Biết $P(A)='+a+'/('+(a+10)+')$ và $P(B|A)=1/2$. Tính $P(A\cap B)$.', a/(2*(a+10)),
          "$P(A\cap B)=P(A)P(B|A)$", ['Dùng công thức $P(A\cap B)=P(A)P(B|A)$.', 'Thay số: $\frac{'+a+'}{'+(a+10)+'}\cdot\frac12=\frac{'+a+'}{'+(2*(a+10))+'}='+fmt(a/(2*(a+10)))+'$.'], '', 'Xác suất giao bằng xác suất A nhân xác suất B có điều kiện theo A.', "$P(A\cap B)=P(A)+P(B|A)$");
        else set('Biết $P(A)='+a+'/('+(a+10)+')$ và $P(B|A)=1/3$. Tính $P(A\cap B)$.', a/(3*(a+10)),
          "$P(A\cap B)=P(A)P(B|A)$", ['Dùng quy tắc nhân xác suất có điều kiện.', 'Tính $\frac{'+a+'}{'+(a+10)+'}\cdot\frac13=\frac{'+a+'}{'+(3*(a+10))+'}='+fmt(a/(3*(a+10)))+'$.'], '', 'Nhân xác suất của A với xác suất có điều kiện.', "$P(A\cap B)=P(A)/P(B|A)$");
        break;
      case 'toan-b19':
        if (t.topicId.endsWith('-t1')) {
          const ans = (a+1)/(2*(a+2));
          set('Có hai nhóm $A,B$ với $P(A)='+a+'/('+(a+2)+')$, $P(B)=2/('+(a+2)+')$, $P(C|A)=1/2$, $P(C|B)=1/4$. Tính $P(C)$.', ans,
            "$P(C)=P(A)P(C|A)+P(B)P(C|B)$", ['Áp dụng công thức xác suất toàn phần.', 'Thay số: $\\frac{'+a+'}{'+(a+2)+'}\\cdot\\frac12+\\frac{2}{'+(a+2)+'}\\cdot\\frac14$.', 'Rút gọn được $\\frac{'+(a+1)+'}{2\\cdot'+(a+2)+'}='+fmt(ans)+'$.'], '', 'Cộng xác suất C qua các nhóm A và B.', "$P(C)=P(A)P(B|C)$");
        } else {
          const ans = a/(a+1);
          set('Với $P(A)='+a+'/('+(a+2)+')$, $P(B)=2/('+(a+2)+')$, $P(C|A)=1/2$, $P(C|B)=1/4$, hãy tính $P(A|C)$.', ans,
            "$P(A|C)=\\frac{P(A)P(C|A)}{P(C)}$", ['Tử số: $P(A)P(C|A)=\\frac{'+a+'}{'+(a+2)+'}\\cdot\\frac12=\\frac{'+a+'}{2\\cdot'+(a+2)+'}$.', 'Mẫu số theo xác suất toàn phần: $P(C)=\\frac{'+(a+1)+'}{2\\cdot'+(a+2)+'}$.', 'Suy ra $P(A|C)=\\frac{'+a+'}{'+(a+1)+'}='+fmt(ans)+'$.'], '', 'Dùng Bayes: xác suất nhóm A và C chia cho xác suất C.', "$P(A|C)=P(A)P(C)$");
        }
        break;
    }
  } else {
    switch (id) {
      case 'ly-b1':
        if (t.topicId.endsWith('-t1')) {
          const prompts = [
            'Mô hình động học phân tử nêu ba ý: chất được cấu tạo từ các hạt riêng biệt; các hạt chuyển động không ngừng; giữa các hạt có lực tương tác. Có bao nhiêu ý cơ bản?',
            'Theo thuyết động học phân tử, cấu tạo hạt, chuyển động nhiệt và lực tương tác là ba luận điểm chính. Có bao nhiêu luận điểm?',
            'Khi tóm tắt mô hình động học phân tử, học sinh ghi ba nội dung: các hạt cấu tạo nên chất, chuyển động liên tục và tương tác với nhau. Số nội dung được ghi là bao nhiêu?',
            'Ba nhận định cơ bản của mô hình động học phân tử gồm tính gián đoạn của vật chất, chuyển động không ngừng và lực tương tác giữa các hạt. Có bao nhiêu nhận định?',
            'Mô hình phân tử của chất được trình bày qua 3 luận điểm về cấu tạo, chuyển động và tương tác. Số luận điểm là bao nhiêu?',
            'Một bản ghi bài liệt kê ba đặc điểm của các phân tử: tồn tại riêng biệt, chuyển động nhiệt và có lực tương tác. Có bao nhiêu đặc điểm?',
            'Thuyết động học phân tử giải thích chất qua cấu tạo từ hạt, chuyển động không ngừng và lực tương tác. Có bao nhiêu ý chính?',
            'Trong phần tổng kết mô hình động học phân tử, ba nội dung cốt lõi được nêu về hạt cấu tạo, chuyển động nhiệt và tương tác. Có bao nhiêu nội dung?'
          ];
          set(prompts[i], 3, 'Mô hình gồm ba luận điểm cơ bản về cấu tạo, chuyển động và tương tác của các hạt.', ['Đếm các luận điểm về cấu tạo hạt, chuyển động không ngừng và lực tương tác.', 'Có 3 ý cơ bản.'], 'ý', 'Ghi nhớ cấu tạo hạt, chuyển động nhiệt và lực tương tác giữa các hạt.', 'Có 2 ý cơ bản');
        } else {
          const prompts = [
            'Trong ba trạng thái rắn, lỏng, khí, có bao nhiêu quá trình chuyển thể thuận nghịch giữa các cặp trạng thái nếu tính cả hai chiều?',
            'Xét ba cặp trạng thái rắn–lỏng, lỏng–khí, rắn–khí. Mỗi cặp chuyển đổi được theo hai chiều. Tổng số quá trình chuyển thể là bao nhiêu?',
            'Có ba cặp trạng thái vật chất khác nhau và mỗi cặp có hai chiều chuyển thể. Có tất cả bao nhiêu quá trình chuyển thể?',
            'Tính nóng chảy/đông đặc, hóa hơi/ngưng tụ và thăng hoa/ngưng kết là sáu quá trình riêng. Tổng số quá trình được nêu là bao nhiêu?',
            'Từ ba trạng thái rắn, lỏng và khí, nếu đếm mỗi chiều biến đổi là một quá trình thì có tất cả bao nhiêu quá trình?',
            'Ba cặp trạng thái vật chất có thể chuyển đổi theo hai chiều thuận nghịch. Số quá trình chuyển thể khi tính riêng từng chiều là bao nhiêu?',
            'Nếu mỗi cặp trong ba cặp trạng thái rắn–lỏng, lỏng–khí, rắn–khí có hai quá trình ngược chiều, tổng số quá trình là bao nhiêu?',
            'Kể cả chiều thuận và chiều ngược, ba cặp trạng thái vật chất tạo nên bao nhiêu quá trình chuyển thể?'
          ];
          set(prompts[i], 6, 'Mỗi cặp trạng thái có hai chiều chuyển thể.', ['Ba cặp trạng thái: rắn–lỏng, lỏng–khí, rắn–khí.', 'Mỗi cặp có hai chiều nên có $3\\times2=6$ quá trình.'], 'quá trình', 'Xét nóng chảy/đông đặc, hóa hơi/ngưng tụ, thăng hoa/ngưng kết.', 'Có 3 quá trình');
        }
        break;
      case 'ly-b2':
        if (t.topicId.endsWith('-t1')) set('Một hệ nhận nhiệt lượng $Q='+(100*a)+'$ J và nhận công $A='+(20*a)+'$ J. Theo quy ước $\\Delta U=Q+A$, nội năng biến thiên bao nhiêu J?', 120*a,
          "$\\Delta U=Q+A$", ['Theo định luật I nhiệt động lực học: $\\Delta U=Q+A$.', 'Thay số: $'+(100*a)+'+'+(20*a)+'='+(120*a)+'$ J.'], 'J', 'Theo quy ước ở đề, hệ nhận công thì A dương.', "$\\Delta U=Q-A$");
        else set('Một hệ nhận nhiệt lượng $Q='+(80*a)+'$ J và nội năng tăng $\\Delta U='+(120*a)+'$ J. Công mà hệ nhận bằng bao nhiêu J?', 40*a,
          "$\\Delta U=Q+A\\Rightarrow A=\\Delta U-Q$", ['Biến đổi công thức: $A=\\Delta U-Q$.', 'Thay số: $'+(120*a)+'-'+(80*a)+'='+(40*a)+'$ J.'], 'J', 'Chuyển vế trong định luật I nhiệt động lực học.', "$A=Q-\\Delta U$");
        break;
      case 'ly-b3':
        set('Nhiệt độ $'+(10*a)+'^\\circ C$ tương ứng bao nhiêu kelvin? Dùng $T=t+273,15$.', 273.15+10*a,
          "$T=t+273,15$", ['Thay $t='+(10*a)+'^\\circ C$ vào công thức.', 'Tính $T='+(10*a)+'+273,15='+fmt(273.15+10*a)+'$ K.'], 'K', 'Cộng 273,15 vào nhiệt độ Celsius.', "$T=t-273,15$");
        break;
      case 'ly-b4':
        if (t.topicId.endsWith('-t1')) set('Đun nóng $'+a+'$ kg chất có nhiệt dung riêng $c=0,5$ kJ/(kg·K), nhiệt độ tăng $10$ K. Nhiệt lượng cần cung cấp là bao nhiêu kJ?', 5*a,
          "$Q=mc\\Delta T$", ['Dùng công thức $Q=mc\\Delta T$.', 'Thay số: $Q='+a+'\\cdot0,5\\cdot10='+(5*a)+'$ kJ.'], 'kJ', 'Dùng Q = mcΔT; chú ý đổi thống nhất đơn vị.', "$Q=mc/\\Delta T$");
        else {
          const hot = 20 + 3*a;
          const equilibrium = (2*hot + 20)/3;
          set('Hai vật cùng chất, nhiệt dung riêng bằng nhau và không thất thoát nhiệt. Vật nóng có khối lượng $2$ kg ở $'+hot+'^\\circ C$, vật lạnh có khối lượng $1$ kg ở $20^\\circ C$. Nhiệt độ cân bằng bằng bao nhiêu độ C?', equilibrium,
            "$m_1c(T_1-T)=m_2c(T-T_2)$", ['Nhiệt lượng vật nóng tỏa ra bằng nhiệt lượng vật lạnh thu vào.', 'Vì khối lượng là 2 kg và 1 kg, ta có $2('+hot+'-T)=T-20$.', 'Giải phương trình: $'+(2*hot)+'-2T=T-20$, nên $3T='+(2*hot+20)+'$ và $T='+fmt(equilibrium)+'^\\circ C$.'], '°C', 'Dùng cân bằng nhiệt, rồi giải phương trình bậc nhất.', "$T=(T_1+T_2)/2$");
        }
        break;
      case 'ly-b5':
        set('Làm nóng chảy hoàn toàn $'+(a/10)+'$ kg chất có nhiệt nóng chảy riêng $\\lambda=200$ kJ/kg. Nhiệt lượng cần thiết là bao nhiêu kJ?', 20*a,
          "$Q=\\lambda m$", ['Dùng $Q=\\lambda m$.', 'Thay số: $Q=200\\cdot'+(a/10)+'='+(20*a)+'$ kJ.'], 'kJ', 'Nhớ rằng nhiệt nóng chảy riêng nhân với khối lượng.', "$Q=\\lambda/m$");
        break;
      case 'ly-b6':
        set('Hóa hơi hoàn toàn $'+(a/100)+'$ kg chất lỏng có nhiệt hóa hơi riêng $L=2300$ kJ/kg. Nhiệt lượng cần thiết là bao nhiêu kJ?', 23*a,
          "$Q=Lm$", ['Dùng $Q=Lm$.', 'Thay số: $Q=2300\\cdot'+(a/100)+'='+(23*a)+'$ kJ.'], 'kJ', 'Nhiệt hóa hơi riêng nhân với khối lượng chất lỏng.', "$Q=L/m$");
        break;
      case 'ly-b7':
        set('Một lượng chất có khối lượng $'+a+'$ kg được tăng nhiệt độ thêm 10 K với $c=1$ kJ/(kg·K), sau đó nóng chảy với $\\lambda=20$ kJ/kg và hóa hơi với $L=30$ kJ/kg. Tổng năng lượng cho ba giai đoạn bằng bao nhiêu kJ?', 60*a,
          "$Q_{\\text{tổng}}=mc\\Delta T+\\lambda m+Lm$", ['Tăng nhiệt: $Q_1=mc\\Delta T='+a+'\\cdot1\\cdot10='+(10*a)+'$ kJ.', 'Nóng chảy: $Q_2=\\lambda m=20\\cdot'+a+'='+(20*a)+'$ kJ.', 'Hóa hơi: $Q_3=Lm=30\\cdot'+a+'='+(30*a)+'$ kJ.', 'Tổng $Q='+(10*a)+'+'+(20*a)+'+'+(30*a)+'='+(60*a)+'$ kJ.'], 'kJ', 'Cộng nhiệt lượng của từng giai đoạn; không bỏ sót nhiệt chuyển thể.', "$Q_{\\text{tổng}}=mc+\\lambda/L$");
        break;
      case 'ly-b8':
        if (t.topicId.endsWith('-t1')) set('Trong một mô hình khí lí tưởng ở nhiệt độ không đổi, nếu mật độ phân tử tăng lên $'+a+'$ lần thì áp suất tăng bao nhiêu lần (thể tích và nhiệt độ được xét theo quan hệ $p\\propto nT$)?', a,
          "$p\\propto nT$", ['Ở nhiệt độ không đổi, $p$ tỉ lệ thuận với mật độ phân tử $n$.', 'Mật độ tăng '+a+' lần thì áp suất cũng tăng '+a+' lần.'], 'lần', 'Giữ nhiệt độ không đổi và dùng quan hệ tỉ lệ giữa áp suất với mật độ phân tử.', "$p\\propto 1/n$");
        else set('Nhiệt độ tuyệt đối của khí tăng từ $100$ K lên $'+(100*a)+'$ K. Động năng tịnh tiến trung bình của phân tử tăng bao nhiêu lần?', a,
          "$\\overline{E_k}=\\frac32 k_BT\\Rightarrow\\overline{E_k}\\propto T$", ['Động năng tịnh tiến trung bình tỉ lệ thuận với nhiệt độ tuyệt đối.', 'Tỉ số động năng bằng $T_2/T_1='+(100*a)+'/100='+a+'$.'], 'lần', 'Tính tỉ số nhiệt độ tuyệt đối.', "$\\overline{E_k}\\propto 1/T$");
        break;
      case 'ly-b9':
        set('Một lượng khí biến đổi đẳng nhiệt có $p_1='+a+'$ kPa, $V_1=4$ L và $V_2=2$ L. Áp suất cuối $p_2$ bằng bao nhiêu kPa?', 2*a,
          "$p_1V_1=p_2V_2$", ['Định luật Boyle: $p_1V_1=p_2V_2$.', 'Suy ra $p_2=p_1V_1/V_2='+a+'\\cdot4/2='+(2*a)+'$ kPa.'], 'kPa', 'Trong quá trình đẳng nhiệt, tích pV không đổi.', "$p_1/V_1=p_2/V_2$");
        break;
      case 'ly-b10':
        set('Một lượng khí biến đổi đẳng áp, thể tích tăng từ $'+a+'$ L ở $300$ K lên $600$ K. Thể tích cuối bằng bao nhiêu L?', 2*a,
          "$\\frac{V_1}{T_1}=\\frac{V_2}{T_2}$", ['Định luật Charles: $V/T$ không đổi khi áp suất không đổi.', 'Suy ra $V_2=V_1T_2/T_1='+a+'\\cdot600/300='+(2*a)+'$ L.'], 'L', 'Dùng nhiệt độ tuyệt đối và tỉ số V/T.', "$V_1T_1=V_2T_2$");
        break;
      case 'ly-b11':
        set('Một lượng khí có $p_1='+a+'$ (đơn vị quy ước), $V_1=2$ L, $T_1=300$ K; trạng thái sau có $p_2='+(a+1)+', T_2=600$ K. Thể tích $V_2$ bằng bao nhiêu L?', 4*a/(a+1),
          "$\\frac{p_1V_1}{T_1}=\\frac{p_2V_2}{T_2}$", ['Từ phương trình trạng thái: $V_2=\\frac{p_1V_1T_2}{p_2T_1}$.', 'Thay số: $V_2=\\frac{'+a+'\\cdot2\\cdot600}{'+(a+1)+'\\cdot300}=\\frac{'+(4*a)+'}{'+(a+1)+'}='+fmt(4*a/(a+1))+'$ L.'], 'L', 'Dùng pV/T không đổi cho cùng một lượng khí.', "$\\frac{p_1V_1}{T_2}=\\frac{p_2V_2}{T_1}$");
        break;
      case 'ly-b12':
        if (t.topicId.endsWith('-t1')) set('Trong một mô hình đơn giản $p=\\frac13\\rho v^2$, cho $\\rho='+a+'$ kg/m³ và $v^2=3$ (đơn vị quy ước). Giá trị áp suất theo mô hình bằng bao nhiêu?', a,
          "$p=\\frac13\\rho v^2$", ['Thay số: $p=\\frac13\\cdot'+a+'\\cdot3='+a+'$.'], 'đơn vị áp suất', 'Thay đúng mật độ và bình phương tốc độ vào công thức.', "$p=3\\rho v^2$");
        else set('Nhiệt độ tuyệt đối tăng từ $100$ K lên $'+(100*a)+'$ K. Động năng trung bình của phân tử tăng theo tỉ số bao nhiêu?', a,
          "$\\overline{E_k}=\\frac32 k_BT$", ['Động năng trung bình tỉ lệ với nhiệt độ tuyệt đối.', 'Tỉ số là $T_2/T_1='+(100*a)+'/100='+a+'$.'], 'lần', 'So sánh nhiệt độ tuyệt đối, không dùng độ Celsius.', "$\\overline{E_k}\\propto 1/T$");
        break;
      case 'ly-b13':
        set('Khí chuyển từ trạng thái $p_1='+a+', V_1=2$ L, $T_1=300$ K sang $p_2='+a+', T_2=600$ K. Thể tích $V_2$ bằng bao nhiêu L?', 4,
          "$\\frac{p_1V_1}{T_1}=\\frac{p_2V_2}{T_2}$", ['Vì $p_1=p_2$, áp suất triệt tiêu trong tỉ số.', 'Suy ra $V_2=V_1T_2/T_1=2\\cdot600/300=4$ L.'], 'L', 'Kết hợp các định luật khí; luôn dùng Kelvin.', "$V_2=V_1T_1/T_2$");
        break;
      case 'ly-b14':
        if (t.topicId.endsWith('-t1')) set('Có '+a+' nam châm thẳng riêng biệt, mỗi nam châm đều có một cực Bắc và một cực Nam. Tổng số cực từ của các nam châm là bao nhiêu?', 2*a,
          'Mỗi nam châm thông thường có hai cực từ: Bắc và Nam.', ['Mỗi nam châm có 2 cực từ.', 'Với '+a+' nam châm, tổng số cực từ là '+a+'\\times2='+(2*a)+'.'], 'cực', 'Mỗi nam châm thông thường có hai cực từ.', 'Mỗi nam châm chỉ có một cực từ');
        else set('Có '+a+' kim nam châm nhỏ, mỗi kim có một đầu Bắc và một đầu Nam. Tổng số đầu kim nam châm là bao nhiêu?', 2*a,
          'Mỗi kim nam châm có hai đầu tương ứng hai cực.', ['Mỗi kim nam châm có 2 đầu.', 'Với '+a+' kim, tổng số đầu là '+a+'\\times2='+(2*a)+'.'], 'đầu', 'Mỗi kim nam châm có hai đầu Bắc/Nam.', 'Mỗi kim nam châm có ba đầu');
        break;
      case 'ly-b15':
        if (t.topicId.endsWith('-t1')) set('Dây dẫn dài $1$ m vuông góc với từ trường $B='+(0.1*a)+'$ T, có dòng điện $I=2$ A. Lực từ tác dụng lên dây bằng bao nhiêu N?', 0.2*a,
          "$F=BIL\\sin\\theta$", ['Dây vuông góc với từ trường nên $\\sin90^\\circ=1$.', 'Thay số: $F='+(0.1*a)+'\\cdot2\\cdot1='+(0.2*a)+'$ N.'], 'N', 'Khi dây vuông góc với từ trường, sin góc bằng 1.', "$F=BIL\\cos\\theta$");
        else set('Dây dẫn dài $1$ m có dòng điện $I=2$ A, chịu lực từ $F='+a+'$ N khi vuông góc với từ trường. Độ lớn cảm ứng từ $B$ bằng bao nhiêu T?', a/2,
          "$B=\\frac{F}{IL}$", ['Vì dây vuông góc từ trường nên $F=BIL$.', 'Suy ra $B=F/(IL)='+a+'/(2\\cdot1)='+fmt(a/2)+'$ T.'], 'T', 'Biến đổi F = BIL để tìm B.', "$B=FIL$");
        break;
      case 'ly-b16':
        if (t.topicId.endsWith('-t1')) set('Từ trường đều có $B='+(0.1*a)+'$ T, diện tích mạch $S=2$ m² và pháp tuyến cùng hướng với từ trường. Từ thông qua mạch bằng bao nhiêu Wb?', 0.2*a,
          "$\\Phi=BS\\cos\\theta$", ['Góc giữa pháp tuyến và từ trường bằng $0^\\circ$, do đó $\\cos\\theta=1$.', 'Từ thông $\\Phi='+(0.1*a)+'\\cdot2='+(0.2*a)+'$ Wb.'], 'Wb', 'Dùng góc giữa vectơ pháp tuyến và B.', "$\\Phi=BS\\sin\\theta$");
        else set('Cuộn dây có $N='+a+'$ vòng; từ thông qua mỗi vòng biến thiên $0,2$ Wb trong $2$ s. Độ lớn suất điện động cảm ứng bằng bao nhiêu V?', 0.1*a,
          "$|\\mathcal E|=N\\frac{|\\Delta\\Phi|}{\\Delta t}$", ['Định luật Faraday: $|\\mathcal E|=N|\\Delta\\Phi|/\\Delta t$.', 'Thay số: $|\\mathcal E|='+a+'\\cdot0,2/2='+(0.1*a)+'$ V.'], 'V', 'Lấy độ biến thiên từ thông chia thời gian rồi nhân số vòng dây.', "$|\\mathcal E|=\\frac{\\Delta t}{N\\Delta\\Phi}$");
        break;
      case 'ly-b17':
        if (t.topicId.endsWith('-t1')) set('Máy phát điện xoay chiều có một đôi cực, quay với tốc độ $n='+(60*a)+'$ vòng/phút. Tần số dòng điện bằng bao nhiêu Hz?', a,
          "$f=\\frac{n}{60}$ (với một đôi cực)", ['Đổi vòng/phút sang vòng/giây: $f=n/60$.', 'Thay số: $f='+(60*a)+'/60='+a+'$ Hz.'], 'Hz', 'Với một đôi cực, mỗi vòng quay tạo một chu kì.', "$f=60n$");
        else set('Một nguồn có suất điện động cảm ứng $E='+a+'$ V mắc với điện trở $R=2\\,\\Omega$. Bỏ qua điện trở trong, cường độ dòng điện bằng bao nhiêu A?', a/2,
          "$I=\\frac{E}{R}$", ['Theo định luật Ohm: $I=E/R$.', 'Suy ra $I='+a+'/2='+fmt(a/2)+'$ A.'], 'A', 'Dùng định luật Ohm cho toàn mạch theo dữ kiện đã cho.', "$I=ER$");
        break;
      case 'ly-b18':
        set('Bếp từ có công suất $P='+(2*a)+'$ kW hoạt động trong $30$ s. Điện năng chuyển hóa theo công thức $Q=Pt$ bằng bao nhiêu kJ?', 60*a,
          "$Q=Pt$", ['Công suất là $P='+(2*a)+'$ kW và thời gian là 30 s, nên $Q=Pt='+(2*a)+'\\cdot30='+(60*a)+'$ kJ.', 'Suy ra $Q='+(60*a)+'$ kJ.'], 'kJ', 'Công suất nhân thời gian cho năng lượng; nhớ kW·s = kJ.', "$Q=P/t$");
        break;
      case 'ly-b19':
        set('Sóng điện từ truyền trong chân không với $c=3\\cdot10^8$ m/s. Nếu tần số $f='+(a)+'\\cdot10^6$ Hz, bước sóng bằng bao nhiêu m?', 300/a,
          "$\\lambda=\\frac{c}{f}$", ['Bước sóng bằng vận tốc chia tần số.', 'Thay số: $\\lambda=\\frac{3\\cdot10^8}{'+a+'\\cdot10^6}='+fmt(300/a)+'$ m.'], 'm', 'Dùng λ = c/f; đổi đơn vị tần số theo lũy thừa 10.', "$\\lambda=cf$");
        break;
      case 'ly-b20':
        set('Dây dẫn dài $1$ m đặt vuông góc trong từ trường $B=0,2$ T, dòng điện chạy qua là $I='+a+'$ A. Lực từ tác dụng lên dây bằng bao nhiêu N?', 0.2*a,
          "$F=BIL$ (khi dây vuông góc với từ trường)", ['Vì dây vuông góc với từ trường: $F=BIL$.', 'Thay số: $F=0,2\\cdot'+a+'\\cdot1='+(0.2*a)+'$ N.'], 'N', 'Dùng công thức lực từ cho dây dẫn mang dòng điện.', "$F=B/I L$");
        break;
      case 'ly-b21':
        set('Một hạt nhân có số proton $Z='+(a+2)+'$ và số neutron $N='+(2*a)+'$. Số khối $A$ bằng bao nhiêu?', 3*a+2,
          "$A=Z+N$", ['Số khối bằng tổng số proton và neutron.', 'Thay số: $A='+(a+2)+'+'+(2*a)+'='+(3*a+2)+'$.'], '', 'Số khối là tổng proton và neutron.', "$A=Z-N$");
        break;
      case 'ly-b22':
        if (t.topicId.endsWith('-t1')) set('Trong phân rã beta trừ, hạt nhân mẹ có số proton $Z='+a+'$. Bỏ qua phần còn lại của phương trình, số proton của hạt nhân con bằng bao nhiêu?', a+1,
          "$Z_{\\text{con}}=Z_{\\text{mẹ}}+1$", ['Trong phân rã $\\beta^-$, một neutron chuyển thành proton, electron và phản neutrino.', 'Số proton tăng thêm 1: $Z_{con}='+a+'+1='+(a+1)+'$.'], '', 'Phân rã beta trừ làm số proton tăng một, số khối bảo toàn.', "$Z_{con}=Z_{mẹ}-1$");
        else set('Độ hụt khối của một hạt nhân là $\\Delta m='+(a/1000)+'$ u. Dùng $1\\,u\\,c^2\\approx931,5$ MeV, năng lượng liên kết bằng bao nhiêu MeV?', 0.9315*a,
          "$E_{lk}=\\Delta m c^2$ và $1u\\,c^2\\approx931,5$ MeV", ['Dùng hệ thức Einstein $E=\\Delta mc^2$.', 'Năng lượng liên kết $E='+(a/1000)+'\\cdot931,5='+(0.9315*a)+'$ MeV.'], 'MeV', 'Nhân độ hụt khối tính bằng u với 931,5 MeV/u.', "$E=\\Delta m/c^2$");
        break;
      case 'ly-b23':
        set('Mẫu phóng xạ có ban đầu $N_0='+(8*a)+'$ hạt. Sau 3 chu kì bán rã, số hạt chưa phân rã còn lại là bao nhiêu?', a,
          "$N=N_0\\left(\\frac12\\right)^n$", ['Sau 3 chu kì, $N=N_0/2^3$.', 'Thay số: $N='+(8*a)+'/8='+a+'$ hạt.'], 'hạt', 'Mỗi chu kì bán rã, số hạt còn lại giảm một nửa.', "$N=N_0/3$");
        break;
      case 'ly-b24':
        set('Giả sử mỗi phản ứng phân hạch giải phóng $200$ MeV. Với $'+(a*1000000)+'$ phản ứng, dùng $1$ MeV $=1,602\\cdot10^{-13}$ J, tổng năng lượng bằng bao nhiêu J?', 3.204e-5*a,
          "$E=nE_1$", ['Năng lượng mỗi phản ứng: $200\\cdot1,602\\cdot10^{-13}=3,204\\cdot10^{-11}$ J.', 'Với $n='+(a*1000000)+'$ phản ứng: $E=3,204\\cdot10^{-11}\\cdot'+(a*1000000)+'='+fmt(3.204e-5*a)+'$ J.'], 'J', 'Đổi MeV sang joule trước khi nhân số phản ứng.', "$E=E_1/n$");
        break;
      case 'ly-b25':
        set('Mẫu phóng xạ có số hạt ban đầu $N_0='+(16*a)+'$. Sau thời gian bằng hai chu kì bán rã, số hạt chưa phân rã còn lại là bao nhiêu?', 4*a,
          "$N=N_0\\left(\\frac12\\right)^n$", ['Sau hai chu kì bán rã, số hạt còn lại bằng $N_0/4$.', 'Tính $N='+(16*a)+'/4='+(4*a)+'$.'], 'hạt', 'Sau n chu kì bán rã, nhân số hạt ban đầu với 1/2^n.', "$N=N_0/2n$");
        break;
    }
  }
  if (!p.prompt) {
    set('Trong chủ đề '+topic+', cho đại lượng chuẩn $a='+a+'$. Tính giá trị $a+('+k+')$.', a+k,
      "$a+k$", ['Thay $a='+a+'$ và $k='+k+'$.', 'Tính được $a+k='+(a+k)+'$.'], '', 'Thay số và tính theo thứ tự phép toán.', "$a-k$");
  }
  p.answer = rnd(Number(p.answer));
  p.topic = topic;
  return p;
}

function makeVariants(topic, variant, p) {
  const n = Number(p.answer);
  const d = rnd(Math.abs(n) * 0.2 || 1);
  const candidates = [];
  [n, n + d, n - d, n + 2*d, n + 3*d, n - 2*d, -n].forEach(v => {
    v = rnd(v);
    if (candidates.every(x => Math.abs(x-v) > 1e-8)) candidates.push(v);
  });
  while (candidates.length < 4) candidates.push(rnd(candidates[candidates.length-1] + d + candidates.length));
  const ordered = [0,1,2,3].map(x => candidates[x]);
  const correctIndex = variant % 4;
  const opts = ordered.slice();
  const tmp = opts[0]; opts[0] = opts[correctIndex]; opts[correctIndex] = tmp;
  const unit = unitText(p.unit);
  const nText = fmt(n) + unit;
  const stepText = (p.steps || []).filter(Boolean);
  const baseExplain = {
    correct: 'Đáp án đúng là '+nText+'. '+p.why,
    wrong: 'Sai số thường đến từ chọn nhầm công thức, thay số hoặc biến đổi đại số. '+p.why,
    perOption: [],
    steps: stepText.length ? stepText : ['Áp dụng công thức $'+p.formula+'$.', 'Thay dữ kiện vào công thức và tính được $'+nText+'$.'],
    related: p.formula,
    mistake: 'Kiểm tra lại công thức và đơn vị trước khi kết luận.',
    tip: p.hint,
    next: 'Làm thêm câu cùng chủ đề để kiểm tra xem bạn đã nắm chắc phương pháp chưa.'
  };
  const mk = (type, question, options, correct, numeric) => ({
    id: 'gen-'+topic.topicId+'-v'+String(variant+1).padStart(2,'0')+'-'+type,
    type, difficulty: (variant % 4) + 1,
    cognitive: ['NB','TH','VD','VDC'][variant % 4],
    subject: topic.subjectId, chapterId: topic.chapterId, lessonId: topic.lessonId, topicId: topic.topicId,
    question, options: options || null, correct, hint: p.hint,
    numeric: numeric || (type === 'numeric' || type === 'short' ? { answer: n, accept: [String(n), String(n).replace('.', ',')], tolerance: (Math.abs(n) < 0.001 ? 1e-8 : 0.00005), unit: p.unit || '', unitRequired: false } : null),
    explain: baseExplain, generated: true
  });
  const displayOpts = opts.map(v => '$'+fmt(v)+'$'+unit);
  const correctAnswer = opts[correctIndex];
  const multiWrong1 = candidates.find(v => Math.abs(v-n)>1e-8);
  const multiWrong2 = candidates.find(v => Math.abs(v-n)>1e-8 && Math.abs(v-multiWrong1)>1e-8);
  const tfValue = variant % 2 === 0 ? n : (multiWrong1 === undefined ? n+d : multiWrong1);
  const tfCorrect = Math.abs(tfValue-n)<1e-8;
  const oneQuestion = p.prompt;
  const formulaText = String(p.formula).replace(/^\$+|\$+$/g, '');
  const formulaLooksMathematical = /[=\\]|\\\\(?:frac|int|sqrt|vec|Delta|Phi|mathcal|overline)/.test(formulaText);
  const formulaStatement = formulaLooksMathematical
    ? 'Công thức phù hợp là $'+formulaText+'$.'
    : 'Kiến thức cần nhớ: '+formulaText+'.';
  const multiOptions = [
    'Kết quả cần tìm bằng $'+fmt(n)+'$'+unit+'.',
    'Kết quả cần tìm bằng $'+fmt(multiWrong1)+'$'+unit+'.',
    formulaStatement,
    'Kết quả cần tìm bằng $'+fmt(multiWrong2)+'$'+unit+'.'
  ];
  return [
    mk('mc1', oneQuestion, displayOpts.map((x,i)=>x), 0, null),
    mk('mcq', 'Chọn tất cả mệnh đề đúng dựa trên dữ kiện: '+oneQuestion, multiOptions, [0,2], null),
    mk('tf', 'Mệnh đề sau đúng hay sai? '+oneQuestion+' Kết quả là $'+fmt(tfValue)+'$'+unit+'.', null, tfCorrect, null),
    mk('short', 'Trả lời ngắn: '+oneQuestion, null, String(n), { answer: n, accept: [String(n), String(n).replace('.', ',')], tolerance: (Math.abs(n) < 0.001 ? 1e-8 : 0.00005), unit: p.unit || '', unitRequired: false }),
    mk('numeric', 'Nhập đáp số: '+oneQuestion, null, n, { answer: n, accept: [String(n), String(n).replace('.', ',')], tolerance: (Math.abs(n) < 0.001 ? 1e-8 : 0.00005), unit: p.unit || '', unitRequired: false })
  ];
}

const existing = new Set(G.QUESTIONS_TOAN.concat(G.QUESTIONS_LY).map(q=>q.id));
const genToan = [], genLy = [];
C.allTopics().forEach(topic => {
  // Hai chủ đề khái niệm có số đáp án cố định chỉ sinh 8 cách diễn đạt.
  // 73 chủ đề tính toán × 274 cấu hình + 2 chủ đề khái niệm × 8 cấu hình,
  // mỗi cấu hình có 5 hình thức = 100.090 biến thể tự động.
  // Đây không phải 100.090 câu được biên soạn độc lập.
  const variantCount = topic.lessonId === 'ly-b1' ? 8 : 274;
  for (let i=0; i<variantCount; i++) {
    const spec = makeProblem(topic, i);
    makeVariants(topic, i, spec).forEach(q => {
      if (existing.has(q.id)) return;
      existing.add(q.id);
      (topic.subjectId === 'toan' ? genToan : genLy).push(q);
    });
  }
});
G.QUESTIONS_TOAN = G.QUESTIONS_TOAN.concat(genToan);
G.QUESTIONS_LY = G.QUESTIONS_LY.concat(genLy);
G.GENERATED_BANK_STATS = {
  generatedToan: genToan.length,
  generatedLy: genLy.length,
  totalToan: G.QUESTIONS_TOAN.length,
  totalLy: G.QUESTIONS_LY.length,
  bySubjectAndType: function () {
    const result = {};
    [['toan',G.QUESTIONS_TOAN],['ly',G.QUESTIONS_LY]].forEach(([s,arr]) => {
      result[s] = {};
      arr.forEach(q => { result[s][q.type]=(result[s][q.type]||0)+1; });
    });
    return result;
  }
};
})(typeof window !== 'undefined' ? window : globalThis);
