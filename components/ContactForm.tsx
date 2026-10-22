"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import { useSite } from "./Providers";
import { profile } from "@/data/content";
import { ui } from "@/data/ui";
import { toast } from "@/lib/toast";

const field = "w-full rounded-xl border border-line bg-panel px-4 py-3 text-[16px] text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none";

export default function ContactForm() {
  const { t } = useSite();
  const f = ui.contact.form;
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const data = {
      name: String(d.get("name") ?? ""),
      email: String(d.get("email") ?? ""),
      message: String(d.get("message") ?? ""),
      website: String(d.get("website") ?? ""),
    };
    setBusy(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { toast(t(f.ok)); form.reset(); return; }
      if (res.status === 400) { toast(t(f.invalid)); return; }
      if (res.status === 503) {
        // Form belum dikonfigurasi: buka aplikasi email sebagai cadangan.
        toast(t(f.fallback));
        const subject = encodeURIComponent(`Pesan portofolio dari ${data.name}`);
        const mail = encodeURIComponent(`${data.message}\n\n${data.name} (${data.email})`);
        window.location.href = `mailto:${profile.email}?subject=${subject}&body=${mail}`;
        return;
      }
      toast(t(f.fail));
    } catch {
      toast(t(f.fail));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-14 max-w-xl text-left" noValidate>
      <p className="mb-4 text-center font-mono text-[13px] text-muted">{t(f.title)}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">{t(f.name)}</span>
          <input name="name" required maxLength={80} autoComplete="name" placeholder={t(f.name)} className={field} />
        </label>
        <label className="block">
          <span className="sr-only">{t(f.email)}</span>
          <input name="email" type="email" required maxLength={120} autoComplete="email" placeholder={t(f.email)} className={field} />
        </label>
      </div>
      <label className="mt-3 block">
        <span className="sr-only">{t(f.message)}</span>
        <textarea name="message" required minLength={10} maxLength={2000} rows={5} placeholder={t(f.message)} className={`${field} resize-y`} />
      </label>
      {/* Kolom jebakan bot, disembunyikan dari manusia dan pembaca layar */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-[34ch] text-[13px] text-muted">{t(f.note)}</p>
        <button type="submit" disabled={busy} className="rounded-full bg-accent-strong px-7 py-3 font-semibold text-on-accent transition-opacity hover:opacity-90 disabled:opacity-60">
          {busy ? t(f.sending) : t(f.send)}
        </button>
      </div>
    </form>
  );
}
