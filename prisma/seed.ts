import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const settings: {
  key: string;
  value: string;
  group: string;
  label: string;
  type: string;
  hint?: string;
}[] = [
  { key: "company.name", value: "PT Mitra Dinding Utama", group: "Identitas", label: "Nama badan usaha", type: "text" },
  { key: "company.brand", value: "RupaDinding", group: "Identitas", label: "Nama merek", type: "text" },
  { key: "company.tagline", value: "Cat Tekstur & Jasa Aplikator Profesional", group: "Identitas", label: "Tagline", type: "text" },
  {
    key: "company.description",
    value:
      "PT Mitra Dinding Utama menjalankan merek cat tekstur RupaDinding melalui skema private label dengan pemasok Decopain, serta menyediakan jasa aplikator cat untuk dinding, plafon, dan fasad bangunan.",
    group: "Identitas",
    label: "Deskripsi singkat",
    type: "textarea",
  },
  {
    key: "company.legalNote",
    value:
      "Merek RupaDinding dilindungi UU No. 20 Tahun 2016 tentang Merek dan Inversi (first to file) atas nama PT Mitra Dinding Utama.",
    group: "Identitas",
    label: "Catatan legal merek",
    type: "textarea",
  },
  {
    key: "company.kbli",
    value:
      "KBLI 47521 (Perdagangan eceran bahan & material konstruksi) - KBLI 43303 Subklasifikasi PB007 (Pengecatan interior & eksterior bangunan)",
    group: "Identitas",
    label: "Kode KBLI",
    type: "text",
  },
  { key: "company.supplier", value: "Decopain (private label)", group: "Identitas", label: "Pemasok / skema", type: "text" },
  { key: "company.heroHeadline", value: "Dinding Retak? Tutup dengan Tekstur.", group: "Identitas", label: "Hero headline", type: "text" },
  {
    key: "company.heroSubheadline",
    value:
      "Cat tekstur RupaDinding menutup retak dinding sekaligus mempercantik fasad, dilengkapi jasa aplikator terlatih untuk hasil kerja rapi dan bergaransi.",
    group: "Identitas",
    label: "Hero subheadline",
    type: "textarea",
  },

  { key: "contact.address", value: "[Alamat lengkap toko-kantor - menunggu data final bisnis]", group: "Kontak", label: "Alamat toko-kantor", type: "textarea" },
  { key: "contact.city", value: "[Kota/Kabupaten]", group: "Kontak", label: "Kota / Kabupaten", type: "text" },
  { key: "contact.province", value: "[Provinsi]", group: "Kontak", label: "Provinsi", type: "text" },
  { key: "contact.postalCode", value: "[Kode pos]", group: "Kontak", label: "Kode pos", type: "text" },
  { key: "contact.phone", value: "[+62 8xx-xxxx-xxxx]", group: "Kontak", label: "Telepon", type: "text" },
  { key: "contact.whatsapp", value: "6281234567890", group: "Kontak", label: "Nomor WhatsApp (tanpa +)", type: "text" },
  { key: "contact.email", value: "[halo@rupadinding.co.id]", group: "Kontak", label: "Email", type: "text" },
  { key: "contact.hours", value: "Senin - Sabtu: 08.00 - 17.00\nMinggu: 09.00 - 14.00", group: "Kontak", label: "Jam operasional", type: "textarea" },
  { key: "contact.mapsUrl", value: "https://maps.google.com/?q=-6.2,106.8", group: "Kontak", label: "Tautan peta", type: "url" },
  { key: "contact.mapsEmbed", value: "", group: "Kontak", label: "URL embed Google Maps", type: "url" },
  {
    key: "contact.mapsNote",
    value: "Titik koordinat final menunggu penyerahan data bisnis (Bagian 7 daftar parameter).",
    group: "Kontak",
    label: "Catatan lokasi",
    type: "textarea",
  },

  { key: "social.instagram", value: "https://instagram.com/rupadinding", group: "Media Sosial", label: "Instagram", type: "url" },
  { key: "social.tiktok", value: "https://tiktok.com/@rupadinding", group: "Media Sosial", label: "TikTok", type: "url" },
  { key: "social.youtube", value: "https://youtube.com/@rupadinding", group: "Media Sosial", label: "YouTube", type: "url" },
  { key: "social.facebook", value: "https://facebook.com/rupadinding", group: "Media Sosial", label: "Facebook", type: "url" },
  { key: "social.pinterest", value: "https://pinterest.com/rupadinding", group: "Media Sosial", label: "Pinterest", type: "url" },
  { key: "social.linkedin", value: "https://linkedin.com/company/rupadinding", group: "Media Sosial", label: "LinkedIn", type: "url" },

  { key: "store.currency", value: "IDR", group: "Toko", label: "Mata uang", type: "text" },
  { key: "store.shippingFlat", value: "25000", group: "Toko", label: "Ongkos kirim flat (Rp)", type: "number" },
  { key: "store.freeShippingMin", value: "750000", group: "Toko", label: "Gratis ongkir mulai dari (Rp)", type: "number" },
  { key: "store.paymentMethods", value: "Transfer Bank|QRIS|E-Wallet|COD", group: "Toko", label: "Metode pembayaran (pisah | )", type: "text" },
  { key: "store.bankInfo", value: "Bank BCA 1234567890 a.n. PT Mitra Dinding Utama", group: "Toko", label: "Informasi rekening", type: "text" },
  {
    key: "store.cartNote",
    value:
      "Gratis ongkir untuk pembelian minimal Rp750.000. Pengiriman cat cair/berat mengikuti perhitungan berat-volume timbangan reseller.",
    group: "Toko",
    label: "Catatan keranjang",
    type: "textarea",
  },

  {
    key: "compliance.retailNotice",
    value:
      "Penjualan produk di website ini merupakan perdagangan eceran (KBLI 47521). Harga grosir/distributor tidak tersedia melalui alur checkout ini.",
    group: "Kepatuhan",
    label: "Catatan eceran",
    type: "textarea",
  },
  {
    key: "compliance.serviceScope",
    value:
      "Layanan jasa aplikator mencakup pengecatan interior, eksterior, plafon, dan permukaan khusus. Pengecatan atap bangunan tidak termasuk lingkup pekerjaan.",
    group: "Kepatuhan",
    label: "Batas lingkup jasa",
    type: "textarea",
  },
  {
    key: "compliance.taxNote",
    value:
      "Omzet produk dan pendapatan jasa dicatat terpisah untuk mendukung kewajiban PPh Final UMKM 0,5% serta persiapan pelaporan PPN sebagai PKP.",
    group: "Kepatuhan",
    label: "Catatan pajak",
    type: "textarea",
  },
  {
    key: "compliance.wholesaleNotice",
    value: "Permintaan pembelian grosir dialihkan ke kanal terpisah di luar alur checkout ritel website.",
    group: "Kepatuhan",
    label: "Catatan grosir",
    type: "textarea",
  },

  {
    key: "trust.skk",
    value:
      "Tenaga kerja mengikuti standar kompetensi SKKNI Aplikator Cat Dekoratif yang disusun APCI bersama Ascoatindo.",
    group: "Kepercayaan",
    label: "Sertifikasi kompetensi",
    type: "textarea",
  },
  {
    key: "trust.warranty",
    value: "Garansi hasil kerja untuk pekerjaan aplikator, dengan proviso kondisi dinding dan spesifikasi proyek.",
    group: "Kepercayaan",
    label: "Garansi",
    type: "textarea",
  },
  {
    key: "trust.servicePoints",
    value: "Layanan cepat|Harga bersaing|Konsultasi gratis|Garansi hasil kerja",
    group: "Kepercayaan",
    label: "Poin layanan (pisah | )",
    type: "text",
  },

  {
    key: "footer.about",
    value:
      "RupaDinding adalah merek cat tekstur milik PT Mitra Dinding Utama yang menyediakan cat tekstur kemasan dengan harga seragam serta jasa aplikator cat untukhunian, komersial, dan proyek.",
    group: "Footer",
    label: "Tentang singkat",
    type: "textarea",
  },
  { key: "footer.copyright", value: "2026 PT Mitra Dinding Utama. Seluruh hak cipta dilindungi.", group: "Footer", label: "Teks copyright", type: "text" },
];

