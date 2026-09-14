import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type Biologos = {
  id: number;
  title: string;
  description: string | null;
  issue_number: number | null;
  cover_image_url: string | null;
  pdf_url: string | null;
  published_at: string | null;
};

export default async function BiologosPage() {
  const supabase = (await createClient()) as any;

  const { data: issues, error } = await supabase
    .from("biologos")
    .select("*")
    .order("issue_number", { ascending: false });

  if (error) {
    console.error("BIOLOGOS verileri alınamadı:", error);
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7]">

      {/* BAŞLIK */}
      <section className="relative overflow-hidden bg-[#071a14] px-6 py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(47,128,237,0.20),transparent_45%)]" />

        <div className="relative mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8ec5ff]">
            Biyobilim Öğrenci Dergisi
          </p>

          <h1 className="mt-5 text-5xl font-bold tracking-tight text-[#dcecff] md:text-6xl lg:text-7xl">
            BIOLOGOS
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/75 md:text-xl">
            Biyoloji, bilim ve doğa üzerine hazırladığımız öğrenci dergisinin
            sayılarını keşfedin.
          </p>
        </div>
      </section>

      {/* SAYILAR */}
      <section className="px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">

          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5c8a6b]">
              Dergi Arşivi
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#163b2a] md:text-4xl">
              BIOLOGOS Sayıları
            </h2>
          </div>

          {!issues || issues.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-[#e1e9e4]">
              <p className="text-[#65726d]">
                Henüz yayınlanmış bir BIOLOGOS sayısı bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {issues.map((issue: any) => (
                <article
                  key={issue.id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#e1e9e4] transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* KAPAK */}
                  <div className="relative flex h-80 items-center justify-center overflow-hidden bg-gradient-to-br from-[#dfeee5] via-[#eef5f0] to-[#dcecff]">

                    {issue.cover_image_url ? (
                      <img
                        src={issue.cover_image_url}
                        alt={issue.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5c8a6b]">
                          BIOLOGOS
                        </p>

                        {issue.issue_number && (
                          <p className="mt-3 text-3xl font-bold text-[#163b2a]">
                            Sayı {issue.issue_number}
                          </p>
                        )}
                      </div>
                    )}

                  </div>

                  {/* İÇERİK */}
                  <div className="p-7">

                    {issue.issue_number && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#2f80ed]">
                        Sayı {issue.issue_number}
                      </span>
                    )}

                    <h3 className="mt-3 text-xl font-bold leading-7 text-[#163b2a] transition group-hover:text-[#2f80ed]">
                      {issue.title}
                    </h3>

                    {issue.description && (
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {issue.description}
                      </p>
                    )}

                    {issue.published_at && (
                      <p className="mt-4 text-xs text-gray-400">
                        {new Date(issue.published_at).toLocaleDateString(
                          "tr-TR"
                        )}
                      </p>
                    )}

                    {issue.pdf_url && (
                      <a
                        href={issue.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center font-semibold text-[#2f6f4e] transition hover:text-[#2f80ed]"
                      >
                        Dergiyi Görüntüle
                        <span className="ml-2">→</span>
                      </a>
                    )}

                  </div>

                </article>
              ))}

            </div>
          )}

        </div>
      </section>

    </main>
  );
}