import Link from "next/link";
import { PostForm } from "@/components/admin/PostForm";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Artikel Baru" };

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Artikel Baru"
        description="Tulis konten edukasi dengan gaya markdown dan tambahkan tautan internal ke produk maupun kalkulator."
        action={
          <Link href="/admin/artikel" className="btn-secondary">
            <Icon name="arrowLeft" className="h-4 w-4" />
            Kembali
          </Link>
        }
      />
      <AdminCard title="Isi artikel">
        <PostForm />
      </AdminCard>
    </div>
  );
}
