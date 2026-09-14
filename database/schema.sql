-- ============================================================
-- BİYOBİLİM — Supabase / PostgreSQL Şeması
-- ============================================================
-- Bu dosyayı Supabase SQL Editor'de veya `supabase db push` ile
-- (migrations/ klasörüne bölünmüş halde) çalıştırın.
--
-- Sıralama önemlidir: uzantılar → enum tipler → tablolar →
-- fonksiyonlar/tetikleyiciler → indeksler → RLS politikaları.
-- ============================================================

-- ------------------------------------------------------------
-- 0. UZANTILAR
-- ------------------------------------------------------------
create extension if not exists "pgcrypto";      -- gen_random_uuid() için
create extension if not exists "pg_trgm";        -- hızlı metin araması (arama sistemi) için

-- ------------------------------------------------------------
-- 1. ENUM TİPLERİ
-- ------------------------------------------------------------
create type user_role as enum ('member', 'admin');
create type content_status as enum ('draft', 'scheduled', 'published', 'archived');
create type registration_status as enum ('pending', 'approved', 'rejected', 'cancelled', 'attended');
create type message_status as enum ('unread', 'read', 'replied', 'archived');
create type notification_audience as enum ('all_members', 'selected_members', 'event_participants', 'newsletter_subscribers');
create type favorite_type as enum ('podcast_episode', 'scientist', 'news', 'gallery_photo', 'biologos_issue', 'event');

-- ------------------------------------------------------------
-- 2. PROFILES  (auth.users tablosunu genişletir)
-- ------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'member',
  first_name text not null,
  last_name text not null,
  university text,
  department text,
  class_year text,
  phone text,
  avatar_url text,
  bio text,
  membership_number text unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.profiles is 'auth.users tablosunu genişleten üye/yönetici profil bilgileri.';

-- ------------------------------------------------------------
-- 3. EVENTS & EVENT_REGISTRATIONS
-- ------------------------------------------------------------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  description text not null,
  cover_image_url text,
  location text not null,
  event_date date not null,
  event_time time,
  registration_deadline date,
  organizer text,
  required_materials text,
  capacity integer not null default 0,
  status content_status not null default 'draft',
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  first_name text not null,
  last_name text not null,
  university text not null,
  department text not null,
  class_year text not null,
  email text not null,
  phone text not null,
  note text,
  consent_given boolean not null default false,
  status registration_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (event_id, email) -- aynı e-posta ile mükerrer kayıt engeli
);

