// Pemicu toast sederhana: komponen <Toast /> mendengarkan event ini.
export function toast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("app:toast", { detail: message }));
}

export function openPalette() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("app:palette"));
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
