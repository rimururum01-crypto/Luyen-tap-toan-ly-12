# Ôn tập Toán 12 & Vật lí 12 — Kết nối tri thức

Website tĩnh để ôn tập Toán 12 và Vật lí 12, tổ chức theo môn → chương → bài → chủ đề. Ứng dụng dùng HTML, CSS và JavaScript thuần; không cần cài đặt framework hay cơ sở dữ liệu.

## Chạy website

1. Giải nén toàn bộ thư mục dự án.
2. Mở `index.html` bằng trình duyệt. Cách ổn định hơn là mở terminal ở thư mục dự án rồi chạy:

   ```bash
   python -m http.server 8000
   ```

3. Truy cập `http://localhost:8000`.

Website tải KaTeX và phông chữ từ CDN, vì vậy công thức toán và phông chữ có thể hiển thị ở chế độ dự phòng khi mất kết nối internet.

## Tính năng

- Tổng quan tiến độ học tập; trạng thái câu đã làm, câu đánh dấu và câu cần củng cố.
- Ôn tập lý thuyết theo chương và bài; lưu công thức, đánh dấu bài học, ghi chú cá nhân.
- Luyện tập theo môn, chương, bài, chủ đề, mức độ nhận thức và số câu; có thể bắt đầu một phiên ngẫu nhiên 10 câu.
- Năm hình thức: một đáp án, nhiều đáp án, đúng/sai, trả lời ngắn và điền đáp số.
- Giải thích đáp án, lời giải theo bước, gợi ý và chức năng đánh dấu để ôn lại.
- Tìm kiếm toàn website, hỗ trợ truy vấn không phân biệt dấu tiếng Việt; phím tắt `Ctrl+K` hoặc `/`.
- Giao diện sáng/tối, hiển thị tương thích màn hình nhỏ.
- Xuất/nhập bản sao lưu tiến độ học; dữ liệu cá nhân được lưu trong `localStorage` trên trình duyệt hiện tại.


## Giao diện phiên bản Summer Ocean

Giao diện đã được thiết kế lại theo ngôn ngữ thị giác của hệ thống NCKH Tin học 10: bảng màu xanh biển–cyan, nền sáng dịu, font Inter/Poppins, thanh điều hướng gradient, thẻ nội dung bo góc và bóng đổ nhẹ. Chế độ tối dùng nền xanh navy cùng màu nhấn cyan; bố cục được tối ưu lại cho máy tính bảng và điện thoại. Lớp CSS mới chỉ thay đổi cách trình bày, giữ nguyên các ID/class và logic nghiệp vụ của các trang ôn tập.

## Cập nhật giao diện gọn và ưu tiên điện thoại

- Sửa cách hiển thị đề bài có công thức: văn bản và công thức `$...$` nằm cùng dòng khi phù hợp; chỉ công thức được đánh dấu khối mới tách dòng. Việc này khắc phục tình trạng một câu bị kéo dài bởi từng khung công thức riêng.
- Rút gọn thông tin phụ trên thẻ câu hỏi, giảm nhãn độ khó/lịch sử làm ở vùng đọc đề và đặt các thao tác chính thành nút dễ chạm.
- Khi chấm bài, kết quả, đáp án đúng và lời giải theo bước được ưu tiên hiển thị; phân tích từng phương án và kiến thức củng cố nằm trong mục mở rộng để tránh cuộn quá dài.
- Tối ưu thanh trên, menu trượt, lựa chọn đáp án, các nút thao tác và khối phản hồi ở màn hình hẹp.
- Đổi nhãn điều hướng từ “Luyện riêng” sang tên cụ thể như “Ôn câu sai”; mục “Câu đúng – câu sai” được đánh dấu là khu vực đang mở.

Kiểm tra logic: `node test/run-tests.js` hiện bao gồm các kiểm tra cho công thức nội tuyến, phần giải thích thu gọn và bố cục di động.

## Ngân hàng câu hỏi

Tổng cộng **100.158 câu hỏi** trong bộ dữ liệu hiện tại: 54.841 câu Toán 12 và 45.317 câu Vật lí 12. Trong đó, **100.090 câu là biến thể tự động sinh theo tham số** trên các mẫu kiến thức; 68 câu còn lại là dữ liệu câu hỏi ban đầu. Vì vậy, con số này không có nghĩa là 100.193 câu đã được biên soạn độc lập bởi chuyên gia. Một số câu có cùng phương pháp giải nhưng khác dữ kiện/đáp số; cần được giáo viên rà soát trước khi dùng để kiểm tra chính thức.

| Môn | Tổng số | Một đáp án | Nhiều đáp án | Đúng/sai | Trả lời ngắn | Điền đáp số |
|---|---:|---:|---:|---:|---:|---:|
| Toán 12 | 54.841 | 10.986 | 10.961 | 10.961 | 10.961 | 10.972 |
| Vật lí 12 | 45.317 | 9.079 | 9.058 | 9.058 | 9.058 | 9.064 |

Tất cả 5 hình thức đều có hơn 200 câu cho mỗi môn. Các câu được gắn chủ đề, bài học, mức nhận thức, đáp án và lời giải theo mẫu. Từng câu có thể khác nhau về tham số nhưng không nhất thiết khác hoàn toàn về kỹ năng kiến thức đang kiểm tra.

## Kiểm thử

Yêu cầu Node.js 18 trở lên. Tại thư mục dự án, chạy:

```bash
node test/run-tests.js
```

Bài kiểm tra bao gồm cấu trúc mục lục, tối thiểu 100.000 câu, liên kết câu hỏi, số lượng theo hình thức, câu trùng nguyên văn, đáp án, giải thích, API chọn ngẫu nhiên, luồng khởi tạo phiên 10 câu và phần render gọn cho giao diện câu hỏi.

## Quyền riêng tư

Website không có đăng nhập và không gửi tiến độ học lên máy chủ. Dữ liệu nằm trong bộ nhớ cục bộ của trình duyệt; hãy dùng chức năng xuất sao lưu trước khi xóa dữ liệu trình duyệt hoặc chuyển máy.
