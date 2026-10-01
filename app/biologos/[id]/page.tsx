import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import PdfViewer from "./PdfViewer";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BiologosReaderPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = (await createClient()) as any;

  const { data: issue, error } = await supabase
    .from("biologos")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !issue) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9f7] px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#163b2a]">
            Dergi bulunamadı
          </h1>

          <p className="mt-3 text-[#65726d]">
            Aradığınız BIOLOGOS sayısı mevcut değil.
          </p>

          <Link
            href="/biologos"
            className="mt-6 inline-flex rounded-xl bg-[#2f6f4e] px-5 py-3 font-semibold text-white transition hover:bg-[#255a3e]"
          >
            Dergi Arşivine Dön
          </Link>
        </div>
      </main>
    );
  }

  if (!issue.pdf_url) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9f7] px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#163b2a]">
            PDF bulunamadı
          </h1>

          <p className="mt-3 text-[#65726d]">
            Bu sayı için henüz bir PDF yüklenmemiş.
          </p>

          <Link
            href="/biologos"
            className="mt-6 inline-flex rounded-xl bg-[#2f6f4e] px-5 py-3 font-semibold text-white transition hover:bg-[#255a3e]"
          >
            Dergi Arşivine Dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#071a14]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071a14]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/biologos"
            className="flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
          >
            <span className="text-lg">←</span>
            <span className="hidden sm:inline">
              BIOLOGOS Arşivi
            </span>
          </Link>

          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8ec5ff]">
              BIOLOGOS
            </p>

            <h1 className="mt-1 text-sm font-bold text-white sm:text-base">
              {issue.title}
            </h1>
          </div>

          <div className="w-[90px] sm:w-[130px]" />
        </div>
      </header>

      <section className="px-2 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-6xl">
          <PdfViewer pdfUrl={issue.pdf_url} />
        </div>
      </section>
    </main>
  );
}