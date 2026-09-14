"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminMenu = [
  {
    title: "Etkinlikler",
    href: "/admin/etkinlikler",
    icon: "📅",
  },
  {
    title: "Bilim İnsanları",
    href: "/admin/bilim-insanlari",
    icon: "👨‍🔬",
  },
  {
    title: "Podcast",
    href: "/admin/podcast",
    icon: "🎙️",
  },
  {
    title: "BIOLOGOS",
    href: "/admin/biologos",
    icon: "📖",
  },
  {
    title: "Doğa Fotoğrafçılığı",
    href: "/admin/doga-fotografciligi",
    icon: "🌿",
  },
  {
    title: "Haberler",
    href: "/admin/haberler",
    icon: "📰",
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f7f9f7]">

      {/* ADMIN ÜST MENÜ */}
      <header className="sticky top-0 z-50 border-b border-[#dce5df] bg-white/95 backdrop-blur-md">

        <div className="mx-auto max-w-7xl px-4 lg:px-6">

          {/* PANEL BAŞLIĞI */}
          <div className="flex h-16 items-center justify-between">

            <Link
              href="/admin"
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#163b2a] text-sm font-bold text-white">
                B
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-bold text-[#163b2a]">
                  Biyobilim
                </p>

                <p className="text-[10px] uppercase tracking-[0.15em] text-[#7a8781]">
                  Yönetim Paneli
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="rounded-full border border-[#d4e0d8] px-4 py-2 text-xs font-semibold text-[#315441] transition hover:border-[#2f80ed] hover:bg-[#eaf3ff] hover:text-[#287fea]"
            >
              Siteye Dön →
            </Link>

          </div>

          {/* YÖNETİM MENÜSÜ */}
          <nav className="flex gap-1 overflow-x-auto pb-2">

            {adminMenu.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-[#163b2a] text-white"
                      : "text-[#52645b] hover:bg-[#eaf3ff] hover:text-[#287fea]"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              );
            })}

          </nav>

        </div>
      </header>

      {/* SAYFA İÇERİĞİ */}
      <div>
        {children}
      </div>

    </div>
  );
}