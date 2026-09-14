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

export default function DogaFotografciligiAdminPage() {
  const [photos, setPhotos] = useState<NaturePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photographer, setPhotographer] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

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
      console.error("Fotoğraflar yüklenemedi:", error);
      setLoading(false);
      return;
    }

    setPhotos(data || []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Fotoğraf başlığı girin.");
      return;
    }

    if (!imageFile) {
      alert("Lütfen bir fotoğraf seçin.");
      return;
    }

    setIsSubmitting(true);

    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("nature-photos")
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Fotoğraf yükleme hatası:", uploadError);
        alert("Fotoğraf yüklenemedi.");
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("nature-photos")
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from("nature_photos")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          photographer: photographer.trim() || null,
          location: location.trim() || null,
          image_url: publicUrl,
          published_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error("Kayıt hatası:", insertError);
        alert("Fotoğraf bilgileri kaydedilemedi.");

        await supabase.storage
          .from("nature-photos")
          .remove([filePath]);

        return;
      }

      alert("Doğa fotoğrafı başarıyla yayınlandı.");

      setTitle("");
      setDescription("");
      setPhotographer("");
      setLocation("");
      setImageFile(null);

      const fileInput = document.getElementById(
        "nature-image"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      await getPhotos();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deletePhoto(photo: NaturePhoto) {
    const confirmed = window.confirm(
      `"${photo.title}" fotoğrafını silmek istediğinize emin misiniz?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("nature_photos")
      .delete()
      .eq("id", photo.id);

    if (error) {
      console.error("Silme hatası:", error);
      alert("Fotoğraf silinemedi.");
      return;
    }

    alert("Fotoğraf silindi.");

    await getPhotos();
  }

  return (
    <main className="min-h-screen bg-[#f5f8f6] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* BAŞLIK */}

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#287fea]">
            Biyobilim Yönetim Paneli
          </p>

          <h1 className="mt-3 text-4xl font-bold text-[#163b2a]">
            Doğa Fotoğrafçılığı
          </h1>

          <p className="mt-3 text-[#65726d]">
            Doğa fotoğraflarını buradan ekleyebilir ve yayınlayabilirsiniz.
          </p>
        </div>

        {/* FORM */}

        <section className="mb-10 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-[#e1e9e4]">

          <h2 className="text-2xl font-bold text-[#163b2a]">
            Yeni Doğa Fotoğrafı Ekle
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">

            {/* BAŞLIK */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Fotoğraf Başlığı
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn. Bolkar Dağları'nda Gün Batımı"
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3 outline-none focus:border-[#287fea]"
              />
            </div>

            {/* FOTOĞRAF */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Fotoğraf
              </label>

              <input
                id="nature-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] || null)
                }
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3"
              />

              {imageFile && (
                <p className="mt-2 text-sm text-[#65726d]">
                  Seçilen dosya: {imageFile.name}
                </p>
              )}
            </div>

            {/* FOTOĞRAFÇI */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Fotoğrafçı
              </label>

              <input
                type="text"
                value={photographer}
                onChange={(e) => setPhotographer(e.target.value)}
                placeholder="Fotoğrafı çeken kişi"
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3 outline-none focus:border-[#287fea]"
              />
            </div>

            {/* KONUM */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Konum
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Örn. Bolkar Dağları, Niğde"
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3 outline-none focus:border-[#287fea]"
              />
            </div>

            {/* AÇIKLAMA */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Açıklama
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Fotoğraf hakkında kısa açıklama"
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3 outline-none focus:border-[#287fea]"
              />
            </div>

            {/* BUTON */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#2f6f4e] px-6 py-3 font-semibold text-white transition hover:bg-[#255a3e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Yayınlanıyor..."
                : "Fotoğrafı Yayınla"}
            </button>

          </form>
        </section>

        {/* LİSTE */}

        <section>

          <h2 className="mb-6 text-2xl font-bold text-[#163b2a]">
            Yayındaki Doğa Fotoğrafları
          </h2>

          {loading ? (
            <p className="text-[#65726d]">
              Fotoğraflar yükleniyor...
            </p>
          ) : photos.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-[#65726d]">
                Henüz doğa fotoğrafı bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {photos.map((photo) => (
                <article
                  key={photo.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#e1e9e4]"
                >

                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-5">

                    <h3 className="text-lg font-bold text-[#163b2a]">
                      {photo.title}
                    </h3>

                    {photo.photographer && (
                      <p className="mt-2 text-sm text-[#65726d]">
                        📷 {photo.photographer}
                      </p>
                    )}

                    {photo.location && (
                      <p className="mt-1 text-sm text-[#65726d]">
                        📍 {photo.location}
                      </p>
                    )}

                    {photo.description && (
                      <p className="mt-3 text-sm leading-6 text-[#65726d]">
                        {photo.description}
                      </p>
                    )}

                    <button
                      onClick={() => deletePhoto(photo)}
                      className="mt-5 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Sil
                    </button>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}