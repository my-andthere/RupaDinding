import { prisma } from "@/lib/prisma";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { Calculator } from "@/components/calculator/Calculator";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kalkulator Kebutuhan Cat Tekstur",
  description:
    "Hitung kebutuhan cat tekstur dinding otomatis: luas dinding dibagi daya sebar, ditambah cadangan 10%, lalu disusun ke kombinasi kemasan 1 kg, 5 kg, dan 25 kg.",
};

export default async function CalculatorPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ href: "/", label: "Beranda" }, { label: "Kalkulator Cat" }]} />

      <div className="mt-5 max-w-3xl">
        <span className="eyebrow">
          <Icon name="calculator" className="h-3.5 w-3.5" />
          Kalkulator kebutuhan cat
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          Hitung Kebutuhan Cat Tekstur
        </h1>
        <p className="mt-3 text-ink-600">
          Rumus resmi: luas dinding = panjang &times; tinggi, kebutuhan dasar = luas &divide; daya sebar,
          total rekomendasi = kebutuhan dasar &times; 1,10 untuk cadangan 10%.
        </p>
      </div>

      <div className="mt-8">
        <Calculator
          products={products.map((product) => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            category: product.category,
            coverageRate: product.coverageRate,
            variants: product.variants.map((variant) => ({
              id: variant.id,
              sizeKg: variant.sizeKg,
              label: variant.label,
              price: variant.price,
            })),
          }))}
        />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Contoh kamprot",
            body: "Dinding 30 m² dengan daya sebar 1,2 m²/kg menghasilkan 25 kg kebutuhan dasar dan 27,5 kg setelah cadangan.",
          },
          {
            title: "Contoh silica",
            body: "Dinding 40 m² dengan daya sebar 0,7 m²/kg membutuhkan sekitar 57 kg sebelum cadangan 10%.",
          },
          {
            title: "Catatan aplikator",
            body: "Selalu tambahkan cadangan. Tekstur kasar butuh lapisan kedua di area retak dan sudut.",
          },
        ].map((item) => (
          <div key={item.title} className="card p-5">
            <h2 className="font-bold text-ink-900">{item.title}</h2>
            <p className="mt-1.5 text-sm text-ink-500">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
