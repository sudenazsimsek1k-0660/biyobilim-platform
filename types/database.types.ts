/**
 * ============================================================
 * BİYOBİLİM — Veritabanı Tipleri
 * ============================================================
 * Bu dosya elle yazılmıştır ve database/schema.sql ile birebir eşleşir.
 * Gerçek bir Supabase projesi bağlandığında, bu dosyanın yerini
 * otomatik üretilmiş tipler alacaktır:
 *
 *   npm run db:types
 *   (bkz. package.json → "supabase gen types typescript")
 *
 * O zamana kadar bu dosya, `createClient<Database>()` çağrılarının
 * derleme zamanında tip güvenli olmasını sağlar.
 * ============================================================
 */

export type UserRole = "member" | "admin";
export type ContentStatus = "draft" | "scheduled" | "published" | "archived";
export type RegistrationStatus = "pending" | "approved" | "rejected" | "cancelled" | "attended";
export type MessageStatus = "unread" | "read" | "replied" | "archived";
export type NotificationAudience =
  | "all_members"
  | "selected_members"
  | "event_participants"
  | "newsletter_subscribers";
export type FavoriteType =
  | "podcast_episode"
  | "scientist"
  | "news"
  | "gallery_photo"
  | "biologos_issue"
  | "event";

/** Ortak zaman damgası alanları. */
interface Timestamps {
  created_at: string;
  updated_at?: string;
}

export interface ProfileRow extends Timestamps {
  id: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  university: string | null;
  department: string | null;
  class_year: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  membership_number: string | null;
  is_active: boolean;
}

export interface EventRow extends Timestamps {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  cover_image_url: string | null;
  location: string;
  event_date: string;
  event_time: string | null;
  registration_deadline: string | null;
  organizer: string | null;
  required_materials: string | null;
  capacity: number;
  status: ContentStatus;
  created_by: string | null;
}

export interface EventRegistrationRow {
  id: string;
  event_id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  university: string;
  department: string;
  class_year: string;
  email: string;
  phone: string;
  note: string | null;
  consent_given: boolean;
  status: RegistrationStatus;
  created_at: string;
}

export interface NewsRow extends Timestamps {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  cover_image_url: string | null;
  author_id: string | null;
  status: ContentStatus;
  published_at: string | null;
  view_count: number;
}

export interface PodcastEpisodeRow extends Timestamps {
  id: string;
  slug: string;
  episode_number: number;
  title: string;
  category: string;
  description: string;
  cover_image_url: string | null;
  audio_url: string | null;
  duration_seconds: number | null;
  is_featured: boolean;
  status: ContentStatus;
  published_at: string | null;
  play_count: number;
  spotify_url: string | null;
  youtube_url: string | null;
  apple_podcasts_url: string | null;
}

export interface BiologosIssueRow extends Timestamps {
  id: string;
  issue_number: number;
  title: string;
  season_label: string;
  description: string | null;
  cover_image_url: string | null;
  pdf_url: string | null;
  file_size_mb: number | null;
  status: ContentStatus;
  published_at: string | null;
  download_count: number;
}

export interface ScientistRow extends Timestamps {
  id: string;
  slug: string;
  full_name: string;
  field: string;
  category: string;
  country: string | null;
  years_label: string | null;
  short_bio: string;
  biography: string | null;
  education: string | null;
  research_areas: string | null;
  major_discoveries: string | null;
  awards: string | null;
  books: string | null;
  interesting_facts: string | null;
  photo_url: string | null;
  is_featured: boolean;
  featured_month: string | null;
  status: ContentStatus;
}

export interface GalleryPhotoRow {
  id: string;
  title: string;
  species: string | null;
  scientific_name: string | null;
  category: string;
  location: string | null;
  photographer: string | null;
  taken_at: string | null;
  camera_info: string | null;
  image_url: string;
  view_count: number;
  status: ContentStatus;
  created_at: string;
}

export interface GalleryVideoRow {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  thumbnail_url: string | null;
  video_url: string;
  duration_seconds: number | null;
  view_count: number;
  status: ContentStatus;
  created_at: string;
}

export interface BoardMemberRow {
  id: string;
  full_name: string;
  position: string;
  short_bio: string | null;
  research_interests: string | null;
  photo_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  display_order: number;
  created_at: string;
}

export interface MessageRow {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  body: string;
  status: MessageStatus;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  title: string;
  body: string;
  audience: NotificationAudience;
  created_by: string | null;
  created_at: string;
}

export interface SiteSettingsRow {
  id: 1;
  hero_subtitle: string;
  hero_quote: string;
  stat_member_count: number;
  stat_event_count: number;
  stat_biologos_count: number;
  stat_podcast_count: number;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  social_instagram: string | null;
  social_linkedin: string | null;
  social_youtube: string | null;
  footer_text: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  updated_at: string;
  updated_by: string | null;
}

/** Supabase istemcisinin (`createClient<Database>()`) beklediği genel şema tipi. */
export interface Database {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: Partial<ProfileRow> & Pick<ProfileRow, "id" | "first_name" | "last_name">; Update: Partial<ProfileRow> };
      events: { Row: EventRow; Insert: Partial<EventRow>; Update: Partial<EventRow> };
      event_registrations: { Row: EventRegistrationRow; Insert: Partial<EventRegistrationRow>; Update: Partial<EventRegistrationRow> };
      news: { Row: NewsRow; Insert: Partial<NewsRow>; Update: Partial<NewsRow> };
      podcast_episodes: { Row: PodcastEpisodeRow; Insert: Partial<PodcastEpisodeRow>; Update: Partial<PodcastEpisodeRow> };
      biologos_issues: { Row: BiologosIssueRow; Insert: Partial<BiologosIssueRow>; Update: Partial<BiologosIssueRow> };
      scientists: { Row: ScientistRow; Insert: Partial<ScientistRow>; Update: Partial<ScientistRow> };
      gallery_photos: { Row: GalleryPhotoRow; Insert: Partial<GalleryPhotoRow>; Update: Partial<GalleryPhotoRow> };
      gallery_videos: { Row: GalleryVideoRow; Insert: Partial<GalleryVideoRow>; Update: Partial<GalleryVideoRow> };
      board_members: { Row: BoardMemberRow; Insert: Partial<BoardMemberRow>; Update: Partial<BoardMemberRow> };
      messages: { Row: MessageRow; Insert: Partial<MessageRow>; Update: Partial<MessageRow> };
      notifications: { Row: NotificationRow; Insert: Partial<NotificationRow>; Update: Partial<NotificationRow> };
      site_settings: { Row: SiteSettingsRow; Insert: Partial<SiteSettingsRow>; Update: Partial<SiteSettingsRow> };
    };
  };
}
