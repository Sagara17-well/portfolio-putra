import { NextResponse } from "next/server";

// Meneruskan pesan dari form kontak ke email lewat Formspree.
export const runtime = "nodejs";

const hits = new Map<string, number[]>();
const WINDOW = 10 * 60_000;
const LIMIT = 4;

function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 500) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW)) hits.delete(k);
  return list.length > LIMIT;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "");

export async function POST(req: Request) {
  // 
  const endpoint = "https://formspree.io/f/xnpjkdjz";

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(ip)) return NextResponse.json({ ok: false, reason: "rate" }, { status: 429 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, reason: "bad" }, { status: 400 }); }

  
  if (clean(body.website, 50)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 80);
  const email = clean(body.email, 120);
  const message = clean(body.message, 2000);
  if (name.length < 1 || message.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, email, message, _subject: `Pesan portofolio dari ${name}` }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return NextResponse.json({ ok: false, reason: "upstream" }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, reason: "upstream" }, { status: 502 });
  }
}