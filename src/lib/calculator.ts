/**
 * Kalkulator Kebutuhan Cat (Bagian 3.3 spesifikasi).
 *
 * Luas Dinding (m2)     = P x T
 * Kebutuhan Dasar (kg) = Luas Dinding / Daya Sebar (m2/kg)
 * Total Rekomendasi     = Kebutuhan Dasar x 1,10 (cadangan efisiensi 10%)
 */

export const RESERVE_RATE = 0.1;

export type CalculatorInput = {
  panjang: number;
  tinggi: number;
  dayaSebar: number;
  jumlahWalls?: number;
};

export type PackageLine = {
  sizeKg: number;
  qty: number;
  label: string;
};

export type CalculatorResult = {
  luas: number;
  kebutuhanDasar: number;
  totalRekomendasi: number;
  cadangan: number;
  paket: PackageLine[];
  totalBeratPaket: number;
 remarks: string[];
};

export function calculateNeeds(input: CalculatorInput): CalculatorResult {
  const panjang = Number.isFinite(input.panjang) ? Math.max(0, input.panjang) : 0;
  const tinggi = Number.isFinite(input.tinggi) ? Math.max(0, input.tinggi) : 0;
  const dayaSebar = Number.isFinite(input.dayaSebar) && input.dayaSebar > 0 ? input.dayaSebar : 1;
  const jumlahWalls = Number.isFinite(input.jumlahWalls) ? Math.max(1, input.jumlahWalls || 1) : 1;

  const luas = panjang * tinggi * jumlahWalls;
  const kebutuhanDasar = luas / dayaSebar;
  const totalRekomendasi = kebutuhanDasar * (1 + RESERVE_RATE);
  const cadangan = totalRekomendasi - kebutuhanDasar;

  const paket = buildPackageCombination(totalRekomendasi);
  const totalBeratPaket = paket.reduce((sum, line) => sum + line.sizeKg * line.qty, 0);

  const remarks: string[] = [];
  if (luas <= 0) remarks.push("Masukkan panjang dan tinggi dinding terlebih dahulu.");
  if (totalRekomendasi > 0 && totalBeratPaket < totalRekomendasi) {
    remarks.push("Kombinasi kemasan dibulatkan ke atas agar kebutuhan aman.");
  }
  remarks.push("Sudah termasuk cadangan 10% untuk lapisan kedua dan penyesuaian motif.");

  return {
    luas,
    kebutuhanDasar,
    totalRekomendasi,
    cadangan,
    paket,
    totalBeratPaket,
    remarks,
  };
}

/** Susun kombinasi kemasan (pail 25 kg, kemasan 5 kg, kemasan 1 kg). */
export function buildPackageCombination(totalKg: number): PackageLine[] {
  const sizes: { sizeKg: number; label: string }[] = [
    { sizeKg: 25, label: "Pail 25 kg" },
    { sizeKg: 5, label: "Kemasan 5 kg" },
    { sizeKg: 1, label: "Kemasan 1 kg" },
  ];

  let remaining = Math.max(0, totalKg);
  const lines: PackageLine[] = [];

  for (const size of sizes) {
    const qty = Math.floor(remaining / size.sizeKg);
    if (qty > 0) {
      lines.push({ sizeKg: size.sizeKg, qty, label: size.label });
      remaining -= qty * size.sizeKg;
    }
  }

  if (remaining > 0.001) {
    const last = lines[lines.length - 1];
    if (last && last.sizeKg === 1) {
      last.qty += Math.ceil(remaining);
    } else {
      lines.push({ sizeKg: 1, qty: Math.ceil(remaining), label: "Kemasan 1 kg" });
    }
  }

  return lines;
}

/** Rumus HPP private label (Bagian 5.1). */
export type HppInput = {
  modalCatPemasok: number;
  ongkirPemasok: number;
  kemasanLabel: number;
  tenagaKerja: number;
  overhead: number;
  jumlahUnitKemasan: number;
};

export function calculateHpp(input: HppInput): number {
  const total =
    Number(input.modalCatPemasok || 0) +
    Number(input.ongkirPemasok || 0) +
    Number(input.kemasanLabel || 0) +
    Number(input.tenagaKerja || 0) +
    Number(input.overhead || 0);
  const units = Math.max(1, Number(input.jumlahUnitKemasan || 1));
  return Math.round(total / units);
}

/** Harga jual dasar agar margin bersih riil tercapai (bukan markup). */
export function calculateSellingPrice(hpp: number, marginPercent: number): number {
  const margin = Math.min(Math.max(marginPercent, 0), 0.95);
  if (margin >= 1) return hpp;
  return Math.ceil(hpp / (1 - margin));
}

/** Simulasi beban kanal digital (marketplace, iklan, subsidi ongkir). */
export type ChannelSimulation = {
  hargaJual: number;
  komisiMarketplace: number;
  alokasiIklan: number;
  subsidiOngkir: number;
  totalPotongan: number;
  marginKotorPercent: number;
  marginBersihPercent: number;
  amanDijual: boolean;
};

export function simulateChannel(input: {
  hpp: number;
  hargaJual: number;
  marketplaceCommission: number; // persen
  adAllocation: number; // persen
  shippingSubsidy: number; // rupiah
}): ChannelSimulation {
  const komisiMarketplace = Math.round((input.hargaJual * input.marketplaceCommission) / 100);
  const alokasiIklan = Math.round((input.hargaJual * input.adAllocation) / 100);
  const totalPotongan = komisiMarketplace + alokasiIklan + input.shippingSubsidy;
  const labaKotor = input.hargaJual - input.hpp;
  const labaBersih = labaKotor - totalPotongan;
  const marginKotorPercent = input.hargaJual > 0 ? (labaKotor / input.hargaJual) * 100 : 0;
  const marginBersihPercent = input.hargaJual > 0 ? (labaBersih / input.hargaJual) * 100 : 0;

  return {
    hargaJual: input.hargaJual,
    komisiMarketplace,
    alokasiIklan,
    subsidiOngkir: input.shippingSubsidy,
    totalPotongan,
    marginKotorPercent: round2(marginKotorPercent),
    marginBersihPercent: round2(marginBersihPercent),
    amanDijual: marginBersihPercent >= 10,
  };
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
