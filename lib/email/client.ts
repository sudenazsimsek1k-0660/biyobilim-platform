import { Resend } from "resend";

/**
 * Merkezi e-posta gönderim istemcisi (Resend).
 * Yalnızca sunucu tarafında (Server Actions, Route Handlers) kullanılmalıdır.
 * API sağlayıcısı ileride değiştirilirse (ör. SendGrid, Postmark) yalnızca bu dosya güncellenir.
 */
export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "Biyobilim <bildirim@biyobilim.org>";
export const ADMIN_NOTIFICATION_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL ?? "iletisim@biyobilim.org";
