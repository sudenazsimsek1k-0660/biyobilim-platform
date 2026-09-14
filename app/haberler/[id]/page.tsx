import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

type News = {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  image_url: string | null;
  published_at: string | null;
};

export default async function HaberDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single<News>();

  if (error || !news) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7]">

      {/* ÜST */}
      <section className="bg-[#071a14] px-6 py-20">
        <div className="mx-auto max-w-4xl">

          <Link
            href="/haberler"
            className="text-sm font-semibold text-[#8ec5ff] hover:text-white"
          >
            ← Haberler
          </Link>

          <div className="mt-8">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8ec5ff]">
              {news.category}
            </span>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
              {news.title}
            </h1>

            {news.published_at && (
              <p className="mt-5 text-sm text-white/60">
                {new Date(news.published_at).toLocaleDateString("tr-TR")}
              </p>
            )}
          </div>

        </div>
      </section>

      {/* HABER */}
      <article className="px-6 py-16">
        <div className="mx-auto max-w-4xl">

          {news.image_url && (
            <img
              src={news.image_url}
              alt={news.title}
              className="mb-10 max-h-[500px] w-full rounded-3xl object-cover"
            />
          )}

          <p className="mb-8 text-xl leading-8 font-medium text-[#315441]">
            {news.description}
          </p>

          <div className="whitespace-pre-line text-base leading-8 text-[#3f4742]">
            {news.content}
          </div>

          <div className="mt-12 border-t border-[#dce5df] pt-8">
            <Link
              href="/haberler"
              className="font-semibold text-[#2f6f4e] hover:text-[#2f80ed]"
            >
              ← Tüm Haberlere Dön
            </Link>
          </div>

        </div>
      </article>

    </main>
  );
}