create table public.event_gallery (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  media_type text not null check (media_type in ('photo', 'video')),
  media_url text not null,
  caption text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 4. NEWS
-- ------------------------------------------------------------
create table public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  summary text not null,
  content text not null,
  cover_image_url text,
  author_id uuid references public.profiles (id),
  status content_status not null default 'draft',
  published_at timestamptz,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 5. PODCAST EPISODES
-- ------------------------------------------------------------
create table public.podcast_episodes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  episode_number integer not null unique,
  title text not null,
  category text not null,
  description text not null,
  cover_image_url text,
  audio_url text,
  duration_seconds integer,
  is_featured boolean not null default false,
  status content_status not null default 'draft',
  published_at timestamptz,
  play_count integer not null default 0,
  spotify_url text,
  youtube_url text,
  apple_podcasts_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 6. BIOLOGOS (dijital dergi sayıları)
-- ------------------------------------------------------------
create table public.biologos_issues (
  id uuid primary key default gen_random_uuid(),
  issue_number integer not null unique,
  title text not null,
  season_label text not null,           -- örn. "Yaz 2026"
  description text,
  cover_image_url text,
  pdf_url text,
  file_size_mb numeric(6, 2),
  status content_status not null default 'draft',
  published_at timestamptz,
  download_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 7. SCIENTISTS
-- ------------------------------------------------------------
create table public.scientists (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_name text not null,
  field text not null,
  category text not null,
  country text,
  years_label text,                     -- örn. "1920–1994"
  short_bio text not null,
  biography text,
  education text,
  research_areas text,
  major_discoveries text,
  awards text,
  books text,
  interesting_facts text,
  photo_url text,
  is_featured boolean not null default false,   -- "Ayın Bilim İnsanı"
  featured_month date,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 8. GALLERY (fotoğraf & video)
-- ------------------------------------------------------------
create table public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  species text,
  scientific_name text,
  category text not null,
  location text,
  photographer text,
  taken_at date,
  camera_info text,
  image_url text not null,
  view_count integer not null default 0,
  status content_status not null default 'published',
  created_at timestamptz not null default now()
);

create table public.gallery_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  thumbnail_url text,
  video_url text not null,
  duration_seconds integer,
  view_count integer not null default 0,
  status content_status not null default 'published',
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 9. BOARD MEMBERS (Yönetim Kurulu)
-- ------------------------------------------------------------
create table public.board_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  position text not null,               -- Başkan / Başkan Yardımcısı / Üye / Danışman Akademisyen
  short_bio text,
  research_interests text,
  photo_url text,
  email text,
  linkedin_url text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 10. MESSAGES (iletişim formu)
-- ------------------------------------------------------------
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  subject text not null,
  body text not null,
  status message_status not null default 'unread',
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 11. NOTIFICATIONS
-- ------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience notification_audience not null default 'all_members',
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- Bildirimin hangi kullanıcılara gönderildiğini ve okunma durumunu tutar.
create table public.notification_recipients (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.notifications (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  is_read boolean not null default false,
  read_at timestamptz,
  unique (notification_id, user_id)
);

-- ------------------------------------------------------------
-- 12. NEWSLETTER
-- ------------------------------------------------------------
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_active boolean not null default true,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- ------------------------------------------------------------
-- 13. FAVORITES
-- ------------------------------------------------------------
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  item_type favorite_type not null,
  item_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

-- ------------------------------------------------------------
-- 14. SETTINGS  (tek satırlık genel site ayarları)
-- ------------------------------------------------------------
-- Admin panelindeki "Ana Sayfa İstatistikleri" ve diğer genel ayarlar
-- burada saklanır. Uygulama katmanında tek satır (id = 1) olacak şekilde kullanılır.
create table public.site_settings (
  id integer primary key default 1 check (id = 1),  -- tek satır garantisi
  hero_subtitle text not null default 'Bilimin ışığında doğayı anlamak, korumak ve geleceğe taşımak.',
  hero_quote text not null default 'Her yaprak damarında bir harita, her hücre çekirdeğinde bir hikâye saklıdır. Biz bu hikâyeleri okumayı öğreniyoruz.',
  stat_member_count integer not null default 1240,
  stat_event_count integer not null default 86,
  stat_biologos_count integer not null default 24,
  stat_podcast_count integer not null default 57,
  contact_email text not null default 'iletisim@biyobilim.org',
  contact_phone text not null default '0 (312) 555 01 01',
  contact_address text not null default 'Fen Fakültesi, Biyoloji Bölümü, Ankara',
  social_instagram text default 'https://instagram.com/biyobilim',
  social_linkedin text default 'https://linkedin.com/company/biyobilim',
  social_youtube text default 'https://youtube.com/@biyobilim',
  footer_text text default 'Biyoloji öğrencilerini araştırma, alan çalışması ve bilim iletişimi etrafında bir araya getiren bağımsız akademik topluluk.',
  logo_url text,
  favicon_url text,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id)
);
insert into public.site_settings (id) values (1);

-- ------------------------------------------------------------
-- 15. AUDIT LOGS  (yönetici işlemleri denetim izi)
-- ------------------------------------------------------------
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id),
  action text not null,              -- örn. 'event.create', 'member.deactivate'
  entity_type text not null,         -- örn. 'events', 'profiles'
  entity_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- FONKSİYONLAR & TETİKLEYİCİLER
-- ============================================================

-- updated_at sütununu otomatik güncelleyen ortak fonksiyon.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_events_updated_at before update on public.events
  for each row execute function public.set_updated_at();
create trigger trg_news_updated_at before update on public.news
  for each row execute function public.set_updated_at();
create trigger trg_podcast_updated_at before update on public.podcast_episodes
  for each row execute function public.set_updated_at();
create trigger trg_biologos_updated_at before update on public.biologos_issues
  for each row execute function public.set_updated_at();
create trigger trg_scientists_updated_at before update on public.scientists
  for each row execute function public.set_updated_at();
create trigger trg_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- Yeni bir auth.users kaydı oluştuğunda otomatik olarak profiles satırı açar.
-- signUp sırasında `options.data` içinde gönderilen alanları kullanır (bkz. auth.actions.ts).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, university, department, class_year)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    new.raw_user_meta_data ->> 'university',
    new.raw_user_meta_data ->> 'department',
    new.raw_user_meta_data ->> 'class_year'
  );
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- İNDEKSLER
-- ============================================================
create index idx_events_status_date on public.events (status, event_date);
create index idx_event_registrations_event on public.event_registrations (event_id);
create index idx_news_status_published on public.news (status, published_at desc);
create index idx_news_search on public.news using gin (title gin_trgm_ops);
create index idx_podcast_status_published on public.podcast_episodes (status, published_at desc);
create index idx_scientists_search on public.scientists using gin (full_name gin_trgm_ops);
create index idx_gallery_photos_category on public.gallery_photos (category);
create index idx_messages_status on public.messages (status, created_at desc);
create index idx_notification_recipients_user on public.notification_recipients (user_id, is_read);
create index idx_favorites_user on public.favorites (user_id, item_type);

-- ============================================================
-- SATIR SEVİYESİ GÜVENLİK (ROW LEVEL SECURITY)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.event_gallery enable row level security;
alter table public.news enable row level security;
alter table public.podcast_episodes enable row level security;
alter table public.biologos_issues enable row level security;
alter table public.scientists enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.gallery_videos enable row level security;
alter table public.board_members enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_recipients enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.favorites enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;

-- Yardımcı fonksiyon: mevcut kullanıcı admin mi?
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- --- PROFILES ---
create policy "Kullanıcı kendi profilini görebilir" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "Kullanıcı kendi profilini güncelleyebilir" on public.profiles
  for update using (auth.uid() = id or public.is_admin());
