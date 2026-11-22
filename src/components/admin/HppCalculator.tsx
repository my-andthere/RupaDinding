"use client";

import { useMemo, useState, useTransition } from "react";
import { calculateHpp, calculateSellingPrice, simulateChannel } from "@/lib/calculator";
import { formatRupiah } from "@/lib/format";
import { saveHppRecordAction } from "@/app/actions/admin";
import { Icon } from "@/components/ui/Icon";

export type HppVariantOption = {
  id: string;
  label: string;
  productName: string;
};

export function HppCalculator({
  variants = [],
  initialProductName = "",
  initialSellingPrice = 0,
  initialMargin = 25,
  initialCommission = 5,
  initialAd = 8,
  initialSubsidy = 0,
}: {
  variants?: HppVariantOption[];
  initialProductName?: string;
  initialSellingPrice?: number;
  initialMargin?: number;
  initialCommission?: number;
  initialAd?: number;
  initialSubsidy?: number;
}) {
  const [productName, setProductName] = useState(initialProductName);
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [modal, setModal] = useState(0);
  const [ongkir, setOngkir] = useState(0);
  const [kemasan, setKemasan] = useState(0);
  const [tenaga, setTenaga] = useState(0);
  const [overhead, setOverhead] = useState(0);
  const [units, setUnits] = useState(1);
  const [margin, setMargin] = useState(initialMargin);
  const [hargaJual, setHargaJual] = useState(initialSellingPrice);
  const [komisi, setKomisi] = useState(initialCommission);
  const [ads, setAds] = useState(initialAd);
  const [subsidy, setSubsidy] = useState(initialSubsidy);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const hpp = useMemo(
    () =>
      calculateHpp({
        modalCatPemasok: modal,
        ongkirPemasok: ongkir,
        kemasanLabel: kemasan,
        tenagaKerja: tenaga,
        overhead,
        jumlahUnitKemasan: units,
      }),
    [modal, ongkir, kemasan, tenaga, overhead, units],
  );

  const suggestedPrice = useMemo(() => calculateSellingPrice(hpp, margin / 100), [hpp, margin]);
  const effectivePrice = hargaJual || suggestedPrice;

  const simulation = useMemo(
    () =>
      simulateChannel({
        hpp,
        hargaJual: effectivePrice,
        marketplaceCommission: komisi,
        adAllocation: ads,
        shippingSubsidy: subsidy,
      }),
    [hpp, effectivePrice, komisi, ads, subsidy],
  );

  const totalBiaya = modal + ongkir + kemasan + tenaga + overhead;

  function saveRecord() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("variantId", variantId);
      formData.set("productName", productName || "Tanpa nama");
      formData.set("supplierCost", String(modal));
      formData.set("shippingCost", String(ongkir));
      formData.set("packagingCost", String(kemasan));
      formData.set("laborCost", String(tenaga));
      formData.set("overhead", String(overhead));
      formData.set("unitsPerBatch", String(units));
      formData.set("marginTarget", String(margin));
      formData.set("marketplaceCommission", String(komisi));
      formData.set("adAllocation", String(ads));
      formData.set("shippingSubsidy", String(subsidy));
      formData.set("notes", notes);
      const result = await saveHppRecordAction(formData);
      setStatus(result.message);
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-sand-200 bg-sand-50 p-5">
        <h3 className="font-bold text-ink-900">Komponen biaya per batch</h3>
        <p className="mt-1 text-xs text-ink-500">
          Biaya private label: modal cat pemasok, ongkir, kemasan & label, tenaga kerja, dan overhead.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Nama produk / SKU</label>
            <input
              className="input"
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
              placeholder="RupaDinding Tekstur Kamprot - Kemasan 5 kg"
            />
          </div>
          {variants.length > 0 ? (
            <div className="sm:col-span-2">
              <label className="label">Hubungkan ke varian produk</label>
              <select
                className="input"
                value={variantId}
                onChange={(event) => {
                  setVariantId(event.target.value);
                  const found = variants.find((variant) => variant.id === event.target.value);
                  if (found) setProductName(`${found.productName} - ${found.label}`);
                }}
              >
                {variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.productName} - {variant.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <NumberField label="Modal cat pemasok (Rp)" value={modal} onChange={setModal} />
          <NumberField label="Ongkir pemasok (Rp)" value={ongkir} onChange={setOngkir} />
          <NumberField label="Kemasan & label (Rp)" value={kemasan} onChange={setKemasan} />
          <NumberField label="Tenaga kerja (Rp)" value={tenaga} onChange={setTenaga} />
          <NumberField label="Overhead (Rp)" value={overhead} onChange={setOverhead} />
          <NumberField label="Jumlah unit kemasan / batch" value={units} onChange={setUnits} min={1} />
        </div>

        <div className="mt-5 rounded-xl bg-white p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-600">Total biaya per batch</span>
            <span className="font-bold text-ink-900">{formatRupiah(totalBiaya)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-ink-600">HPP per unit kemasan</span>
            <span className="text-lg font-extrabold text-brand-700">{formatRupiah(hpp)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-sand-200 bg-white p-5">
        <h3 className="font-bold text-ink-900">Harga jual & simulasi kanal digital</h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <NumberField label="Target margin bersih (%)" value={margin} onChange={setMargin} min={0} max={95} />
          <NumberField
            label="Harga jual dasar (Rp)"
            value={hargaJual}
            onChange={setHargaJual}
            hint={`Saran: ${formatRupiah(suggestedPrice)}`}
          />
          <NumberField
            label="Komisi marketplace (%)"
            value={komisi}
            onChange={setKomisi}
            min={0}
            max={100}
          />
          <NumberField label="Alokasi iklan/promo (%)" value={ads} onChange={setAds} min={0} max={100} />
          <NumberField label="Subsidi ongkir penjual (Rp)" value={subsidy} onChange={setSubsidy} min={0} />
          <div className="sm:col-span-2">
            <label className="label">Catatan evaluasi</label>
            <input
              className="input"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Evaluasi bulanan / perubahan harga material pemasok"
            />
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-sand-100 p-4 text-sm">
          <p className="font-semibold text-ink-900">Simulasi margin</p>
          <dl className="mt-3 space-y-2">
            <div className="flex justify-between">
              <dt className="text-ink-600">Harga jual dipakai</dt>
              <dd className="font-semibold text-ink-900">{formatRupiah(simulation.hargaJual)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-600">Potongan marketplace</dt>
              <dd className="font-semibold text-ink-900">-{formatRupiah(simulation.komisiMarketplace)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-600">Alokasi iklan</dt>
              <dd className="font-semibold text-ink-900">-{formatRupiah(simulation.alokasiIklan)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-600">Subsidi ongkir</dt>
              <dd className="font-semibold text-ink-900">-{formatRupiah(simulation.subsidiOngkir)}</dd>
            </div>
            <div className="flex justify-between border-t border-sand-300 pt-2">
              <dt className="font-semibold text-ink-900">Margin kotor</dt>
              <dd className="font-bold text-ink-900">{simulation.marginKotorPercent}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-semibold text-ink-900">Margin bersih setelah kanal</dt>
              <dd
                className={`font-extrabold ${
                  simulation.marginBersihPercent >= 10 ? "text-brand-700" : "text-red-600"
                }`}
              >
                {simulation.marginBersihPercent}%
              </dd>
            </div>
          </dl>
          <p
            className={`mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${
              simulation.amanDijual ? "bg-brand-50 text-brand-700" : "bg-red-50 text-red-700"
            }`}
          >
            <Icon
              name={simulation.amanDijual ? "check" : "bell"}
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
            />
            {simulation.amanDijual
              ? "Harga ini aman dipasang untuk kanal digital yang dipakai."
              : "Margin bersih di bawah 10%. Pertimbangkan menaikkan harga jual atau mengurangi beban kanal."}
          </p>
        </div>

        <button type="button" onClick={saveRecord} disabled={pending} className="btn-primary mt-5 w-full">
          <Icon name="trend" className="h-4 w-4" />
          {pending ? "Menyimpan..." : "Simpan catatan HPP"}
        </button>
        {status ? <p className="mt-2 text-sm text-brand-700">{status}</p> : null}
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max,
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="number"
        className="input"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {hint ? <p className="mt-1 text-[11px] text-ink-400">{hint}</p> : null}
    </div>
  );
}
