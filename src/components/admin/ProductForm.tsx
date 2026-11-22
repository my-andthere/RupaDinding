import { saveProductAction } from "@/app/actions/admin";
import { ActionForm } from "@/components/admin/ActionForm";
import { parseJsonArray } from "@/lib/format";

export type ProductFormValues = {
  id?: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  textureLevel: string;
  tagline: string;
  description: string;
  baseMaterial: string;
  features: string;
  applicationAreas: string;
  coverageRate: number;
  image: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

export function ProductForm({ product }: { product?: ProductFormValues }) {
  const values: ProductFormValues = product ?? {
    sku: "",
    name: "",
    slug: "",
    category: "Kamprot",
    textureLevel: "Rustic",
    tagline: "",
    description: "",
    baseMaterial: "Akrilik + silica",
    features: "",
    applicationAreas: "",
    coverageRate: 1.2,
    image: "/images/produk/default.svg",
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
  };

  return (
    <ActionForm action={saveProductAction} className="space-y-5" submitLabel="Simpan produk">
      {values.id ? <input type="hidden" name="id" value={values.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Nama produk *</label>
          <input name="name" required className="input" defaultValue={values.name} />
        </div>
        <div>
          <label className="label">SKU *</label>
          <input name="sku" required className="input" defaultValue={values.sku} placeholder="RPD-KMP-001" />
        </div>
        <div>
          <label className="label">Slug URL</label>
          <input name="slug" className="input" defaultValue={values.slug} placeholder="dibuat otomatis dari nama" />
        </div>
        <div>
          <label className="label">Kategori motif *</label>
          <input
            name="category"
            required
            className="input"
            defaultValue={values.category}
            placeholder="Kamprot / Pasir / Silica / Stucco ..."
          />
        </div>
        <div>
          <label className="label">Tingkat tekstur</label>
          <select name="textureLevel" className="input" defaultValue={values.textureLevel}>
            {["Rustic", "Medium", "Smooth"].map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Daya sebar (m&sup2;/kg) *</label>
          <input
            name="coverageRate"
            type="number"
            step="0.1"
            min="0.1"
            required
            className="input"
            defaultValue={values.coverageRate}
          />
        </div>
        <div>
          <label className="label">Bahan dasar</label>
          <input name="baseMaterial" className="input" defaultValue={values.baseMaterial} />
        </div>
        <div>
          <label className="label">URL gambar</label>
          <input name="image" className="input" defaultValue={values.image} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Tagline singkat</label>
          <input name="tagline" className="input" defaultValue={values.tagline} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Deskripsi lengkap</label>
          <textarea name="description" rows={5} className="input" defaultValue={values.description} />
        </div>
        <div>
          <label className="label">Keunggulan (satu per baris)</label>
          <textarea
            name="features"
            rows={5}
            className="input"
            defaultValue={values.features}
            placeholder={"Menutup retak rambut\nReady for use\nTahan UV dan jamur"}
          />
        </div>
        <div>
          <label className="label">Bidang aplikasi (satu per baris)</label>
          <textarea
            name="applicationAreas"
            rows={5}
            className="input"
            defaultValue={values.applicationAreas}
            placeholder={"Dinding interior\nFasad eksterior\nPagar"}
          />
        </div>
        <div>
          <label className="label">Urutan tampil</label>
          <input name="sortOrder" type="number" className="input" defaultValue={values.sortOrder} />
        </div>
        <div className="flex items-end gap-6">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" name="isActive" defaultChecked={values.isActive} className="h-4 w-4 accent-[var(--color-brand-600)]" />
            Aktif
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" name="isFeatured" defaultChecked={values.isFeatured} className="h-4 w-4 accent-[var(--color-brand-600)]" />
            Unggulan
          </label>
        </div>
      </div>
    </ActionForm>
  );
}

export function productToFormValues(product: {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  textureLevel: string;
  tagline: string;
  description: string;
  baseMaterial: string;
  features: string;
  applicationAreas: string;
  coverageRate: number;
  image: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
}): ProductFormValues {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    slug: product.slug,
    category: product.category,
    textureLevel: product.textureLevel,
    tagline: product.tagline,
    description: product.description,
    baseMaterial: product.baseMaterial,
    features: parseJsonArray(product.features).join("\n"),
    applicationAreas: parseJsonArray(product.applicationAreas).join("\n"),
    coverageRate: product.coverageRate,
    image: product.image ?? "",
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    sortOrder: product.sortOrder,
  };
}