create policy "Adminler tüm profilleri yönetebilir" on public.profiles
  for delete using (public.is_admin());

-- --- EVENTS (herkes yayınlananları görür, adminler her şeyi yönetir) ---
create policy "Yayınlanan etkinlikler herkese açık" on public.events
  for select using (status = 'published' or public.is_admin());
create policy "Adminler etkinlik yönetir" on public.events
  for insert with check (public.is_admin());
create policy "Adminler etkinlik günceller" on public.events
  for update using (public.is_admin());
create policy "Adminler etkinlik siler" on public.events
  for delete using (public.is_admin());

-- --- EVENT REGISTRATIONS ---
create policy "Kullanıcı kendi kaydını oluşturur" on public.event_registrations
  for insert with check (true); -- misafir kaydına da izin verir; e-posta tekilliği unique constraint ile korunur
create policy "Kullanıcı kendi kayıtlarını görür" on public.event_registrations
  for select using (auth.uid() = user_id or public.is_admin());
create policy "Adminler kayıtları yönetir" on public.event_registrations
  for update using (public.is_admin());
create policy "Adminler kayıtları siler" on public.event_registrations
  for delete using (public.is_admin());

-- --- İÇERİK TABLOLARI (news, podcast, biologos, scientists, gallery, board) ortak desen ---
create policy "Yayınlanan haberler herkese açık" on public.news
  for select using (status = 'published' or public.is_admin());
create policy "Adminler haber yönetir" on public.news
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Yayınlanan bölümler herkese açık" on public.podcast_episodes
  for select using (status = 'published' or public.is_admin());
create policy "Adminler podcast yönetir" on public.podcast_episodes
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Yayınlanan sayılar herkese açık" on public.biologos_issues
  for select using (status = 'published' or public.is_admin());
create policy "Adminler BIOLOGOS yönetir" on public.biologos_issues
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Yayınlanan profiller herkese açık" on public.scientists
  for select using (status = 'published' or public.is_admin());
create policy "Adminler bilim insanı profili yönetir" on public.scientists
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Galeri fotoğrafları herkese açık" on public.gallery_photos
  for select using (status = 'published' or public.is_admin());
create policy "Adminler galeri fotoğrafı yönetir" on public.gallery_photos
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Galeri videoları herkese açık" on public.gallery_videos
  for select using (status = 'published' or public.is_admin());
create policy "Adminler galeri videosu yönetir" on public.gallery_videos
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Yönetim kurulu herkese açık" on public.board_members
  for select using (true);
create policy "Adminler yönetim kurulu yönetir" on public.board_members
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Etkinlik galerisi herkese açık" on public.event_gallery
  for select using (true);
create policy "Adminler etkinlik galerisi yönetir" on public.event_gallery
  for all using (public.is_admin()) with check (public.is_admin());

-- --- MESSAGES (iletişim formu: herkes ekleyebilir, sadece admin okuyabilir) ---
create policy "Herkes mesaj gönderebilir" on public.messages
  for insert with check (true);
create policy "Adminler mesajları yönetir" on public.messages
  for select using (public.is_admin());
create policy "Adminler mesaj günceller" on public.messages
  for update using (public.is_admin());
create policy "Adminler mesaj siler" on public.messages
  for delete using (public.is_admin());

-- --- NOTIFICATIONS ---
create policy "Adminler bildirim oluşturur" on public.notifications
  for insert with check (public.is_admin());
create policy "Adminler tüm bildirimleri görür" on public.notifications
  for select using (public.is_admin());
create policy "Kullanıcı kendi bildirimlerini görür" on public.notification_recipients
  for select using (auth.uid() = user_id or public.is_admin());
create policy "Kullanıcı kendi bildirimini okundu işaretler" on public.notification_recipients
  for update using (auth.uid() = user_id);
create policy "Adminler alıcı listesi oluşturur" on public.notification_recipients
  for insert with check (public.is_admin());

-- --- NEWSLETTER ---
create policy "Herkes bültene abone olabilir" on public.newsletter_subscribers
  for insert with check (true);
create policy "Kullanıcı kendi aboneliğini yönetir" on public.newsletter_subscribers
  for update using (true); -- unsubscribe bağlantısı token bazlı; uygulama katmanında ek doğrulama önerilir
create policy "Adminler abone listesini görür" on public.newsletter_subscribers
  for select using (public.is_admin());

-- --- FAVORITES ---
create policy "Kullanıcı kendi favorilerini yönetir" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- --- SETTINGS ---
create policy "Site ayarları herkese açık (salt okunur)" on public.site_settings
  for select using (true);
create policy "Adminler site ayarlarını günceller" on public.site_settings
  for update using (public.is_admin());

-- --- AUDIT LOGS ---
create policy "Adminler denetim kayıtlarını görür" on public.audit_logs
  for select using (public.is_admin());
create policy "Sistem denetim kaydı oluşturur" on public.audit_logs
  for insert with check (public.is_admin());
