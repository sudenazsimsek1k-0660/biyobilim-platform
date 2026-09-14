"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type Podcast = {
  id: number;
  title: string;
  description: string | null;
  speaker: string | null;
  editor: string | null;
  cover_image_url: string | null;
  audio_url: string | null;
  published_at: string | null;
};

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds)) return "";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function PodcastContent() {
  const [episodes, setEpisodes] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [durations, setDurations] = useState<Record<number, string>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function getPodcasts() {
      const { data, error } = await supabase
        .from("podcasts")
        .select("*")
        .not("published_at", "is", null)
        .order("published_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setEpisodes(data || []);
      setLoading(false);
    }

    getPodcasts();
  }, []);

  useEffect(() => {
    if (episodes.length === 0) return;

    episodes.forEach((episode) => {
      if (!episode.audio_url) return;

      const audio = new Audio();

      audio.addEventListener("loadedmetadata", () => {
        setDurations((prev) => ({
          ...prev,
          [episode.id]: formatDuration(audio.duration),
        }));
      });

      audio.src = episode.audio_url;
    });
  }, [episodes]);

  function playEpisode(episode: Podcast) {
    if (!episode.audio_url) {
      alert("Bu bölüm için ses kaydı bulunmuyor.");
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    if (currentId === episode.id) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }

      return;
    }

    audio.pause();
    audio.src = episode.audio_url;
    audio.currentTime = 0;

    audio
      .play()
      .then(() => {
        setCurrentId(episode.id);
      })
      .catch((error) => {
        console.error(error);
        alert("Ses kaydı oynatılamadı.");
      });

    audio.onended = () => {
      setCurrentId(null);
    };
  }

  const latestEpisode = episodes[0];
  const archiveEpisodes = episodes.slice(1);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f9f7]">
        <section className="px-6 py-32">
          <div className="mx-auto max-w-6xl">
            <p className="text-[#5c8a6b]">Podcastler yükleniyor...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!latestEpisode) {
    return (
      <main className="min-h-screen bg-[#f7f9f7]">

        {/* HERO */}
        <section className="relative overflow-hidden bg-[#071a14] px-6 py-24 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(47,128,237,0.20),transparent_45%)]" />

          <div className="relative mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8ec5ff]">
              Biyobilim Podcast
            </p>

            <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-tight text-[#dcecff] md:text-6xl lg:text-7xl">
              Bilimi
              <span className="text-[#8ec5ff]"> konuşuyoruz.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/75 md:text-xl">
              Biyoloji, bilim, doğa ve yaşam bilimleri üzerine merak
              ettiklerimizi konuşuyor; bilimsel konuları herkes için
              anlaşılır ve keyifli hâle getiriyoruz.
            </p>
          </div>
        </section>

        <section className="px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5c8a6b]">
              Şimdi Dinle
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#163b2a] md:text-4xl">
              Son Bölüm
            </h2>

            <div className="mt-10 rounded-[2rem] bg-[#163b2a] p-12 text-white">
              Henüz yayınlanmış bir podcast bölümü bulunmuyor.
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#071a14] px-6 py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(47,128,237,0.20),transparent_45%)]" />

        <div className="relative mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8ec5ff]">
            Biyobilim Podcast
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-tight text-[#dcecff] md:text-6xl lg:text-7xl">
            Bilimi
            <span className="text-[#8ec5ff]"> konuşuyoruz.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/75 md:text-xl">
            Biyoloji, bilim, doğa ve yaşam bilimleri üzerine merak
            ettiklerimizi konuşuyor; bilimsel konuları herkes için anlaşılır
            ve keyifli hâle getiriyoruz.
          </p>
        </div>
      </section>

      {/* ÖNE ÇIKAN BÖLÜM */}
      <section className="px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">

          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5c8a6b]">
              Şimdi Dinle
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#163b2a] md:text-4xl">
              Son Bölüm
            </h2>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-[#163b2a] shadow-xl">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(47,128,237,0.30),transparent_45%)]" />

            <div className="relative grid gap-10 p-8 md:grid-cols-[180px_1fr] md:p-12 lg:grid-cols-[220px_1fr]">

              {/* PODCAST GÖRSEL ALANI */}
              <div className="flex items-center justify-center">
                <div className="flex h-40 w-40 items-center justify-center rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-sm md:h-48 md:w-48">

                  {latestEpisode.cover_image_url ? (
                    <img
                      src={latestEpisode.cover_image_url}
                      alt={latestEpisode.title}
                      className="h-full w-full rounded-3xl object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-bold text-[#8ec5ff]">
                      {String(episodes.length).padStart(2, "0")}
                    </span>
                  )}

                </div>
              </div>

              {/* İÇERİK */}
              <div className="flex flex-col justify-center">

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8ec5ff]">
                  Biyobilim Podcast · Bölüm{" "}
                  {String(episodes.length).padStart(2, "0")}
                </p>

                <h3 className="mt-4 text-3xl font-bold text-white md:text-4xl">
                  {latestEpisode.title}
                </h3>

                <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
                  {latestEpisode.description}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-4">

                  <button
                    onClick={() => playEpisode(latestEpisode)}
                    className="inline-flex items-center gap-3 rounded-full bg-[#2f80ed] px-6 py-3 font-semibold text-white transition hover:bg-[#60aaff]"
                  >
                    <span className="text-lg">
                      {currentId === latestEpisode.id ? "Ⅱ" : "▶"}
                    </span>

                    {currentId === latestEpisode.id
                      ? "Duraklat"
                      : "Bölümü Dinle"}
                  </button>

                  <span className="text-sm text-white/50">
                    {durations[latestEpisode.id]
                      ? durations[latestEpisode.id]
                      : "Podcast"}
                  </span>

                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BÖLÜMLER */}
      {archiveEpisodes.length > 0 && (
        <section className="border-t border-[#dce5df] bg-white px-6 py-20 lg:py-24">

          <div className="mx-auto max-w-6xl">

            <div className="mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5c8a6b]">
                Arşiv
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#163b2a] md:text-4xl">
                Podcast Bölümleri
              </h2>
            </div>

            <div className="space-y-5">

              {archiveEpisodes.map((episode, index) => (

                <article
                  key={episode.id}
                  className="group flex flex-col gap-6 rounded-3xl border border-[#e1e9e4] bg-[#f9fbf9] p-6 transition hover:-translate-y-0.5 hover:border-[#cbded1] hover:shadow-md md:flex-row md:items-center md:p-7"
                >

                  {/* NUMARA */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#e5f0e9] text-xl font-bold text-[#2f6f4e]">
                    {String(episodes.length - index - 1).padStart(2, "0")}
                  </div>

                  {/* BİLGİ */}
                  <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-3">

                      <h3 className="text-xl font-bold text-[#163b2a] transition group-hover:text-[#2f80ed]">
                        {episode.title}
                      </h3>

                      <span className="text-sm text-gray-400">
                        {durations[episode.id] || "Podcast"}
                      </span>

                    </div>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                      {episode.description}
                    </p>

                  </div>

                  {/* OYNAT */}
                  <button
                    onClick={() => playEpisode(episode)}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2f6f4e] text-white transition hover:bg-[#2f80ed]"
                  >
                    {currentId === episode.id ? "Ⅱ" : "▶"}
                  </button>

                </article>

              ))}

            </div>
          </div>
        </section>
      )}

      {/* EKİP / PODCAST BİLGİ */}
      <section className="px-6 py-20 lg:py-24">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5c8a6b]">
            Biyobilim Podcast
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#163b2a] md:text-4xl">
            Bilim, merakla başlar.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600">
            Podcast ekibimiz, bilimsel konuları öğrenciler ve bilim meraklıları
            için anlaşılır bir formatta ele alıyor. Her bölümde yeni bir konu,
            yeni bir soru ve keşfedilecek yeni bir şey var.
          </p>

        </div>

      </section>

    </main>
  );
}