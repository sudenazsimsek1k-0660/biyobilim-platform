import Link from "next/link";
import { AuthShell } from "@/features/auth/components/AuthShell";

/**
 * `/kayit` sonrası bilgilendirme sayfası. Gerçek doğrulama işlemi
 * `app/auth/callback/route.ts` tarafından, kullanıcı e-postasındaki
 * bağlantıya tıkladığında sunucu tarafında yürütülür.
 */
export default function DogrulaPage() {
  return (
    <AuthShell title="E-postanızı Doğrulayın" subtitle="Kaydınızı tamamlamak için son bir adım kaldı.">
      <p className="text-sm leading-relaxed text-ink-muted">
        Size gönderdiğimiz doğrulama bağlantısına tıklayarak hesabınızı etkinleştirebilirsiniz.
        E-postayı birkaç dakika içinde göremiyorsanız spam/gereksiz klasörünü kontrol edin.
      </p>
      <Link href="/giris" className="mt-6 block text-center text-sm font-semibold text-blue hover:text-green">
        Giriş sayfasına dön →
      </Link>
    </AuthShell>
  );
}
