/**
 * Etki alanı (domain) düzeyinde yardımcı tipler.
 * Veritabanı satır tipleri (database.types.ts) üzerine inşa edilir.
 */
export type {
  UserRole,
  ContentStatus,
  RegistrationStatus,
  MessageStatus,
  NotificationAudience,
  FavoriteType,
  ProfileRow as Profile,
  EventRow as Event,
  EventRegistrationRow as EventRegistration,
  NewsRow as NewsArticle,
  PodcastEpisodeRow as PodcastEpisode,
  BiologosIssueRow as BiologosIssue,
  ScientistRow as Scientist,
  GalleryPhotoRow as GalleryPhoto,
  GalleryVideoRow as GalleryVideo,
  BoardMemberRow as BoardMember,
  MessageRow as ContactMessage,
  NotificationRow as Notification,
  SiteSettingsRow as SiteSettings,
} from "./database.types";

import type { EventRow } from "./database.types";

/** Kalan kontenjan / doluluk gibi türetilmiş alanlarla zenginleştirilmiş etkinlik. */
export interface EventWithAvailability extends EventRow {
  registered_count: number;
  remaining_capacity: number;
  is_full: boolean;
}
