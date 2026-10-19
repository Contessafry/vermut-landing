# Vermut "How it works" videos (Remotion)

Three short looping clips in a Screen Studio / Recordly style: a padded neutral
stage, the app window with rounded corners and a soft shadow, a smoothed cursor,
click ripples, and spring zooms into the clicked area. There is no OS clutter and no text in the frame,
because the copy lives on the page.

```
src/template/ScreenFlow.tsx  reusable composition (stage, window, camera, cursor, ripples, loop fade)
src/template/types.ts        data model: shots | recording, cursor keys, zooms (seconds, window px)
src/template/math.ts         eased cursor glide with arc, press curve, spring camera
src/steps/flows.ts           the three flows (data only)
src/Root.tsx                 compositions: Step1-PickAStore, Step2-SetsUpWine, Step3-Play
scripts/render-all.sh        MP4 + WebM + posters → ../public/videos, with a 2.5 MB budget check
public/shots/                real screenshots of Vermut 1.0.0 (1280×800 window, dark)
```

## Commands

```bash
npm install
npm run dev          # Remotion Studio preview
npm run render:all   # renders all three and copies them into the site (../public/videos)
```

Output: 1600×1000, 60 fps, 8–8.5 s seamless loops. H.264 (CRF 20, yuv420p,
faststart) and VP9 WebM (CRF 34). Each file is about 0.65–1.25 MB. Posters are frames with no zoom
(PNG master in `out/`, 1200 px WebP on the site).

## Re-recording after the app redesign (required before launch)

The current clips use screenshots of the pre-revision UI, which still shows items from the
23-point review: the Fortnite copy, "grapple-wine", the old Stores grid and the
CaskLauncher path. Re-capture once the revised app ships.

**Option A: screenshots (what the clips use today).**

1. Set the window to 1280×800 points, Dark appearance, with a clean demo state (stores installed,
   one or two games in the Library).
2. Capture each screen with only the window, no shadow: `screencapture -o -x -l <windowid> shot.png`.
   On a Retina display, downscale to 1280×800 (`sips -Z 1280 shot.png`) so the coordinates in `flows.ts` stay valid, or
   capture at 2× and set `windowSize` to 2560×1600 and double the coordinates.
3. Replace the files in `public/shots/`, re-check the click coordinates (window px from
   the top-left, title bar included), then run `npm run render:all`.

**Option B: a real recording (more natural motion).**

1. Record the window only, with the system cursor hidden: QuickTime or `screencapture -v -l <windowid>`,
   or Recordly/Screen Studio with its cursor turned off and no zoom.
2. Put the file in `public/` and pass `recording: "rec/step-1.mov"` instead of `shots`.
3. Add a `cursor` key for each real click (time in seconds, window px) so the template draws a
   clean cursor, ripple and zoom over it. Keep `loopFade` so the clip loops.

Recordly or Screen Studio can also export the final clip directly. If you use one, match this
spec: 1600×1000 (16:10), zinc 100→200 background, 7% padding, 12 px radius, soft shadow,
cursor scaled 1.35×, zoom 1.3–1.6×, 8 s loop, no audio. Then encode to the same budget.

Remotion licence: free for individuals and teams of up to 3 people (see remotion.pro/license).