const products = [
  {
    sku: "RPD-KMP-001",
    name: "RupaDinding Tekstur Kamprot",
    slug: "tekstur-kamprot",
    category: "Kamprot",
    textureLevel: "Rustic",
    tagline: "Butiran kasar penuh, menutup retak dinding dan cacat permukaan",
    description:
      "Cat tekstur kamprot RupaDinding adalah solusi populer untuk dinding retak, tidak rata, dan memiliki cacat permukaan. Butiran bertekstur tegas mampu menutup celah kecil sekaligus memberi karakter visual yang hangat dan natural. Formulasi siap pakai (ready for use) tidak perlu pengenceran tambahan sehingga aplikasi lebih cepat dan hemat tenaga.",
    baseMaterial: "Akrilik + silica",
    features: [
      "Menutup retak rambut dan permukaan tidak rata",
      "Formula ramah lingkungan tanpa bau tajam",
      "Ready for use - siap sapu tanpa pengenceran",
      "Tahan UV, lumut, dan jamur",
      "Daya sebar 1-1,5 m2/kg",
    ],
    applicationAreas: ["Dinding interior", "Fasad eksterior", "Pagar", "Gypsum", "GRC", "Beton", "Batu bata"],
    coverageRate: 1.2,
    image: "/images/produk/kamprot.svg",
    isFeatured: true,
    sortOrder: 1,
    variants: [
      { label: "Kemasan 1 kg", sizeKg: 1, price: 89900, stock: 120 },
      { label: "Kemasan 5 kg", sizeKg: 5, price: 449900, stock: 80 },
      { label: "Pail 25 kg", sizeKg: 25, price: 2199000, stock: 24 },
    ],
  },
  {
    sku: "RPD-PSR-002",
    name: "RupaDinding Tekstur Pasir / Sandtex",
    slug: "tekstur-pasir-sandtex",
    category: "Pasir / Sandtex",
    textureLevel: "Medium",
    tagline: "Butiran pasir halus yang rapi untuk interior maupun eksterior",
    description:
      "Tekstur pasir RupaDinding menghasilkan permukaan seperti amplas kasar yang tetap halus saat disentuh. Cocok untuk dinding ruang tamu, kamar, bagian luar rumah, hingga area kering kamar mandi. Kesan rapi dan modern dengan warna pekat yang tidak mudah pudar.",
    baseMaterial: "Pasir kuarsa + akrilik",
    features: ["Tekstur pasir halus yang elegan", "Ready to use, tidak perlu diencerkan", "Tahan kelembapan dan sinar UV", "Daya sebar 1-1,2 m2/kg"],
    applicationAreas: ["Dinding interior", "Eksterior", "Pagar", "Gypsum", "Kayu"],
    coverageRate: 1.1,
    image: "/images/produk/pasir.svg",
    isFeatured: true,
    sortOrder: 2,
    variants: [
      { label: "Kemasan 1 kg", sizeKg: 1, price: 79900, stock: 100 },
      { label: "Kemasan 5 kg", sizeKg: 5, price: 399900, stock: 70 },
      { label: "Pail 25 kg", sizeKg: 25, price: 1990000, stock: 18 },
    ],
  },
  {
    sku: "RPD-SLC-003",
    name: "RupaDinding Tekstur Silica / Stone",
    slug: "tekstur-silica-stone",
    category: "Silica / Stone",
    textureLevel: "Rustic",
    tagline: "Butiran batu alam dengan karakter kuat untuk aksen kokoh",
    description:
      "Berbasis butiran silica, tekstur stone RupaDinding memberi kesan batuan alam yang berkarakter kuat. Cocok untuk dinding aksen, kolom, serta fasad bangunan yang ingin tampil kokoh. Ketahanan terhadap retak dan panas menjadikannya pilihan untuk fasad gedung komersial.",
    baseMaterial: "Silica / batu alam + akrilik",
    features: ["Karakter batu alam yang kuat", "Tahan retak rambut dan panas", "Ready for use", "Daya sebar 0,9-1,1 m2/kg"],
    applicationAreas: ["Fasad eksterior", "Dinding interior", "Pagar", "Beton", "GRC"],
    coverageRate: 1.0,
    image: "/images/produk/silica.svg",
    isFeatured: true,
    sortOrder: 3,
    variants: [
      { label: "Kemasan 1 kg", sizeKg: 1, price: 84900, stock: 90 },
      { label: "Kemasan 5 kg", sizeKg: 5, price: 424900, stock: 60 },
      { label: "Pail 25 kg", sizeKg: 25, price: 2099000, stock: 15 },
    ],
  },
  {
    sku: "RPD-KJT-004",
    name: "RupaDinding Tekstur Kulit Jeruk",
    slug: "tekstur-kulit-jeruk",
    category: "Kulit Jeruk",
    textureLevel: "Smooth",
    tagline: "Permukaan seperti kulit jeruk yang lembut dan hangat",
    description:
      "Tekstur kulit jeruk memberi kesan hangat dan lembut pada dinding. Motifnya halus namun tetap bertekstur, sering dipilih untuk ruang tamu dan dinding feature yang ingin tetap natural tanpa terlihat kasar.",
    baseMaterial: "Akrilik",
    features: ["Tekstur lembut natural", "Warna pekat tidak mudah retak", "Ready for use", "Daya sebar 1,2-1,4 m2/kg"],
    applicationAreas: ["Dinding interior", "Plafon", "Gypsum", "Kayu"],
    coverageRate: 1.3,
    image: "/images/produk/kulit-jeruk.svg",
    isFeatured: false,
    sortOrder: 4,
    variants: [
      { label: "Kemasan 1 kg", sizeKg: 1, price: 74900, stock: 80 },
      { label: "Kemasan 5 kg", sizeKg: 5, price: 374900, stock: 50 },
    ],
  },
  {
    sku: "RPD-POP-005",
    name: "RupaDinding Tekstur Popcorn",
    slug: "tekstur-popcorn",
    category: "Popcorn",
    textureLevel: "Rustic",
    tagline: "Motif popcorn klasik untuk langit-langit dan dinding feature",
    description:
      "Tekstur popcorn adalah solusi favorit untuk menutupi langit-langit yang retak atau tidak rata. Motifnya tegas dan mudah disamarkan dengan cat tembok setelah kering.",
    baseMaterial: "Akrilik + filler tekstur",
    features: ["Menyembunyikan cacat plafon dan dinding", "Motif tegas khas popcorn", "Ready for use", "Daya sebar 1-1,2 m2/kg"],
    applicationAreas: ["Plafon", "Dinding interior", "Dinding lama"],
    coverageRate: 1.1,
    image: "/images/produk/popcorn.svg",
    isFeatured: false,
    sortOrder: 5,
    variants: [
      { label: "Kemasan 1 kg", sizeKg: 1, price: 79900, stock: 75 },
      { label: "Kemasan 5 kg", sizeKg: 5, price: 399900, stock: 45 },
    ],
  },
  {
    sku: "RPD-STU-006",
    name: "RupaDinding Plaster Gosok / Stucco",
    slug: "plaster-gosok-stucco",
    category: "Plaster Gosok / Stucco",
    textureLevel: "Rustic",
    tagline: "Nuansa Mediterania untuk interior dan fasad kelas atas",
    description:
      "Plaster gosok memberikan kesan dinding gipsum klasik yang hangat dan dikerjakan tangan. Butiran halusnya menjadi pilihan untuk proyek kelas atas dan area aksen yang ingin tampil tegas tanpa terlihat berlubang.",
    baseMaterial: "Silika + akrilik",
    features: ["Nuansa Mediterania", "Tekstur halus yang digandrungi", "Tahan UV dan cuaca", "Daya sebar 0,9-1,1 m2/kg"],
    applicationAreas: ["Fasad eksterior", "Dinding interior", "Plafon", "Pagar"],
    coverageRate: 1.0,
    image: "/images/produk/stucco.svg",
    isFeatured: false,
    sortOrder: 6,
    variants: [
      { label: "Kemasan 5 kg", sizeKg: 5, price: 449900, stock: 40 },
      { label: "Pail 25 kg", sizeKg: 25, price: 2199000, stock: 12 },
    ],
  },
  {
    sku: "RPD-BAL-007",
    name: "RupaDinding Batu Alam Texture",
    slug: "batu-alam-texture",
    category: "Batu Alam Texture",
    textureLevel: "Rustic",
    tagline: "Tekstur batu alam premium untuk aksen dan fasad",
    description:
      "Batu Alam Texture RupaDinding mereplikasi permukaan batu alam dengan butiran bergradasi tinggi. Sangat cocok untuk dinding aksen, pagar, dan fasad yang menuntut kesan natural premium.",
    baseMaterial: "Agregat batu + akrilik",
    features: ["Tekstur batu alam bergradasi", "Tahan panas dan retak rambut", "Ready for use", "Daya sebar 0,8-1 m2/kg"],
    applicationAreas: ["Fasad eksterior", "Dinding interior", "Pagar", "Beton"],
    coverageRate: 0.9,
    image: "/images/produk/batu-alam.svg",
    isFeatured: false,
    sortOrder: 7,
    variants: [
      { label: "Kemasan 5 kg", sizeKg: 5, price: 474900, stock: 35 },
      { label: "Pail 25 kg", sizeKg: 25, price: 2299000, stock: 10 },
    ],
  },
];

