"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";

const SECTIONS = [
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "beyond", label: "Beyond" },
  { id: "contact", label: "Contact" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

/** Tracks which home-page section is under the header. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        // The first section (in page order) inside the band wins.
        const first = SECTIONS.find((s) => visible.get(s.id));
        setActive(first ? first.id : null);
      },
      // A band just under the sticky header.
      { rootMargin: "-80px 0px -55% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const activeSection = useActiveSection(onHome);
  const active: SectionId | null = onHome
    ? activeSection
    : pathname.startsWith("/work")
      ? "work"
      : null;

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const linkClass = (id: SectionId) =>
    `transition-colors ${
      active === id ? "text-pitch" : "text-ink-muted hover:text-ink"
    }`;

  return (
    <header
      className={`sticky top-0 z-30 transition-colors ${
        scrolled || menuOpen
          ? "bg-paper/85 backdrop-blur-md border-b border-line"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="font-display text-lg text-ink whitespace-nowrap"
          onClick={() => setMenuOpen(false)}
        >
          {site.name}
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          <nav aria-label="Sections" className="hidden sm:flex gap-6 text-sm">
            {SECTIONS.map((s) => (
              <Link
                key={s.id}
                href={`/#${s.id}`}
                className={linkClass(s.id)}
                aria-current={active === s.id ? "true" : undefined}
              >
                {s.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
          <button
            type="button"
            className="sm:hidden inline-flex size-9 items-center justify-center rounded-full text-ink hover:bg-paper-deep cursor-pointer"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
              {menuOpen ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Sections"
          className="sm:hidden border-t border-line px-6 pb-4"
        >
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/#${s.id}`}
                  className={`block py-3 text-base ${linkClass(s.id)}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
