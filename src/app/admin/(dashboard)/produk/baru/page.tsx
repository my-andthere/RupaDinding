import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Tambah Produk" };

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tambah Produk"
        description="Isi atribut teknis produk agar katalog tetap bisa dibandingkan antar motif."
        action={
          <Link href="/admin/produk" className="btn-secondary">
            <Icon name="arrowLeft" className="h-4 w-4" />
            Kembali
          </Link>
        }
      />
      <AdminCard title="Detail produk">
        <ProductForm />
      </AdminCard>
      <p className="text-xs text-ink-500">
        Setelah produk disimpan, tambahkan varian kemasan (1 kg, 5 kg, pail 25 kg) pada halaman detail
        produk.
      </p>
    </div>
  );
}
