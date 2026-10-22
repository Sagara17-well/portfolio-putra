import { ImageResponse } from "next/og";
import { profile } from "@/data/content";

export const alt = "Putra Baadi Zaelani, Web Developer & Cybersecurity";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0a0e1a", color: "#eaf0fb", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", border: "3px solid #7c6cff", borderRadius: 999, padding: "6px 24px", fontSize: 30, color: "#4fd8b0" }}>PBZ_</div>
          <div style={{ display: "flex", fontSize: 28, color: "#93a0bd" }}>{profile.city}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 112, fontWeight: 700, lineHeight: 1, letterSpacing: -4 }}>
          <div style={{ display: "flex" }}>{profile.name[0]}</div>
          <div style={{ display: "flex", color: "#7c6cff" }}>{profile.name[1]}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "2px solid #222c47", paddingTop: 28, fontSize: 34 }}>
          <div style={{ display: "flex", whiteSpace: "nowrap" }}>Web Developer &amp; Cybersecurity</div>
          <div style={{ display: "flex", color: "#93a0bd", fontSize: 28 }}>Mahasiswa UTB</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
