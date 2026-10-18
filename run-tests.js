/* Kiểm thử dữ liệu và logic chính (headless, Node.js).
   Chạy: node test/run-tests.js */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const storage = Object.create(null);
global.window = global;
global.localStorage = {
  getItem: key => Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null,
  setItem: (key, value) => { storage[key] = String(value); },
  removeItem: key => { delete storage[key]; }
};
let pass = 0, fail = 0;
const failures = [];
function check(condition, name, detail) {
  if (condition) { pass++; console.log('  ✓ ' + name); }
  else { fail++; const message = name + (detail ? ' — ' + detail : ''); failures.push(message); console.log('  ✗ ' + message); }
}
function equal(actual, expected, name) {
  check(JSON.stringify(actual) === JSON.stringify(expected), name,
    'nhận ' + JSON.stringify(actual) + ', cần ' + JSON.stringify(expected));
}
function load(file) { (0, eval)(fs.readFileSync(path.join(ROOT, file), 'utf8')); }

console.log('\n[1] Khởi tạo module');
[
  'js/data/curriculum.js', 'js/data/theory.js', 'js/data/questions-toan.js',
  'js/data/questions-ly.js', 'js/data/generated-bank.js', 'js/core.js',
  'js/views/theory.js', 'js/views/question.js', 'js/views/practice.js',
  'js/views/history.js', 'js/views/misc.js', 'js/views/overview.js', 'js/views/search.js'
].forEach(file => { load(file); check(true, 'nạp ' + file); });
const bankBeforeCompatibilityLoad = global.MathLib.Bank;
load('js/bank.js');
check(global.MathLib.Bank === bankBeforeCompatibilityLoad, 'mô-đun Bank cũ không ghi đè API chuẩn');
check(typeof global.MathLib.Bank.shuffle === 'function', 'API shuffle vẫn tồn tại sau khi nạp tương thích Bank');
const C = global.CURRICULUM;
const ML = global.MathLib;
const S = global.Store;

console.log('\n[2] Mục lục chương trình');
check(C.SUBJECTS.length === 2, 'có đúng hai môn');
check(C.allLessons().length >= 40, 'có đầy đủ danh sách bài học', 'số bài: ' + C.allLessons().length);
check(C.allTopics().length >= 60, 'phân chia nội dung thành các chủ đề', 'số chủ đề: ' + C.allTopics().length);
const curriculumIds = [];
C.SUBJECTS.forEach(subject => subject.semesters.forEach(semester => semester.chapters.forEach(chapter => {
  curriculumIds.push(chapter.id);
  chapter.lessons.forEach(lesson => {
    curriculumIds.push(lesson.id);
    (lesson.topics || []).forEach(topic => curriculumIds.push(topic.id));
  });
})));
equal(new Set(curriculumIds).size, curriculumIds.length, 'ID chương, bài, chủ đề không trùng nhau');