const serviceRates = [
  { category: "tenaga", name: "Tekstur Sederhana (Roll)", motif: "Roll", minPrice: 50000, maxPrice: 80000, description: "Pengecatan tekstur roll dan poles dasar.", sortOrder: 1 },
  { category: "tenaga", name: "Tekstur Medium (Kamprot / Pasir)", motif: "Kamprot / Pasir", minPrice: 75000, maxPrice: 130000, description: "Tenaga kerja aplikator untuk motif kamprot dan pasir.", sortOrder: 2 },
  { category: "tenaga", name: "Tekstur Premium (Stucco / Artistik)", motif: "Stucco / Artistik", minPrice: 120000, maxPrice: 250000, description: "Teknik khusus dengan waktu pengerjaan lebih lama.", sortOrder: 3 },
  { category: "paket", name: "Jasa Cat Tekstur Batu", motif: "Batu Alam", minPrice: 180000, maxPrice: 200000, description: "Paket bahan dan tenaga, cocok untuk aksen kokoh dan natural.", sortOrder: 4 },
  { category: "paket", name: "Jasa Cat Tekstur Kasar", motif: "Kamprot / Kasar", minPrice: 180000, maxPrice: 220000, description: "Paket bahan dan tenaga, umum untuk plafon dan menyamarkan cacat dinding.", sortOrder: 5 },
  { category: "paket", name: "Jasa Cat Tekstur Pasir", motif: "Pasir / Sandtex", minPrice: 200000, maxPrice: 250000, description: "Paket bahan dan tenaga, ideal untuk eksterior maupun interior.", sortOrder: 6 },
  { category: "paket", name: "Jasa Cat Tekstur Plaster Gosok", motif: "Stucco", minPrice: 200000, maxPrice: 250000, description: "Paket bahan dan tenaga dengan nuansa Mediterania.", sortOrder: 7 },
  { category: "paket", name: "Jasa Cat Tekstur Artistik / Kustom", motif: "Kustom", minPrice: 220000, maxPrice: 350000, description: "Paket bahan dan tenaga, pola dan warna dapat disesuaikan.", sortOrder: 8 },
];

