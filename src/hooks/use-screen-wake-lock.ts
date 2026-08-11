import { useEffect, useRef } from "react";

export function useScreenWakeLock(enabled = true) {
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled || !("wakeLock" in navigator)) return;

    let cancelled = false;

    const requestWakeLock = async () => {
      if (
        cancelled ||
        document.visibilityState !== "visible" ||
        (wakeLock.current && !wakeLock.current.released)
      )
        return;

      try {
        const sentinel = await navigator.wakeLock.request("screen");
        if (cancelled || document.visibilityState !== "visible") {
          await sentinel.release();
          return;
        }
        wakeLock.current = sentinel;
        sentinel.addEventListener(
          "release",
          () => {
            if (wakeLock.current === sentinel) wakeLock.current = null;
          },
          { once: true },
        );
      } catch {
        // Wake lock is best-effort and may be denied by the browser or OS.
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void requestWakeLock();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    void requestWakeLock();

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      const sentinel = wakeLock.current;
      wakeLock.current = null;
      void sentinel?.release();
    };
  }, [enabled]);
}
