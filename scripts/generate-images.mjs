/**
 * Generator aset gambar placeholder (SVG) untuk katalog, galeri, dan blog.
 * Jalankan: node scripts/generate-images.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "images");

function write(path, content) {
  const full = join(out, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content.trim() + "\n");
  console.log("created", path);
}

const texture = ({ id, base, accent, freq, octaves, scale, dark = false }) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <filter id="t-${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${octaves}" seed="7" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>
      <feColorMatrix in="noise" type="saturate" values="0" result="gray"/>
      <feBlend in="SourceGraphic" in2="gray" mode="multiply"/>
    </filter>
    <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${base}"/>
      <stop offset="100%" stop-color="${accent}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g-${id})"/>
  <rect width="800" height="600" filter="url(#t-${id})" opacity="${dark ? 0.55 : 0.38}"/>
  <rect x="0" y="430" width="800" height="170" fill="#1d1c19" opacity="0.12"/>
  <g opacity="0.25" stroke="#ffffff" stroke-width="2" fill="none">
    <path d="M0 470 H800"/>
    <path d="M0 520 H800"/>
  </g>
</svg>
`;

const productSwatch = ({ id, base, accent, freq, octaves, scale, label }) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <filter id="t-${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${octaves}" seed="11" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>
      <feColorMatrix in="noise" type="saturate" values="0" result="gray"/>
      <feBlend in="SourceGraphic" in2="gray" mode="multiply"/>
    </filter>
    <radialGradient id="v-${id}" cx="35%" cy="25%" r="80%">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${base}"/>
    </radialGradient>
  </defs>
  <rect width="800" height="600" fill="url(#v-${id})"/>
  <rect width="800" height="600" filter="url(#t-${id})" opacity="0.42"/>
  <circle cx="400" cy="300" r="150" fill="#ffffff" opacity="0.12"/>
  <circle cx="400" cy="300" r="150" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.35"/>
  <text x="400" y="295" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="46" font-weight="700" fill="#ffffff" opacity="0.92">${label}</text>
  <text x="400" y="345" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" fill="#ffffff" opacity="0.72">RupaDinding</text>
</svg>
`;

const wallScene = ({ id, tone, cracks = false, label }) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="w-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${tone}"/>
      <stop offset="100%" stop-color="#e8e2d8"/>
    </linearGradient>
    <filter id="n-${id}">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="3" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0"/>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#w-${id})"/>
  <rect width="800" height="600" filter="url(#n-${id})" opacity="0.12"/>
  <rect x="0" y="470" width="800" height="130" fill="#1d1c19" opacity="0.18"/>
  ${
    cracks
      ? `<path d="M120 90 L200 220 L160 330 L240 470" stroke="#7a736b" stroke-width="4" fill="none" opacity="0.7"/>
         <path d="M520 60 L600 180 L560 300 L640 460" stroke="#7a736b" stroke-width="3" fill="none" opacity="0.5"/>
         <path d="M300 40 L360 150 L320 260" stroke="#7a736b" stroke-width="3" fill="none" opacity="0.45"/>`
      : ""
  }
  <text x="400" y="545" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="600" fill="#ffffff" opacity="0.85">${label}</text>
</svg>
`;

const blogCover = ({ id, title, subtitle, base, accent }) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="b-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${base}"/>
      <stop offset="100%" stop-color="${accent}"/>
    </linearGradient>
    <filter id="bn-${id}">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="5" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0"/>
    </filter>
  </defs>
  <rect width="1200" height="675" fill="url(#b-${id})"/>
  <rect width="1200" height="675" filter="url(#bn-${id})" opacity="0.14"/>
  <circle cx="980" cy="140" r="220" fill="#ffffff" opacity="0.08"/>
  <circle cx="200" cy="560" r="160" fill="#ffffff" opacity="0.06"/>
  <text x="80" y="300" font-family="Inter, Arial, sans-serif" font-size="62" font-weight="800" fill="#ffffff">${title}</text>
  <text x="80" y="360" font-family="Inter, Arial, sans-serif" font-size="30" fill="#ffffff" opacity="0.85">${subtitle}</text>
</svg>
`;

// Hero
write(
  "hero-tekstur.svg",
  texture({
    id: "hero",
    base: "#d9cdbb",
    accent: "#b9835a",
    freq: "0.045",
    octaves: 4,
    scale: 26,
  }),
);

// Produk
const products = [
  { file: "kamprot", base: "#c8b39a", accent: "#8f7355", freq: "0.03", octaves: 4, scale: 34, label: "KAMPROT" },
  { file: "pasir", base: "#e4d8c3", accent: "#c0a684", freq: "0.14", octaves: 3, scale: 12, label: "PASIR" },
  { file: "silica", base: "#9aa0a6", accent: "#6b737b", freq: "0.05", octaves: 5, scale: 28, label: "SILICA" },
  { file: "kulit-jeruk", base: "#e8b579", accent: "#cd8a4b", freq: "0.11", octaves: 3, scale: 14, label: "KULIT JERUK" },
  { file: "popcorn", base: "#efe9df", accent: "#cfc4b2", freq: "0.04", octaves: 5, scale: 40, label: "POPCORN" },
  { file: "stucco", base: "#e7e2d9", accent: "#bdb3a2", freq: "0.02", octaves: 4, scale: 18, label: "STUCCO" },
  { file: "batu-alam", base: "#a89f93", accent: "#7c7268", freq: "0.025", octaves: 5, scale: 38, label: "BATU ALAM" },
];

for (const product of products) {
  write(
    `produk/${product.file}.svg`,
    productSwatch({
      id: product.file,
      base: product.base,
      accent: product.accent,
      freq: product.freq,
      octaves: product.octaves,
      scale: product.scale,
      label: product.label,
    }),
  );
}

write(
  "produk/default.svg",
  productSwatch({
    id: "default",
    base: "#ded7cb",
    accent: "#b7ac9a",
    freq: "0.06",
    octaves: 4,
    scale: 20,
    label: "CAT TEKSTUR",
  }),
);

// Galeri
const gallery = [
  { file: "fasad-before", tone: "#cfc6b8", cracks: true, label: "Sebelum - Fasad" },
  { file: "fasad-after", tone: "#b9a288", cracks: false, label: "Sesudah - Fasad" },
  { file: "hunian-before", tone: "#d6cec2", cracks: true, label: "Sebelum - Hunian" },
  { file: "hunian-after", tone: "#c8a882", cracks: false, label: "Sesudah - Hunian" },
  { file: "plafon-before", tone: "#d9d4cc", cracks: true, label: "Sebelum - Plafon" },
  { file: "plafon-after", tone: "#efe9de", cracks: false, label: "Sesudah - Plafon" },
  { file: "stucco-before", tone: "#cfc7ba", cracks: true, label: "Sebelum - Stucco" },
  { file: "stucco-after", tone: "#ded3c0", cracks: false, label: "Sesudah - Stucco" },
  { file: "generic-before", tone: "#d3ccbf", cracks: true, label: "Sebelum" },
  { file: "generic-after", tone: "#c6b195", cracks: false, label: "Sesudah" },
];

for (const item of gallery) {
  write(
    `galeri/${item.file}.svg`,
    wallScene({ id: item.file, tone: item.tone, cracks: item.cracks, label: item.label }),
  );
}

// Blog
write(
  "blog/hitung-kebutuhan.svg",
  blogCover({
    id: "hitung",
    title: "Hitung Kebutuhan Cat",
    subtitle: "Rumus luas, daya sebar, dan cadangan 10%",
    base: "#2f2e2a",
    accent: "#b95327",
  }),
);
write(
  "blog/pilihan-tekstur.svg",
  blogCover({
    id: "pilih",
    title: "Pilih Jenis Tekstur",
    subtitle: "Kamprot, pasir, stucco, atau batu alam?",
    base: "#3b3a35",
    accent: "#963f21",
  }),
);
write(
  "blog/tips-hemat.svg",
  blogCover({
    id: "tips",
    title: "Tips Hemat Pengecatan",
    subtitle: "Persiapan permukaan yang benar",
    base: "#4a4038",
    accent: "#d46d38",
  }),
);
write(
  "blog/default.svg",
  blogCover({
    id: "default",
    title: "Panduan RupaDinding",
    subtitle: "Cat tekstur & jasa aplikator",
    base: "#1d1c19",
    accent: "#7a3420",
  }),
);

console.log("Selesai membuat aset gambar.");