const serviceFactors = [
  { title: "Jenis Tekstur", description: "Motif sederhana sampai artistik/custom memiliki tingkat kesulitan dan biaya tenaga yang berbeda.", icon: "texture", sortOrder: 1 },
  { title: "Total Luas Area", description: "Area luas lebih hemat karena efisiensi alat dan tenaga kerja pada proyek bertumbuhan besar.", icon: "area", sortOrder: 2 },
  { title: "Kompleksitas Bidang", description: "Banyak sudut, ketinggian kerja, lengkungan, dan area sulit menjangkau menambah waktu pengerjaan.", icon: "complexity", sortOrder: 3 },
  { title: "Kondisi Permukaan", description: "Dinding retak/lembap mungkin memerlukan perbaikan, plamir, atau waterproofing tambahan.", icon: "surface", sortOrder: 4 },
  { title: "Kualitas Bahan", description: "Material premium dengan daya sebar dan pigmen lebih tinggi berkonsekuensi harga berbeda.", icon: "material", sortOrder: 5 },
  { title: "Lokasi Proyek", description: "Proyek di luar kota dapat dikenakan biaya transportasi dan tenaga tambahan.", icon: "location", sortOrder: 6 },
];

const serviceScopes = [
  { name: "Interior", description: "Dinding dalam ruangan, partisi, dan area interior hunian maupun komersial.", icon: "interior", sortOrder: 1 },
  { name: "Eksterior", description: "Fasad bangunan, pagar, dan bagian luar yang terpapar cuaca.", icon: "exterior", sortOrder: 2 },
  { name: "Plafon", description: "Plafon retak atau tidak rata dengan motif popcorn dan tekstur penutup.", icon: "ceiling", sortOrder: 3 },
  { name: "Permukaan Khusus", description: "Permukaan beton, GRC, gypsum, kayu, dan batu bata yang butuh perlakuan khusus.", icon: "special", sortOrder: 4 },
];

