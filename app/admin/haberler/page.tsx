"use client";

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

export default function AdminHaberlerPage() {
  const supabase = createClient();

  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    image_url: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  async function getNews() {
    setLoading(true);

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Haberler alınamadı:", error);
      alert("Haberler alınamadı.");
    } else {
      setNews(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    getNews();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.content ||
      !form.category
    ) {
      alert("Lütfen zorunlu alanları doldurun.");
      return;
    }

    if (editingId !== null) {
      const { error } = await supabase
        .from("news")
        .update({
          title: form.title,
          description: form.description,
          content: form.content,
          category: form.category,
          image_url: form.image_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId);

      if (error) {
        console.error(error);
        alert("Haber güncellenemedi.");
        return;
      }

      alert("Haber güncellendi.");
    } else {
      const { error } = await supabase.from("news").insert({
        title: form.title,
        description: form.description,
        content: form.content,
        category: form.category,
        image_url: form.image_url || null,
        published_at: new Date().toISOString(),
      });

      if (error) {
        console.error(error);
        alert("Haber eklenemedi.");
        return;
      }

      alert("Haber başarıyla yayınlandı.");
    }

    resetForm();
    await getNews();
  }

  function editNews(item: News) {
    setEditingId(item.id);

    setForm({
      title: item.title,
      description: item.description,
      content: item.content,
      category: item.category,
      image_url: item.image_url || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteNews(id: number) {
    const confirmed = window.confirm(
      "Bu haberi silmek istediğinize emin misiniz?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("news")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Haber silinemedi.");
      return;
    }

    alert("Haber silindi.");
    await getNews();
  }

  function resetForm() {
    setEditingId(null);

    setForm({
      title: "",
      description: "",
      content: "",
      category: "",
      image_url: "",
    });
  }

  return (
    <main className="min-h-screen bg-[#f5f8f6] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#287fea]">
            Biyobilim Yönetim Paneli
          </p>

          <h1 className="mt-3 text-4xl font-bold text-[#163b2a]">
            Haberler
          </h1>

          <p className="mt-3 text-[#65726d]">
            Bilimsel haberleri buradan ekleyebilir, düzenleyebilir ve
            silebilirsiniz.
          </p>
        </div>

        <section className="mb-10 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-[#e1e9e4]">

          <h2 className="text-2xl font-bold text-[#163b2a]">
            {editingId !== null ? "Haberi Düzenle" : "Yeni Haber Ekle"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Başlık
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3 outline-none focus:border-[#287fea]"
                placeholder="Haber başlığı"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Kategori
              </label>

              <input
                type="text"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3 outline-none focus:border-[#287fea]"
                placeholder="Örn. Genetik"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Açıklama
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3 outline-none focus:border-[#287fea]"
                placeholder="Kısa haber açıklaması"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                İçerik
              </label>

              <textarea
                value={form.content}
                onChange={(e) =>
                  setForm({ ...form, content: e.target.value })
                }
                rows={8}
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3 outline-none focus:border-[#287fea]"
                placeholder="Haberin tam içeriği"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Görsel URL
              </label>

              <input
                type="text"
                value={form.image_url}
                onChange={(e) =>
                  setForm({ ...form, image_url: e.target.value })
                }
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3 outline-none focus:border-[#287fea]"
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-3">

              <button
                type="submit"
                className="rounded-xl bg-[#2f6f4e] px-6 py-3 font-semibold text-white transition hover:bg-[#255a3e]"
              >
                {editingId !== null
                  ? "Haberi Güncelle"
                  : "Haberi Yayınla"}
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

        <section>

          <h2 className="mb-6 text-2xl font-bold text-[#163b2a]">
            Yayındaki Haberler
          </h2>

          {loading ? (
            <p className="text-[#65726d]">Haberler yükleniyor...</p>
          ) : news.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-[#65726d]">
                Henüz haber bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {news.map((item) => (

                <article
                  key={item.id}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e1e9e4]"
                >

                  <div className="flex flex-col justify-between gap-5 md:flex-row">

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <span className="rounded-full bg-[#eef5f1] px-3 py-1 text-xs font-semibold text-[#2f6f4e]">
                          {item.category}
                        </span>

                        {item.published_at && (
                          <span className="text-xs text-gray-400">
                            {new Date(
                              item.published_at
                            ).toLocaleDateString("tr-TR")}
                          </span>
                        )}

                      </div>

                      <h3 className="mt-3 text-xl font-bold text-[#163b2a]">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#65726d]">
                        {item.description}
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() => editNews(item)}
                        className="rounded-xl border border-[#d4e0d8] px-4 py-2 text-sm font-semibold text-[#315441] hover:border-[#287fea] hover:text-[#287fea]"
                      >
                        Düzenle
                      </button>

                      <button
                        onClick={() => deleteNews(item.id)}
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