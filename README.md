README.md - Next.js Frontend

Reimbursement Frontend - Next.js

Aplikasi frontend berbasis React (Next.js) untuk melakukan pengajuan reimbursement, upload dokumen, serta melihat daftar pengajuan per user. Terintegrasi dengan Laravel API menggunakan token Sanctum dan FormData.

📌 Arsitektur Solusi

[User (Browser)]
Login -> Dapatkan token Sanctum
Kirim FormData (file, nominal, deskripsi, dsb)

[Next.js Frontend]
fetchPost('/pengajuan', FormData, Bearer Token)
[Laravel API Backend]

🎨 Penjelasan Desain

🔐 Autentikasi

Setelah login, token disimpan di localStorage.

Setiap permintaan API disisipkan header:

Authorization: Bearer {token}

📄 Upload File

Form pengajuan menggunakan FormData.

File dikirim via <input type="file"> dan diteruskan langsung ke Laravel.

📊 Perhitungan

Frontend tidak melakukan perhitungan reimbursement.

Semua logika tetap di backend (Laravel).

⚙️ Setup & Jalankan Aplikasi

1. Clone Repo

2. Instalasi Dependensi

npm install

3. Konfigurasi API Endpoint

Edit .env.local:

NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_URL=http://localhost:8000

4. Jalankan Frontend

npm run dev

🚧 Tantangan & Solusi

Tantangan

Solusi

Kirim file ke API

Gunakan FormData dan multipart/form-data

Error .map() undefined

Inisialisasi useState dengan bentuk { data: [] }

Autentikasi gagal

Periksa localStorage & header Authorization

✅ Fitur

Autentikasi & Redirect otomatis

Form input CRUD (user, role, category, pengajuan)

Fetch & tampilkan list data

Modal input dinamis (add/edit)

Integrasi dengan Laravel API
