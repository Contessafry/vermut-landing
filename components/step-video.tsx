"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type Props = {
  mp4: string;
  webm: string;
  poster: string;
  width: number;
  height: number;
  label: string;
  descriptionId: string;
};

/**
 * The only client component on the page.
 * - Loads nothing until the clip is near the viewport (preload="none").
 * - Autoplays muted + inline while ≥40% visible, pauses when off-screen.
 * - prefers-reduced-motion: never autoplays; shows the poster and a Play button.
 * - Always offers a visible Pause/Play control (WCAG 2.2.2).
 */
export function StepVideo({ mp4, webm, poster, width, height, label, descriptionId }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);
  const reduced = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const onMq = () => {
      reduced.current = mq.matches;
      if (mq.matches) video.pause();
    };
    mq.addEventListener("change", onMq);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduced.current && !userPaused.current) {
          video.play().catch(() => {});
        } else if (!entry.isIntersecting) {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(video);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", onMq);
    };
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  return (
    <div className="relative">
      <video
        ref={ref}
        className="block h-auto w-full bg-neutral-200"
        width={width}
        height={height}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-label={label}
        aria-describedby={descriptionId}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={!playing}
        aria-label={playing ? `Pause: ${label}` : `Play: ${label}`}
        className="absolute top-2 right-2 inline-flex size-9 items-center justify-center rounded-full bg-neutral-950/70 text-white shadow-sm transition-colors hover:bg-neutral-950 focus-visible:outline-offset-2 md:top-3 md:right-3"
      >
        {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4 translate-x-px" aria-hidden="true" />}
      </button>
    </div>
  );
}
