import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isAdminRoute = path.startsWith("/admin");
  const isAdminLoginRoute = path === "/admin/login";
  const isAccountRoute = path.startsWith("/hesabim");

  // ---------------------------------------------------------
  // ADMIN LOGIN
  // ---------------------------------------------------------

  if (isAdminLoginRoute) {
    // Zaten admin olarak giriş yaptıysa direkt panele gönder
    if (user) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: () => {},
          },
        }
      );

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        return NextResponse.redirect(
          new URL("/admin", request.url)
        );
      }
    }

    return supabaseResponse;
  }

  // ---------------------------------------------------------
  // HESABIM
  // ---------------------------------------------------------

  if (!user && isAccountRoute) {
    const redirectUrl = new URL("/giris", request.url);
    redirectUrl.searchParams.set("yonlendirme", path);

    return NextResponse.redirect(redirectUrl);
  }

  // ---------------------------------------------------------
  // ADMIN
  // ---------------------------------------------------------

  if (isAdminRoute && user) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => {},
        },
      }
    );

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || profile?.role !== "admin") {
      return NextResponse.redirect(
        new URL("/403", request.url)
      );
    }
  }

  // ---------------------------------------------------------
  // GİRİŞ YAPMAMIŞ KULLANICI
  // ---------------------------------------------------------

  if (isAdminRoute && !user) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};