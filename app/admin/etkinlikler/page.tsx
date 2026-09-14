"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type EventItem = {
  id: number;
  created_at: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  image_url: string | null;
  published_at: string | null;
};

export default function EtkinliklerAdminPage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getEvents();
  }, []);

  async function getEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) {
      console.error(error);
      alert("Etkinlikler yüklenemedi.");
      return;
    }

    setEvents(data || []);
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setEventDate("");
    setEventTime("");
    setLocation("");
    setImageFile(null);
    setImageUrl("");
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isSubmitting) return;

    if (!title.trim()) {
      alert("Lütfen etkinlik başlığını girin.");
      return;
    }

    if (!eventDate) {
      alert("Lütfen etkinlik tarihini seçin.");
      return;
    }

    if (editingId === null && !imageFile) {
      alert("Lütfen etkinlik görselini seçin.");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = imageUrl || null;

      // Yeni görsel seçildiyse yükle
      if (imageFile) {
        const safeFileName = imageFile.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9.-]/g, "-");

        const fileName = `${Date.now()}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from("events")
          .upload(`images/${fileName}`, imageFile);

        if (uploadError) {
          console.error(uploadError);
          alert(`Görsel yüklenemedi: ${uploadError.message}`);
          return;
        }

        const { data: imageData } = supabase.storage
          .from("events")
          .getPublicUrl(`images/${fileName}`);

        finalImageUrl = imageData.publicUrl;
      }

      const eventData = {
        title: title.trim(),
        description: description.trim() || null,
        event_date: eventDate,
        event_time: eventTime || null,
        location: location.trim() || null,
        image_url: finalImageUrl,
      };

      if (editingId !== null) {
        const { error } = await supabase
          .from("events")
          .update(eventData)
          .eq("id", editingId);

        if (error) {
          console.error(error);
          alert(`Etkinlik güncellenemedi: ${error.message}`);
          return;
        }

        alert("Etkinlik güncellendi.");
      } else {
        const { error } = await supabase.from("events").insert({
          ...eventData,
          published_at: new Date().toISOString(),
        });

        if (error) {
          console.error(error);
          alert(`Etkinlik eklenemedi: ${error.message}`);
          return;
        }

        alert("Etkinlik yayınlandı.");
      }

      resetForm();
      await getEvents();
    } finally {
      setIsSubmitting(false);
    }
  }

  function editEvent(event: EventItem) {
    setEditingId(event.id);
    setTitle(event.title);
    setDescription(event.description || "");
    setEventDate(event.event_date);
    setEventTime(event.event_time || "");
    setLocation(event.location || "");
    setImageUrl(event.image_url || "");
    setImageFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteEvent(id: number) {
    const confirmed = window.confirm(
      "Bu etkinliği ve görselini silmek istediğinize emin misiniz?"
    );

    if (!confirmed) return;

    const { data: event, error: fetchError } = await supabase
      .from("events")
      .select("image_url")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error(fetchError);
      alert("Etkinlik bulunamadı.");
      return;
    }

    // Storage görselini sil
    if (event.image_url) {
      const imagePath = event.image_url.split("/events/")[1];

      if (imagePath) {
        const decodedPath = decodeURIComponent(imagePath);

        const { error: storageError } = await supabase.storage
          .from("events")
          .remove([decodedPath]);

        if (storageError) {
          console.error(storageError);
          alert("Etkinlik görseli silinemedi.");
          return;
        }
      }
    }

    // Veritabanındaki etkinliği sil
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert(`Etkinlik silinemedi: ${error.message}`);
      return;
    }

    alert("Etkinlik ve görseli silindi.");
    await getEvents();
  }

  async function togglePublish(event: EventItem) {
    const newPublishedAt = event.published_at
      ? null
      : new Date().toISOString();

    const { error } = await supabase
      .from("events")
      .update({
        published_at: newPublishedAt,
      })
      .eq("id", event.id);

    if (error) {
      console.error(error);
      alert(`Yayın durumu değiştirilemedi: ${error.message}`);
      return;
    }

    await getEvents();
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Başlık */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-green-700">
            Yönetim Paneli
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            Etkinlikler
          </h1>

          <p className="mt-2 text-gray-600">
            Etkinlikleri ekleyin, düzenleyin ve yayın durumlarını yönetin.
          </p>
        </div>

        {/* Form */}
        <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId !== null
                ? "Etkinliği Düzenle"
                : "Yeni Etkinlik Ekle"}
            </h2>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Düzenlemeyi İptal Et
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Başlık */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Etkinlik Başlığı *
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn. Biyologlar Günü"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            {/* Açıklama */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Açıklama
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Etkinlik hakkında kısa açıklama..."
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            {/* Tarih / Saat */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tarih *
                </label>

                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Saat
                </label>

                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
                />
              </div>
            </div>

            {/* Konum */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Konum
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Örn. NÖHÜ Merkezi Konferans Salonu"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            {/* Görsel */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Etkinlik Görseli *
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] || null)
                }
                className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
              />

              {editingId !== null && imageUrl && !imageFile && (
                <p className="mt-2 text-sm text-gray-500">
                  Mevcut görsel kullanılacak. Değiştirmek için yeni görsel
                  seçin.
                </p>
              )}
            </div>

            {/* Buton */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-green-700 px-6 py-3 font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Kaydediliyor..."
                : editingId !== null
                  ? "Etkinliği Güncelle"
                  : "Etkinliği Yayınla"}
            </button>
          </form>
        </section>

        {/* Etkinlik Listesi */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Etkinlik Listesi
            </h2>

            <span className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
              {events.length} etkinlik
            </span>
          </div>

          {events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
              Henüz etkinlik eklenmemiş.
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 md:flex-row">
                    {/* Görsel */}
                    {event.image_url && (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="h-32 w-full rounded-xl object-cover md:w-48"
                      />
                    )}

                    {/* İçerik */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {event.title}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            event.published_at
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {event.published_at
                            ? "Yayında"
                            : "Yayında Değil"}
                        </span>
                      </div>

                      {event.description && (
                        <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                          {event.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                        <span>📅 {event.event_date}</span>

                        {event.event_time && (
                          <span>🕐 {event.event_time.slice(0, 5)}</span>
                        )}

                        {event.location && (
                          <span>📍 {event.location}</span>
                        )}
                      </div>
                    </div>

                    {/* İşlemler */}
                    <div className="flex shrink-0 flex-wrap items-center gap-2 md:flex-col md:items-stretch">
                      <button
                        type="button"
                        onClick={() => editEvent(event)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Düzenle
                      </button>

                      <button
                        type="button"
                        onClick={() => togglePublish(event)}
                        className="rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
                      >
                        {event.published_at
                          ? "Yayından Kaldır"
                          : "Yayınla"}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteEvent(event.id)}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}