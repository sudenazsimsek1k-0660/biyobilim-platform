"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient() as any;

type Scientist = {
  id: number;
  name: string;
  title: string | null;
  field: string | null;
  bio: string | null;
  image_url: string | null;
  created_at: string;
};

export default function BilimInsanlariAdminPage() {
  const [scientists, setScientists] = useState<Scientist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    title: "",
    field: "",
    bio: "",
  });

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

  async function uploadImage(file: File) {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExtension}`;

    const filePath = `scientists/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("scientists")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Fotoğraf yüklenemedi:", uploadError);
      throw new Error("Fotoğraf yüklenemedi.");
    }

    const { data } = supabase.storage
      .from("scientists")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Ad Soyad alanı zorunludur.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | null = null;

      // Yeni fotoğraf seçildiyse yükle
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (editingId !== null) {
        const scientistData = {
  full_name: form.name.trim(),
  field: form.field.trim(),
  short_bio: form.bio.trim(),
  photo_url: imageUrl,
};

        /// Düzenlemede yeni fotoğraf seçildiyse mevcut fotoğrafı değiştir
if (imageFile) {
  scientistData.photo_url = imageUrl;
}

        const { error } = await supabase
          .from("scientists")
          .update(scientistData)
          .eq("id", editingId);

        if (error) {
          console.error("Güncelleme hatası:", error);
          alert("Bilim insanı güncellenemedi.");
          return;
        }

        alert("Bilim insanı güncellendi.");
      } else {
        const scientistData = {
  full_name: form.name.trim(),
  field: form.field.trim(),
  short_bio: form.bio.trim(),
  photo_url: imageUrl,
};

        const { error } = await supabase
          .from("scientists")
          .insert([scientistData]);

        if (error) {
          console.error("Ekleme hatası:", error);
          alert("Bilim insanı eklenemedi.");
          return;
        }

        alert("Bilim insanı yayınlandı.");
      }

      resetForm();
      await getScientists();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Bir hata oluştu.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function editScientist(scientist: Scientist) {
    setEditingId(scientist.id);

    setForm({
      name: scientist.name || "",
      title: scientist.title || "",
      field: scientist.field || "",
      bio: scientist.bio || "",
    });

    setImageFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteScientist(id: number) {
    const confirmed = window.confirm(
      "Bu bilim insanını silmek istediğinize emin misiniz?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("scientists")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Silme hatası:", error);
      alert("Bilim insanı silinemedi.");
      return;
    }

    alert("Bilim insanı silindi.");
    await getScientists();
  }

  function resetForm() {
    setEditingId(null);

    setForm({
      name: "",
      title: "",
      field: "",
      bio: "",
    });

    setImageFile(null);
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
            Bilim İnsanları
          </h1>

          <p className="mt-3 text-[#65726d]">
            Bilim insanlarını buradan ekleyebilir, düzenleyebilir ve
            silebilirsiniz.
          </p>
        </div>

        {/* FORM */}

        <section className="mb-10 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-[#e1e9e4]">

          <h2 className="text-2xl font-bold text-[#163b2a]">
            {editingId !== null
              ? "Bilim İnsanını Düzenle"
              : "Yeni Bilim İnsanı Ekle"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">

            {/* AD SOYAD */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Ad Soyad
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Örn. Prof. Dr. ..."
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3 outline-none focus:border-[#287fea]"
              />
            </div>

            {/* AKADEMİK ÜNVAN */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Akademik Ünvan
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Örn. Profesör Doktor"
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3 outline-none focus:border-[#287fea]"
              />
            </div>

            {/* ÇALIŞMA ALANI */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Uzmanlık / Çalışma Alanı
              </label>

              <input
                type="text"
                value={form.field}
                onChange={(e) =>
                  setForm({
                    ...form,
                    field: e.target.value,
                  })
                }
                placeholder="Örn. Moleküler Biyoloji"
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3 outline-none focus:border-[#287fea]"
              />
            </div>

            {/* FOTOĞRAF */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Fotoğraf
              </label>

              <input
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

              <p className="mt-2 text-xs text-[#65726d]">
                Fotoğraf eklemek isteğe bağlıdır.
              </p>
            </div>

            {/* BİYOGRAFİ */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Kısa Biyografi
              </label>

              <textarea
                value={form.bio}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bio: e.target.value,
                  })
                }
                rows={5}
                placeholder="Bilim insanı hakkında kısa bilgi..."
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3 outline-none focus:border-[#287fea]"
              />
            </div>

            {/* BUTONLAR */}

            <div className="flex gap-3">

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[#2f6f4e] px-6 py-3 font-semibold text-white transition hover:bg-[#255a3e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Yayınlanıyor..."
                  : editingId !== null
                    ? "Bilim İnsanını Güncelle"
                    : "Bilim İnsanını Yayınla"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-[#d4e0d8] bg-white px-6 py-3 font-semibold text-[#315441]"
                >
                  İptal
                </button>
              )}

            </div>

          </form>
        </section>

        {/* LİSTE */}

        <section>

          <h2 className="mb-6 text-2xl font-bold text-[#163b2a]">
            Yayındaki Bilim İnsanları
          </h2>

          {loading ? (
            <p className="text-[#65726d]">
              Bilim insanları yükleniyor...
            </p>
          ) : scientists.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-[#65726d]">
                Henüz bilim insanı eklenmemiş.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {scientists.map((scientist) => (

                <article
                  key={scientist.id}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e1e9e4]"
                >

                  <div className="flex flex-col justify-between gap-5 md:flex-row">

                    <div className="flex-1">

                      <h3 className="text-xl font-bold text-[#163b2a]">
                        {scientist.name}
                      </h3>

                      {scientist.title && (
                        <p className="mt-1 text-sm font-semibold text-[#287fea]">
                          {scientist.title}
                        </p>
                      )}

                      {scientist.field && (
                        <p className="mt-2 text-sm text-[#65726d]">
                          Alan: {scientist.field}
                        </p>
                      )}

                      {scientist.bio && (
                        <p className="mt-3 text-sm leading-6 text-[#65726d]">
                          {scientist.bio}
                        </p>
                      )}

                    </div>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() => editScientist(scientist)}
                        className="rounded-xl border border-[#d4e0d8] px-4 py-2 text-sm font-semibold text-[#315441] hover:border-[#287fea] hover:text-[#287fea]"
                      >
                        Düzenle
                      </button>

                      <button
                        onClick={() => deleteScientist(scientist.id)}
                        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Sil
                      </button>

                    </div>

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