console.log('\n[3] Ngân hàng câu hỏi');
const questions = ML.Bank.all();
check(questions.length >= 100000, 'ngân hàng có ít nhất 100.000 câu', 'hiện có ' + questions.length);
check(typeof ML.Bank.shuffle === 'function', 'API shuffle tồn tại để nút luyện ngẫu nhiên hoạt động');
const shuffledSample = ML.Bank.shuffle(questions.slice(0, 20));
equal(shuffledSample.length, 20, 'shuffle trả về đủ câu hỏi đã chọn');
equal(new Set(shuffledSample.map(q => q.id)).size, 20, 'shuffle không làm mất hoặc nhân đôi câu trong tập chọn');
const randomView = global.VIEWS.practice({ subject: 'toan', random: '1' });
const randomSession = global.Store.session.get();
check(randomView.includes('Câu 1/10'), 'nút luyện ngẫu nhiên mở câu đầu của phiên 10 câu');
equal(randomSession.ids.length, 10, 'phiên ngẫu nhiên thực sự lưu đủ 10 câu');
equal(randomSession.subject, 'toan', 'phiên ngẫu nhiên giữ đúng môn được chọn');
equal(new Set(questions.map(q => q.id)).size, questions.length, 'ID câu hỏi không trùng nhau');
const brokenLinks = questions.filter(q => !C.index.chapters[q.chapterId] || !C.index.lessons[q.lessonId] || !C.index.topics[q.topicId]);
equal(brokenLinks.length, 0, 'mọi câu liên kết tới chương, bài và chủ đề hợp lệ', brokenLinks.slice(0, 5).map(q => q.id).join(', '));
const supportedTypes = ['mc1', 'mcq', 'tf', 'short', 'numeric'];
const typeLabels = { mc1: 'một đáp án', mcq: 'nhiều đáp án', tf: 'đúng/sai', short: 'trả lời ngắn', numeric: 'điền đáp số' };
const counts = {};
for (const subject of ['toan', 'ly']) {
  counts[subject] = {};
  const subset = questions.filter(q => q.subject === subject);
  for (const type of supportedTypes) {
    counts[subject][type] = subset.filter(q => q.type === type).length;
    check(counts[subject][type] >= 200,
      (subject === 'toan' ? 'Toán 12' : 'Vật lí 12') + ' có ít nhất 200 câu dạng ' + typeLabels[type],
      'hiện có ' + counts[subject][type]);
  }
}
console.log('  Phân bố Toán:', JSON.stringify(counts.toan));
console.log('  Phân bố Vật lí:', JSON.stringify(counts.ly));
check(!!global.GENERATED_BANK_STATS && global.GENERATED_BANK_STATS.generatedToan > 0 && global.GENERATED_BANK_STATS.generatedLy > 0,
  'các biến thể theo tham số đã được thêm vào ngân hàng');

const badExplanation = questions.filter(q => !q.explain || !q.explain.correct || !q.explain.wrong ||
  !Array.isArray(q.explain.steps) || !q.explain.steps.length || !q.explain.related || !q.explain.mistake || !q.explain.next);
equal(badExplanation.length, 0, 'mọi câu có phản hồi đúng/sai và lời giải từng bước', badExplanation.slice(0, 4).map(q => q.id).join(', '));
const badCognitive = questions.filter(q => !['NB', 'TH', 'VD', 'VDC'].includes(q.cognitive));
equal(badCognitive.length, 0, 'mọi câu có mức độ nhận thức hợp lệ');
const invalidProbabilityInputs = questions.filter(q => q.generated && /P\(A\)=\d+\/10/.test(q.question) && Number((q.question.match(/P\(A\)=(\d+)\/10/) || [])[1]) > 10);
equal(invalidProbabilityInputs.length, 0, 'biến thể xác suất không sinh dữ kiện P(A) lớn hơn 1');
const invalidGeneratedProbabilityAnswers = questions.filter(q => q.generated && q.topicId.indexOf('toan-b18') === 0 && ['short', 'numeric'].includes(q.type) && (!q.numeric || !(q.numeric.answer > 0 && q.numeric.answer < 1)));
equal(invalidGeneratedProbabilityAnswers.length, 0, 'đáp án xác suất sinh theo mẫu nằm trong khoảng hợp lệ');
const badFields = questions.filter(q => !q.question || typeof q.question !== 'string' || !q.chapterId || !q.lessonId || !q.topicId);
equal(badFields.length, 0, 'mọi câu có nội dung và metadata cần thiết');
const badMc1 = questions.filter(q => q.type === 'mc1' &&
  (!Array.isArray(q.options) || q.options.length < 2 || !Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.options.length));
