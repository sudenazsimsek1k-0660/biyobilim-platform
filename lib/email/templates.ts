/**
 * ============================================================
 * E-POSTA ŞABLONLARI
 * ============================================================
 * Basit, bağımlılıksız HTML string şablonları — Biyobilim marka renkleriyle
 * (lacivert / yeşil) uyumludur. İleride React Email (@react-email/components)
 * gibi bir kütüphaneye geçilirse bu fonksiyonlar aynı imzayla korunabilir.
 * Tüm metinler Türkçedir.
 * ============================================================
 */

function emailShell(title: string, bodyHtml: string) {
  return `
  <div style="font-family: Inter, Arial, sans-serif; background:#F6F7F9; padding:32px 0;">
    <div style="max-width:520px; margin:0 auto; background:#ffffff; border:1px solid #DADEE1;">
      <div style="background:#123A63; padding:22px 28px;">
        <span style="color:#ffffff; font-family: Poppins, Arial, sans-serif; font-weight:700; font-size:18px;">
          ● BİYOBİLİM
        </span>
      </div>
      <div style="padding:32px 28px; color:#232629; font-size:14.5px; line-height:1.7;">
        <h1 style="font-family: Poppins, Arial, sans-serif; font-size:19px; color:#123A63; margin:0 0 16px;">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:18px 28px; border-top:1px solid #DADEE1; font-size:12px; color:#5C6167;">
        Biyobilim Öğrenci Topluluğu — Fen Fakültesi, Biyoloji Bölümü, Ankara
      </div>
    </div>
  </div>`;
}

export function membershipConfirmationEmail(firstName: string) {
  return {
    subject: "Biyobilim'e Hoş Geldiniz",
    html: emailShell(
      "Üyeliğiniz Onaylandı",
      `<p>Merhaba ${firstName},</p>
       <p>Biyobilim topluluğuna katıldığınız için teşekkür ederiz. Artık etkinliklerimize kayıt olabilir,
       BIOLOGOS sayılarına ve podcast bölümlerine erişebilirsiniz.</p>`
    ),
  };
}

export function eventRegistrationEmail(params: {
  firstName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
}) {
  return {
    subject: `Kayıt Onayı — ${params.eventTitle}`,
    html: emailShell(
      "Etkinlik Kaydınız Alındı",
      `<p>Merhaba ${params.firstName},</p>
       <p><b>${params.eventTitle}</b> etkinliğine kaydınız başarıyla alındı.</p>
       <p>📅 ${params.eventDate}<br/>📍 ${params.eventLocation}</p>
       <p>Etkinlik yaklaştıkça size bir hatırlatma e-postası göndereceğiz.</p>`
    ),
  };
}

export function eventReminderEmail(params: { firstName: string; eventTitle: string; eventDate: string }) {
  return {
    subject: `Hatırlatma — ${params.eventTitle} yaklaşıyor`,
    html: emailShell(
      "Etkinlik Hatırlatması",
      `<p>Merhaba ${params.firstName},</p>
       <p><b>${params.eventTitle}</b> etkinliği <b>${params.eventDate}</b> tarihinde gerçekleşecek. Sizi aramızda görmekten mutluluk duyarız.</p>`
    ),
  };
}

export function passwordResetEmail(resetUrl: string) {
  return {
    subject: "Şifre Sıfırlama Talebi",
    html: emailShell(
      "Şifrenizi Sıfırlayın",
      `<p>Hesabınız için bir şifre sıfırlama talebi aldık. Aşağıdaki bağlantıya tıklayarak yeni bir şifre belirleyebilirsiniz.</p>
       <p><a href="${resetUrl}" style="display:inline-block; background:#3F7D52; color:#fff; padding:11px 22px; text-decoration:none; font-weight:600;">Şifremi Sıfırla</a></p>
       <p style="color:#5C6167; font-size:12.5px;">Bu talebi siz oluşturmadıysanız bu e-postayı yok sayabilirsiniz.</p>`
    ),
  };
}

export function contactConfirmationEmail(fullName: string, subject: string) {
  return {
    subject: "Mesajınız Alındı",
    html: emailShell(
      "Bize Ulaştığınız İçin Teşekkürler",
      `<p>Merhaba ${fullName},</p>
       <p>"<b>${subject}</b>" konulu mesajınız ekibimize ulaştı. En kısa sürede size dönüş yapacağız.</p>`
    ),
  };
}

export function adminNewMessageNotification(params: { fullName: string; email: string; subject: string; body: string }) {
  return {
    subject: `Yeni İletişim Mesajı — ${params.subject}`,
    html: emailShell(
      "Yeni Bir Mesaj Aldınız",
      `<p><b>${params.fullName}</b> (${params.email}) size bir mesaj gönderdi:</p>
       <p style="background:#F6F7F9; padding:14px; border-left:3px solid #175488;">${params.body}</p>`
    ),
  };
}

export function newsletterWelcomeEmail() {
  return {
    subject: "Bültenimize Hoş Geldiniz",
    html: emailShell(
      "Aboneliğiniz Onaylandı",
      `<p>Biyobilim bültenine abone olduğunuz için teşekkür ederiz. Yeni etkinlikler, BIOLOGOS sayıları ve podcast bölümlerinden ilk siz haberdar olacaksınız.</p>
       <p style="color:#5C6167; font-size:12px;">Dilediğiniz zaman bültenden ayrılabilirsiniz.</p>`
    ),
  };
}

export function adminEventRegistrationNotification(params: { eventTitle: string; fullName: string; email: string }) {
  return {
    subject: `Yeni Etkinlik Kaydı — ${params.eventTitle}`,
    html: emailShell(
      "Yeni Bir Katılımcı Kaydoldu",
      `<p><b>${params.fullName}</b> (${params.email}), <b>${params.eventTitle}</b> etkinliğine kaydoldu.</p>
       <p>Yönetim panelinden kaydı onaylayabilir veya reddedebilirsiniz.</p>`
    ),
  };
}
