"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type EventItem = {
  id: number;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  image_url: string | null;
  published_at: string | null;
};

export default function EtkinliklerPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  useEffect(() => {
    getEvents();
  }, []);

  async function getEvents() {
    setLoading(true);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true })
      .order("event_time", { ascending: true });

    if (error) {
      console.error("Etkinlikler yüklenemedi:", error);
      setLoading(false);
      return;
    }

    setEvents(data || []);
    setLoading(false);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(`${event.event_date}T00:00:00`);
    return eventDate >= today;
  });

  const pastEvents = events
    .filter((event) => {
      const eventDate = new Date(`${event.event_date}T00:00:00`);
      return eventDate < today;
    })
    .reverse();

  function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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
            Biyobilim Topluluğu
          </p>

          <h1 className="mt-5 text-5xl font-black tracking-tight text-white md:text-6xl lg:text-7xl">
            Etkinlikler
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d7e3e1] md:text-xl">
            Bilim, biyoloji, doğa ve akademik gelişim odağında
            gerçekleştirdiğimiz etkinlikleri keşfedin.
          </p>

        </div>
      </section>


      {/* ========================================================= */}
      {/* YAKLAŞAN ETKİNLİKLER */} 
      {/* ========================================================= */}

      <section className="px-6 py-20 lg:px-8 lg:py-24">

        <div className="mx-auto max-w-6xl">

          <div className="mb-10">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#287fea]">
              Takvim
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#163b2a] md:text-4xl">
              Yaklaşan Etkinlikler
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[#65726d]">
              Biyobilim Topluluğu tarafından gerçekleştirilecek etkinlikleri
              takip edin.
            </p>

          </div>


          {loading ? (
            <div className="rounded-3xl border border-[#dfe8e3] bg-white p-10 text-center">
              <p className="text-[#65726d]">
                Etkinlikler yükleniyor...
              </p>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="rounded-3xl border border-[#dfe8e3] bg-white p-10 text-center">
              <p className="text-lg font-semibold text-[#163b2a]">
                Yaklaşan etkinlik bulunmuyor.
              </p>

              <p className="mt-2 text-sm text-[#65726d]">
                Yeni etkinlikler yayınlandığında burada görünecek.
              </p>
            </div>
          ) : (

            <div className="grid gap-7">

              {upcomingEvents.map((event) => (
                <article
                  key={event.id}
                  className="group overflow-hidden rounded-3xl border border-[#dfe8e3] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  <div className="grid md:grid-cols-[190px_1fr]">

                    {/* TARİH */}

                    <div className="flex min-h-[180px] items-center justify-center bg-gradient-to-br from-[#eaf3ff] via-[#edf6f1] to-[#e3f0ea] p-8">

                      <div className="text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#287fea] text-2xl text-white shadow-lg shadow-[#287fea]/20">
                          📅
                        </div>

                        <p className="mt-4 text-sm font-bold text-[#287fea]">
                          {formatDate(event.event_date)}
                        </p>

                      </div>

                    </div>


                    {/* İÇERİK */}

                    <div className="p-7 md:p-9">

                      <h3 className="text-2xl font-bold text-[#163b2a] transition group-hover:text-[#287fea] md:text-3xl">
                        {event.title}
                      </h3>

                      <div className="mt-5 flex flex-col gap-3 text-sm text-[#64716d] sm:flex-row sm:flex-wrap sm:gap-6">

                        {event.event_time && (
                          <span>
                            🕐 {event.event_time.slice(0, 5)}
                          </span>
                        )}

                        {event.location && (
                          <span>
                            📍 {event.location}
                          </span>
                        )}

                      </div>

                      {event.description && (
                        <p className="mt-5 max-w-3xl text-base leading-7 text-[#65726d]">
                          {event.description}
                        </p>
                      )}

                      <button
                        onClick={() =>
                          setSelectedEvent(
                            selectedEvent === event.id ? null : event.id
                          )
                        }
                        className="mt-6 inline-flex items-center rounded-xl bg-[#287fea] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1764c2]"
                      >
                        Detayları Gör
                        <span className="ml-2">
                          →
                        </span>
                      </button>

                      {selectedEvent === event.id && (
                        <div className="mt-5 rounded-2xl border border-[#dce8f5] bg-[#f5f9ff] p-5 text-sm leading-6 text-[#53615c]">
                          <p>
                            <strong>Tarih:</strong>{" "}
                            {formatDate(event.event_date)}
                          </p>

                          {event.event_time && (
                            <p className="mt-1">
                              <strong>Saat:</strong>{" "}
                              {event.event_time.slice(0, 5)}
                            </p>
                          )}

                          {event.location && (
                            <p className="mt-1">
                              <strong>Konum:</strong>{" "}
                              {event.location}
                            </p>
                          )}
                        </div>
                      )}

                    </div>

                  </div>

                </article>
              ))}

            </div>

          )}

        </div>
      </section>


      {/* ========================================================= */}
      {/* GEÇMİŞ ETKİNLİKLER */}
      {/* ========================================================= */}

      <section className="border-t border-[#dce5df] bg-white px-6 py-20 lg:px-8 lg:py-24">

        <div className="mx-auto max-w-6xl">

          <div className="mb-10">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5c8a6b]">
              Arşiv
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#163b2a] md:text-4xl">
              Geçmiş Etkinlikler
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[#65726d]">
              Daha önce gerçekleştirdiğimiz etkinliklere göz atın.
            </p>

          </div>


          {loading ? (
            <div className="rounded-3xl border border-[#e1e9e4] bg-[#f9fbfa] p-10 text-center">
              <p className="text-[#65726d]">
                Etkinlikler yükleniyor...
              </p>
            </div>
          ) : pastEvents.length === 0 ? (
            <div className="rounded-3xl border border-[#e1e9e4] bg-[#f9fbfa] p-10 text-center">
              <p className="text-lg font-semibold text-[#163b2a]">
                Henüz geçmiş etkinlik bulunmuyor.
              </p>
            </div>
          ) : (

            <div className="grid gap-7 md:grid-cols-2">

              {pastEvents.map((event) => (
                <article
                  key={event.id}
                  className="group rounded-3xl border border-[#e1e9e4] bg-[#f9fbfa] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                >

                  <div className="flex items-start justify-between gap-5">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e8f1eb] text-xl">
                      🌿
                    </div>

                    <span className="rounded-full bg-[#edf1ef] px-3 py-1.5 text-xs font-semibold text-[#65726d]">
                      Geçmiş
                    </span>

                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#163b2a] transition group-hover:text-[#287fea]">
                    {event.title}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-[#65726d]">

                    <p>
                      📅 {formatDate(event.event_date)}
                    </p>

                    {event.location && (
                      <p>
                        📍 {event.location}
                      </p>
                    )}

                    {event.event_time && (
                      <p>
                        🕐 {event.event_time.slice(0, 5)}
                      </p>
                    )}

                  </div>

                  {event.description && (
                    <p className="mt-5 text-sm leading-6 text-[#65726d]">
                      {event.description}
                    </p>
                  )}

                </article>
              ))}

            </div>

          )}

        </div>
      </section>


      {/* ========================================================= */}
      {/* CTA */}
      {/* ========================================================= */}

      <section className="border-t border-[#dce5df] bg-[#f7f9f7] px-6 py-20">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#287fea]">
            Biyobilim
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#163b2a] md:text-4xl">
            Bir sonraki etkinlikte görüşmek üzere.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#65726d]">
            Yeni etkinliklerden haberdar olmak için Biyobilim Topluluğu'nun
            duyurularını takip edin.
          </p>

        </div>

      </section>

    </main>
  );
}