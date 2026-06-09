# KLTN GiaPhaOnline FE

## Giới thiệu

`KLTN_GIAPHAONLINE_FE` là frontend của hệ thống quản lý gia phả trực tuyến, xây dựng bằng Vue 3, TypeScript và Vite. Dự án cung cấp giao diện quản trị, đăng nhập, quản lý thành viên, cây gia phả, dịch vụ gia đình và thông báo thời gian thực.

## Công nghệ chính

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Tailwind CSS
- Axios
- Vue Query
- VeeValidate + Yup/Zod
- WangEditor
- Chart.js
- ExcelJS / XLSX
- SockJS / STOMP cho websocket
- Google Translate API

## Tính năng chính

- Xác thực và phân quyền người dùng
- Quản lý tài khoản và gia đình
- Cây gia phả trực quan
- Quản lý sự kiện, nghi lễ, chuẩn bị timeline
- Bảng điều khiển thống kê hệ thống
- Thông báo thời gian thực qua websocket
- Xuất dữ liệu ra Excel / PDF
- Tích hợp thanh toán và VNPAY
- Quản lý phản hồi và thông báo
- Dịch tự động nội dung bằng Google Translate

## Cấu trúc thư mục

- `src/main.ts` - Điểm khởi tạo ứng dụng
- `src/app/router` - Định tuyến công khai, người dùng, admin, xác thực
- `src/app/guard` - Bảo vệ route và phân quyền
- `src/components` - Các component UI đa dạng, tái sử dụng
- `src/composables` - Logic tái sử dụng theo module
- `src/services` - API service kết nối backend
- `src/store` - Pinia store quản lý trạng thái
- `src/types` - Kiểu TypeScript dành cho API và domain
- `src/utils` - Các tiện ích chung
- `src/views` - Các trang chính của ứng dụng

## Cài đặt

1. Clone repository:

```bash
git clone <repository-url>
cd KLTN_GIAPHAONLINE_FE
```

2. Cài đặt phụ thuộc:

```bash
npm install
```

3. Chạy ứng dụng ở chế độ phát triển:

```bash
npm run dev
```

4. Xây dựng sản phẩm:

```bash
npm run build
```

5. Kiểm tra bản xem trước sau khi build:

```bash
npm run preview
```

## Biến môi trường

Dự án sử dụng biến môi trường để cấu hình API và các thông số khác. Tạo file môi trường tương ứng tại thư mục gốc, ví dụ:

- `.env`
- `.env.development`
- `.env.production`

Ví dụ nội dung:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_SOCKET_URL=wss://socket.example.com
VITE_GOOGLE_TRANSLATE_API_KEY=your_key
```

> Lưu ý: Tên biến môi trường có thể khác tùy cấu hình hiện tại trong dự án.

## Kết nối backend

Frontend tương tác với backend qua các service trong `src/services`. Các service đa phần sử dụng `axios` và xử lý base URL, refresh token, auth header.

## Hướng dẫn phát triển

- Tạo route mới trong `src/app/router`
- Thêm service mới trong `src/services`
- Đăng ký store mới trong `src/store`
- Dùng `VeeValidate` + `Yup` hoặc `Zod` để validate form
- Dùng `Pinia` để lưu trạng thái và hỗ trợ persist state
- Dùng `vue-query` để fetch dữ liệu bất đồng bộ hiệu quả

## Tiêu chuẩn code

- Sử dụng `script setup` cho Vue SFC
- Viết TypeScript rõ ràng với kiểu trả về
- Giữ component nhỏ gọn, tách logic vào composable nếu cần
- Ưu tiên tái sử dụng component chung trong `src/components`

## Triển khai

1. Build frontend:

```bash
npm run build
```

2. Triển khai thư mục `dist` lên server hoặc CDN.

3. Cấu hình reverse proxy nếu cần, đảm bảo mọi request API được chuyển tới backend.

## Hỗ trợ

Nếu cần mở rộng hoặc sửa lỗi, kiểm tra:

- `src/services` cho logic API
- `src/app/router` cho điều hướng
- `src/store` cho trạng thái toàn cục
- `src/components` cho UI và cấu trúc hiển thị

---

