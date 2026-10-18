/* ============================================================
   CẤU TRÚC CHƯƠNG TRÌNH HỌC — Bộ sách Kết nối tri thức với cuộc sống
   Toán 12 (6 chương, 19 bài) · Vật lí 12 (4 chương, 25 bài)
   Mục lục đã đối chiếu chương trình THPT hiện hành.
   ============================================================ */
(function (G) {
'use strict';

const SUBJECTS = [
  {
    id: 'toan',
    name: 'Toán 12',
    book: 'Kết nối tri thức với cuộc sống',
    icon: 'sigma',
    semesters: [
      {
        id: 'hk1', name: 'Học kì 1',
        chapters: [
          {
            id: 'toan-c1', name: 'Chương I. Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số',
            lessons: [
              { id: 'toan-b1', name: 'Bài 1. Tính đơn điệu và cực trị của hàm số', topics: [
                { id: 'toan-b1-t1', name: 'Quy tắc xét dấu đạo hàm và tính đơn điệu' },
                { id: 'toan-b1-t2', name: 'Cực trị của hàm số' },
                { id: 'toan-b1-t3', name: 'Điều kiện đồng biến/nghịch biến trên R' }
              ]},
              { id: 'toan-b2', name: 'Bài 2. Giá trị lớn nhất và giá trị nhỏ nhất của hàm số', topics: [
                { id: 'toan-b2-t1', name: 'GTLN, GTNN trên đoạn' },
                { id: 'toan-b2-t2', name: 'Bài toán tìm tham số m' }
              ]},
              { id: 'toan-b3', name: 'Bài 3. Đường tiệm cận của đồ thị hàm số', topics: [
                { id: 'toan-b3-t1', name: 'Tiệm cận đứng' },
                { id: 'toan-b3-t2', name: 'Tiệm cận ngang' },
                { id: 'toan-b3-t3', name: 'Tiệm cận xiên' }
              ]},
              { id: 'toan-b4', name: 'Bài 4. Khảo sát sự biến thiên và vẽ đồ thị của hàm số', topics: [
                { id: 'toan-b4-t1', name: 'Quy trình khảo sát và vẽ đồ thị' },
                { id: 'toan-b4-t2', name: 'Nhận dạng đồ thị, đếm nghiệm qua đồ thị' }
              ]},
              { id: 'toan-b5', name: 'Bài 5. Ứng dụng đạo hàm để giải quyết một số vấn đề liên quan đến thực tiễn', topics: [
                { id: 'toan-b5-t1', name: 'Bài toán tối ưu hóa hình học' },
                { id: 'toan-b5-t2', name: 'Bài toán tối ưu hóa trong kinh tế' }
              ]}
            ]
          },
          {
            id: 'toan-c2', name: 'Chương II. Vectơ và hệ trục tọa độ trong không gian',
            lessons: [
              { id: 'toan-b6', name: 'Bài 6. Vectơ trong không gian', topics: [
                { id: 'toan-b6-t1', name: 'Vectơ trong không gian và các phép toán' },
                { id: 'toan-b6-t2', name: 'Hai đường thẳng song song, vectơ chỉ phương' },
                { id: 'toan-b6-t3', name: 'Điều kiện đồng phẳng của ba vectơ' }
              ]},
              { id: 'toan-b7', name: 'Bài 7. Hệ trục tọa độ trong không gian', topics: [
                { id: 'toan-b7-t1', name: 'Hệ trục tọa độ Oxyz và tọa độ điểm' },
                { id: 'toan-b7-t2', name: 'Tọa độ của vectơ' }
              ]},
              { id: 'toan-b8', name: 'Bài 8. Biểu thức tọa độ của các phép toán vectơ', topics: [
                { id: 'toan-b8-t1', name: 'Tọa độ của tổng, hiệu vectơ' },
                { id: 'toan-b8-t2', name: 'Tích vô hướng, góc và độ dài vectơ' }
              ]}
            ]
          },
          {
            id: 'toan-c3', name: 'Chương III. Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm',
            lessons: [
              { id: 'toan-b9', name: 'Bài 9. Khoảng biến thiên và khoảng tứ phân vị', topics: [
                { id: 'toan-b9-t1', name: 'Khoảng biến thiên và khoảng tứ phân vị' }
              ]},
              { id: 'toan-b10', name: 'Bài 10. Phương sai và độ lệch chuẩn', topics: [
                { id: 'toan-b10-t1', name: 'Phương sai và độ lệch chuẩn' }
              ]}
            ]
          }
        ]
      },
      {
        id: 'hk2', name: 'Học kì 2',
        chapters: [
          {
            id: 'toan-c4', name: 'Chương IV. Nguyên hàm và tích phân',
            lessons: [
              { id: 'toan-b11', name: 'Bài 11. Nguyên hàm', topics: [
                { id: 'toan-b11-t1', name: 'Định nghĩa, tính chất nguyên hàm' },
                { id: 'toan-b11-t2', name: 'Sơ cấp nguyên hàm cơ bản và đổi biến' }
              ]},
              { id: 'toan-b12', name: 'Bài 12. Tích phân', topics: [
                { id: 'toan-b12-t1', name: 'Định nghĩa và tính chất tích phân' },
                { id: 'toan-b12-t2', name: 'Đổi biến tích phân và đổi cận' }
              ]},
              { id: 'toan-b13', name: 'Bài 13. Ứng dụng hình học của tích phân', topics: [
                { id: 'toan-b13-t1', name: 'Diện tích hình phẳng' },
                { id: 'toan-b13-t2', name: 'Thể tích vật thể tròn xoay' }
              ]}
            ]
          },
          {
            id: 'toan-c5', name: 'Chương V. Phương pháp tọa độ trong không gian',
            lessons: [
              { id: 'toan-b14', name: 'Bài 14. Phương trình mặt phẳng', topics: [
                { id: 'toan-b14-t1', name: 'Vectơ pháp tuyến và phương trình mặt phẳng' },
                { id: 'toan-b14-t2', name: 'Vị trí tương đối của hai mặt phẳng' }
              ]},
              { id: 'toan-b15', name: 'Bài 15. Phương trình đường thẳng trong không gian', topics: [
                { id: 'toan-b15-t1', name: 'Phương trình tham số và tổng quát của đường thẳng' },
                { id: 'toan-b15-t2', name: 'Vị trí tương đối của hai đường thẳng' }
              ]},
              { id: 'toan-b16', name: 'Bài 16. Công thức tính góc trong không gian', topics: [
                { id: 'toan-b16-t1', name: 'Góc giữa hai đường thẳng' },
                { id: 'toan-b16-t2', name: 'Góc giữa đường thẳng và mặt phẳng' },
                { id: 'toan-b16-t3', name: 'Góc giữa hai mặt phẳng' }
              ]},
              { id: 'toan-b17', name: 'Bài 17. Phương trình mặt cầu', topics: [
                { id: 'toan-b17-t1', name: 'Phương trình mặt cầu' },
                { id: 'toan-b17-t2', name: 'Vị trí tương đối của điểm, đường thẳng với mặt cầu' }
              ]}
            ]
          },
          {
            id: 'toan-c6', name: 'Chương VI. Xác suất có điều kiện',
            lessons: [
              { id: 'toan-b18', name: 'Bài 18. Xác suất có điều kiện', topics: [
                { id: 'toan-b18-t1', name: 'Xác suất của biến cố liên quan đến biến cố khác' },
                { id: 'toan-b18-t2', name: 'Tính chất của xác suất có điều kiện' }
              ]},
              { id: 'toan-b19', name: 'Bài 19. Công thức xác suất toàn phần và công thức Bayes', topics: [
                { id: 'toan-b19-t1', name: 'Công thức xác suất toàn phần' },
                { id: 'toan-b19-t2', name: 'Công thức Bayes' }
              ]}
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ly',
    name: 'Vật lí 12',
    book: 'Kết nối tri thức với cuộc sống',
    icon: 'atom',
    semesters: [
      {
        id: 'hk1', name: 'Học kì 1',
        chapters: [
          {
            id: 'ly-c1', name: 'Chương I. Vật lí nhiệt',
            lessons: [
              { id: 'ly-b1', name: 'Bài 1. Cấu trúc của chất. Sự chuyển thể', topics: [
                { id: 'ly-b1-t1', name: 'Cấu tạo phân tử và lực liên kết' },
                { id: 'ly-b1-t2', name: 'Sơ đồ chuyển thể' }
              ]},
              { id: 'ly-b2', name: 'Bài 2. Nội năng. Định luật I của nhiệt động lực học', topics: [
                { id: 'ly-b2-t1', name: 'Nội năng và sự thay đổi nội năng' },
                { id: 'ly-b2-t2', name: 'Định luật I nhiệt động lực học' }
              ]},
              { id: 'ly-b3', name: 'Bài 3. Nhiệt độ. Thang nhiệt độ – nhiệt kế', topics: [
                { id: 'ly-b3-t1', name: 'Nhiệt độ và chuyển đổi thang nhiệt độ' }
              ]},
              { id: 'ly-b4', name: 'Bài 4. Nhiệt dung riêng', topics: [
                { id: 'ly-b4-t1', name: 'Nhiệt lượng: Q = mcΔt' },
                { id: 'ly-b4-t2', name: 'Bài toán cân bằng nhiệt' }
              ]},
              { id: 'ly-b5', name: 'Bài 5. Nhiệt nóng chảy riêng', topics: [
                { id: 'ly-b5-t1', name: 'Nhiệt nóng chảy riêng: λ = Q/m' }
              ]},
              { id: 'ly-b6', name: 'Bài 6. Nhiệt hóa hơi riêng', topics: [
                { id: 'ly-b6-t1', name: 'Nhiệt hóa hơi riêng: L = Q/m' }
              ]},
              { id: 'ly-b7', name: 'Bài 7. Bài tập về nhiệt', topics: [
                { id: 'ly-b7-t1', name: 'Tổng hợp bài toán vật lí nhiệt' }
              ]}
            ]
          },
          {
            id: 'ly-c2', name: 'Chương II. Khí lí tưởng',
            lessons: [
              { id: 'ly-b8', name: 'Bài 8. Mô hình động học phân tử khí lí tưởng', topics: [
                { id: 'ly-b8-t1', name: 'Mô hình động học phân tử khí lí tưởng' },
                { id: 'ly-b8-t2', name: 'Động năng trung bình của phân tử khí' }
              ]},
              { id: 'ly-b9', name: 'Bài 9. Định luật Boyle', topics: [
                { id: 'ly-b9-t1', name: 'Quá trình đẳng nhiệt và định luật Boyle' }
              ]},
              { id: 'ly-b10', name: 'Bài 10. Định luật Charles', topics: [
                { id: 'ly-b10-t1', name: 'Quá trình đẳng áp và định luật Charles' }
              ]},
              { id: 'ly-b11', name: 'Bài 11. Phương trình trạng thái của khí lí tưởng', topics: [
                { id: 'ly-b11-t1', name: 'Phương trình trạng thái của khí lí tưởng' }
              ]},
              { id: 'ly-b12', name: 'Bài 12. Áp suất khí theo mô hình động học phân tử. Quan hệ giữa động năng phân tử và nhiệt độ', topics: [
                { id: 'ly-b12-t1', name: 'Áp suất khí lí tưởng theo mô hình động học' },
                { id: 'ly-b12-t2', name: 'Quan hệ giữa động năng phân tử và nhiệt độ' }
              ]},
              { id: 'ly-b13', name: 'Bài 13. Bài tập về khí lí tưởng', topics: [
                { id: 'ly-b13-t1', name: 'Tổng hợp bài toán khí lí tưởng' }
              ]}
            ]
          },
          {
            id: 'ly-c3', name: 'Chương III. Từ trường',
            lessons: [
              { id: 'ly-b14', name: 'Bài 14. Từ trường', topics: [
                { id: 'ly-b14-t1', name: 'Khái niệm từ trường, đường sức từ' },
                { id: 'ly-b14-t2', name: 'Từ cảm của kim nam châm' }
              ]},
              { id: 'ly-b15', name: 'Bài 15. Lực từ tác dụng lên dây dẫn mang dòng điện. Cảm ứng từ', topics: [
                { id: 'ly-b15-t1', name: 'Lực từ tác dụng lên dòng điện' },
                { id: 'ly-b15-t2', name: 'Cảm ứng từ' }
              ]},
              { id: 'ly-b16', name: 'Bài 16. Từ thông. Hiện tượng cảm ứng điện từ', topics: [
                { id: 'ly-b16-t1', name: 'Từ thông qua mạch kín' },
                { id: 'ly-b16-t2', name: 'Định luật Faraday-Lenz' }
              ]},
              { id: 'ly-b17', name: 'Bài 17. Máy phát điện xoay chiều', topics: [
                { id: 'ly-b17-t1', name: 'Máy phát điện xoay chiều một pha' },
                { id: 'ly-b17-t2', name: 'Định luật Ohm – Faraday cho toàn mạch' }
              ]},
              { id: 'ly-b18', name: 'Bài 18. Ứng dụng hiện tượng cảm ứng điện từ', topics: [
                { id: 'ly-b18-t1', name: 'Lò vi sóng, bếp từ và các ứng dụng' }
              ]},
              { id: 'ly-b19', name: 'Bài 19. Điện từ trường. Mô hình sóng điện từ', topics: [
                { id: 'ly-b19-t1', name: 'Điện từ trường và sóng điện từ' }
              ]},
              { id: 'ly-b20', name: 'Bài 20. Bài tập về từ trường', topics: [
                { id: 'ly-b20-t1', name: 'Tổng hợp bài toán từ trường' }
              ]}
            ]
          }
        ]
      },
      {
        id: 'hk2', name: 'Học kì 2',
        chapters: [
          {
            id: 'ly-c4', name: 'Chương IV. Hạt nhân',
            lessons: [
              { id: 'ly-b21', name: 'Bài 21. Cấu trúc hạt nhân', topics: [
                { id: 'ly-b21-t1', name: 'Cấu tạo hạt nhân, nuclit và số khối' }
              ]},
              { id: 'ly-b22', name: 'Bài 22. Phản ứng hạt nhân và năng lượng liên kết', topics: [
                { id: 'ly-b22-t1', name: 'Phản ứng hạt nhân và bảo toàn điện tích' },
                { id: 'ly-b22-t2', name: 'Độ hụt khối và năng lượng liên kết' }
              ]},
              { id: 'ly-b23', name: 'Bài 23. Hiện tượng phóng xạ', topics: [
                { id: 'ly-b23-t1', name: 'Định luật phóng xạ và chu kỳ bán rã' }
              ]},
              { id: 'ly-b24', name: 'Bài 24. Công nghiệp hạt nhân', topics: [
                { id: 'ly-b24-t1', name: 'Phản ứng phân hạch và nhiệt hạch' }
              ]},
              { id: 'ly-b25', name: 'Bài 25. Bài tập về vật lí hạt nhân', topics: [
                { id: 'ly-b25-t1', name: 'Tổng hợp bài toán vật lí hạt nhân' }
              ]}
            ]
          }
        ]
      }
    ]
  }
];

/* ==== BẢNG TRA CỨU ==== */
const index = { subjects: {}, chapters: {}, lessons: {}, topics: {} };

SUBJECTS.forEach(function (s) {
  index.subjects[s.id] = s;
  s.semesters.forEach(function (sem) {
    sem.chapters.forEach(function (ch) {
      index.chapters[ch.id] = { id: ch.id, name: ch.name, subjectId: s.id, semesterId: sem.id, semesterName: sem.name };
      ch.lessons.forEach(function (les) {
        index.lessons[les.id] = { id: les.id, name: les.name, subjectId: s.id, chapterId: ch.id, chapterName: ch.name, semesterName: sem.name };
        (les.topics || []).forEach(function (t) {
          index.topics[t.id] = { id: t.id, name: t.name, subjectId: s.id, chapterId: ch.id, lessonId: les.id, lessonName: les.name, chapterName: ch.name };
        });
      });
    });
  });
});

G.CURRICULUM = {
  SUBJECTS: SUBJECTS,
  index: index,
  getSubject: function (id) { return index.subjects[id]; },
  getChapter: function (id) { return index.chapters[id]; },
  getLesson: function (id) { return index.lessons[id]; },
  getTopic: function (id) { return index.topics[id]; },
  allLessons: function () {
    const out = [];
    SUBJECTS.forEach(function (s) {
      s.semesters.forEach(function (sem) {
        sem.chapters.forEach(function (ch) {
          ch.lessons.forEach(function (l) {
            out.push({ subjectId: s.id, chapterId: ch.id, lessonId: l.id, name: l.name, chapterName: ch.name, semesterName: sem.name });
          });
        });
      });
    });
    return out;
  },
  allTopics: function () {
    const out = [];
    SUBJECTS.forEach(function (s) {
      s.semesters.forEach(function (sem) {
        sem.chapters.forEach(function (ch) {
          ch.lessons.forEach(function (l) {
            (l.topics || []).forEach(function (t) {
              out.push({ subjectId: s.id, chapterId: ch.id, lessonId: l.id, topicId: t.id, name: t.name, lessonName: l.name, chapterName: ch.name });
            });
          });
        });
      });
    });
    return out;
  }
};

})(typeof window !== 'undefined' ? window : globalThis);