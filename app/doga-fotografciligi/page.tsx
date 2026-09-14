"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type NaturePhoto = {
  id: number;
  title: string;
  description: string | null;
  photographer: string | null;
  location: string | null;
  image_url: string;
  published_at: string | null;
};

export default function DogaFotografciligiPage() {
  const [photos, setPhotos] = useState<NaturePhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] =
    useState<NaturePhoto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPhotos();
  }, []);

  async function getPhotos() {
    setLoading(true);

    const { data, error } = await supabase
      .from("nature_photos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Doğa fotoğrafları yüklenemedi:", error);
      setLoading(false);
      return;
    }

    setPhotos(data || []);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7]">

      {/* HERO */}

      <section className="relative overflow-hidden bg-[#061a16] px-6 py-24 lg:px-8 lg:py-32">

        <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#168fd1]/10 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[500px] rounded-full bg-[#2f80ed]/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#4aaeff]">
            Biyobilim
          </p>

          <h1 className="mt-5 text-5xl font-black tracking-tight text-white md:text-6xl lg:text-7xl">
            Doğa Fotoğrafçılığı
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d7e3e1] md:text-xl">
            Biyolojik çeşitliliği, canlıları ve doğanın eşsiz detaylarını
            objektifimizden keşfedin.
          </p>

        </div>
      </section>


      {/* GALERİ */}

      <section className="px-6 py-20 lg:px-8 lg:py-24">

        <div className="mx-auto max-w-7xl">

          <div className="mb-12">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#287fea]">
              Galeri
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#163b2a] md:text-4xl">
              Doğadan Kareler
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[#65726d]">
              Biyobilim Topluluğu üyelerinin objektifinden doğaya ve canlı
              yaşamına dair fotoğrafları keşfedin.
            </p>

          </div>


          {/* YÜKLENİYOR */}

          {loading ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-[#e0e9e4]">
              <p className="text-[#65726d]">
                Fotoğraflar yükleniyor...
              </p>
            </div>
          ) : photos.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-[#e0e9e4]">
              <p className="text-lg font-semibold text-[#163b2a]">
                Henüz doğa fotoğrafı bulunmuyor.
              </p>

              <p className="mt-2 text-sm text-[#65726d]">
                Yeni fotoğraflar yayınlandığında burada görünecek.
              </p>
            </div>
          ) : (

            /* FOTOĞRAF GRID */

            <div className="grid auto-rows-[240px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className={`group relative overflow-hidden rounded-3xl bg-[#dcebe2] text-left shadow-sm ring-1 ring-[#e0e9e4] transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    index === 0
                      ? "sm:col-span-2 lg:row-span-2"
                      : index === 4
                        ? "lg:col-span-2"
                        : ""
                  }`}
                >

                  {/* GERÇEK FOTOĞRAF */}

                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {/* MAVİ IŞIK */}

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(47,128,237,0.16),transparent_45%)]" />

                  {/* ALT BİLGİ */}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#061a16]/90 via-[#061a16]/60 to-transparent p-6 pt-16">

                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4aaeff]">
                      {photo.location || "Doğa"}
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-white">
                      {photo.title}
                    </h3>

                    {photo.photographer && (
                      <p className="mt-1 text-xs text-[#d7e3e1]">
                        📷 {photo.photographer}
                      </p>
                    )}

                  </div>

                </button>
              ))}

            </div>
          )}

        </div>
      </section>


{/* KATKI ÇAĞRISI */}

<section className="border-t border-[#dce5df] bg-white px-6 py-20 lg:px-8">

  <div className="mx-auto max-w-5xl">

    <div className="overflow-hidden rounded-3xl bg-[#061a16] px-7 py-12 md:px-12">

      <div className="max-w-2xl">

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4aaeff]">
          Biyobilim
        </p>

        <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
          Objektifinden doğayı paylaş.
        </h2>

        <p className="mt-5 text-base leading-7 text-[#c9d8d4]">
          Doğada karşılaştığın canlıları, bitkileri ve doğal yaşamdan
          kareleri bizimle paylaşmak istersen bize ulaşabilirsin.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">

          <a
            href="mailto:biyobilimtoplulugu@gmail.com"
            className="rounded-xl bg-[#287fea] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#45a1ff]"
          >
            📧 E-posta Gönder
          </a>

          <a
            href="https://www.instagram.com/nohubiyobilim/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            📷 Instagram'dan Ulaş
          </a>

        </div>

      </div>

    </div>

  </div>
</section>


      {/* FOTOĞRAF MODAL */}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#061a16]/90 p-6 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >

          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >

            {/* GÖRSEL */}

            <div className="flex max-h-[70vh] items-center justify-center bg-[#061a16]">

              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-full object-contain"
              />

            </div>

            {/* BİLGİ */}

            <div className="p-7">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#287fea]">
                {selectedPhoto.location || "Doğa"}
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#163b2a]">
                {selectedPhoto.title}
              </h2>

              {selectedPhoto.photographer && (
                <p className="mt-3 text-sm text-[#65726d]">
                  📷 {selectedPhoto.photographer}
                </p>
              )}

              {selectedPhoto.description && (
                <p className="mt-4 max-w-3xl text-sm leading-6 text-[#65726d]">
                  {selectedPhoto.description}
                </p>
              )}

            </div>

            {/* KAPAT */}

            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#061a16]/70 text-xl text-white backdrop-blur-sm transition hover:bg-[#061a16]"
              aria-label="Kapat"
            >
              ×
            </button>

          </div>

        </div>
      )}

    </main>
  );
}