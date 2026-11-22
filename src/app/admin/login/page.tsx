import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Masuk CMS RupaDinding",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4 py-12">
      <div className="w-full">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Portal CMS RupaDinding
          </h1>
          <p className="mt-2 text-sm text-ink-300">
            Kelola katalog produk, tarif jasa, HPP, artikel, dan pesanan dalam satu tempat.
          </p>
        </div>
        <div className="flex justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
