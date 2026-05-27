# Setup Gemini API untuk JurnalisBot

Project ini sudah diganti dari DeepSeek/OpenAI ke Google Gemini API.

## 1. Buat API key

1. Buka Google AI Studio.
2. Pilih menu **Get API key**.
3. Buat API key baru.
4. Salin API key tersebut.

## 2. Isi file `.env`

Tambahkan atau ubah bagian berikut:

```env
GEMINI_API_KEY="isi_api_key_gemini_anda"
GEMINI_MODEL="gemini-2.0-flash"
GEMINI_BASE_URL="https://generativelanguage.googleapis.com/v1beta"
```

Jangan isi API key dengan tanda bintang. Masukkan API key asli lengkap hanya di file `.env` lokal.

## 3. Restart server

Setelah mengubah `.env`, hentikan server lalu jalankan ulang:

```bash
CTRL + C
npm run dev
```

## 4. Tes JurnalisBot

Login sebagai siswa, buka menu JurnalisBot, lalu coba:

```text
Buatkan 5 ide liputan jurnalistik tentang kegiatan sekolah.
```

Jika API key belum diisi, chatbot akan memakai mode demo lokal.
