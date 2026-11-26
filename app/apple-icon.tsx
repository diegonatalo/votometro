import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#111318" }}>
        <svg width="180" height="180" viewBox="0 0 100 100">
          <path d="M29 43 L50 20" fill="none" stroke="#ff7a5e" strokeWidth="11" strokeLinecap="round" />
          <path d="M50 20 L71 43" fill="none" stroke="#7fa3ff" strokeWidth="11" strokeLinecap="round" />
          <circle cx="50" cy="65" r="17" fill="none" stroke="#f6f5f1" strokeWidth="12" />
        </svg>
      </div>
    ),
    size,
  );
}
