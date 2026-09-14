import "server-only";
import { resend, EMAIL_FROM, ADMIN_NOTIFICATION_EMAIL } from "@/lib/email/client";
import {
  membershipConfirmationEmail,
  eventRegistrationEmail,
  eventReminderEmail,
  passwordResetEmail,
  contactConfirmationEmail,
  adminNewMessageNotification,
  newsletterWelcomeEmail,
  adminEventRegistrationNotification,
} from "@/lib/email/templates";

/**
 * ============================================================
 * E-POSTA SERVİSİ
 * ============================================================
 * Bu katman, e-posta şablonlarını Resend istemcisiyle birleştirerek
 * gönderim fonksiyonları sunar. Server Action'lar (ör. etkinlik kaydı,
 * iletişim formu) yalnızca bu fonksiyonları çağırır — Resend'in
 * kendisiyle doğrudan konuşmaz. Böylece sağlayıcı değişse dahi
 * çağıran kodlar değişmez.
 *
 * NOT: Supabase Auth, e-posta doğrulama ve şifre sıfırlama e-postalarını
 * varsayılan olarak kendi SMTP altyapısıyla gönderir (Supabase Dashboard →
 * Authentication → Email Templates). `sendPasswordResetEmail` burada,
 * marka kimliğine birebir uyan özel bir e-posta göndermek istendiğinde
 * (Supabase şablonları yerine) kullanılmak üzere hazırlanmıştır.
 * ============================================================
 */

export async function sendMembershipConfirmation(to: string, firstName: string) {
  const { subject, html } = membershipConfirmationEmail(firstName);
  return resend.emails.send({ from: EMAIL_FROM, to, subject, html });
}

export async function sendEventRegistrationConfirmation(
  to: string,
  params: { firstName: string; eventTitle: string; eventDate: string; eventLocation: string }
) {
  const { subject, html } = eventRegistrationEmail(params);
  return resend.emails.send({ from: EMAIL_FROM, to, subject, html });
}

export async function notifyAdminOfEventRegistration(params: {
  eventTitle: string;
  fullName: string;
  email: string;
}) {
  const { subject, html } = adminEventRegistrationNotification(params);
  return resend.emails.send({ from: EMAIL_FROM, to: ADMIN_NOTIFICATION_EMAIL, subject, html });
}

export async function sendEventReminder(
  to: string,
  params: { firstName: string; eventTitle: string; eventDate: string }
) {
  const { subject, html } = eventReminderEmail(params);
  return resend.emails.send({ from: EMAIL_FROM, to, subject, html });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const { subject, html } = passwordResetEmail(resetUrl);
  return resend.emails.send({ from: EMAIL_FROM, to, subject, html });
}

/** İletişim formu gönderildiğinde hem kullanıcıya hem yöneticiye e-posta gider. */
export async function sendContactFormEmails(params: {
  fullName: string;
  email: string;
  subject: string;
  body: string;
}) {
  const confirmation = contactConfirmationEmail(params.fullName, params.subject);
  const adminNotice = adminNewMessageNotification(params);

  return Promise.all([
    resend.emails.send({ from: EMAIL_FROM, to: params.email, subject: confirmation.subject, html: confirmation.html }),
    resend.emails.send({ from: EMAIL_FROM, to: ADMIN_NOTIFICATION_EMAIL, subject: adminNotice.subject, html: adminNotice.html }),
  ]);
}

export async function sendNewsletterWelcome(to: string) {
  const { subject, html } = newsletterWelcomeEmail();
  return resend.emails.send({ from: EMAIL_FROM, to, subject, html });
}
