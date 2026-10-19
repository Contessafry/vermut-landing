import { Easing, interpolate } from "remotion";
import type { CursorKey, Point, Zoom } from "./types";

const glide = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Cursor position at time t (seconds): eased glide with a slight arc. */
export const cursorAt = (keys: readonly CursorKey[], t: number): Point => {
  if (keys.length === 0) return { x: 0, y: 0 };
  if (t <= keys[0].at) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (t <= b.at) {
      // Start moving after a short dwell so clicks read as deliberate.
      const dwell = Math.min(0.25, (b.at - a.at) * 0.2);
      const p = interpolate(t, [a.at + dwell, b.at], [0, 1], { ...clamp, easing: glide });
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const arc = Math.sin(Math.PI * p) * Math.min(40, Math.hypot(dx, dy) * 0.08);
      const len = Math.hypot(dx, dy) || 1;
      return {
        x: a.x + dx * p + (-dy / len) * arc,
        y: a.y + dy * p + (dx / len) * arc,
      };
    }
  }
  return keys[keys.length - 1];
};

/** 0..1 press amount around each click (quick dip and release). */
export const pressAt = (keys: readonly CursorKey[], t: number): number => {
  let v = 0;
  for (const k of keys) {
    if (!k.click) continue;
    v = Math.max(
      v,
      interpolate(t, [k.at, k.at + 0.08, k.at + 0.28], [0, 1, 0], clamp),
    );
  }
  return v;
};

/** Camera scale and focus at time t. Spring in, spring out. */
export const cameraAt = (
  zooms: readonly Zoom[],
  t: number,
  fps: number,
): { scale: number; focus: Point; amount: number } => {
  const spring = Easing.spring({ damping: 200, mass: 1.1, stiffness: 90 });
  for (const z of zooms) {
    const inDur = 0.9;
    const outDur = 0.9;
    if (t >= z.from - 0.001 && t <= z.to + outDur) {
      const p =
        t < z.to
          ? interpolate(t, [z.from, z.from + inDur], [0, 1], { ...clamp, easing: spring })
          : interpolate(t, [z.to, z.to + outDur], [1, 0], { ...clamp, easing: spring });
      void fps;
      return { scale: 1 + (z.scale - 1) * p, focus: z, amount: p };
    }
  }
  return { scale: 1, focus: { x: 0, y: 0 }, amount: 0 };
};
