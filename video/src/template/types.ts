/**
 * ScreenFlow template — a Recordly / Screen Studio–style "app demo" clip.
 *
 * Everything is described in WINDOW coordinates: pixels of the source
 * screenshot / recording (1280×800 for the current captures). The template
 * places the window on a padded neutral stage, draws a smoothed cursor,
 * click ripples and spring zooms, and crossfades between screens.
 *
 * Times are in SECONDS so the same flow renders at 30 or 60 fps.
 */

export type Point = { readonly x: number; readonly y: number };

/** One static screen (a real screenshot). Shown from `at` until the next shot. */
export type Shot = {
  readonly src: string; // file in public/, passed through staticFile()
  readonly at: number; // seconds
};

/** A cursor waypoint. The cursor glides between waypoints with ease-in-out. */
export type CursorKey = Point & {
  readonly at: number; // seconds: cursor ARRIVES here at this time
  readonly click?: boolean; // ripple + press at arrival
};

/** A camera zoom: eases in at `from`, holds, eases out at `to`. */
export type Zoom = Point & {
  readonly from: number;
  readonly to: number;
  readonly scale: number; // 1.4–2.0 reads best
};

export type ScreenFlowProps = {
  /** Real screenshots, in order. Ignored if `recording` is set. */
  readonly shots: readonly Shot[];
  /**
   * Optional: a real macOS window recording (MP4/MOV in public/) used instead
   * of `shots`. Record the WINDOW only (no desktop), cursor hidden, and
   * describe the clicks in `cursor` so the template redraws a clean cursor.
   */
  readonly recording?: string;
  readonly cursor: readonly CursorKey[];
  readonly zooms: readonly Zoom[];
  /** Source window size in px (screenshot size at 1x). */
  readonly windowSize: { readonly width: number; readonly height: number };
  /** Crossfade the last N seconds back to the first frame for a seamless loop. */
  readonly loopFade: number;
  /** Stage background (brand-neutral). */
  readonly background: string;
  /** Window corner radius in window px (macOS Tahoe ≈ 12–16). */
  readonly radius: number;
};
