"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const adminSections = [
  {
    title: "Etkinlikler",
    description:
      "Etkinlikleri ekle, düzenle ve yaklaşan veya geçmiş etkinlikleri yönet.",
    href: "/admin/etkinlikler",
    icon: "📅",
    table: "events",
  },
  {
    title: "Bilim İnsanları",
    description:
      "Bilim insanlarını, çalışma alanlarını, biyografilerini ve fotoğraflarını yönet.",
    href: "/admin/bilim-insanlari",
    icon: "👨‍🔬",
    table: "scientists",
  },
  {
    title: "Podcast",
    description:
      "Podcast bölümlerini, açıklamalarını ve ses kayıtlarını yönet.",
    href: "/admin/podcast",
    icon: "🎙️",
    table: "podcasts",
  },
  {
    title: "BIOLOGOS",
    description:
      "Dergi sayılarını, kapaklarını, PDF dosyalarını ve yayın bilgilerini yönet.",
    href: "/admin/biologos",
    icon: "📖",
    table: "biologos",
  },
  {
    title: "Doğa Fotoğrafçılığı",
    description:
      "Doğa fotoğraflarını ve galeri içeriklerini yönet.",
    href: "/admin/doga-fotografciligi",
    icon: "🌿",
    table: "nature_photos",
  },
  {
    title: "Haberler",
    description:
      "Bilimsel haberleri ve Biyobilim duyurularını yönet.",
    href: "/admin/haberler",
    icon: "📰",
    table: "news",
  },
];

type Counts = Record<string, number>;

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();

  const [counts, setCounts] = useState<Counts>({});
  const [loadingCounts, setLoadingCounts] = useState(true);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  useEffect(() => {
    async function getCounts() {
      setLoadingCounts(true);

      const results = await Promise.all(
        adminSections.map(async (section) => {
          const { count, error } = await supabase
            .from(section.table)
            .select("*", {
              count: "exact",
              head: true,
            });

          if (error) {
            console.error(
              `${section.table} sayısı alınamadı:`,
              error
            );
            return [section.table, 0] as const;
          }

          return [section.table, count ?? 0] as const;
        })
      );

      setCounts(Object.fromEntries(results));
      setLoadingCounts(false);
    }

    getCounts();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f9f7]">

      {/* HERO */}

      <section className="relative overflow-hidden bg-[#061a16] px-6 py-20 lg:px-8 lg:py-28">

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#168fd1]/10 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[500px] bg-[#2f80ed]/10 blur-3xl rounded-full" />

        <div className="relative mx-auto max-w-6xl">

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#4aaeff]">
                Biyobilim Yönetim
              </p>

              <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
                Yönetim Paneli
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-[#d7e3e1] md:text-lg">
                Biyobilim platformundaki içerikleri buradan kolayca
                yönetebilirsiniz.
              </p>

            </div>

            {/* ÇIKIŞ YAP */}

            <button
              onClick={handleLogout}
              className="inline-flex w-fit items-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <span className="mr-2">↪</span>
              Çıkış Yap
            </button>

          </div>

        </div>
      </section>


      {/* YÖNETİM KARTLARI */}

      <section className="px-6 py-16 lg:px-8 lg:py-20">

        <div className="mx-auto max-w-6xl">

          <div className="mb-10">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5c8a6b]">
              İçerik Yönetimi
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#163b2a] md:text-4xl">
              Yönetim Alanları
            </h2>

          </div>


          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {adminSections.map((section) => {

              const count = counts[section.table];

              return (
                <Link
                  key={section.title}
                  href={section.href as any}
                  className="group rounded-3xl border border-[#dfe8e3] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#bcd5c7] hover:shadow-xl"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf3ff] text-2xl transition group-hover:scale-105">
                      {section.icon}
                    </div>

                    <span className="rounded-full bg-[#f0f5f2] px-3 py-1 text-xs font-semibold text-[#5c7165]">
                      {loadingCounts ? "..." : `${count} içerik`}
                    </span>

                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#163b2a] transition group-hover:text-[#287fea]">
                    {section.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#65726d]">
                    {section.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">

                    <span className="text-sm font-semibold text-[#287fea]">
                      Yönet →
                    </span>

                    <span className="text-xs text-[#8a9791]">
                      {loadingCounts
                        ? "Yükleniyor..."
                        : `${count} kayıt`}
                    </span>

                  </div>

                </Link>
              );
            })}

          </div>

        </div>

      </section>


      {/* ALT BİLGİ */}

      <section className="border-t border-[#dce5df] bg-white px-6 py-12">

        <div className="mx-auto max-w-6xl">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm font-semibold text-[#163b2a]">
                Biyobilim Yönetim Paneli
              </p>

              <p className="mt-1 text-xs text-[#7a8781]">
                Platform içeriklerini tek merkezden yönetin.
              </p>

            </div>

            <Link
              href="/"
              className="inline-flex items-center text-sm font-semibold text-[#287fea] transition hover:text-[#1764c2]"
            >
              Siteye Dön
              <span className="ml-2">→</span>
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}