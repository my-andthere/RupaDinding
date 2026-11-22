import { savePostAction } from "@/app/actions/admin";
import { ActionForm } from "@/components/admin/ActionForm";

export type PostFormValues = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string;
  status: string;
  author: string;
};

export function PostForm({ post }: { post?: PostFormValues }) {
  const values: PostFormValues = post ?? {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "/images/blog/default.svg",
    tags: "panduan",
    status: "draft",
    author: "Tim RupaDinding",
  };

  return (
    <ActionForm action={savePostAction} className="space-y-5" submitLabel="Simpan artikel">
      {values.id ? <input type="hidden" name="id" value={values.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Judul artikel *</label>
          <input name="title" required className="input" defaultValue={values.title} />
        </div>
        <div>
          <label className="label">Slug URL</label>
          <input name="slug" className="input" defaultValue={values.slug} placeholder="otomatis dari judul" />
        </div>
        <div>
          <label className="label">Gambar sampul</label>
          <input name="coverImage" className="input" defaultValue={values.coverImage} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Ringkasan (excerpt)</label>
          <textarea name="excerpt" rows={2} className="input" defaultValue={values.excerpt} />
        </div>
        <div>
          <label className="label">Tag (pisah koma)</label>
          <input name="tags" className="input" defaultValue={values.tags} placeholder="kalkulator,panduan" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Status</label>
            <select name="status" className="input" defaultValue={values.status}>
              <option value="draft">Draft</option>
              <option value="published">Terbit</option>
            </select>
          </div>
          <div>
            <label className="label">Penulis</label>
            <input name="author" className="input" defaultValue={values.author} />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Isi artikel (Markdown)</label>
          <textarea
            name="content"
            rows={18}
            className="input font-mono text-xs"
            defaultValue={values.content}
            placeholder={"## Subjudul\n\nParagraf artikel. Tautan internal ke /produk dan /kalkulator sangat disarankan."}
          />
        </div>
      </div>
    </ActionForm>
  );
}
