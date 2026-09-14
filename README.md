# Biyobilim — Platform Temeli (Foundation)

Üniversite biyoloji öğrenci topluluğu **Biyobilim** için üretime hazır, tam yığın (full‑stack)
dijital platformun **mimari temeli**. Bu depo şu an yalnızca alt yapıyı içerir — arayüz
sayfaları (ana sayfa, etkinlikler, admin paneli, içerik sayfaları) **bilinçli olarak
oluşturulmamıştır**; bir sonraki geliştirme adımında bu temel üzerine inşa edilecektir.

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Stil | Tailwind CSS + özel tasarım token'ları |
| Animasyon | Framer Motion (kurulu, henüz sayfa içinde kullanılmadı) |
| İkonlar | Lucide React |
| Backend | Next.js Server Actions + Route Handlers |
| Veritabanı | Supabase (PostgreSQL) |
| Kimlik Doğrulama | Supabase Auth (`@supabase/ssr`) |
| Dosya Depolama | Supabase Storage |
| E-posta | Resend |
| Form Doğrulama | Zod |
| Dağıtım | Vercel |

## Klasör Yapısı

```
app/                        Next.js App Router sayfaları
  (auth)/                   Kimlik doğrulama sayfaları (route group — URL'de görünmez)
    giris/                  Giriş Yap
    kayit/                  Üye Ol
    sifremi-unuttum/        Şifremi Unuttum
    sifre-sifirla/          Yeni şifre belirleme
    dogrula/                E-posta doğrulama bilgilendirme sayfası
  auth/callback/route.ts    Supabase doğrulama bağlantılarının yönlendiği uç nokta
  admin/                    Yalnızca role="admin" erişebilir (bkz. middleware.ts)
  403/                      Yetkisiz erişim sayfası
  layout.tsx                Kök layout — Türkçe dil, fontlar, SEO meta
  page.tsx                  Geçici ana sayfa yer tutucusu
  globals.css               Tailwind + tasarım sistemi CSS değişkenleri

components/ui/              Yeniden kullanılabilir tasarım sistemi bileşenleri
                             (Button, Input, Label, FieldError, Card, Badge)

features/auth/              Kimlik doğrulama özelliğine özel kod
  actions/auth.actions.ts   Server Actions: signIn, signUp, forgotPassword, resetPassword, signOut
  components/AuthShell.tsx  Kimlik doğrulama sayfaları için paylaşılan kabuk

hooks/                      İstemci tarafı React hook'ları
  use-current-user.ts       Oturum/profil bilgisine erişim
  use-toast.ts              Hafif bildirim (toast) durum yönetimi

services/                   Veritabanı/harici servislerle konuşan iş mantığı katmanı
  settings.service.ts       site_settings tablosunu okur/günceller
  email.service.ts          E-posta gönderim fonksiyonları (Resend + şablonlar)

lib/
  supabase/                 client.ts (tarayıcı), server.ts (sunucu), middleware.ts (oturum yenileme)
  email/                    client.ts (Resend istemcisi), templates.ts (Türkçe HTML şablonları)
  config/site.config.ts     Merkezi, hardcode edilmemiş metin/sabit kaynağı
  validations/              Zod şemaları
  utils/cn.ts               Tailwind sınıf birleştirme yardımcısı

utils/formatters.ts         Tarih/sayı/slug biçimlendirme yardımcıları (tr-TR)

types/
  database.types.ts         Supabase şemasıyla birebir eşleşen el yazımı tipler
  index.ts                  Etki alanı (domain) tipleri

database/
  schema.sql                Tüm tablolar, enum'lar, tetikleyiciler, RLS politikaları
  storage_buckets.sql       Supabase Storage bucket tanımları ve politikaları
  seed.sql                  Yalnızca geliştirme ortamı için örnek veri

middleware.ts                Kök dizinde olmak ZORUNDA (Next.js kısıtı — bkz. aşağıdaki not)
```

> **Not — `middleware/` klasörü hakkında:** İstenen örnek yapıda ayrı bir `middleware/`
> klasörü vardı; ancak Next.js, rota koruma mantığını yalnızca proje kökündeki
> `middleware.ts` dosyasından çalıştırabilir (bu bir framework kısıtıdır, mimari tercih değildir).
> Bu yüzden asıl mantık kökteki `middleware.ts` içinde, yardımcı fonksiyon ise
> `lib/supabase/middleware.ts` içinde tutulmuştur.

## Veritabanı Şeması Özeti

