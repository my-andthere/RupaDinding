"use client";

import { useState, useTransition } from "react";
import { submitContactMessage } from "@/app/actions/lead";
import { Icon } from "@/components/ui/Icon";

export function ContactForm() {
  const [status, setStatus] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await submitContactMessage(formData);
      setStatus({ type: result.ok ? "ok" : "error", text: result.message });
      if (result.ok) event.currentTarget.reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <h2 className="text-lg font-bold text-ink-900">Kirim pesan</h2>
      <p className="mt-1 text-sm text-ink-500">
        Pertanyaan soal produk, harga grosir, atau kerja sama proyek bisa langsungLeave lewat formulir ini.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="contact-name">
            Nama *
          </label>
          <input id="contact-name" name="name" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="contact-email">
            Email *
          </label>
          <input id="contact-email" name="email" type="email" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="contact-phone">
            Nomor WhatsApp
          </label>
          <input id="contact-phone" name="phone" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="contact-subject">
            Subjek
          </label>
          <input id="contact-subject" name="subject" className="input" />
        </div>
      </div>
      <div className="mt-4">
        <label className="label" htmlFor="contact-message">
          Pesan *
        </label>
        <textarea id="contact-message" name="message" required rows={5} className="input" />
      </div>
      <button type="submit" disabled={pending} className="btn-primary mt-5">
        <Icon name="mail" className="h-4 w-4" />
        {pending ? "Mengirim..." : "Kirim pesan"}
      </button>
      {status ? (
        <p
          className={`mt-3 flex items-start gap-2 text-sm ${
            status.type === "ok" ? "text-brand-700" : "text-red-600"
          }`}
        >
          <Icon name={status.type === "ok" ? "check" : "bell"} className="mt-0.5 h-4 w-4 shrink-0" />
          {status.text}
        </p>
      ) : null}
    </form>
  );
}
