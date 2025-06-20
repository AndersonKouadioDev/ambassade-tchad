"use client";
import { useEffect } from "react";

export default function InertFixWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const fixEmptyInert = () => {
      document.querySelectorAll('[inert=""]').forEach((el) => {
        el.removeAttribute("inert");
      });
    };
    fixEmptyInert();
    const observer = new MutationObserver(fixEmptyInert);
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["inert"],
    });
    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
