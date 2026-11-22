# RupaDinding — Website & CMS Portal

Website resmi **PT Mitra Dinding Utama** dengan merek cat tekstur **RupaDinding**, dilengkapi **portal CMS**
untuk mengelola katalog, tarif jasa, HPP, konten, pesanan, dan prospek proyek.

Sistem menjalankan dua mesin konversi secara berdampingan:

| Modul | Nature | Fokus |
| --- | --- | --- |
| **E-commerce ritel** | *Uniform pricing* (harga seragam per kemasan) | Penjualan cat tekstur kemasan (KBLI 47521) |
| **Custom quotation** | *Custom pricing* (negotiable) | Jasa aplikator cat (KBLI 43303 / PB007) |

---

## 1. Tech Stack

| Lapisan | Teknologi |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, Turbopack) |
| Bahasa | TypeScript (strict) |
| Gaya | Tailwind CSS v4 (CSS-first `@theme`) |
| Database | SQLite + Prisma ORM (siap dimigrasikan ke PostgreSQL) |
| Auth CMS | JWT httpOnly cookie (`jose`) + `bcryptjs` |

---

## 2. Menjalankan Proyek

```bash
npm install            # pasang dependensi
cp .env.example .env   # sesuaikan env (opsional, .env sudah tersedia)
npm run setup          # prisma generate + db push + seed data awal
npm run dev            # http://localhost:3000
```

Build produksi:

```bash
npm run build && npm start
```

### Akun CMS

| Field | Nilai |
| --- | --- |
| URL | `/admin/login` |
| Email | `admin@rupadinding.co.id` |
| Password | `RupaDinding2026!` |

> Ganti password melalui `ADMIN_EMAIL` / `ADMIN_PASSWORD` di `.env` sebelum seed ulang, lalu jalankan
> `npm run db:seed`. Untuk produksi, wajib ganti `AUTH_SECRET` dengan string acak minimal 32 karakter.

### Skrip npm

| Skrip | Fungsi |
| --- | --- |
| `npm run dev` | Server pengembangan |
| `npm run build` | Build produksi (menjalankan `prisma generate` otomatis) |
| `npm start` | Menjalankan build produksi |
| `npm run db:push` | Sinkronkan skema ke database |
| `npm run db:seed` | Isi data awal (produk, tarif, artikel, pengaturan, admin) |
| `npm run db:reset` | Reset total database lalu seed ulang |
| `npm run db:studio` | Prisma Studio untuk inspeksi data |
| `node scripts/generate-images.mjs` | Generate ulang aset gambar SVG placeholder |

---

## 3. Peta Halaman Publik

| URL | Isi | Bagian Spesifikasi |
| --- | --- | --- |
| `/` | Hero (A/B testing), produk unggulan, kalkulator, tarif jasa, galeri, blog | §2 |
| `/produk` | Katalog + filter kategori + pencarian | §3.1 |
| `/produk/[slug]` | Detail produk, varian kemasan, kalkulator, produk terkait | §3.1–3.3 |
| `/layanan` | Tarif borongan & paket, 6 faktor penentu harga, cakupan area, Project Brief | §4 |
| `/galeri` | Before-after per motif + CTA penawaran | §6 |
| `/blog`, `/blog/[slug]` | Artikel SEO dengan tautan internal | §6 |
| `/kalkulator` | Kalkulator kebutuhan cat interaktif | §3.3 |
| `/kontak` | Alamat toko-kantor, jam, peta, formulir pesan | §2 |
| `/keranjang` | Keranjang belanja (cookie session + database) | §3 |
| `/checkout`, `/checkout/selesai` | Checkout produk dan konfirmasi | §3 |
| Floating WhatsApp | Tombol WhatsApp mengambang di seluruh halaman | §2 |

Navigasi CMS berada di `/admin` (butuh login).

---

## 4. Modul CMS Portal

| Menu | Isi | Bagian Spesifikasi |
| --- | --- | --- |
| Dashboard | Omzet produk vs jasa, pesanan terbaru, prospek terbaru, stok menipis, riwayat HPP | §5.2 |
| Produk & Varian | CRUD produk + varian kemasan (harga, harga coret, stok) | §3.1–3.2 |
| Promo & Harga Coret | Diskon %, harga coret, jadwal 11.11/12.12, subsidi ongkir | §3.2 |
| Pesanan | Status pesanan & pembayaran (dipisah dari pendapatan jasa) | §5.2 |
| Tarif & Layanan | Borongan tenaga, paket bahan+tenaga, faktor harga, cakupan area | §4.2 |
| Prospek Project Brief | Prospek dari formulir, status pipeline, balas WhatsApp | §4.3 |
| HPP & Margin | Kalkulator HPP private label + simulasi kanal digital + riwayat | §5.1 |
| Artikel & Blog | CMS artikel (markdown), terbit/draft, jumlah dibaca | §6 |
| Galeri Portofolio | Unggah before-after, studi kasus proyek | §6 |
| Landing Page A/B | Varian hero, bobot trafik, CTR/CVR, reset statistik | §5.3 |
| Pesan Masuk | Pesan formulir kontak | §2 |
| Pengaturan Situs | Identitas, alamat, kanal sosial, ongkir, catatan kepatuhan | §1, §7 |

---

## 5. Aturan Bisnis yang Diterapkan

### 5.1 Kalkulator Kebutuhan Cat (§3.3)

