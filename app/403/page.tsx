import Link from "next/link";

export const metadata = { title: "Erişim Reddedildi" };

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center">
      <span className="font-head text-6xl font-bold text-blue-deep">403</span>
      <h1 className="text-xl font-semibold text-blue-deep">Bu sayfaya erişim yetkiniz yok</h1>
      <p className="max-w-sm text-sm text-ink-muted">
        Bu bölüm yalnızca yöneticiler içindir. Bir hata olduğunu düşünüyorsanız topluluk yöneticileriyle iletişime geçin.
      </p>
      <Link href="/" className="mt-2 font-semibold text-blue hover:text-green">
        Ana sayfaya dön →
      </Link>
    </main>
  );
}
