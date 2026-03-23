"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const INITIAL_PROGRESS = 8;
const MAX_PROGRESS_BEFORE_COMPLETE = 90;

export function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const startedRef = useRef(false);
  const trickleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (trickleTimerRef.current) {
      clearInterval(trickleTimerRef.current);
      trickleTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (visible) return;
    clearTimers();
    setVisible(true);
    setProgress(INITIAL_PROGRESS);

    trickleTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= MAX_PROGRESS_BEFORE_COMPLETE) return prev;
        const remaining = MAX_PROGRESS_BEFORE_COMPLETE - prev;
        const bump = remaining * (Math.random() * 0.18 + 0.04);
        return Math.min(MAX_PROGRESS_BEFORE_COMPLETE, prev + bump);
      });
    }, 180);
  }, [clearTimers, visible]);

  const complete = useCallback(() => {
    if (!visible) return;
    clearTimers();
    setProgress(100);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 220);
  }, [clearTimers, visible]);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      if (anchor.target === "_blank") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      if (nextUrl.origin !== currentUrl.origin) return;
      if (nextUrl.pathname === currentUrl.pathname && nextUrl.search === currentUrl.search) return;

      start();
    }

    function handlePopState() {
      start();
    }

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [start]);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      return;
    }
    const timer = window.setTimeout(() => {
      complete();
    }, 0);
    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname, search, complete]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[100] h-0.5 w-full transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 shadow-[0_0_10px_rgba(124,58,237,0.55)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
