"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkında", href: "/hakkinda" },
  { label: "Haberler", href: "/haberler" },
  { label: "BIOLOGOS", href: "/biologos" },
  { label: "Podcast", href: "/podcast" },
  { label: "Bilim İnsanları", href: "/bilim-insanlari" },
  { label: "Doğa Fotoğrafçılığı", href: "/doga-fotografciligi" },
  { label: "Etkinlikler", href: "/etkinlikler" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071a14]/90 shadow-lg backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">

        {/* LOGO + BİYOBİLİM */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 text-xl font-bold tracking-tight text-white transition hover:text-[#8ec5ff]"
        >
          <img
            src="/logo.png"
            alt="Biyobilim"
            className="h-[52px] w-[52px] shrink-0 rounded-full object-contain"
          />

          <span>Biyobilim</span>
        </Link>

        {/* MASAÜSTÜ MENÜ */}
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as any}
              className="rounded-full px-3 py-2 text-sm font-medium text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-[#8ec5ff]"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/uye-ol"
            className="ml-2 rounded-full bg-[#2f6f4e] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#24583e] hover:shadow-md"
          >
            Üye Ol
          </Link>
        </div>

        {/* MOBİL HAMBURGER */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white lg:hidden"
          aria-label="Menüyü aç"
        >
          <span className="text-xl">
            {mobileOpen ? "×" : "☰"}
          </span>
        </button>
      </nav>

      {/* MOBİL MENÜ */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#071a14] px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href as any}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-[#8ec5ff]"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/uye-ol"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-lg bg-[#2f6f4e] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#24583e]"
            >
              Üye Ol
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}