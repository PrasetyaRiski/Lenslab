# LensLab

LensLab adalah starter project website edukasi untuk ekstrakurikuler jurnalistik sekolah. Project ini memakai Next.js App Router, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL, Google Drive API, dan Gemini API.

## Fitur utama

- Authentication: register, login, logout, role ADMIN/MENTOR/STUDENT.
- Dashboard Admin/Mentor dan Dashboard Siswa.
- CRUD Materi dan kategori.
- CRUD Kuis, soal, attempt kuis, skor otomatis.
- Simulasi kamera DSLR interaktif dengan skor dan feedback.
- Asset Editing Center dengan metadata Google Drive dan riwayat download.
- Upload karya siswa ke Google Drive dan review mentor.
- Galeri karya yang sudah dipublikasikan.
- JurnalisBot berbasis Gemini API dengan riwayat chat.
- Score log, badge, dan leaderboard.
- Seed data awal untuk admin, mentor, siswa, kategori, materi, kuis, skenario, dan badge.

## Akun seed

| Role | Email | Password |
|---|---|---|
| Admin | admin@lenslab.test | password123 |
| Mentor | mentor@lenslab.test | password123 |
| Student | siswa@lenslab.test | password123 |

## Cara menjalankan lokal

1. Install dependency:

```bash
npm install
```

2. Salin environment:

```bash
cp .env.example .env
```

3. Isi `DATABASE_URL` PostgreSQL. Contoh lokal:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lenslab?schema=public"
JWT_SECRET="ganti-dengan-secret-panjang"
```

4. Generate Prisma dan migrasi database:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

5. Seed data awal:

```bash
npm run db:seed
```

6. Jalankan project:

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Environment dan rahasia

- File `.env`, `.env.*`, log, dan `public/uploads/` diabaikan oleh Git.
- Gunakan `.env.example` untuk lokal dan `.env.production.example` sebagai template server.
- Jangan commit `JWT_SECRET`, password database, OAuth client secret, refresh token Google Drive, atau API key Gemini asli.

## Google Drive

Isi variabel berikut di `.env` agar upload asset/karya benar-benar dikirim ke Google Drive:

```env
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REDIRECT_URI=""
GOOGLE_REFRESH_TOKEN=""
GOOGLE_DRIVE_ROOT_FOLDER_ID=""
```

Jika belum diisi, helper akan memakai mode demo sehingga flow upload tetap bisa diuji tanpa gagal.

## Gemini API untuk JurnalisBot

Isi variabel berikut untuk JurnalisBot:

```env
GEMINI_API_KEY="isi_api_key_dari_google_ai_studio"
GEMINI_MODEL="gemini-2.0-flash"
GEMINI_BASE_URL="https://generativelanguage.googleapis.com/v1beta"
```

API key bisa dibuat melalui Google AI Studio. Jika `GEMINI_API_KEY` belum diisi, chatbot akan memberi balasan demo lokal.

## Catatan pengembangan

- Komponen UI sederhana dibuat manual agar tidak wajib menjalankan generator shadcn. Struktur dan class mengikuti gaya shadcn/Tailwind.
- Semua route API melakukan pengecekan role melalui helper `requireRole` atau `getCurrentUser`.
- File upload route menerima `multipart/form-data`.
- Project ini adalah fondasi siap dikembangkan. Untuk produksi, tambahkan rate limit, antivirus file scanning, audit log yang lebih ketat, dan object/file permission Google Drive yang sesuai kebijakan sekolah.

## Lisensi

MIT License. Lihat file `LICENSE`.
