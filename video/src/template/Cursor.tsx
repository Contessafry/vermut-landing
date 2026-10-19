import React from "react";

/** macOS-style arrow, drawn at 1.35× for legibility in a scaled-down video. */
export const CursorArrow: React.FC<{ readonly size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size * 1.5}
    viewBox="0 0 20 30"
    style={{ display: "block", filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.45))" }}
  >
    <path
      d="M1.5 1.5 L1.5 23.2 L6.6 18.4 L10.1 26.6 L13.9 25 L10.5 16.9 L17.6 16.9 Z"
      fill="#0A0A0B"
      stroke="#FFFFFF"
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
  </svg>
);
