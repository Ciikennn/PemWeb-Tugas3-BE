# Tugas 3 – Backend Manajemen Produk

REST API untuk aplikasi Manajemen Produk menggunakan **Express.js**, **TypeScript**, **Prisma ORM**, dan **PostgreSQL (Neon)**.

## Setup
1. Install dependensi
   ```bash
   npm install
   ```
2. Salin `.env.example` menjadi `.env`, lalu isi connection string Neon
   ```env
   DATABASE_URL="postgresql://...-pooler.../neondb?sslmode=require"
   DIRECT_URL="postgresql://.../neondb?sslmode=require"
   PORT=4000
   CLIENT_URL="http://localhost:5173"
   ```
3. Generate Prisma Client, jalankan migrasi, dan isi data awal
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run seed
   ```
4. Jalankan server
   ```bash
   npm run dev
   ```
   Server berjalan di http://localhost:4000

## Endpoint

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/health` | Cek status server |
| GET | `/api/products?search=` | Ambil semua produk (opsional cari berdasarkan nama) |
| GET | `/api/products/:id` | Ambil detail produk |
| POST | `/api/products` | Tambah produk |
| PUT | `/api/products/:id` | Ubah produk |
| DELETE | `/api/products/:id` | Hapus produk |

Body untuk POST/PUT:
```json
{ "name": "Pulpen", "price": 5000 }
```

Format response:
```json
{ "status": true, "message": "Berhasil mengambil data produk", "data": [] }
```

Validasi:
- `name` wajib diisi → 400 `Nama produk wajib diisi`
- `price` harus bilangan bulat > 0 → 400 `Harga harus berupa bilangan bulat lebih dari 0`
- ID tidak ditemukan → 404 `Produk tidak ditemukan`
