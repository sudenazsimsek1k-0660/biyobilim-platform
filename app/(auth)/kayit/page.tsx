"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction, type ActionState } from "@/features/auth/actions/auth.actions";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Button, Input, Label, FieldError } from "@/components/ui";

const initialState: ActionState = { success: false };
const classYears = ["Hazırlık", "1. Sınıf", "2. Sınıf", "3. Sınıf", "4. Sınıf", "Yüksek Lisans", "Doktora"];

export default function KayitPage() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);

  if (state.success) {
    return (
      <AuthShell title="Kaydınız Alındı" subtitle="Son bir adım kaldı.">
        <p className="bg-green/10 px-4 py-3.5 text-sm text-green">{state.message}</p>
        <Link href="/giris" className="mt-6 block text-center text-sm font-semibold text-blue hover:text-green">
          Giriş sayfasına dön →
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Üye Ol"
      subtitle="Biyobilim topluluğuna katılmak için bilgilerinizi girin."
      footer={
        <>
          Zaten üye misiniz?{" "}
          <Link href="/giris" className="font-semibold text-blue hover:text-green">
            Giriş Yap
          </Link>
        </>
      }
    >
      <form action={formAction} noValidate className="space-y-4">
        {state.message && (
          <p role="alert" className="bg-red/10 px-3.5 py-2.5 text-sm text-red">
            {state.message}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName">Ad</Label>
            <Input id="firstName" name="firstName" required error={state.fieldErrors?.firstName?.[0]} />
            <FieldError id="firstName" message={state.fieldErrors?.firstName?.[0]} />
          </div>
          <div>
            <Label htmlFor="lastName">Soyad</Label>
            <Input id="lastName" name="lastName" required error={state.fieldErrors?.lastName?.[0]} />
            <FieldError id="lastName" message={state.fieldErrors?.lastName?.[0]} />
          </div>
        </div>
        <div>
          <Label htmlFor="university">Üniversite</Label>
          <Input id="university" name="university" required error={state.fieldErrors?.university?.[0]} />
          <FieldError id="university" message={state.fieldErrors?.university?.[0]} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="department">Bölüm</Label>
            <Input id="department" name="department" required error={state.fieldErrors?.department?.[0]} />
            <FieldError id="department" message={state.fieldErrors?.department?.[0]} />
          </div>
          <div>
            <Label htmlFor="classYear">Sınıf</Label>
            <select
              id="classYear"
              name="classYear"
              required
              className="w-full border border-line bg-bg px-3.5 py-2.5 text-sm focus:border-green focus:bg-white focus:outline-none"
            >
              <option value="">Seçiniz</option>
              {classYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <FieldError id="classYear" message={state.fieldErrors?.classYear?.[0]} />
          </div>
        </div>
        <div>
          <Label htmlFor="email">E-posta</Label>
          <Input id="email" name="email" type="email" required error={state.fieldErrors?.email?.[0]} />
          <FieldError id="email" message={state.fieldErrors?.email?.[0]} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="password">Şifre</Label>
            <Input id="password" name="password" type="password" required error={state.fieldErrors?.password?.[0]} />
            <FieldError id="password" message={state.fieldErrors?.password?.[0]} />
          </div>
          <div>
            <Label htmlFor="passwordConfirm">Şifre Tekrar</Label>
            <Input id="passwordConfirm" name="passwordConfirm" type="password" required error={state.fieldErrors?.passwordConfirm?.[0]} />
            <FieldError id="passwordConfirm" message={state.fieldErrors?.passwordConfirm?.[0]} />
          </div>
        </div>
        <label className="flex items-start gap-2.5 text-xs text-ink-muted">
          <input type="checkbox" name="termsAccepted" className="mt-0.5 accent-green" required />
          Kullanım Koşullarını kabul ediyorum.
        </label>
        <FieldError id="termsAccepted" message={state.fieldErrors?.termsAccepted?.[0]} />
        <Button type="submit" className="w-full justify-center" disabled={isPending}>
          {isPending ? "Kaydediliyor..." : "Üye Ol"}
        </Button>
      </form>
    </AuthShell>
  );
}
