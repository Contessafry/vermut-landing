import React from "react";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CursorArrow } from "./Cursor";
import { cameraAt, cursorAt, pressAt } from "./math";
import type { ScreenFlowProps } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/**
 * Reusable Recordly-style composition. See ./types.ts for the data model and
 * ../steps/*.ts for three concrete flows.
 */
export const ScreenFlow: React.FC<ScreenFlowProps> = ({
  shots,
  recording,
  cursor,
  zooms,
  windowSize,
  loopFade,
  background,
  radius,
}) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;

  // Window placement: fit inside the stage with generous padding (7% each side).
  const ws = Math.min((W * 0.86) / windowSize.width, (H * 0.86) / windowSize.height);
  const winW = windowSize.width * ws;
  const winH = windowSize.height * ws;
  const winX = (W - winW) / 2;
  const winY = (H - winH) / 2;

  // Camera
  const cam = cameraAt(zooms, t, fps);
  const s = cam.scale;
  const fx = winX + cam.focus.x * ws;
  const fy = winY + cam.focus.y * ws;
  const solve = (f: number, c: number, start: number, size: number, frameSize: number) => {
    const raw = lerp(f, c, cam.amount) - f * s;
    const min = frameSize - (start + size) * s; // right/bottom edge stays outside
    const max = -start * s; // left/top edge stays outside
    const clamped = min <= max ? Math.min(max, Math.max(min, raw)) : raw;
    return lerp(raw, clamped, cam.amount);
  };
  const tx = cam.amount > 0 ? solve(fx, W / 2, winX, winW, W) : 0;
  const ty = cam.amount > 0 ? solve(fy, H / 2, winY, winH, H) : 0;

  // Cursor
  const pos = cursorAt(cursor, t);
  const press = pressAt(cursor, t);
  const cursorSize = 28;

  const loopP = loopFade > 0
    ? interpolate(t, [total - loopFade, total], [0, 1], { ...clamp, easing: Easing.bezier(0.33, 0, 0.67, 1) })
    : 0;

  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transformOrigin: "0 0",
          translate: `${tx}px ${ty}px`,
          scale: String(s),
        }}
      >
        {/* Window */}
        <div
          style={{
            position: "absolute",
            left: winX,
            top: winY,
            width: winW,
            height: winH,
            borderRadius: radius * ws,
            overflow: "hidden",
            boxShadow:
              "0 50px 100px -20px rgba(9,9,11,0.45), 0 30px 60px -30px rgba(9,9,11,0.5), 0 0 0 1px rgba(9,9,11,0.18)",
            background: "#0A0A0B",
          }}
        >
          {recording ? (
            <Video src={staticFile(recording)} muted style={{ width: "100%", height: "100%" }} />
          ) : (
            shots.map((shot, i) => (
              <Img
                key={shot.src + i}
                src={staticFile(shot.src)}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity:
                    i === 0
                      ? 1
                      : interpolate(t, [shot.at, shot.at + 0.22], [0, 1], clamp),
                }}
              />
            ))
          )}
          {!recording && loopP > 0 ? (
            <Img
              src={staticFile(shots[0].src)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: loopP }}
            />
          ) : null}
        </div>

        {/* Click ripples (window coords → stage) */}
        {cursor
          .filter((k) => k.click)
          .map((k, i) => {
            const p = interpolate(t, [k.at, k.at + 0.55], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
            if (t < k.at || p >= 1) return null;
            const r = lerp(8, 36, p) * ws;
            return (
              <div
                key={`ripple-${i}`}
                style={{
                  position: "absolute",
                  left: winX + k.x * ws - r,
                  top: winY + k.y * ws - r,
                  width: r * 2,
                  height: r * 2,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.22)",
                  border: `${2 * ws}px solid rgba(255,255,255,0.75)`,
                  opacity: 1 - p,
                }}
              />
            );
          })}

        {/* Cursor: tip sits exactly on the point */}
        <div
          style={{
            position: "absolute",
            left: winX + pos.x * ws - 1.5 * (cursorSize / 20),
            top: winY + pos.y * ws - 1.5 * (cursorSize / 20),
            transformOrigin: "2px 2px",
            scale: String(1 - press * 0.14),
          }}
        >
          <CursorArrow size={cursorSize} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