const gallery = [
  {
    title: "Renovasi Fasad Gedung Komersial 5 Lantai",
    motif: "Batu Alam Texture",
    category: "Komersial",
    location: "Jakarta Selatan",
    projectType: "Fasad gedung komersial",
    areaSize: 850,
    description:
      "Studi kasus renovasi fasad gedung komersial 5 lantai dengan kebutuhan material 22-27 kg per lantai. Efisiensi biaya finishing turun sekitar 15% dan daya tahan terhadap panas serta retak rambut meningkat sekitar 25%.",
    beforeImage: "/images/galeri/fasad-before.svg",
    afterImage: "/images/galeri/fasad-after.svg",
    isFeatured: true,
    sortOrder: 1,
  },
  {
    title: "Dinding Feature Kamprot Hunian",
    motif: "Kamprot",
    category: "Hunian",
    location: "Bandung",
    projectType: "Rumah tinggal",
    areaSize: 120,
    description: "Penutupan dinding retak menggunakan tekstur kamprot satu warna, hasil akhir rapi dan sambungan tidak terlihat.",
    beforeImage: "/images/galeri/hunian-before.svg",
    afterImage: "/images/galeri/hunian-after.svg",
    isFeatured: true,
    sortOrder: 2,
  },
  {
    title: "Plafon Popcorn Restoran",
    motif: "Popcorn",
    category: "Komersial",
    location: "Surabaya",
    projectType: "Restoran",
    areaSize: 260,
    description: "Perbaikan plafon retak dan tidak rata pada area dining dengan aplikator popcorn siap pakai.",
    beforeImage: "/images/galeri/plafon-before.svg",
    afterImage: "/images/galeri/plafon-after.svg",
    isFeatured: false,
    sortOrder: 3,
  },
  {
    title: "Panel Aksen Stucco",
    motif: "Plaster Gosok / Stucco",
    category: "Interior",
    location: "Tangerang Selatan",
    projectType: "Rumah tinggal",
    areaSize: 85,
    description: "Panel dinding aksen bernuansa Mediterania di ruang keluarga, dipadukan cat tembok matte.",
    beforeImage: "/images/galeri/stucco-before.svg",
    afterImage: "/images/galeri/stucco-after.svg",
    isFeatured: false,
    sortOrder: 4,
  },
];

