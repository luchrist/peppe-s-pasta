"use client";

import { useEffect, useState } from "react";
import config from "@/config/restaurant.json";

const links = [
  { href: "#storia", label: "Storia" },
  { href: "#menu", label: "Carta" },
  { href: "/bestellen", label: "Bestellen" },
  { href: "/reservierung", label: "Besuch" }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-bone/80 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className={`absolute inset-x-0 bottom-0 h-px bg-ink/10 transition-opacity ${scrolled ? "opacity-100" : "opacity-0"}`} />
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-[2px] md:px-10">
          <a href="#" className="group flex items-center gap-3">
            <img
              src="/assets/logo-mark.png"
              alt={`${config.name} Logo`}
              className="h-20 w-20 object-contain md:h-28 md:w-28"
            />
            <span className="font-display text-[22px] tracking-tight text-ink md:text-[28px]">
              {config.name}
            </span>
          </a>

          <div className="hidden items-center gap-10 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative font-mono text-[11px] uppercase tracking-[0.22em] text-ink/65 transition-colors hover:text-ink"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-rosso-600 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop: Bestellen button */}
          <a
            href="/bestellen"
            className="group relative hidden items-center gap-3 overflow-hidden rounded-full border border-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-transform active:scale-[0.98] md:inline-flex"
          >
            <span className="relative z-10 transition-colors group-hover:text-bone">
              Bestellen
            </span>
            <span className="relative z-10 transition-colors group-hover:text-bone">→</span>
            <span className="absolute inset-0 -z-0 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
          </a>

          {/* Mobile: Burger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-[60] flex h-10 w-10 items-center justify-center md:hidden"
            aria-label="Menu"
          >
            <div className="flex w-5 flex-col gap-[5px]">
              <span
                className={`block h-px w-full bg-ink transition-all duration-300 ${
                  menuOpen ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-full bg-ink transition-all duration-300 ${
                  menuOpen ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-bone transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-3xl tracking-tight text-ink transition-colors hover:text-rosso-600"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/bestellen"
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-flex items-center gap-3 rounded-full border border-ink px-8 py-3 font-mono text-[12px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-bone"
          >
            Bestellen →
          </a>
        </div>
      </div>
    </>
  );
}
