"use client";

import { useEffect } from "react";
import { firstTouchLabel, STORAGE_KEY } from "@/lib/download-core";

function capture(): string {
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
  } catch {
    // sessionStorage can throw (privacy mode); still compute a label for this page.
  }
  const label = firstTouchLabel({
    search: window.location.search,
    referrer: document.referrer,
    pageHost: window.location.hostname,
  });
  try {
    sessionStorage.setItem(STORAGE_KEY, label);
  } catch {
    // Keep the in-memory label for this document only.
  }
  return label;
}

function decorate(anchor: HTMLAnchorElement, source: string) {
  const href = anchor.getAttribute("href");
  if (!href) return;
  let url: URL;
  try {
    url = new URL(href, window.location.origin);
  } catch {
    return;
  }
  if (url.pathname !== "/api/download") return;
  url.searchParams.set("src", source);
  if (!url.searchParams.get("path")) {
    url.searchParams.set("path", window.location.pathname || "/");
  }
  anchor.setAttribute("href", `${url.pathname}?${url.searchParams.toString()}`);
}

function decorateAll(source: string) {
  for (const node of document.querySelectorAll('a[href^="/api/download"]')) {
    if (node instanceof HTMLAnchorElement) decorate(node, source);
  }
}

/**
 * First-touch campaign capture (sessionStorage) and src= decoration on counted
 * download links. Renders nothing. Links still work without JS: they already
 * point at /api/download and the route redirects without `src`.
 */
export function Attribution() {
  useEffect(() => {
    const source = capture();
    decorateAll(source);
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href^="/api/download"]');
      if (anchor instanceof HTMLAnchorElement) decorate(anchor, capture());
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
