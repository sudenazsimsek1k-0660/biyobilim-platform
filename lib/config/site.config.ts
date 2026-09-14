/**
 * ============================================================
 * MERKEZİ SİTE YAPILANDIRMASI
 * ============================================================
 * Bu dosya, uygulama genelinde kullanılan sabit metinleri, marka bilgilerini
 * ve varsayılan değerleri tek bir yerde toplar. Sayfalarda ve bileşenlerde
 * asla ham (hardcoded) metin kullanılmamalı; bunun yerine bu dosyadan veya
 * `settings` tablosundan (bkz. services/settings.service.ts) okunmalıdır.
 *
 * Statik/az değişen içerik (site adı, navigasyon etiketleri) burada,
 * sık değişen/yönetici tarafından düzenlenebilir içerik (hero başlığı,
 * istatistikler, iletişim bilgisi) ise veritabanındaki `settings` tablosunda
 * tutulur ve `getSiteSettings()` servis fonksiyonu ile çekilir.
 * ============================================================
 */

export const siteConfig = {
  name: "Biyobilim",
  shortName: "Biyobilim",
  description:
    "Biyoloji öğrencilerini araştırma, alan çalışması ve bilim iletişimi etrafında bir araya getiren bağımsız akademik topluluk.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  keywords: [
    "biyoloji",
    "öğrenci topluluğu",
    "bilim",
    "BIOLOGOS",
    "doğa fotoğrafçılığı",
    "biyoloji podcast",
  ],
  locale: "tr-TR",
  contactEmail: "iletisim@biyobilim.org",
  social: {
    instagram: "https://instagram.com/biyobilim",
    linkedin: "https://linkedin.com/company/biyobilim",
    youtube: "https://youtube.com/@biyobilim",
  },
} as const;

/** Ana navigasyon menüsü — hem üst menüde hem mobil çekmecede kullanılır. */
export const mainNav = [
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "BIOLOGOS", href: "/biologos" },
  { label: "Podcast", href: "/podcast" },
  { label: "Doğa Fotoğrafçılığı", href: "/fotografcilik" },
  { label: "Bilim İnsanları", href: "/bilim-insanlari" },
  { label: "Haberler", href: "/haberler" },
  { label: "Etkinlikler", href: "/etkinlikler" },
  { label: "Yönetim Kurulu", href: "/yonetim-kurulu" },
  { label: "İletişim", href: "/iletisim" },
] as const;

/** Kullanıcı rolleri — Supabase `profiles.role` sütunu ile birebir eşleşir. */
export const userRoles = {
  MEMBER: "member",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof userRoles)[keyof typeof userRoles];

/** Etkinlik kategorileri — hem admin panelinde hem genel sitede kullanılır. */
export const eventCategories = [
  "Seminer",
  "Konferans",
  "Atölye",
  "Doğa Yürüyüşü",
  "Kamp",
  "Podcast",
  "Eğitim",
  "Sosyal Etkinlik",
  "Bilim Söyleşisi",
  "Teknik Gezi",
] as const;

/** Haber kategorileri. */
export const newsCategories = [
  "Topluluk",
  "Bilim",
  "Etkinlik",
  "Podcast",
  "BIOLOGOS",
  "Duyuru",
] as const;

/** Podcast kategorileri. */
export const podcastCategories = [
  "Ekoloji",
  "Mikrobiyoloji",
  "Botanik",
  "Genetik",
  "Biyoteknoloji",
  "Bilim Haberleri",
  "Yapay Zeka",
  "İklim",
] as const;

/** Galeri fotoğraf kategorileri. */
export const galleryCategories = [
  "Bitkiler",
  "Hayvanlar",
  "Mantarlar",
  "Manzara",
  "Makro",
  "Kuşlar",
  "Böcekler",
  "Mikro Dünya",
] as const;

/** Bilim insanı uzmanlık kategorileri. */
export const scientistCategories = [
  "Botanik",
  "Zooloji",
  "Ekoloji",
  "Mikrobiyoloji",
  "Genetik",
  "Moleküler Biyoloji",
  "Evrim",
  "Biyoteknoloji",
  "Biyoinformatik",
] as const;

/** Yönetim kurulu pozisyon kategorileri. */
export const boardPositions = [
  "Başkan",
  "Başkan Yardımcısı",
  "Yönetim Kurulu Üyesi",
  "Danışman Akademisyen",
] as const;

/** Ortak, tekrarlanabilir arayüz metinleri (buton/durum etiketleri). */
export const uiStrings = {
  buttons: {
    submit: "Gönder",
    save: "Kaydet",
    cancel: "Vazgeç",
    edit: "Düzenle",
    delete: "Sil",
    readMore: "Devamını Oku",
    join: "Katıl",
    login: "Giriş Yap",
    register: "Üye Ol",
    logout: "Çıkış Yap",
  },
  status: {
    loading: "Yükleniyor...",
    empty: "Sonuç bulunamadı.",
    error: "Bir şeyler ters gitti. Lütfen tekrar deneyin.",
    success: "İşlem başarıyla tamamlandı.",
  },
} as const;