equal(badMc1.length, 0, 'câu một đáp án có danh sách lựa chọn và chỉ số đáp án hợp lệ');
const misplacedGeneratedMc1 = questions.filter(q => q.generated && q.type === 'mc1' && q.correct !== 0);
equal(misplacedGeneratedMc1.length, 0, 'đáp án đúng của trắc nghiệm một lựa chọn khớp vị trí hiển thị');
const generatedPromptKeys = new Set();
let duplicateGeneratedPrompts = 0;
questions.filter(q => q.generated).forEach(q => {
  const key = [q.subject, q.topicId, q.type, q.question.replace(/\s+/g, ' ')].join('|');
  if (generatedPromptKeys.has(key)) duplicateGeneratedPrompts++;
  generatedPromptKeys.add(key);
});
equal(duplicateGeneratedPrompts, 0, 'không có câu sinh theo mẫu trùng nguyên văn trong cùng chủ đề và hình thức');
const badMathUnitOptions = questions.filter(q => q.generated && q.type === 'mc1' &&
  q.options.some(option => /\$[^$]*(?:độ|cực|quá trình|điểm|đơn vị diện tích|°C|nghiệm)[^$]*\$/.test(option)));
equal(badMathUnitOptions.length, 0, 'đơn vị chữ không bị đặt nhầm bên trong công thức toán');
const unresolvedTemplateText = questions.filter(q => q.generated && /\+\(a\*|\+'\+|\+a\+'/.test(JSON.stringify(q)));
equal(unresolvedTemplateText.length, 0, 'không còn chuỗi nội suy mẫu chưa được thay tham số');
const genericFallbackQuestions = questions.filter(q => q.generated && q.question.indexOf('Trong chủ đề ') === 0);
equal(genericFallbackQuestions.length, 0, 'không dùng câu số học chung chung để lấp chủ đề chưa có mẫu');
const badMcq = questions.filter(q => q.type === 'mcq' &&
  (!Array.isArray(q.options) || q.options.length < 2 || !Array.isArray(q.correct) || !q.correct.length ||
   q.correct.some(index => !Number.isInteger(index) || index < 0 || index >= q.options.length)));
equal(badMcq.length, 0, 'câu nhiều đáp án có các lựa chọn đúng hợp lệ');
const badTf = questions.filter(q => q.type === 'tf' && ![true, false, 'true', 'false'].includes(q.correct));
equal(badTf.length, 0, 'câu đúng/sai có đáp án boolean hợp lệ');
const badNumeric = questions.filter(q => q.type === 'numeric' &&
  (!q.numeric || typeof q.numeric.answer !== 'number' || typeof q.numeric.tolerance !== 'number'));
equal(badNumeric.length, 0, 'câu điền số có đáp số và sai số cho phép');
const generatedWithoutAnswers = questions.filter(q => q.generated &&
  (q.type === 'numeric' && (!q.numeric || typeof q.numeric.answer !== 'number') ||
   q.type === 'short' && q.correct === undefined));
equal(generatedWithoutAnswers.length, 0, 'câu sinh theo mẫu đều có đáp án');

console.log('\n[4] Kiểm thử bộ chấm tự động');
const gradeFailures = [];
for (const q of questions) {
  let answer;
  if (q.type === 'mc1' || q.type === 'mcq' || q.type === 'tf' || q.type === 'short') answer = q.correct;
  else if (q.type === 'numeric') answer = String(q.numeric.answer);
  const result = ML.grade(q, answer);
  if (!result.correct) gradeFailures.push(q.id + ' (' + q.type + ')');
}
equal(gradeFailures.length, 0, 'đáp án chuẩn của mọi câu đều được chấm đúng', gradeFailures.slice(0, 10).join(', '));
const wrongAnswerFailures = [];
for (const q of questions) {
  let wrong;
  if (q.type === 'mc1') wrong = (q.correct + 1) % q.options.length;
  else if (q.type === 'mcq') wrong = q.correct.slice(1);
  else if (q.type === 'tf') wrong = (String(q.correct) === 'true') ? false : true;
  else if (q.type === 'short') wrong = '__khong_phai_dap_an__';
  else wrong = String(q.numeric.answer + Math.max(1, (q.numeric.tolerance || 0) * 10));
  if (ML.grade(q, wrong).correct) wrongAnswerFailures.push(q.id + ' (' + q.type + ')');
}
equal(wrongAnswerFailures.length, 0, 'đáp án sai không bị chấm nhầm thành đúng', wrongAnswerFailures.slice(0, 10).join(', '));
equal(ML.grade(questions.find(q => q.type === 'mc1'), null).state, 'blank', 'bỏ trống câu một đáp án được nhận diện đúng');
equal(ML.grade(questions.find(q => q.type === 'mcq'), []).state, 'blank', 'bỏ trống câu nhiều đáp án được nhận diện đúng');
equal(ML.parseNum('0,5'), 0.5, 'nhận số thập phân dùng dấu phẩy');
equal(ML.parseNum('1/2'), 0.5, 'nhận phân số đơn giản');
check(ML.checkNumeric('2.5', { answer: 2.5, tolerance: 0.1 }).ok, 'chấm số trong khoảng sai số');
check(!ML.checkNumeric('3.5', { answer: 2.5, tolerance: 0.1 }).ok, 'từ chối số ngoài khoảng sai số');

console.log('\n[5] Tìm kiếm toàn website');
const searchHome = global.VIEWS.search({});
check(searchHome.includes('Tìm nhanh kiến thức bạn cần'), 'trang tìm kiếm có trạng thái hướng dẫn khi chưa nhập từ khóa');
const searchResults = global.VIEWS.search({ q: 'dao ham' });
check(searchResults.includes('KẾT QUẢ TÌM KIẾM'), 'tìm kiếm render tiêu đề kết quả');
check(searchResults.includes('Câu hỏi luyện tập'), 'tìm kiếm trả về câu hỏi liên quan');
check(searchResults.includes('#/question?id='), 'kết quả câu hỏi có đường dẫn mở trực tiếp');
const searchAccent = global.VIEWS.search({ q: 'đạo hàm' });
check(searchAccent.includes('Câu hỏi luyện tập'), 'tìm kiếm không phân biệt dấu tiếng Việt');

console.log('\n[5b] Kiểm tra render các màn hình chính');
[
  ['tổng quan', () => global.VIEWS.overview({})],
  ['lý thuyết', () => global.VIEWS.theory({})],
  ['lịch sử luyện tập', () => global.VIEWS.history({})],
  ['câu đã làm / câu sai', () => global.VIEWS.my({})],
  ['sổ tay kiến thức', () => global.VIEWS.notes({})],
  ['chủ đề cần củng cố', () => global.VIEWS.reinforce({})],
  ['cài đặt và dữ liệu', () => global.VIEWS.settings({})],
  ['trang luyện tập', () => global.VIEWS.practice({ subject: 'toan' })]
].forEach(([name, render]) => {
  try {
    const html = render();
    check(typeof html === 'string' && html.length > 0, 'render được màn hình ' + name);
  } catch (err) {
    check(false, 'render được màn hình ' + name, err && err.message);
  }
});

const sampleWithInlineMath = questions.find(q => typeof q.question === 'string' && q.question.includes('$'));
if (sampleWithInlineMath) {
  const questionHtml = global.VIEWS.question({ id: sampleWithInlineMath.id, mode: 'practice' });
  const qMeta = (questionHtml.match(/class=\"qcard__meta\">([\s\S]*?)<\/div>/) || [])[1] || '';
  check(!/class=\"qcard__q\"[^>]*data-display=\"1\"/.test(questionHtml),
    'câu hỏi giữ công thức nội tuyến, không tách mỗi công thức thành một khối');
  check(!qMeta.includes('Đã làm') && !qMeta.includes('Độ khó'),
    'thanh thông tin câu hỏi đã rút gọn, bỏ nhãn phụ gây rối');
  const sampleAttempt = { state: 'wrong', correct: false, answer: sampleWithInlineMath.type === 'mc1' ? (sampleWithInlineMath.correct + 1) % sampleWithInlineMath.options.length : null, reason: 'Chọn chưa đúng', mode: 'practice' };
  const feedbackHtml = global.QUESTION.feedbackHTML(sampleWithInlineMath, sampleAttempt);
  check(feedbackHtml.includes('class=\"teacher-more\"') && feedbackHtml.includes('Xem phân tích thêm'),
    'phân tích mở rộng được thu gọn để phần giải chính dễ theo dõi');
  check(feedbackHtml.includes('Lời giải từng bước') && feedbackHtml.includes('Đã hiểu') && feedbackHtml.includes('Cần ôn thêm'),
    'phản hồi giữ lời giải theo bước và xác nhận mức độ hiểu');
} else {
  check(false, 'có câu chứa công thức nội tuyến để kiểm thử giao diện');
}
const mobileCss = fs.readFileSync(path.join(ROOT, 'css/style.css'), 'utf8');
check(mobileCss.includes('@media (max-width: 560px)') && mobileCss.includes('.qcard__actions .btn--primary'),
  'giao diện câu hỏi có bố cục và nút thao tác riêng cho điện thoại');

console.log('\n[6] Học liệu lý thuyết');
const T = global.THEORY || {};
const theoryIds = Object.keys(T);
check(theoryIds.length > 0, 'có học liệu lý thuyết');
equal(theoryIds.filter(id => !C.index.lessons[id]).length, 0, 'học liệu chỉ tham chiếu tới bài tồn tại');
equal(theoryIds.filter(id => !T[id].goal || !T[id].summary || !Array.isArray(T[id].core) || !T[id].core.length).length, 0,
  'bài có mục tiêu, kiến thức cốt lõi và tóm tắt');

console.log('\n[7] Lưu tiến độ cục bộ');
S.reset();
S.attempts.record('test-q1', '1', true, 'practice');
equal(S.attempts.all('test-q1').length, 1, 'ghi lại lần làm câu hỏi');
check(S.attempts.last('test-q1').correct, 'truy vấn được kết quả mới nhất');
check(S.flagged.toggle('test-q1'), 'đánh dấu câu để ôn lại');
check(S.flagged.ids().includes('test-q1'), 'danh sách đánh dấu có câu vừa thêm');
S.understood.mark('test-q1', false);
equal(S.data().understood['test-q1'], false, 'lưu trạng thái chưa hiểu');
S.theory.mark('toan-b1', 'mastered');
equal(S.theory.get('toan-b1'), 'mastered', 'lưu trạng thái bài lý thuyết');
S.theory.bookmark('toan-b1');
check(S.theory.bookmarkedIds().includes('toan-b1'), 'đánh dấu trang bài học');
S.notes.add('toan-b1', 'ghi chú kiểm thử');
equal(S.notes.list('toan-b1')[0].text, 'ghi chú kiểm thử', 'lưu ghi chú');
S.formulas.save('test-formula', 'Công thức', 'a^2+b^2');
check(S.formulas.has('test-formula'), 'lưu công thức');
S.session.set({ ids: ['test-q1'], index: 0, subject: 'toan' });
equal(S.session.get().ids.length, 1, 'lưu phiên luyện tập');
check(Object.prototype.hasOwnProperty.call(storage, 'ontap12.v1'), 'dữ liệu được ghi vào localStorage');
S.reset();
equal(S.attempts.all('test-q1').length, 0, 'xóa dữ liệu cục bộ khi yêu cầu reset');

console.log('\n' + '='.repeat(60));
console.log('KẾT QUẢ: ' + pass + ' đạt, ' + fail + ' lỗi');
if (fail) { console.log('\nCác mục lỗi:'); failures.forEach(message => console.log('  - ' + message)); }
console.log('='.repeat(60));
process.exit(fail ? 1 : 0);
