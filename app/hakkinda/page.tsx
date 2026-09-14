import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkında | Biyobilim",
  description:
    "Biyobilim Topluluğu hakkında bilgi, misyonumuz, vizyonumuz ve faaliyet alanlarımız.",
};

const activities = [
  {
    title: "Bilimsel İçerik",
    description:
      "Biyoloji ve yaşam bilimleri alanındaki güncel gelişmeleri öğrencilerle buluşturan içerikler hazırlıyoruz.",
  },
  {
    title: "Akademik Gelişim",
    description:
      "Öğrencilerin bilimsel düşünme, araştırma ve akademik becerilerini geliştirmelerine katkı sağlayan çalışmalar yürütüyoruz.",
  },
  {
    title: "Çevre ve Doğa",
    description:
      "Biyolojik çeşitlilik, çevre bilinci ve doğanın korunmasına yönelik farkındalık çalışmaları gerçekleştiriyoruz.",
  },
  {
    title: "Topluluk Etkinlikleri",
    description:
      "Seminerler, söyleşiler, atölyeler, doğa etkinlikleri ve öğrencilerin aktif rol aldığı çeşitli faaliyetler düzenliyoruz.",
  },
];

export default function HakkindaPage() {
  return (
    <main className="min-h-screen bg-[#f7f9f7]">

      {/* HERO */}

      <section className="relative overflow-hidden bg-[#061a16] px-6 py-24 lg:px-8 lg:py-32">

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#287fea]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-[400px] w-[500px] rounded-full bg-[#2f6f4e]/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#4aaeff]">
            Biyobilim
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight text-white md:text-6xl lg:text-7xl">
            Bilimle öğreniyor,
            <br />
            <span className="text-[#4aaeff]">birlikte üretiyoruz.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d7e3e1] md:text-xl">
            Biyobilim Topluluğu; biyoloji, bilim, doğa ve akademik gelişimi
            bir araya getiren öğrenci odaklı bir bilim topluluğudur.
          </p>

        </div>
      </section>


      {/* BİZ KİMİZ? */}

      <section className="px-6 py-20 lg:px-8 lg:py-24">

        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-center">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#287fea]">
              Biz Kimiz?
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#163b2a] md:text-4xl">
              Bilimi yalnızca öğrenmekle kalmıyoruz.
            </h2>

          </div>

          <div className="space-y-5 text-base leading-8 text-[#52645b]">

            <p>
              Biyobilim Topluluğu, öğrencilerin biyoloji ve yaşam bilimleri
              alanındaki ilgilerini geliştirmelerini, bilimsel düşünme
              becerilerini güçlendirmelerini ve farklı disiplinlerden
              öğrencilerle bir araya gelmelerini amaçlayan bir öğrenci
              topluluğudur.
            </p>

            <p>
              Bilimsel içeriklerden akademik etkinliklere, doğa
              çalışmalarından öğrenci projelerine kadar farklı alanlarda
              faaliyet göstererek öğrencilerin bilimle daha aktif bir ilişki
              kurmasına katkı sağlamayı hedefliyoruz.
            </p>

          </div>

        </div>

      </section>


      {/* MİSYON & VİZYON */}

      <section className="border-y border-[#dce5df] bg-white px-6 py-20 lg:px-8 lg:py-24">

        <div className="mx-auto grid max-w-6xl gap-7 md:grid-cols-2">

          <div className="rounded-3xl bg-[#edf6f1] p-8 md:p-10">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#287fea]">
              Misyonumuz
            </p>

            <h2 className="mt-4 text-3xl font-bold text-[#163b2a]">
              Bilime erişimi ve katılımı artırmak.
            </h2>

            <p className="mt-5 leading-8 text-[#52645b]">
              Öğrencilerin bilimsel bilgiye erişmesini, araştırma kültürü
              kazanmasını ve bilimsel üretim süreçlerinde aktif rol almasını
              desteklemek.
            </p>

          </div>


          <div className="rounded-3xl bg-[#eef5ff] p-8 md:p-10">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#287fea]">
              Vizyonumuz
            </p>

            <h2 className="mt-4 text-3xl font-bold text-[#163b2a]">
              Üreten ve paylaşan bir bilim topluluğu.
            </h2>

            <p className="mt-5 leading-8 text-[#52645b]">
              Öğrencilerin bilimsel meraklarını destekleyen, farklı
              disiplinleri bir araya getiren ve bilim kültürünü kampüsün
              ötesine taşıyan güçlü bir topluluk oluşturmak.
            </p>

          </div>

        </div>

      </section>


      {/* FAALİYETLER */}

      <section className="px-6 py-20 lg:px-8 lg:py-24">

        <div className="mx-auto max-w-6xl">

          <div className="mb-12">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#287fea]">
              Neler Yapıyoruz?
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#163b2a] md:text-4xl">
              Bilim, doğa ve öğrenci gelişimi
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#65726d]">
              Farklı alanlarda gerçekleştirdiğimiz çalışmalarla öğrencilerin
              hem akademik hem de sosyal gelişimlerine katkı sağlıyoruz.
            </p>

          </div>


          <div className="grid gap-6 md:grid-cols-2">

            {activities.map((activity) => (
              <article
                key={activity.title}
                className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#e1e9e4] transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="mb-6 h-1 w-12 rounded-full bg-[#287fea]" />

                <h3 className="text-xl font-bold text-[#163b2a]">
                  {activity.title}
                </h3>

                <p className="mt-4 leading-7 text-[#65726d]">
                  {activity.description}
                </p>

              </article>
            ))}

          </div>

        </div>

      </section>


      {/* KAPANIŞ */}

      <section className="px-6 pb-20 lg:px-8 lg:pb-24">

        <div className="mx-auto max-w-6xl">

          <div className="overflow-hidden rounded-3xl bg-[#061a16] px-8 py-14 text-center md:px-12">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4aaeff]">
              Biyobilim Topluluğu
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold text-white md:text-4xl">
              Bilimin bir parçası olmak için merak etmek yeterli.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#c9d8d4]">
              Öğrenmek, üretmek, paylaşmak ve bilime birlikte katkı sağlamak
              için Biyobilim'e katılın.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}