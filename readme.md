# Challange 6 - Binar BEJS

Repo ini merupakan pengembangan lanjutan dari projek "challenge-5" dengan penambahan beberapa fitur baru:

- Penambahan fitur testing menggunakan Jest dan Supertest untuk memastikan kualitas kode.
- Implementasi CI/CD menggunakan GitHub Actions untuk otomatisasi proses pengembangan dan produksi di Railway.
- Penggunaan Sentry untuk fitur debugging dan logging.

## Fitur Baru

### Testing menggunakan Jest dan Supertest

Fitur testing telah ditambahkan menggunakan Jest dan Supertest untuk memastikan bahwa kode yang dikembangkan berfungsi sebagaimana mestinya. Dalam pengujian, mock data dari Jest digunakan untuk mengisolasi dan menjalankan pengujian pada fungsi-fungsi yang menggunakan ORM Sequelize.

![testing](https://drive.google.com/uc?id=1LSPc4OGYYQ7gffgt_O5fAp7yuUjNe4HD)

### CI/CD dengan GitHub Actions

Proyek ini telah diintegrasikan dengan GitHub Actions untuk otomatisasi CI/CD. Terdapat dua job yang dijalankan:

1. **Development (Dev)**: Setiap kali terjadi push ke branch `development`, GitHub Actions akan menjalankan job untuk testing dan melakukan deployment ke environment development di Railway dan dapat diakses melalui link: [https://manufaktur-dev.rinaru.com](https://manufaktur-dev.rinaru.com).

![ci/cd dev](https://drive.google.com/uc?id=1GnZYfsQ0Y8QdgSFiOXKkn8C-gRHhezHY)

2. **Production (Prod)**: Setiap kali terjadi pull request ke branch `master`, GitHub Actions akan menjalankan job untuk testing dan melakukan deployment ke environment production di Railway. Jika terjadi kesalahan dalam proses testing atau deployment, merge request tidak akan dapat dilakukan, sehingga memastikan bahwa kode yang akan digabungkan ke branch master telah lulus pengujian dan dinyatakan siap untuk production. untuk hasilnya dapat diakses melalui link: [https://manufaktur-prod.rinaru.com](https://manufaktur-prod.rinaru.com).

![ci/cd prod](https://drive.google.com/uc?id=1MyHEvV6CSfPN3TnES4mL5M2HG3_g-3-V)

### Sentry untuk Debugging dan Logging

Sentry telah diimplementasikan dalam kode untuk membantu dalam proses debugging dan logging. Setiap kali terjadi kesalahan pada aplikasi, pesan kesalahan akan dikirim ke Sentry untuk analisis dan pelacakan.

![sentry](https://drive.google.com/uc?id=1sGxXn2c6J99Yg2cFEwCedyHVfqZEgHo3)