const blogPosts = [
  {
    title: "Cara Menghitung Kebutuhan Cat Tekstur Dinding (Rumus Praktis)",
    slug: "cara-menghitung-kebutuhan-cat-tekstur",
    excerpt: "Luas dinding dibagi daya sebar material, lalu tambahkan cadangan 10%. Ini rumus sederhana yang dipakai aplikator profesional.",
    coverImage: "/images/blog/hitung-kebutuhan.svg",
    tags: "kalkulator,kebutuhan cat,panduan",
    status: "published",
    content: `Menghitung kebutuhan cat tekstur tidak serumit menghitung cat tembok biasa, karena daya sebarnya dipengaruhi ukuran butiran tekstur.

## Rumus dasar

1. Luas dinding (m2) = panjang (m) x tinggi (m)
2. Kebutuhan dasar (kg) = luas dinding / daya sebar (m2/kg)
3. Total rekomendasi (kg) = kebutuhan dasar x 1,10 (cadangan 10%)

## Contoh: dinding 30 m2, kamprot daya sebar 1,2 m2/kg

- Luas dinding: 30 m2
- Kebutuhan dasar: 30 / 1,2 = 25 kg
- Dengan cadangan 10%: 27,5 kg

Contoh tersebut setara dengan 1 pail 25 kg ditambah kemasan 2,5 kg, atau kombinasi kemasan 5 kg dan 1 kg terdekat.

## Kenapa cadangan 10%?

Tekstur kasar seperti kamprot dan batu alam absorbif. Cat terlalu tipis membuat butiran hilang, sedangkan cat terlalu tebal mudah retak saat kering. Cadangan 10% menutup area yang butuh lapisan kedua.

## Tips praktis

Gunakan kalkulator kebutuhan cat di halaman Kalkulator Cat agar Anda cukup memasukkan panjang, tinggi, dan jenis tekstur. Untuk hasil paling hemat, gunakan rol yang sesuai jenis tekstur.`,
  },
  {
    title: "Kamprot, Pasir, atau Stucco? Memilih Tekstur yang Tepat",
    slug: "memilih-jenis-tekstur-dinding",
    excerpt: "Perbandingan karakter, daya sebar, dan kegunaan jenis tekstur cat paling populer untuk hunian dan kontraktor.",
    coverImage: "/images/blog/pilihan-tekstur.svg",
    tags: "produk,perbandingan,panduan",
    status: "published",
    content: `Pemilihan tekstur tidak boleh sembarangan. Karakter permukaan menentukan apakah dinding terlihat natural atau seperti hasil pekerjaan terburu-buru.

## Kamprot

Butiran kasar, paling efektif menutup retak dan permukaan tidak rata. Cocok untuk dinding lama, dinding baru yang belum diplester, dan area dengan banyak cacat.

## Pasir / Sandtex

Butiran sedang, hasil lebih halus dan rapi. Favorit untuk interior modern dan eksterior rumah yang tetap ingin terlihat bersih.

## Plaster Gosok / Stucco

Tekstur halus dengan nuansa Mediterania, butuh teknik aplikasi yang lebih terlatih. Pilihan untuk panel aksen kelas atas.

## Batu Alam Texture

Butiran bergradasi dengan kesan batu alam. Ketahanan panas dan retak menjadikannya cocok untuk fasad.

## Tips

Bandingkan total biaya antara satu motif dan motif lain pada luas dinding yang sama memakai kalkulator kebutuhan cat sebelum Anda memutuskan.`,
  },
  {
    title: "Tips Hemat Pengecatan: Persiapan Permukaan yang Benar",
    slug: "tips-hemat-pengecatan",
    excerpt: "Sebagian besar kegagalan cat tekstur berawal dari permukaan yang tidak disiapkan dengan benar.",
    coverImage: "/images/blog/tips-hemat.svg",
    tags: "tips,teknik,panduan",
    status: "published",
    content: `Menghemat cat berarti memperpanjang umur cat, bukan menipiskan lapisan sampai terkelupas.

## 1. Bersihkan permukaan

Hapus sisa cat lama, debu, dan lemak dengan kain lembap.

## 2. Tutup retak

Isi retak dengan compound lalu haluskan. Tanpa perbaikan retak, tekstur baru hanya menutupi retak sementara.

## 3. Plamir bila perlu

Untuk dinding baru atau berwarna, gunakan plamir agar hasil lebih rata dan hemat.

## 4. Gunakan rol yang tepat

Rol dan kuas yang sesuai jenis tekstur menentukan hasil akhir dan berapa banyak cat yang terpakai.`,
  },
];

