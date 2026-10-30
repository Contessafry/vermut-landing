import assert from "node:assert/strict";
import { test } from "node:test";
import {
  downloadHref,
  firstTouchLabel,
  isSafeGithubRedirect,
  parseChannel,
  referrerLabel,
  sanitizePath,
  sanitizeSource,
} from "./download-core.ts";

const repo = "https://github.com/Contessafry/Vermut";

test("parseChannel defaults unknown values to stable (never a free-form URL)", () => {
  assert.equal(parseChannel(null), "stable");
  assert.equal(parseChannel("stable"), "stable");
  assert.equal(parseChannel("releases"), "releases");
  assert.equal(parseChannel("https://evil.example/"), "stable");
  assert.equal(parseChannel("beta"), "stable");
});

test("downloadHref is a first-party path with channel and path only", () => {
  assert.equal(downloadHref("stable", "/it"), "/api/download?channel=stable&path=%2Fit");
  assert.equal(downloadHref("releases", "/"), "/api/download?channel=releases&path=%2F");
});

test("firstTouchLabel prefers UTMs, then gclid presence, then referrer host", () => {
  assert.equal(
    firstTouchLabel({ search: "?utm_source=reddit&utm_medium=social&utm_campaign=launch", referrer: "https://google.com/", pageHost: "vermut.app" }),
    "utm:reddit/social/launch",
  );
  assert.equal(
    firstTouchLabel({ search: "?gclid=abc123", referrer: "https://google.com/", pageHost: "vermut.app" }),
    "google-ads",
  );
  assert.equal(
    firstTouchLabel({ search: "", referrer: "https://old.reddit.com/r/macgaming", pageHost: "vermut.app" }),
    "reddit",
  );
  assert.equal(firstTouchLabel({ search: "", referrer: "", pageHost: "vermut.app" }), "direct");
});

test("gclid value is never part of the stored label", () => {
  const label = firstTouchLabel({ search: "?gclid=VERY-IDENTIFYING-TOKEN", referrer: "", pageHost: "vermut.app" });
  assert.equal(label, "google-ads");
  assert.equal(label.includes("VERY"), false);
});

test("referrerLabel maps hosts and treats same-site as direct", () => {
  assert.equal(referrerLabel("https://www.google.com/search?q=vermut", "vermut.app"), "google");
  assert.equal(referrerLabel("https://news.ycombinator.com/item?id=1", "vermut.app"), "hacker-news");
  assert.equal(referrerLabel("https://x.com/u", "vermut.app"), "x");
  assert.equal(referrerLabel("https://vermut.app/it", "vermut.app"), "direct");
  assert.equal(referrerLabel("https://www.example.net/path", "vermut.app"), "example.net");
  assert.equal(referrerLabel("not a url", "vermut.app"), "direct");
});

test("sanitizeSource and sanitizePath reject junk", () => {
  assert.equal(sanitizeSource(null), "unknown");
  assert.equal(sanitizeSource("utm:reddit/social"), "utm:reddit/social");
  assert.equal(sanitizeSource("javascript:alert(1)"), "unknown");
  assert.equal(sanitizePath("/it/guides"), "/it/guides");
  assert.equal(sanitizePath("/it/?x=1#y"), "/it");
  assert.equal(sanitizePath("https://evil.example/"), "other");
  assert.equal(sanitizePath("../../etc/passwd"), "other");
});

test("isSafeGithubRedirect only allows this repo on github.com", () => {
  assert.equal(isSafeGithubRedirect("https://github.com/Contessafry/Vermut/releases/latest", repo), true);
  assert.equal(
    isSafeGithubRedirect("https://github.com/Contessafry/Vermut/releases/download/v1.1.2/Vermut-1.1.2.dmg", repo),
    true,
  );
  assert.equal(isSafeGithubRedirect("https://github.com/evil/Vermut/releases/latest", repo), false);
  assert.equal(isSafeGithubRedirect("https://evil.example/?u=https://github.com/Contessafry/Vermut", repo), false);
  assert.equal(isSafeGithubRedirect("https://objects.githubusercontent.com/foo", repo), false);
  assert.equal(isSafeGithubRedirect("/api/download?url=https://github.com/Contessafry/Vermut", repo), false);
});
