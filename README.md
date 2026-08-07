# Senopati Coffee

**Inventory & Distribution System**

Sistem internal **Senopati Coffee** untuk mengelola inventori, gudang, distribusi stok ke outlet, dan pelaporan. Aplikasi ini merupakan sistem internal perusahaan, bukan aplikasi SaaS.

## Teknologi

- **React 19** + **Vite 8** + **TypeScript**
- **TanStack Query 5** untuk data fetching & caching
- **React Router DOM v7** untuk routing SPA
- **Axios** untuk HTTP client
- **Zod** untuk validasi form
- **ExcelJS** untuk ekspor laporan

## Prasyarat

- Node.js (v18+)
- Backend API Senopati Coffee (Laravel) berjalan di `http://localhost:8000`

## Instalasi

```bash
npm install
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`.

## Scripts

| Script        | Deskripsi                          |
|---------------|------------------------------------|
| `npm run dev` | Menjalankan dev server (Vite)      |
| `npm run build` | Build produksi (tsc + vite)      |
| `npm run lint` | Menjalankan ESLint                 |
| `npm run preview` | Preview hasil build            |

## Akun Default (Seeder Backend)

| Role     | Email                          | Password    |
|----------|--------------------------------|-------------|
| Manager  | `manager@senopaticoffee.id`    | `password123` |
| Keeper   | `keeper1@senopaticoffee.id` (s.d. `keeper3`) | `password123` |

## Dokumentasi

Dokumentasi lengkap terdapat di [`docs/DOKUMENTASI.md`](docs/DOKUMENTASI.md) (`docs/DOKUMENTASI.docx`).