`database/schema.sql` şu tabloları oluşturur: `profiles`, `events`, `event_registrations`,
`event_gallery`, `news`, `podcast_episodes`, `biologos_issues`, `scientists`,
`gallery_photos`, `gallery_videos`, `board_members`, `messages`, `notifications`,
`notification_recipients`, `newsletter_subscribers`, `favorites`, `site_settings`,
`audit_logs`. Her tabloda **Row Level Security (RLS)** etkindir; genel içerik yalnızca
`status = 'published'` olduğunda herkese açıktır, yönetim işlemleri `is_admin()`
fonksiyonuyla korunur.

`site_settings` tablosu tek satırlık (id = 1) bir yapı kullanır ve ana sayfa başlığı/alt
başlığı, alıntı, dört istatistik sayacı, iletişim bilgileri, sosyal medya bağlantıları,
footer metni, logo ve favicon alanlarını içerir — hepsi admin panelinden (ileride
eklenecek arayüzle) düzenlenebilir olacak şekilde tasarlanmıştır.

## Kimlik Doğrulama Akışı

1. **Kayıt** (`/kayit`) → `signUpAction` → Supabase Auth kullanıcı oluşturur →
   `handle_new_user` veritabanı tetikleyicisi otomatik olarak `profiles` satırı açar →
   kullanıcıya doğrulama e-postası gider.
2. **Doğrulama** → kullanıcı e-postadaki bağlantıya tıklar → `/auth/callback` kodu
   oturuma çevirir → `/hesabim`'e yönlendirir.
3. **Giriş** (`/giris`) → `signInAction` → oturum çerezi ayarlanır.
4. **Şifre sıfırlama** → `/sifremi-unuttum` → e-posta → `/sifre-sifirla` → `resetPasswordAction`.
5. **Rol kontrolü** → `middleware.ts`, `/admin/**` altındaki her istekte `profiles.role`
   değerini kontrol eder; `admin` değilse `/403`'e yönlendirir.

## Kurulum

```bash
# 1) Bağımlılıkları kurun
npm install

# 2) Ortam değişkenlerini ayarlayın
cp .env.example .env.local
# .env.local içine Supabase proje URL/anon key, Resend API key vb. değerleri girin

# 3) Supabase veritabanını kurun (Supabase SQL Editor'de sırasıyla çalıştırın)
#    database/schema.sql
#    database/storage_buckets.sql
#    database/seed.sql   (yalnızca geliştirme ortamında, isteğe bağlı)

# 4) Geliştirme sunucusunu başlatın
npm run dev
```

## Tasarım Sistemi

Renk paleti, tipografi (Poppins/Inter) ve bileşen stilleri `tailwind.config.ts` ve
`app/globals.css` içinde tanımlıdır; bu token'lar önceki statik prototiple birebir
uyumludur (Bilimsel Mavi `#175488`, Doğal Yeşil `#3F7D52`, açık gri zemin, koyu gri metin).
`components/ui/` altındaki `Button`, `Input`, `Card`, `Badge` bileşenleri `class-variance-authority`
ile varyant tabanlı ve tamamen yeniden kullanılabilir şekilde yazılmıştır.

## Kapsam Notu (VERY IMPORTANT talimatına uyum)

Bu teslimat şunları **içerir**: proje mimarisi, veritabanı şeması + RLS, kimlik doğrulama
(giriş/kayıt/şifre sıfırlama sayfaları dahil — bunlar "içerik sayfası" değil, kimlik
doğrulama alt yapısının parçasıdır), merkezi yapılandırma sistemi, yeniden kullanılabilir
tasarım sistemi, e-posta alt yapısı, dosya depolama (storage bucket) yapılandırması.

Bu teslimat **bilinçli olarak içermez**: ana sayfa (Hero, Hakkımızda, Canlı İstatistikler,
Haberler, Etkinlikler, Podcast, BIOLOGOS, Galeri, Bilim İnsanı, CTA, Footer), etkinlikler
sayfası, admin panel arayüzü, diğer içerik sayfaları. Bunlar bir sonraki istekte, bu
mimari üzerine inşa edilecektir.

## Bilinen Sınırlamalar

- Bu depo `npm install` çalıştırılmadan derlenemez; bu ortamda internet erişimi olsa da
  paket kurulumu ve `next build` doğrulaması bilinçli olarak yapılmamıştır (kapsam,
  "yalnızca mimari" ile sınırlıdır). Kodun kendisi güncel Next.js 15 / React 19 /
  `@supabase/ssr` API'leriyle tutarlı yazılmıştır.
- `types/database.types.ts` elle yazılmıştır; gerçek bir Supabase projesi bağlandığında
  `npm run db:types` ile otomatik üretilen sürüm bunun yerini almalıdır.
- E-posta şablonları basit HTML string'lerdir; kurumsal ölçekte `@react-email/components`
  gibi bir kütüphaneye geçiş önerilir (servis katmanı imzası aynı kalacağından geçiş kolaydır).
