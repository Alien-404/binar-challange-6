# Repository Challenge 7

Repository ini berisi implementasi Challenge 7, yang fokus pada penambahan fitur baru dan perbaikan pada sistem autentikasi.

## Fitur

### Who Am I

- Route: `auth/whoami`
- Deskripsi: Mengembalikan informasi dari pengguna yang sedang terautentikasi. Endpoint ini memungkinkan pengguna untuk mendapatkan informasi profil mereka sendiri.

### Update Avatar

- Route: `auth/update-avatar`
- Deskripsi: Memungkinkan pengguna untuk mengupdate avatar profil mereka dengan mengunggah gambar baru.

### Google OAuth

- Route: `auth/oauth`
- Deskripsi: Menyediakan autentikasi melalui Google OAuth. Pengguna dapat masuk menggunakan akun Google mereka.

### Notifikasi Email untuk Registrasi melalui OAuth

- Deskripsi: Ketika pengguna berhasil mendaftar menggunakan Google OAuth, notifikasi email dikirimkan kepada pengguna untuk success message.

### Verifikasi Email untuk Registrasi Dasar

- Deskripsi: Bagi pengguna yang mendaftar menggunakan formulir pendaftaran dasar, proses verifikasi email diterapkan untuk memastikan verified alamat email yang diberikan.

### Role-Based Access Control (RBAC)

- Deskripsi: Role-Based Access Control (RBAC) diterapkan untuk semua endpoint kecuali endpoint `auth`. Administrator memiliki akses penuh, sementara pengguna biasa memiliki akses terbatas berdasarkan peran mereka.

## Akun Admin

- Email: admin@gmail.com
- Password: admin123

Silakan membuat akun user role basic jika ingin mencoba nya.

link development : [https://manufaktur-dev.rinaru.com](https://manufaktur-dev.rinaru.com).

link production : [https://manufaktur-prod.rinaru.com](https://manufaktur-prod.rinaru.com).
