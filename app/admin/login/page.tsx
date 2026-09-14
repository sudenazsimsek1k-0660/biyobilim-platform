"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setError("E-posta veya şifre hatalı.");
      setLoading(false);
      return;
    }

    // Kullanıcının admin olup olmadığını kontrol et
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      await supabase.auth.signOut();

      setError("Bu hesap yönetim paneline erişemez.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f9f7] px-6">
      <div className="w-full max-w-md rounded-3xl border border-[#dce5df] bg-white p-8 shadow-xl md:p-10">

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#287fea]">
            Biyobilim
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[#163b2a]">
            Yönetim Paneli
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#65726d]">
            Yönetim paneline erişmek için admin hesabınızla giriş yapın.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#315441]">
              E-posta
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin e-posta adresi"
              required
              className="w-full rounded-xl border border-[#d5e0db] bg-[#f8faf9] px-4 py-3 text-sm text-[#163b2a] outline-none transition focus:border-[#287fea] focus:ring-2 focus:ring-[#287fea]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#315441]">
              Şifre
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifreniz"
              required
              className="w-full rounded-xl border border-[#d5e0db] bg-[#f8faf9] px-4 py-3 text-sm text-[#163b2a] outline-none transition focus:border-[#287fea] focus:ring-2 focus:ring-[#287fea]/10"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#287fea] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1764c2] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>

        </form>
      </div>
    </main>
  );
}