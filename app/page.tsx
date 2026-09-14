import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ana Sayfa",
};

const sections = [
  {
    title: "Haberler",
    description:
      "Bilim dünyasından güncel gelişmeler, araştırmalar ve biyoloji alanındaki dikkat çekici çalışmalar.",
    href: "/haberler",
  },
  {
    title: "Etkinlikler",
    description:
      "Biyobilim Topluluğu tarafından düzenlenen etkinlikleri, seminerleri ve bilimsel buluşmaları keşfedin.",
    href: "/etkinlikler",
  },
  {
    title: "BIOLOGOS",
    description:
      "Öğrencilerin bilimsel merakını ve üretimini yansıtan topluluk dergimizi keşfedin.",
    href: "/biologos",
  },
  {
    title: "Podcast",
    description:
      "Bilim, biyoloji ve yaşam bilimleri üzerine sohbetler, röportajlar ve farklı bakış açıları.",
    href: "/podcast",
  },
  {
    title: "Bilim İnsanları",
    description:
      "Bilime yön veren araştırmacıları, çalışmalarını ve bilim dünyasına katkılarını tanıyın.",
    href: "/bilim-insanlari",
  },
  {
    title: "Doğa Fotoğrafçılığı",
    description:
      "Doğanın çeşitliliğini ve canlı yaşamını fotoğraf kareleriyle keşfedin.",
    href: "/doga-fotografciligi",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#163b2a]">

      {/* ==================================================
          HERO
      ================================================== */}
      <section className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden">

        {/* DNA ARKA PLAN */}
        <div className="absolute inset-0">
          <img
            src="/dna-background.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        {/* KOYU OVERLAY */}
        <div className="absolute inset-0 bg-[#071a14]/60" />

        {/* MAVİ PARLAKLIK */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(47,128,237,0.22),transparent_45%)]" />

        {/* ==================================================
            HERO LOGOSU - SADECE MASAÜSTÜ
            Mobilde görünmez, mevcut mobil tasarım bozulmaz.
            ================================================== */}
        <div className="pointer-events-none absolute right-[7%] top-1/2 z-10 hidden -translate-y-1/2 lg:block">
          <img
            src="/logo.png"
            alt=""
            className="h-80 w-80 object-contain"
          />
        </div>

        {/* İÇERİK */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-3xl">

            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-[#a8d5bd]">
              Biyobilim Topluluğu
            </p>

            <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
              Bilimin peşinde,
              <br />
              <span className="text-[#8ec5ff]">
                doğanın yanında.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
              Biyoloji başta olmak üzere farklı bilim alanlarına ilgi duyan
              öğrencileri bir araya getiriyor, bilimsel düşünceyi ve araştırma
              kültürünü kampüs yaşamının bir parçası hâline getiriyoruz.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href="/haberler"
                className="rounded-full bg-[#2f80ed] px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-[#60aaff]"
              >
                Haberleri Keşfet
              </Link>

              <Link
                href="/biologos"
                className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                BIOLOGOS
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          KISA TANITIM
      ================================================== */}
      <section className="border-y border-[#dce5df] bg-white px-6 py-20 md:py-24">

        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1fr_1.4fr] md:items-center">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5c8a6b]">
              Biz Kimiz?
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Merak eden,
              <br />
              araştıran,
              <br />
              üreten bir topluluk.
            </h2>

          </div>

          <div className="max-w-2xl">

            <p className="text-lg leading-8 text-[#52645b]">
              2022 yılında kurulan Biyobilim Topluluğu, Niğde Ömer Halisdemir
              Üniversitesi çatısı altında öğrencileri bilimsel merak,
              araştırma, doğa ve akademik gelişim etrafında bir araya getiriyor.
            </p>

            <p className="mt-5 text-lg leading-8 text-[#52645b]">
              Biyoloji başta olmak üzere farklı bilim alanlarını takip ediyor,
              bilimsel içerikler üretiyor, etkinlikler düzenliyor ve öğrencilerin
              bilimle daha güçlü bir bağ kurabileceği bir ortam oluşturuyoruz.
            </p>

            <Link
              href="/hakkinda"
              className="mt-7 inline-flex font-semibold text-[#2f6f4e] transition hover:text-[#163b2a]"
            >
              Biyobilim hakkında →
            </Link>

          </div>

        </div>
      </section>

      {/* ==================================================
          ATATÜRK SÖZÜ
      ================================================== */}
      <section className="border-t border-[#dce5df] bg-[#f7f9f7] px-6 py-20 lg:px-8 lg:py-24">

        <div className="mx-auto max-w-4xl text-center">

          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f1eb] text-3xl text-[#3f7d5a]">
            “
          </div>

          <blockquote className="text-2xl font-semibold leading-relaxed tracking-tight text-[#163b2a] md:text-3xl lg:text-4xl">
            “Hayatta en hakiki mürşit ilimdir.”
          </blockquote>

          <div className="mx-auto mt-7 h-px w-12 bg-[#3f7d5a]" />

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#5c8a6b]">
            Mustafa Kemal Atatürk
          </p>

        </div>
      </section>

      {/* ==================================================
          KEŞFET
      ================================================== */}
      <section className="bg-white px-6 py-24 md:py-28">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5c8a6b]">
              Keşfet
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Bilimin farklı alanlarına göz atın.
            </h2>

            <p className="mt-5 text-lg leading-8 text-[#66756c]">
              Haberlerden podcastlere, topluluk dergimizden doğa fotoğraflarına
              kadar Biyobilim&apos;in ürettiği ve takip ettiği içerikleri keşfedin.
            </p>

          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {sections.map((section) => (

              <Link
                key={section.title}
                href={section.href as any}
                className="group rounded-3xl border border-[#e1e8e3] bg-[#f9fbf9] p-8 transition duration-300 hover:-translate-y-1 hover:border-[#b9cdbf] hover:shadow-lg"
              >

                <div className="flex items-start justify-between gap-4">

                  <h3 className="text-xl font-semibold">
                    {section.title}
                  </h3>

                  <span className="text-xl text-[#6b8e78] transition-transform group-hover:translate-x-1">
                    →
                  </span>

                </div>

                <p className="mt-4 leading-7 text-[#66756c]">
                  {section.description}
                </p>

              </Link>

            ))}

          </div>

        </div>
      </section>

      {/* ==================================================
          TOPLULUK CTA
      ================================================== */}
      <section className="px-6 py-24">

        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#163b2a] px-8 py-16 text-center text-white md:px-16 md:py-20">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#a8c6b0]">
            Biyobilim Topluluğu
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-[#8EC5FF] md:text-5xl">
            Bilime birlikte katkı sağlayalım.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#c7d7cc]">
            Bilimsel etkinliklere katılın, içeriklerimizi takip edin ve
            Biyobilim topluluğunun bir parçası olun.
          </p>

          <div className="mt-9">

            <Link
              href="/uye-ol"
              className="inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#163b2a] transition hover:bg-[#e8f1eb]"
            >
              Topluluğa Katıl
            </Link>

          </div>

        </div>
      </section>

      {/* ==================================================
          FOOTER
      ================================================== */}
      <footer className="border-t border-[#dce5df] bg-white px-6 py-12">

        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="font-semibold text-[#163b2a]">
              Biyobilim Topluluğu
            </p>

            <p className="mt-2 text-sm text-[#7a877f]">
              Bilim • Doğa • Biyoloji
            </p>

          </div>

          <div className="flex flex-wrap gap-5 text-sm text-[#66756c]">

            <Link
              href="/hakkinda"
              className="hover:text-[#2f6f4e]"
            >
              Hakkında
            </Link>

            <Link
              href="/haberler"
              className="hover:text-[#2f6f4e]"
            >
              Haberler
            </Link>

            <Link
              href="/etkinlikler"
              className="hover:text-[#2f6f4e]"
            >
              Etkinlikler
            </Link>

            <Link
              href="/uye-ol"
              className="hover:text-[#2f6f4e]"
            >
              Üye Ol
            </Link>

          </div>

        </div>
      </footer>

    </main>
  );
}