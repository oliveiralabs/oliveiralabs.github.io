"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/" && pathname !== "/pt") return;
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const frame = window.requestAnimationFrame(() => window.scrollTo(0, 0));

    return () => {
      window.cancelAnimationFrame(frame);
      window.history.scrollRestoration = previousRestoration;
    };
  }, [pathname]);

  return null;
}
