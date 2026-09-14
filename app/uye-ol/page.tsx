"use client";

import { FormEvent, useState } from "react";

export default function UyeOlPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);

  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    department: formData.get("department"),
    class_year: formData.get("year"),
    message: formData.get("message"),
  };

  try {
    const response = await fetch("/api/membership", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Başvuru gönderilemedi.");
    }

    setSubmitted(true);
    form.reset();
  } catch (error) {
    console.error(error);
    alert("Başvuru gönderilemedi. Lütfen tekrar deneyin.");
  }
}

  return (
    <main className="min-h-screen bg-[#f7f9f7] px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-2xl">

        {/* BAŞLIK */}

        <div className="mb-10 text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#287fea]">
            Biyobilim Topluluğu
          </p>

          <h1 className="mt-3 text-4xl font-bold text-[#163b2a] md:text-5xl">
            Üye Ol
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#65726d]">
            Biyobilim Topluluğu'na katılmak için aşağıdaki formu
            doldurabilirsiniz.
          </p>

        </div>


        {/* FORM */}

        <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#e1e9e4] md:p-10">

          {submitted ? (
            <div className="py-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f1eb] text-2xl text-[#2f6f4e]">
                ✓
              </div>

              <h2 className="mt-5 text-2xl font-bold text-[#163b2a]">
                Başvurunuz alındı
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#65726d]">
                Üyelik başvurunuz başarıyla oluşturuldu. Teşekkür ederiz.
              </p>

            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* AD SOYAD */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#315441]"
                >
                  Ad Soyad
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Adınız ve soyadınız"
                  className="w-full rounded-xl border border-[#d4e0d8] bg-[#fbfcfb] px-4 py-3 text-sm text-[#163b2a] outline-none transition placeholder:text-gray-400 focus:border-[#287fea] focus:ring-2 focus:ring-[#287fea]/10"
                />
              </div>


              {/* E-POSTA */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#315441]"
                >
                  E-posta
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="ornek@mail.com"
                  className="w-full rounded-xl border border-[#d4e0d8] bg-[#fbfcfb] px-4 py-3 text-sm text-[#163b2a] outline-none transition placeholder:text-gray-400 focus:border-[#287fea] focus:ring-2 focus:ring-[#287fea]/10"
                />
              </div>


              {/* TELEFON */}

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-[#315441]"
                >
                  Telefon
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  className="w-full rounded-xl border border-[#d4e0d8] bg-[#fbfcfb] px-4 py-3 text-sm text-[#163b2a] outline-none transition placeholder:text-gray-400 focus:border-[#287fea] focus:ring-2 focus:ring-[#287fea]/10"
                />
              </div>


              {/* BÖLÜM */}

              <div>
                <label
                  htmlFor="department"
                  className="mb-2 block text-sm font-semibold text-[#315441]"
                >
                  Bölüm
                </label>

                <input
                  id="department"
                  name="department"
                  type="text"
                  placeholder="Bölümünüz"
                  className="w-full rounded-xl border border-[#d4e0d8] bg-[#fbfcfb] px-4 py-3 text-sm text-[#163b2a] outline-none transition placeholder:text-gray-400 focus:border-[#287fea] focus:ring-2 focus:ring-[#287fea]/10"
                />
              </div>


              {/* SINIF */}

              <div>
                <label
                  htmlFor="year"
                  className="mb-2 block text-sm font-semibold text-[#315441]"
                >
                  Sınıf
                </label>

                <select
                  id="year"
                  name="year"
                  defaultValue=""
                  className="w-full rounded-xl border border-[#d4e0d8] bg-[#fbfcfb] px-4 py-3 text-sm text-[#163b2a] outline-none transition focus:border-[#287fea] focus:ring-2 focus:ring-[#287fea]/10"
                >
                  <option value="" disabled>
                    Sınıfınızı seçin
                  </option>
                  <option value="1">1. Sınıf</option>
                  <option value="2">2. Sınıf</option>
                  <option value="3">3. Sınıf</option>
                  <option value="4">4. Sınıf</option>
                  <option value="mezun">Mezun</option>
                </select>
              </div>


              {/* MESAJ */}

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-[#315441]"
                >
                  Kendinizden Bahsedin
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Biyobilim Topluluğuna katılma motivasyonunuz..."
                  className="w-full resize-none rounded-xl border border-[#d4e0d8] bg-[#fbfcfb] px-4 py-3 text-sm text-[#163b2a] outline-none transition placeholder:text-gray-400 focus:border-[#287fea] focus:ring-2 focus:ring-[#287fea]/10"
                />
              </div>


              {/* BUTON */}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#287fea] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1764c2]"
              >
                Üyelik Başvurusu Gönder
              </button>

            </form>
          )}

        </div>

      </div>
    </main>
  );
}