const landingVariants = [
  {
    name: "Varian A - Fokus Warisan",
    slug: "varian-a",
    isActive: true,
    trafficWeight: 50,
    headline: "Cat Tekstur Ramah Biaya untuk Dinding Retak",
    subheadline: "Beli cat tekstur RupaDinding per kilogram dengan harga jelas, hitung kebutuhan sendiri lewat kalkulator, dan kerjakan sendiri atau serahkan ke tim aplikator kami.",
    ctaText: "Beli Cat Tekstur",
    secondaryCtaText: "Konsultasi Jasa Aplikator",
    bundlePrice: "",
    promoText: "Harga mulai Rp89.900/kg - gratis ongkir mulai Rp750.000",
  },
  {
    name: "Varian B - Fokus Jasa",
    slug: "varian-b",
    isActive: true,
    trafficWeight: 50,
    headline: "Dinding Retak Terlihat Baru, Tanpa Bongkar Total",
    subheadline: "Jasa aplikator cat tekstur dengan harga mulai dari Rp50.000/m2, survei gratis, dan garansi hasil kerja untuk dinding, plafon, serta fasad.",
    ctaText: "Minta Penawaran Gratis",
    secondaryCtaText: "Lihat Katalog Cat",
    bundlePrice: "",
    promoText: "Tarif borongan mulai Rp50.000/m2 - negotiable",
  },
];

