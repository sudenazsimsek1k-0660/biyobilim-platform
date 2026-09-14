"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const categories = [
  "Tümü",
  "Moleküler Biyoloji",
  "Genetik",
  "Ekoloji",
  "Botanik",
  "Zooloji",
  "Biyoteknoloji",
];

type Scientist = {
  id: number;
  name: string;
  title: string | null;
  field: string | null;
  bio: string | null;
  image_url: string | null;
  created_at: string;
};

export default function BilimInsanlariPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [search, setSearch] = useState("");
  const [scientists, setScientists] = useState<Scientist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScientists();
  }, []);

  async function getScientists() {
    setLoading(true);

    const { data, error } = await supabase
      .from("scientists")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Bilim insanları yüklenemedi:", error);
      setLoading(false);
      return;
    }

    setScientists(data || []);
    setLoading(false);
  }

  const filteredScientists = scientists.filter((scientist) => {
    const matchesCategory =
      selectedCategory === "Tümü" ||
      scientist.field === selectedCategory;

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      searchText === "" ||
      scientist.name.toLowerCase().includes(searchText) ||
      (scientist.field || "").toLowerCase().includes(searchText) ||
      (scientist.title || "").toLowerCase().includes(searchText) ||
      (scientist.bio || "").toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  function getInitials(name: string) {
    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
     return (words[0] ?? "").substring(0, 2).toUpperCase();
    }

    return (
      (words[0] ?? "").charAt(0) +
(words[words.length - 1] ?? "").charAt(0)
    ).toUpperCase();
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7]">

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden bg-[#061a16] px-6 py-24 lg:px-8 lg:py-32">

        <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#168fd1]/10 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[500px] rounded-full bg-[#2f80ed]/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#4aaeff]">
            Biyobilim
          </p>

          <h1 className="mt-5 text-5xl font-black tracking-tight text-white md:text-6xl lg:text-7xl">
            Bilim İnsanları
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d7e3e1] md:text-xl">
            Bilime yön veren araştırmacıları, çalışmalarını ve bilim dünyasına
            yaptıkları katkıları keşfedin.
          </p>

        </div>
      </section>


      {/* ========================================================= */}
      {/* ARAMA */}
      {/* ========================================================= */}

      <section className="border-b border-[#dce5df] bg-white px-6 py-8">

        <div className="mx-auto max-w-6xl">

          <div className="relative max-w-xl">

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Bilim insanı ara..."
              className="w-full rounded-2xl border border-[#d5e0db] bg-[#f8faf9] px-5 py-3.5 pl-12 text-sm text-[#163b2a] outline-none transition placeholder:text-[#8a9791] focus:border-[#2f80ed] focus:ring-2 focus:ring-[#2f80ed]/10"
            />

            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#71807a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
              />
            </svg>

          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* KATEGORİLER */}
      {/* ========================================================= */}

      <section className="border-b border-[#dce5df] bg-white px-6 py-6">

        <div className="mx-auto flex max-w-6xl flex-wrap gap-3">

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-[#2f80ed] text-white shadow-sm"
                  : "border border-[#d4e0d8] bg-white text-[#315441] hover:border-[#2f80ed] hover:bg-[#eaf3ff] hover:text-[#2f80ed]"
              }`}
            >
              {category}
            </button>
          ))}

        </div>
      </section>


      {/* ========================================================= */}
      {/* BİLİM İNSANLARI */}
      {/* ========================================================= */}

      <section className="px-6 py-20 lg:px-8 lg:py-24">

        <div className="mx-auto max-w-6xl">

          <div className="mb-10">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5c8a6b]">
              Keşfet
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#163b2a] md:text-4xl">
              Bilim Dünyasından İsimler
            </h2>

          </div>


          {/* YÜKLENİYOR */}

          {loading && (
            <div className="rounded-3xl border border-[#e1e9e4] bg-white p-10 text-center">
              <p className="text-[#65726d]">
                Bilim insanları yükleniyor...
              </p>
            </div>
          )}


          {/* KAYIT YOK */}

          {!loading && filteredScientists.length === 0 && (
            <div className="rounded-3xl border border-[#e1e9e4] bg-white p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf3ff] text-2xl">
                🔬
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#163b2a]">
                Bilim insanı bulunamadı
              </h3>

              <p className="mt-2 text-sm text-[#65726d]">
                Arama veya kategori seçiminizi değiştirmeyi deneyin.
              </p>
            </div>
          )}


          {/* KARTLAR */}

          {!loading && filteredScientists.length > 0 && (

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

              {filteredScientists.map((scientist) => (

                <article
                  key={scientist.id}
                  className="group overflow-hidden rounded-3xl border border-[#e1e9e4] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* FOTOĞRAF ALANI */}

                  <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-[#e8f2ec] via-[#edf5f1] to-[#e5f0fa]">

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(47,128,237,0.18),transparent_45%)]" />

                    {scientist.image_url ? (

                      <img
                        src={scientist.image_url}
                        alt={scientist.name}
                        className="relative h-full w-full object-cover"
                      />

                    ) : (

                      <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[#163b2a] shadow-lg">

                        <span className="text-2xl font-bold text-[#8ec5ff]">
                          {getInitials(scientist.name)}
                        </span>

                      </div>

                    )}

                  </div>


                  {/* İÇERİK */}

                  <div className="p-7">

                    {scientist.field && (
                      <span className="inline-flex rounded-full bg-[#eaf3ff] px-3 py-1.5 text-xs font-semibold text-[#287fea]">
                        {scientist.field}
                      </span>
                    )}

                    <h3 className="mt-4 text-xl font-bold text-[#163b2a] transition group-hover:text-[#2f80ed]">
                      {scientist.name}
                    </h3>

                    {scientist.title && (
                      <p className="mt-2 text-sm font-semibold text-[#5c8a6b]">
                        {scientist.title}
                      </p>
                    )}

                    {scientist.bio && (
                      <p className="mt-3 text-sm leading-6 text-[#65726d]">
                        {scientist.bio}
                      </p>
                    )}

                    <button className="mt-6 inline-flex items-center text-sm font-semibold text-[#287fea] transition hover:text-[#1764c2]">
                      Profili İncele
                      <span className="ml-2 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </div>
      </section>


      {/* ========================================================= */}
      {/* ALT CTA */}
      {/* ========================================================= */}

      <section className="border-t border-[#dce5df] bg-white px-6 py-20">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#287fea]">
            Bilim ve İlham
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#163b2a] md:text-4xl">
            Bilimin iz bırakan hikâyelerini keşfedin.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#65726d]">
            Araştırmalarıyla bilime katkı sağlayan bilim insanlarını tanıyın,
            çalışmalarından ilham alın ve bilim dünyasındaki gelişmeleri takip
            edin.
          </p>

        </div>

      </section>

    </main>
  );
}