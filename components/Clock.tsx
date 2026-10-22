"use client";
import { useEffect, useState } from "react";

// Jam zona Asia/Jakarta (WIB). Baru tampil setelah halaman siap agar tidak beda dengan server.
export default function Clock({ place }: { place: string }) {
  const [now, setNow] = useState("--:--:--");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const tick = () => setNow(f.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="mt-8 font-mono text-sm text-muted">
      <span className="tabular-nums text-ink">{now}</span> WIB <span className="mx-1 text-line">/</span> {place}
    </p>
  );
}
