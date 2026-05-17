"use client";

import Link from "next/link";
import { useState, useEffect, type MouseEvent } from "react";
import { navigation } from "@/content/navigation";

const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
];

function resumeClick(e: MouseEvent<HTMLAnchorElement>) {
  if (navigation.resumeHref === "#") {
    e.preventDefault();
  }
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const handler = () => {
      const y = window.scrollY;
      setHidden(y > lastY && y > 52);
      lastY = y;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
      <header className={`sticky top-0 z-50 h-[52px] bg-canvas/80 backdrop-blur-xl backdrop-saturate-150 border-b border-black/8 flex items-center transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      <nav className="w-full max-w-[1440px] mx-auto px-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-[21px] font-semibold leading-[1.19] tracking-[0.231px] text-ink"
        >
          Jalil Evans
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="text-link text-[14px] font-normal tracking-[-0.224px] text-ink hover:text-primary transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={navigation.resumeHref}
              onClick={resumeClick}
              className="text-link text-[14px] font-normal tracking-[-0.224px] text-ink hover:text-primary transition-colors"
            >
              Resume
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="text-[14px] font-normal tracking-[-0.224px] border border-primary text-primary rounded-full px-[18px] py-[8px] hover:bg-primary/5 transition-colors active:scale-95 inline-block"
            >
              Get in touch
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 text-ink"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-[1.5px] bg-ink transition-transform origin-center ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-ink transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-ink transition-transform origin-center ${menuOpen ? "-rotate-45 translate-y-[-6.5px]" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="absolute top-[52px] left-0 right-0 bg-canvas-parchment/95 backdrop-blur-xl border-b border-black/8 md:hidden">
          <ul className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-link block py-3 text-[17px] font-normal tracking-[-0.374px] text-ink border-b border-hairline last:border-0"
                >
                  {label}
                </a>
              </li>
            ))}
            <li key="resume">
              <a
                href={navigation.resumeHref}
                onClick={(e) => {
                  resumeClick(e);
                  setMenuOpen(false);
                }}
                className="text-link block py-3 text-[17px] font-normal tracking-[-0.374px] text-ink border-b border-hairline"
              >
                Resume
              </a>
            </li>
            <li className="pt-3">
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="inline-block bg-primary text-white rounded-full px-[22px] py-[11px] text-[17px] active:scale-95"
              >
                Get in Touch
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
