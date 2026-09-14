import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Supabase e-posta doğrulama / şifre sıfırlama bağlantılarının yönlendirdiği uç nokta.
 * `code` parametresini oturum çerezine dönüştürür, ardından kullanıcıyı
 * hedef sayfaya (varsayılan: profil paneli) yönlendirir.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/hesabim";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/giris?hata=dogrulama-basarisiz`);
}
