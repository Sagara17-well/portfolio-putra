import type { L } from "@/data/content";
import { l } from "@/data/content";

/* ---------- Password ---------- */
const COMMON = [
  "password", "passw0rd", "123456", "12345678", "qwerty", "abc123", "letmein", "admin", "welcome", "iloveyou",
  "111111", "dragon", "monkey", "sandi", "rahasia", "indonesia", "bandung", "bismillah", "sayang", "master", "login",
];

export type PwResult = {
  bits: number;
  level: 0 | 1 | 2 | 3 | 4;
  seconds: number;
  checks: Record<"len" | "mix" | "num" | "sym" | "common" | "pattern", boolean>;
};

function hasSequence(s: string) {
  const low = s.toLowerCase();
  for (let i = 0; i + 2 < low.length; i++) {
    const a = low.charCodeAt(i), b = low.charCodeAt(i + 1), c = low.charCodeAt(i + 2);
    if ((b - a === 1 && c - b === 1) || (a - b === 1 && b - c === 1)) return true;
  }
  return false;
}

export function analyzePassword(pw: string): PwResult {
  const lower = /[a-z]/.test(pw), upper = /[A-Z]/.test(pw), num = /\d/.test(pw), sym = /[^A-Za-z0-9]/.test(pw);
  const pool = (lower ? 26 : 0) + (upper ? 26 : 0) + (num ? 10 : 0) + (sym ? 33 : 0);
  let bits = pw.length * Math.log2(Math.max(pool, 1));
  const common = COMMON.some((c) => pw.toLowerCase().includes(c));
  const repeat = /(.)\1{2,}/.test(pw);
  const seq = hasSequence(pw);
  if (common) bits = Math.min(bits, 22);
  if (repeat) bits *= 0.75;
  if (seq) bits *= 0.8;
  bits = Math.max(0, bits);
  // Asumsi: 10 miliar tebakan per detik (serangan offline ke hash cepat), rata-rata separuh ruang pencarian.
  const seconds = Math.pow(2, bits) / 2 / 1e10;
  const level = bits < 28 ? 0 : bits < 40 ? 1 : bits < 60 ? 2 : bits < 80 ? 3 : 4;
  return {
    bits, level: level as PwResult["level"], seconds,
    checks: { len: pw.length >= 12, mix: lower && upper, num, sym, common: !common, pattern: !repeat && !seq },
  };
}

export function formatDuration(sec: number, lang: "id" | "en"): string {
  const T = lang === "id"
    ? { now: "seketika", s: "detik", m: "menit", h: "jam", d: "hari", y: "tahun", ky: "ribu tahun", my: "juta tahun", by: "miliar tahun", more: "lebih dari miliaran tahun" }
    : { now: "instantly", s: "seconds", m: "minutes", h: "hours", d: "days", y: "years", ky: "thousand years", my: "million years", by: "billion years", more: "more than billions of years" };
  if (sec < 1) return T.now;
  const n = (x: number) => (x >= 100 ? Math.round(x).toLocaleString(lang) : (Math.round(x * 10) / 10).toLocaleString(lang));
  if (sec < 60) return `${n(sec)} ${T.s}`;
  if (sec < 3600) return `${n(sec / 60)} ${T.m}`;
  if (sec < 86400) return `${n(sec / 3600)} ${T.h}`;
  if (sec < 86400 * 365) return `${n(sec / 86400)} ${T.d}`;
  const y = sec / (86400 * 365);
  if (y < 1000) return `${n(y)} ${T.y}`;
  if (y < 1e6) return `${n(y / 1e3)} ${T.ky}`;
  if (y < 1e9) return `${n(y / 1e6)} ${T.my}`;
  if (y < 1e12) return `${n(y / 1e9)} ${T.by}`;
  return T.more;
}

/* ---------- Hash ---------- */
export const ALGOS = ["SHA-256", "SHA-1", "SHA-384", "SHA-512"] as const;
export type Algo = (typeof ALGOS)[number];

