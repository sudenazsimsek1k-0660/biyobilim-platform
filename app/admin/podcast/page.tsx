"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type Podcast = {
  id: number;
  created_at: string;
  title: string;
  description: string | null;
  speaker: string | null;
  editor: string | null;
  cover_image_url: string | null;
  audio_url: string | null;
  published_at: string | null;
};

export default function PodcastAdminPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [editor, setEditor] = useState("");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  async function getPodcasts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("podcasts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Podcastler yüklenemedi.");
    } else {
      setPodcasts(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    getPodcasts();
  }, []);

  function resetForm() {
    setTitle("");
    setDescription("");
    setSpeaker("");
    setEditor("");
    setCoverFile(null);
    setAudioFile(null);
    setCoverImageUrl("");
    setAudioUrl("");
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isSubmitting) return;

    if (editingId === null && (!coverFile || !audioFile)) {
      alert("Lütfen kapak görselini ve ses dosyasını seçin.");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalCoverUrl = coverImageUrl || null;
      let finalAudioUrl = audioUrl || null;

      // KAPAK GÖRSELİ YÜKLE
      if (coverFile) {
        const safeCoverName = coverFile.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9.-]/g, "-");

        const coverFileName = `${Date.now()}-${safeCoverName}`;

        const { error: coverUploadError } = await supabase.storage
          .from("podcasts")
          .upload(`covers/${coverFileName}`, coverFile);

        if (coverUploadError) {
          console.error(coverUploadError);
          alert(`Kapak görseli yüklenemedi: ${coverUploadError.message}`);
          return;
        }

        const { data: coverUrlData } = supabase.storage
          .from("podcasts")
          .getPublicUrl(`covers/${coverFileName}`);

        finalCoverUrl = coverUrlData.publicUrl;
      }

      // SES DOSYASI YÜKLE
      if (audioFile) {
        const safeAudioName = audioFile.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9.-]/g, "-");

        const audioFileName = `${Date.now()}-${safeAudioName}`;

        const { error: audioUploadError } = await supabase.storage
          .from("podcasts")
          .upload(`audio/${audioFileName}`, audioFile);

        if (audioUploadError) {
          console.error(audioUploadError);
          alert(`Ses dosyası yüklenemedi: ${audioUploadError.message}`);
          return;
        }

        const { data: audioUrlData } = supabase.storage
          .from("podcasts")
          .getPublicUrl(`audio/${audioFileName}`);

        finalAudioUrl = audioUrlData.publicUrl;
      }

      // YENİ PODCAST
      if (editingId === null) {
        const { error } = await supabase.from("podcasts").insert({
          title,
          description,
          speaker,
          editor,
          cover_image_url: finalCoverUrl,
          audio_url: finalAudioUrl,
          published_at: new Date().toISOString(),
        });

        if (error) {
          console.error(error);
          alert(`Podcast eklenemedi: ${error.message}`);
          return;
        }

        alert("Podcast başarıyla yayınlandı.");
      } else {
        // PODCAST GÜNCELLE
        const { error } = await supabase
          .from("podcasts")
          .update({
            title,
            description,
            speaker,
            editor,
            cover_image_url: finalCoverUrl,
            audio_url: finalAudioUrl,
          })
          .eq("id", editingId);

        if (error) {
          console.error(error);
          alert(`Podcast güncellenemedi: ${error.message}`);
          return;
        }

        alert("Podcast başarıyla güncellendi.");
      }

      resetForm();
      await getPodcasts();
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEdit(podcast: Podcast) {
    setEditingId(podcast.id);
    setTitle(podcast.title);
    setDescription(podcast.description || "");
    setSpeaker(podcast.speaker || "");
    setEditor(podcast.editor || "");
    setCoverImageUrl(podcast.cover_image_url || "");
    setAudioUrl(podcast.audio_url || "");
    setCoverFile(null);
    setAudioFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deletePodcast(id: number) {
    const confirmed = window.confirm(
      "Bu podcasti ve dosyalarını silmek istediğinize emin misiniz?"
    );

    if (!confirmed) return;

    const { data: podcast, error: fetchError } = await supabase
      .from("podcasts")
      .select("cover_image_url, audio_url")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error(fetchError);
      alert("Podcast bulunamadı.");
      return;
    }

    const filesToDelete: string[] = [];

    if (podcast.cover_image_url) {
      const coverPath = podcast.cover_image_url.split("/podcasts/")[1];

      if (coverPath) {
        filesToDelete.push(decodeURIComponent(coverPath));
      }
    }

    if (podcast.audio_url) {
      const audioPath = podcast.audio_url.split("/podcasts/")[1];

      if (audioPath) {
        filesToDelete.push(decodeURIComponent(audioPath));
      }
    }

    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("podcasts")
        .remove(filesToDelete);

      if (storageError) {
        console.error(storageError);
        alert(`Dosyalar silinemedi: ${storageError.message}`);
        return;
      }
    }

    const { error } = await supabase
      .from("podcasts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert(`Podcast silinemedi: ${error.message}`);
      return;
    }

    alert("Podcast ve dosyaları silindi.");

    if (editingId === id) {
      resetForm();
    }

    await getPodcasts();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Podcast Yönetimi
          </h1>

          <p className="mt-2 text-gray-600">
            Podcast bölümlerini ekleyebilir, düzenleyebilir ve silebilirsin.
          </p>
        </div>

        {/* FORM */}
        <div className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            {editingId !== null ? "Podcast Düzenle" : "Yeni Podcast Yayınla"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Podcast Başlığı
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Örn: Yapay Zekâ ve Biyoloji"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Açıklama
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Podcast bölümü hakkında kısa açıklama..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Konuşmacı
                </label>

                <input
                  type="text"
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  placeholder="Konuşmacı adı"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Editör
                </label>

                <input
                  type="text"
                  value={editor}
                  onChange={(e) => setEditor(e.target.value)}
                  placeholder="Editör adı"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Kapak Görseli
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                className="block w-full rounded-xl border border-gray-300 p-3"
              />

              {editingId !== null && coverImageUrl && (
                <p className="mt-2 text-sm text-gray-500">
                  Mevcut kapak korunacak. Değiştirmek için yeni dosya seç.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Podcast Ses Dosyası
              </label>

              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="block w-full rounded-xl border border-gray-300 p-3"
              />

              {editingId !== null && audioUrl && (
                <p className="mt-2 text-sm text-gray-500">
                  Mevcut ses dosyası korunacak. Değiştirmek için yeni dosya
                  seç.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Yayınlanıyor..."
                  : editingId !== null
                    ? "Podcasti Güncelle"
                    : "Podcast Yayınla"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                >
                  İptal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LİSTE */}
        <div>
          <h2 className="mb-5 text-xl font-semibold text-gray-900">
            Yayınlanan Podcastler
          </h2>

          {loading ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
              Podcastler yükleniyor...
            </div>
          ) : podcasts.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
              Henüz podcast yayınlanmamış.
            </div>
          ) : (
            <div className="space-y-4">
              {podcasts.map((podcast) => (
                <div
                  key={podcast.id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      {podcast.cover_image_url ? (
                        <img
                          src={podcast.cover_image_url}
                          alt={podcast.title}
                          className="h-20 w-20 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                          Kapak yok
                        </div>
                      )}

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {podcast.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {podcast.speaker || "Konuşmacı belirtilmemiş"}
                        </p>

                        {podcast.editor && (
                          <p className="text-sm text-gray-500">
                            Editör: {podcast.editor}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {podcast.audio_url && (
                        <audio controls className="max-w-full">
                          <source src={podcast.audio_url} />
                        </audio>
                      )}

                      <button
                        type="button"
                        onClick={() => startEdit(podcast)}
                        className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                      >
                        Düzenle
                      </button>

                      <button
                        type="button"
                        onClick={() => deletePodcast(podcast.id)}
                        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}