import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types";

/**
 * Genel site ayarlarını (hero metni, istatistikler, iletişim bilgisi vb.) getirir.
 * `site_settings` tablosu her zaman tek satır içerir (id = 1).
 * RLS politikası bu tabloyu herkese açık (salt okunur) yapar, bu yüzden
 * Server Component'lerden doğrudan çağrılabilir.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = (await createClient()) as any;
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) {
    throw new Error("Site ayarları yüklenemedi.");
  }

  return data as SiteSettings;
}

/**
 * Yalnızca admin tarafından çağrılmalıdır (RLS bunu zaten zorunlu kılar).
 * Ana Sayfa İstatistikleri formu bu fonksiyonu kullanacaktır.
 */
export async function updateHomeStatistics(input: {
  stat_member_count: number;
  stat_event_count: number;
  stat_biologos_count: number;
  stat_podcast_count: number;
}) {
  const supabase = (await createClient()) as any;
  const { data: userData } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("site_settings")
    .update({ ...input, updated_by: userData.user?.id ?? null })
    .eq("id", 1);

  if (error) {
    throw new Error("İstatistikler güncellenemedi.");
  }
}
