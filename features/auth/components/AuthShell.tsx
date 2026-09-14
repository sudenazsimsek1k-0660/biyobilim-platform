import type { ReactNode } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site.config";

/** Tüm kimlik doğrulama sayfalarında (giriş, kayıt, şifre işlemleri) paylaşılan kabuk. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-deep to-blue px-5 py-12">
      <div className="w-full max-w-[420px] bg-white p-9 shadow-modal">
        <Link href="/" className="mb-1.5 flex items-center gap-2.5 font-head text-lg font-bold text-blue-deep">
          <span className="h-2 w-2 rounded-full bg-green" aria-hidden="true" />
          {siteConfig.name.toUpperCase()}
        </Link>
        <h1 className="mt-4 text-xl font-semibold text-blue-deep">{title}</h1>
        <p className="mb-7 mt-1.5 text-sm text-ink-muted">{subtitle}</p>
        {children}
        {footer && <div className="mt-6 text-center text-sm text-ink-muted">{footer}</div>}
      </div>
    </main>
  );
}