async function main() {
  const password = process.env.ADMIN_PASSWORD || "RupaDinding2026!";
  const email = process.env.ADMIN_EMAIL || "admin@rupadinding.co.id";

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash: await bcrypt.hash(password, 10), name: "Admin RupaDinding", role: "admin" },
  });

  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }

  for (const p of products) {
    const { variants, ...rest } = p;
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: { ...rest, features: JSON.stringify(rest.features), applicationAreas: JSON.stringify(rest.applicationAreas) },
      create: { ...rest, features: JSON.stringify(rest.features), applicationAreas: JSON.stringify(rest.applicationAreas) },
    });
    for (const v of variants) {
      await prisma.productVariant.upsert({
        where: { productId_sizeKg: { productId: product.id, sizeKg: v.sizeKg } },
        update: { price: v.price, label: v.label, stock: v.stock },
        create: { ...v, productId: product.id },
      });
    }
  }

  await prisma.serviceRate.deleteMany();
  await prisma.serviceRate.createMany({ data: serviceRates });

  await prisma.serviceFactor.deleteMany();
  await prisma.serviceFactor.createMany({ data: serviceFactors });

  await prisma.serviceScope.deleteMany();
  await prisma.serviceScope.createMany({ data: serviceScopes });

  for (const g of gallery) {
    const exists = await prisma.galleryItem.findFirst({ where: { title: g.title } });
    if (!exists) await prisma.galleryItem.create({ data: g });
  }

  for (const b of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: { ...b, relatedProductIds: "[]" },
      create: { ...b, relatedProductIds: "[]" },
    });
  }

  for (const v of landingVariants) {
    await prisma.landingVariant.upsert({ where: { slug: v.slug }, update: v, create: v });
  }

  const now = new Date();
  await prisma.promo.upsert({
    where: { id: "promo-1112" },
    update: {},
    create: {
      id: "promo-1112",
      name: "Flash Sale 11.11 - 12.12",
      type: "percent",
      value: 10,
      startDate: new Date(now.getFullYear(), 10, 1),
      endDate: new Date(now.getFullYear(), 11, 31),
      freeShipping: true,
      isActive: true,
    },
  });

  const variants = await prisma.productVariant.findMany({ include: { product: true } });
  const kamprot5 = variants.find((v) => v.product.sku === "RPD-KMP-001" && v.sizeKg === 5);
  if (kamprot5) {
    await prisma.hppRecord.create({
      data: {
        variantId: kamprot5.id,
        productName: "RupaDinding Tekstur Kamprot - Kemasan 5 kg",
        supplierCost: 250000,
        shippingCost: 20000,
        packagingCost: 15000,
        laborCost: 25000,
        overhead: 15000,
        unitsPerBatch: 1,
        marginTarget: 25,
        marketplaceCommission: 5,
        adAllocation: 8,
        shippingSubsidy: 15000,
        notes: "Evaluasi awal private label (estimasi, awaiting harga beli aktual Decopain).",
      },
    });
  }

  console.log("Seed selesai:", {
    products: await prisma.product.count(),
    variants: await prisma.productVariant.count(),
    serviceRates: await prisma.serviceRate.count(),
    posts: await prisma.blogPost.count(),
    settings: await prisma.setting.count(),
    admin: email,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
