# Novelmu

Novel digital romantis untuk kisah perjalanan hidup Rizki Habibi.

## Stack
- Next.js + React + TypeScript
- Supabase PostgreSQL
- Vercel

## Data
Cerita dan seluruh bab publik dibaca langsung dari Supabase melalui tabel:
- `novel_stories`
- `novel_chapters`

Tidak ada isi cerita utama yang disimpan sebagai hard-code di halaman.

## Environment
Copy `.env.example` menjadi `.env.local` dan isi publishable key Supabase.

Project Supabase yang digunakan:
`hzufsuzwfsbsksqgokul`

Sumber awal cerita disusun dari konten perjalanan pada portofolio Rizki Habibi:
https://rizki-habibi-portofolio.vercel.app
