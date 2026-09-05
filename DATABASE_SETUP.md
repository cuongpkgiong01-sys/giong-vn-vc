# Giong Route - Máy chủ nội bộ

## Kiến trúc

Máy chủ Windows chạy Node/Vite và PostgreSQL. Các máy khác trong LAN chỉ mở trình duyệt tới http://IP-MAY-CHU:8080.

## 1. Tạo cơ sở dữ liệu PostgreSQL

Trong pgAdmin, đăng nhập bằng tài khoản quản trị PostgreSQL rồi chạy:

```sql
CREATE USER giong_app WITH PASSWORD 'DOI_MAT_KHAU_MANH';
CREATE DATABASE giong_route OWNER giong_app;
```

## 2. Đặt biến môi trường DATABASE_URL trên máy chủ

PowerShell (Run as Administrator):

```powershell
[Environment]::SetEnvironmentVariable(
  'DATABASE_URL',
  'postgresql://giong_app:DOI_MAT_KHAU_MANH@127.0.0.1:5432/giong_route',
  'Machine'
)
```

Đóng và mở lại PowerShell sau khi đặt biến.

## 3. Cài migration

```powershell
npm run db:migrate
```

## 4. Chạy máy chủ

```powershell
npm run dev
```

## 5. Kiểm tra

Từ máy chủ: http://localhost:8080

Từ máy khác: http://IP-MAY-CHU:8080

Dữ liệu phiếu và danh sách người vận chuyển được lưu trong PostgreSQL trên máy chủ.
