"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Biologos = {
  id: number;
  created_at: string;
  title: string;
  description: string;
  issue_number: number;
  cover_image_url: string | null;
  pdf_url: string | null;
  published_at: string | null;
};

export default function AdminBiologosPage() {
  const supabase = createClient();

  const [issues, setIssues] = useState<Biologos[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    issue_number: "",
    cover_image_url: "",
    pdf_url: "",
  });
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);

  async function getIssues() {
    setLoading(true);

    const { data, error } = await supabase
      .from("biologos")
      .select("*")
      .order("issue_number", { ascending: false });

    if (error) {
      console.error("BIOLOGOS sayıları alınamadı:", error);
      alert("BIOLOGOS sayıları alınamadı.");
    } else {
      setIssues(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    getIssues();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

      if (isSubmitting) return;
  setIsSubmitting(true);

  try{

    if (editingId === null && (!coverFile || !pdfFile)) {
  alert("Lütfen kapak görselini ve PDF dosyasını seçin.");
  return;
}

    if (
      !form.title ||
      !form.description ||
      !form.issue_number
    ) {
      alert("Lütfen zorunlu alanları doldurun.");
      return;
    }

let coverImageUrl = form.cover_image_url || null;
let pdfUrl = form.pdf_url || null;

// Yeni kapak seçildiyse yükle
if (coverFile) {
  const fileName = `${Date.now()}-${coverFile.name}`;

  const { error: coverUploadError } = await supabase.storage
    .from("biologos")
    .upload(`covers/${fileName}`, coverFile);

  if (coverUploadError) {
    console.error(coverUploadError);
    alert("Kapak görseli yüklenemedi.");
    return;
  }

  const { data: coverUrlData } = supabase.storage
    .from("biologos")
    .getPublicUrl(`covers/${fileName}`);

  coverImageUrl = coverUrlData.publicUrl;
}

// Yeni PDF seçildiyse yükle
if (pdfFile) {
  const safePdfName = pdfFile.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "-");

  const pdfFileName = `${Date.now()}-${safePdfName}`;

  const { error: pdfUploadError } = await supabase.storage
    .from("biologos")
    .upload(`pdfs/${pdfFileName}`, pdfFile);

  if (pdfUploadError) {
    console.error(pdfUploadError);
    alert(`PDF yüklenemedi: ${pdfUploadError.message}`);
    return;
  }

  const { data: pdfUrlData } = supabase.storage
    .from("biologos")
    .getPublicUrl(`pdfs/${pdfFileName}`);

  pdfUrl = pdfUrlData.publicUrl;
}

    if (editingId !== null) {
      const { error } = await supabase
        .from("biologos")
        .update({
          title: form.title,
          description: form.description,
          issue_number: Number(form.issue_number),
          cover_image_url: form.cover_image_url || null,
          pdf_url: form.pdf_url || null,
        })
        .eq("id", editingId);

      if (error) {
        console.error(error);
        alert("BIOLOGOS sayısı güncellenemedi.");
        return;
      }

      alert("BIOLOGOS sayısı güncellendi.");
    } else {
      const { error } = await supabase.from("biologos").insert({
        title: form.title,
        description: form.description,
        issue_number: Number(form.issue_number),
        cover_image_url: coverImageUrl,
        pdf_url: pdfUrl,
        published_at: new Date().toISOString(),
      });

      if (error) {
  console.error(error);
  alert(`BIOLOGOS sayısı eklenemedi: ${error.message}`);
  return;
}

      alert("BIOLOGOS sayısı başarıyla yayınlandı.");
    }

    resetForm();
    await getIssues();

      } finally {
    setIsSubmitting(false);
  }
  }

  function editIssue(item: Biologos) {
    setEditingId(item.id);

    setForm({
      title: item.title,
      description: item.description,
      issue_number: String(item.issue_number),
      cover_image_url: item.cover_image_url || "",
      pdf_url: item.pdf_url || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

 async function deleteIssue(id: number) {
  const confirmed = window.confirm(
    "Bu BIOLOGOS sayısını ve dosyalarını silmek istediğinize emin misiniz?"
  );

  if (!confirmed) return;

  // Önce kaydın dosya adreslerini al
  const { data: issue, error: fetchError } = await supabase
    .from("biologos")
    .select("cover_image_url, pdf_url")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error(fetchError);
    alert("BIOLOGOS sayısı bulunamadı.");
    return;
  }

  // Storage'daki dosya yollarını URL'den çıkar
  const filesToDelete: string[] = [];

  if (issue.cover_image_url) {
    const coverPath = issue.cover_image_url.split("/biologos/")[1];

    if (coverPath) {
      filesToDelete.push(decodeURIComponent(coverPath));
    }
  }

  if (issue.pdf_url) {
    const pdfPath = issue.pdf_url.split("/biologos/")[1];

    if (pdfPath) {
      filesToDelete.push(decodeURIComponent(pdfPath));
    }
  }

  // Storage'daki dosyaları sil
  if (filesToDelete.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("biologos")
      .remove(filesToDelete);

    if (storageError) {
      console.error(storageError);
      alert("Dosyalar silinemedi.");
      return;
    }
  }

  // Veritabanındaki kaydı sil
  const { error } = await supabase
    .from("biologos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("BIOLOGOS sayısı silinemedi.");
    return;
  }

  alert("BIOLOGOS sayısı ve dosyaları silindi.");
  await getIssues();
}

  function resetForm() {
    setEditingId(null);

    setForm({
      title: "",
      description: "",
      issue_number: "",
      cover_image_url: "",
      pdf_url: "",
    });

    setCoverFile(null);
setPdfFile(null);

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
            BIOLOGOS
          </h1>

          <p className="mt-3 text-[#65726d]">
            BIOLOGOS dergi sayılarını buradan ekleyebilir,
            düzenleyebilir ve silebilirsiniz.
          </p>
        </div>

        {/* FORM */}

        <section className="mb-10 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-[#e1e9e4]">

          <h2 className="text-2xl font-bold text-[#163b2a]">
            {editingId !== null
              ? "Sayının Bilgilerini Düzenle"
              : "Yeni BIOLOGOS Sayısı Ekle"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">

            {/* BAŞLIK */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Başlık
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
                placeholder="Örn. BIOLOGOS 1. Sayı"
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3 outline-none focus:border-[#287fea]"
              />
            </div>

            {/* SAYI NUMARASI */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Sayı Numarası
              </label>

              <input
                type="number"
                min="1"
                value={form.issue_number}
                onChange={(e) =>
                  setForm({
                    ...form,
                    issue_number: e.target.value,
                  })
                }
                placeholder="Örn. 1"
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3 outline-none focus:border-[#287fea]"
              />
            </div>

            {/* AÇIKLAMA */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#315441]">
                Açıklama
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                rows={4}
                placeholder="Dergi sayısı hakkında kısa açıklama"
                className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3 outline-none focus:border-[#287fea]"
              />
            </div>

            {/* KAPAK */}

<div>
  <label className="mb-2 block text-sm font-semibold text-[#315441]">
    Kapak Görseli
  </label>

  <input
    type="file"
    accept="image/png,image/jpeg,image/webp"
    onChange={(e) =>
      setCoverFile(e.target.files?.[0] || null)
    }
    className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3"
  />

  {coverFile && (
    <p className="mt-2 text-sm text-[#65726d]">
      Seçilen dosya: {coverFile.name}
    </p>
  )}
</div>


            {/* PDF */}

<div>
  <label className="mb-2 block text-sm font-semibold text-[#315441]">
    Dergi PDF
  </label>

  <input
    type="file"
    accept="application/pdf"
    onChange={(e) =>
      setPdfFile(e.target.files?.[0] || null)
    }
    className="w-full rounded-xl border border-[#d4e0d8] px-4 py-3"
  />

  {pdfFile && (
    <p className="mt-2 text-sm text-[#65726d]">
      Seçilen dosya: {pdfFile.name}
    </p>
  )}
</div>

            {/* BUTONLAR */}

            <div className="flex gap-3">

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[#2f6f4e] px-6 py-3 font-semibold text-white transition hover:bg-[#255a3e]"
              >
                {editingId !== null
                  ? "Sayısı Güncelle"
                  : "Sayısı Yayınla"}
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
            Yayındaki BIOLOGOS Sayıları
          </h2>

          {loading ? (
            <p className="text-[#65726d]">
              BIOLOGOS sayıları yükleniyor...
            </p>
          ) : issues.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-[#65726d]">
                Henüz BIOLOGOS sayısı bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {issues.map((item) => (

                <article
                  key={item.id}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e1e9e4]"
                >

                  <div className="flex flex-col justify-between gap-5 md:flex-row">

                    <div className="flex-1">

                      <span className="inline-flex rounded-full bg-[#eef5f1] px-3 py-1 text-xs font-semibold text-[#2f6f4e]">
                        Sayı {item.issue_number}
                      </span>

                      <h3 className="mt-3 text-xl font-bold text-[#163b2a]">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#65726d]">
                        {item.description}
                      </p>

                      {item.published_at && (
                        <p className="mt-3 text-xs text-gray-400">
                          Yayın tarihi:{" "}
                          {new Date(
                            item.published_at
                          ).toLocaleDateString("tr-TR")}
                        </p>
                      )}

                    </div>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() => editIssue(item)}
                        className="rounded-xl border border-[#d4e0d8] px-4 py-2 text-sm font-semibold text-[#315441] hover:border-[#287fea] hover:text-[#287fea]"
                      >
                        Düzenle
                      </button>

                      <button
                        onClick={() => deleteIssue(item.id)}
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