export async function digest(algo: Algo, text: string): Promise<string> {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Balik satu bit terendah pada karakter terakhir. */
export function flipLastBit(text: string) {
  if (!text) return text;
  const chars = Array.from(text);
  const last = chars.pop() as string;
  const cp = last.codePointAt(0) as number;
  return chars.join("") + String.fromCodePoint(cp ^ 1);
}

export function bitDiff(a: string, b: string) {
  let n = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    let x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    while (x) { n += x & 1; x >>= 1; }
  }
  return n;
}

/* ---------- Header HTTP ---------- */
export type Status = "pass" | "warn" | "fail" | "info";
export type Check = { id: string; name: string; status: Status; detail: L };

export function parseHeaders(raw: string) {
  const map = new Map<string, string[]>();
  raw.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Za-z0-9!#$%&'*+.^_`|~-]+)\s*:\s*(.*)$/);
    if (!m) return;
    const k = m[1].toLowerCase();
    map.set(k, [...(map.get(k) ?? []), m[2].trim()]);
  });
  return map;
}

export function analyzeHeaders(raw: string): { checks: Check[]; score: number; grade: string } | null {
  const h = parseHeaders(raw);
  if (h.size === 0) return null;
  const get = (k: string) => h.get(k)?.join(", ");
  const csp = get("content-security-policy");
  const checks: Check[] = [];
  const add = (id: string, name: string, status: Status, id_: string, en: string) =>
    checks.push({ id, name, status, detail: l(id_, en) });

  // CSP
  if (!csp) add("csp", "Content-Security-Policy", "fail", "Tidak ada. CSP adalah lapisan terkuat melawan XSS.", "Missing. CSP is the strongest layer against XSS.");
  else if (/'unsafe-eval'/.test(csp)) add("csp", "Content-Security-Policy", "warn", "Ada, tetapi memakai 'unsafe-eval' yang melemahkan perlindungan.", "Present, but uses 'unsafe-eval' which weakens protection.");
  else if (/script-src[^;]*'unsafe-inline'/.test(csp) && !/nonce-|sha256-/.test(csp)) add("csp", "Content-Security-Policy", "warn", "Ada, tetapi script-src mengizinkan 'unsafe-inline' tanpa nonce atau hash.", "Present, but script-src allows 'unsafe-inline' without a nonce or hash.");
  else if (!/default-src|script-src/.test(csp)) add("csp", "Content-Security-Policy", "warn", "Ada, tetapi tidak menetapkan default-src atau script-src.", "Present, but sets neither default-src nor script-src.");
  else add("csp", "Content-Security-Policy", "pass", "Ada dan membatasi sumber skrip.", "Present and restricts script sources.");

  // HSTS
  const hsts = get("strict-transport-security");
  if (!hsts) add("hsts", "Strict-Transport-Security", "fail", "Tidak ada. Browser bisa jatuh ke HTTP yang tidak terenkripsi.", "Missing. Browsers can fall back to unencrypted HTTP.");
  else {
    const age = Number(hsts.match(/max-age=(\d+)/i)?.[1] ?? 0);
    if (age >= 15552000) add("hsts", "Strict-Transport-Security", "pass", `max-age ${age} detik, cukup panjang.`, `max-age ${age} seconds, long enough.`);
    else add("hsts", "Strict-Transport-Security", "warn", "max-age terlalu pendek. Disarankan minimal 6 bulan (15552000).", "max-age is too short. At least 6 months (15552000) is recommended.");
  }

  // nosniff
  const xcto = get("x-content-type-options");
  if (xcto && /nosniff/i.test(xcto)) add("xcto", "X-Content-Type-Options", "pass", "nosniff aktif.", "nosniff is set.");
  else add("xcto", "X-Content-Type-Options", "fail", "Tidak ada nosniff. Browser bisa menebak tipe berkas dan menjalankan yang salah.", "No nosniff. Browsers may guess file types and run the wrong thing.");

  // Framing
  const xfo = get("x-frame-options");
  if ((xfo && /deny|sameorigin/i.test(xfo)) || (csp && /frame-ancestors/.test(csp))) add("frame", "X-Frame-Options / frame-ancestors", "pass", "Perlindungan clickjacking aktif.", "Clickjacking protection is on.");
  else add("frame", "X-Frame-Options / frame-ancestors", "fail", "Halaman bisa dibingkai situs lain (risiko clickjacking).", "The page can be framed by other sites (clickjacking risk).");

  // Referrer
  const rp = get("referrer-policy");
  if (!rp) add("ref", "Referrer-Policy", "warn", "Tidak ada. URL lengkap bisa bocor ke situs lain.", "Missing. Full URLs may leak to other sites.");
  else if (/unsafe-url|no-referrer-when-downgrade/i.test(rp)) add("ref", "Referrer-Policy", "warn", "Nilainya terlalu longgar.", "The value is too permissive.");
  else add("ref", "Referrer-Policy", "pass", "Kebijakan referrer yang ketat.", "A strict referrer policy.");

  // Permissions-Policy
  if (get("permissions-policy")) add("perm", "Permissions-Policy", "pass", "Fitur browser dibatasi.", "Browser features are restricted.");
  else add("perm", "Permissions-Policy", "warn", "Tidak ada. Kamera, mikrofon, dan lokasi tidak dibatasi eksplisit.", "Missing. Camera, microphone and location aren't explicitly restricted.");

  // COOP
  if (get("cross-origin-opener-policy")) add("coop", "Cross-Origin-Opener-Policy", "pass", "Isolasi jendela lintas asal aktif.", "Cross-origin window isolation is on.");
  else add("coop", "Cross-Origin-Opener-Policy", "warn", "Tidak ada. Berguna untuk mengisolasi jendela dari situs lain.", "Missing. Useful for isolating the window from other sites.");

  // Kebocoran info
  const server = get("server"), pb = get("x-powered-by");
  if (pb || (server && /\d/.test(server))) add("leak", "Server / X-Powered-By", "warn", `Membocorkan teknologi${pb ? `: ${pb}` : server ? `: ${server}` : ""}. Sembunyikan versi.`, `Leaks technology${pb ? `: ${pb}` : server ? `: ${server}` : ""}. Hide the version.`);
  else add("leak", "Server / X-Powered-By", "pass", "Tidak membocorkan versi perangkat lunak.", "Doesn't leak software versions.");

  // Cookie
  const cookies = h.get("set-cookie");
  if (cookies?.length) {
    const lacking = new Set<string>();
    cookies.forEach((c) => {
      if (!/;\s*secure/i.test(c)) lacking.add("Secure");
      if (!/;\s*httponly/i.test(c)) lacking.add("HttpOnly");
      if (!/;\s*samesite=/i.test(c)) lacking.add("SameSite");
    });
    if (lacking.size) add("cookie", "Set-Cookie", lacking.has("Secure") || lacking.has("HttpOnly") ? "fail" : "warn", `Atribut belum ada: ${[...lacking].join(", ")}.`, `Missing attributes: ${[...lacking].join(", ")}.`);
    else add("cookie", "Set-Cookie", "pass", "Cookie memakai Secure, HttpOnly, dan SameSite.", "Cookies use Secure, HttpOnly and SameSite.");
  } else add("cookie", "Set-Cookie", "info", "Tidak ada cookie pada respons ini.", "No cookies on this response.");

  const counted = checks.filter((c) => c.status !== "info");
  const pts = counted.reduce((n, c) => n + (c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0), 0);
  const score = Math.round((pts / counted.length) * 100);
  const grade = score >= 95 ? "A+" : score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : score >= 40 ? "D" : "F";
  return { checks, score, grade };
}

export const SAMPLE_GOOD = `HTTP/2 200
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
strict-transport-security: max-age=63072000; includeSubDomains; preload
x-content-type-options: nosniff
x-frame-options: DENY
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
cross-origin-opener-policy: same-origin`;

export const SAMPLE_BAD = `HTTP/1.1 200 OK
Server: Apache/2.4.41 (Ubuntu)
X-Powered-By: PHP/7.4.3
Content-Type: text/html; charset=UTF-8
Set-Cookie: PHPSESSID=abc123; path=/`;
