"use client";

import { useCallback } from "react";

/** Melacak klik CTA pada varian landing page untuk perhitungan konversi A/B. */
export function AbTracker({ slug }: { slug: string }) {
  const track = useCallback(
    (type: "click" | "conversion") => {
      void fetch("/api/ab/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, type }),
        keepalive: true,
      });
    },
    [slug],
  );

  return (
    <div
      className="contents"
      onClick={() => track("click")}
      onFocus={() => track("click")}
    />
  );
}
