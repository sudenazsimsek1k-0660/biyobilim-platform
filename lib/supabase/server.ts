import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

/**
 * Sunucu tarafı (Server Component, Server Action, Route Handler) Supabase istemcisi.
 * Her istek için yeni bir istemci oluşturulmalıdır — global/singleton olarak paylaşılmamalıdır.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component içinden çağrılırsa cookie set edilemez.
            // Oturum yenilemesi middleware.ts tarafından zaten yürütülür; güvenle yok sayılabilir.
          }
        },
      },
    }
  );
}

/**
 * Yönetici (service role) yetkisiyle çalışan ayrıcalıklı istemci.
 * SADECE güvenilir sunucu ortamlarında (ör. admin-only route handler'lar,
 * webhook işleyicileri) kullanılmalıdır. İstemciye asla gönderilmemelidir.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

