"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type News = {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  image_url: string | null;
  published_at: string | null;
};

const categories = [
  "Tümü",
  "Bilim ve Teknoloji",
  "Moleküler Biyoloji",
  "Genetik",
  "Botanik",
  "Zooloji",
  "Ekoloji",
];

export default function HaberlerPage() {
  const supabase = createClient();

  const [news, setNews] = useState<News[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getNews() {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Haberler alınamadı:", error);
      } else {
        setNews(data || []);
      }

      setLoading(false);
    }

    getNews();
  }, []);

  const filteredNews =
    selectedCategory === "Tümü"
      ? news
      : news.filter((item) => item.category === selectedCategory);

  return (
    <main className="min-h-screen bg-[#f7f9f7]">

      {/* BAŞLIK */}
      <section className="relative overflow-hidden bg-[#071a14] px-6 py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(47,128,237,0.20),transparent_45%)]" />

        <div className="relative mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8ec5ff]">
            Biyobilim
          </p>

          <h1 className="mt-5 text-5xl font-bold tracking-tight text-[#dcecff] md:text-6xl lg:text-7xl">
            Haberler
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/75 md:text-xl">
            Biyoloji, bilim ve araştırma dünyasından güncel gelişmeleri,
            önemli keşifleri ve Biyobilim Topluluğu'ndan haberleri keşfedin.
          </p>
        </div>
      </section>

      {/* KATEGORİLER */}
      <section className="border-b border-[#dce5df] bg-white px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-[#2f6f4e] text-white shadow-sm"
                  : "border border-[#d4e0d8] bg-white text-[#315441] hover:border-[#2f80ed] hover:bg-[#eaf3ff] hover:text-[#2f80ed]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* HABERLER */}
      <section className="px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">

          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5c8a6b]">
                Güncel
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#163b2a] md:text-4xl">
                Son Haberler
              </h2>
            </div>

            <p className="hidden text-sm text-gray-500 md:block">
              Bilim dünyasından seçtiklerimiz
            </p>
          </div>

          {loading ? (
            <p className="text-[#65726d]">Haberler yükleniyor...</p>
          ) : filteredNews.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center">
              <p className="text-[#65726d]">
                Bu kategoride henüz haber bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

              {filteredNews.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#e1e9e4] transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* GÖRSEL */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#dfeee5] via-[#eef5f0] to-[#dcecff]">

                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(47,128,237,0.15),transparent_45%)]" />

                        <div className="flex h-full items-center justify-center">
                          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5c8a6b]">
                            {item.category}
                          </span>
                        </div>
                      </>
                    )}

                  </div>

                  {/* İÇERİK */}
                  <div className="p-7">

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#2f80ed]">
                        {item.category}
                      </span>

                      {item.published_at && (
                        <span className="text-xs text-gray-400">
                          {new Date(item.published_at).toLocaleDateString(
                            "tr-TR"
                          )}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-xl font-bold leading-7 text-[#163b2a] transition group-hover:text-[#2f80ed]">
                      {item.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>

                    <Link
                      href={`/haberler/${item.id}`}
                      className="mt-6 inline-flex items-center text-sm font-semibold text-[#2f6f4e] transition group-hover:text-[#2f80ed]"
                    >
                      Devamını Oku
                      <span className="ml-2 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>

                  </div>
                </article>
              ))}

            </div>
          )}

        </div>
      </section>

    </main>
  );
}