```
Luas Dinding (m2)      = P x T x jumlah bidang
Kebutuhan Dasar (kg)   = Luas Dinding / Daya Sebar (m2/kg)
Total Rekomendasi (kg)  = Kebutuhan Dasar x 1,10   (cadangan 10%)
```

Kombinasi kemasan disusun otomatis: pail 25 kg → kemasan 5 kg → kemasan 1 kg.
Angka hasil dapat langsung ditambahkan ke keranjang atau diteruskan ke formulir Project Brief
(paket bundling cat + jasa).

### 5.2 HPP & Harga Jual (§5.1)

```
HPP per Unit      = (Modal Cat + Ongkir + Kemasan & Label + Tenaga Kerja + Overhead) / Jumlah Unit
Harga Jual Dasar  = HPP per Unit / (1 - Target Margin Bersih)
```

Simulasi beban kanal: komisi marketplace (1–5%), alokasi iklan (5–15%), subsidi ongkir penjual.
Panel menampilkan margin kotor dan margin bersih setelah kanal, serta peringatan bila margin bersih < 10%.

### 5.3 Pemisahan Pembukuan (§5.2)

Penjualan produk (`Order`) dan pendapatan jasa (`Lead` → invoice manual) dicatat terpisah agar mendukung
PPh Final UMKM 0,5% maupun persiapan pelaporan PPN sebagai PKP. Dashboard menampilkan keduanya terpisah.

### 5.4 Kepatuhan (§1)

| Aturan | Implementasi |
| --- | --- |
| Penjualan ritel saja (KBLI 47521) | Tidak ada harga grosir di alur checkout; catatan eceran tampil di katalog & keranjang |
| Pemisahan grosir (KBLI 46738/46737) | Permintaan grosir diarahkan ke kanal terpisah (Pengaturan → Kepatuhan) |
| Lingkup jasa (KBLI 43303) | Cakupan area: dinding, plafon, fasad; pengecatan atap tidak termasuk (catatan di halaman layanan) |
| Merek (UU 20/2016, first to file) | Nama merek & catatan legal konsisten di header, footer, produk, dan pengaturan |
| PPh Final 0,5% / PKP | Pencatatan produk & jasa terpisah + catatan pajak pada pengaturan |

---

## 6. Struktur Proyek

```
prisma/
  schema.prisma          # model data (produk, varian, promo, tarif, pesanan, prospek, HPP, CMS)
  seed.ts                # data awal sesuai spesifikasi
scripts/
  generate-images.mjs    # generator aset SVG (produk, galeri, blog)
src/
  app/
    (site)/              # halaman publik
    admin/               # portal CMS (login + dashboard + modul)
    actions/             # server actions (cart, checkout, lead, admin, auth)
    api/ab/track/        # pelacakan klik CTA untuk A/B testing
  components/
    site/ catalog/ calculator/ services/ cart/ checkout/ contact/ admin/ ui/
  lib/
    prisma.ts settings.ts auth.ts cart.ts catalog.ts calculator.ts
    whatsapp.ts ab.ts markdown.ts format.ts
  proxy.ts               # visitor id untuk assignment A/B testing
```

---

## 7. Parameter yang Masih Menunggu Data Bisnis (§7)

Nilai di bawah ini sengaja dikosongkan/diisi contoh dan **dapat diubah langsung dari CMS** tanpa
mengubah kode:

| Parameter | Lokasi Pengaturan |
| --- | --- |
| Alamat toko-kantor, koordinat peta, jam operasional, nomor WhatsApp, email | `/admin/pengaturan` → Kontak |
| SKU pasti, varian warna, nilai daya sebar resmi per SKU, desain kemasan | `/admin/produk` (daya sebar & gambar produk) |
| Harga beli aktual Decopain, ongkir pemasok, biaya stiker/kemasan, harga jual final | `/admin/harga-hpp` |
| Metode pembayaran (payment gateway) | `/admin/pengaturan` → Toko (checkout saat ini membuat pesanan + instruksi transfer manual) |
| Mitra logistik pengiriman cat cair/berat | `/admin/pengaturan` → Toko (ongkir flat & ambang gratis ongkir) |

---

## 8. Catatan Teknis

- **Keranjang & checkout** memakai session cookie `rd_cart` (httpOnly) dengan data di database;
  pesanan dicatat pada `Order` + `OrderItem`.
- **A/B testing** memakai visitor id cookie `rd_vid` yang ditetapkan oleh `src/proxy.ts`;
  assignment dihitung deterministik dari bobot trafik sehingga konsisten per pengunjung.
  Metrik: `views`, `clicks` (klik CTA), `conversions` (lead/project brief).
- **Project Brief** menyimpan prospek di database (opsional sesuai kebijakan privasi) lalu membuka
  WhatsApp dengan pesan terstruktur siap baca.
- **Markdown** pada artikel memakai renderer ringan internal dengan escaping HTML.
- **Gambar** saat ini berupa SVG placeholder hasil generator; ganti dengan foto asli melalui CMS
  (field URL gambar produk, galeri, dan artikel).

## 9. Deployment

1. Gunakan database PostgreSQL untuk produksi: ubah `datasource` di `prisma/schema.prisma` menjadi
   `provider = "postgresql"` dan sesuaikan `DATABASE_URL`.
2. Jalankan `npx prisma migrate deploy && npm run build && npm start`.
3. Set `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` pada secret manager.
4. HTTPS diwajibkan agar cookie sesi dan keranjang terenkripsi.
