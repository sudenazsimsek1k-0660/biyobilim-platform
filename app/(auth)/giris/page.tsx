"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction, type ActionState } from "@/features/auth/actions/auth.actions";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Button, Input, Label, FieldError } from "@/components/ui";

const initialState: ActionState = { success: false };

export default function GirisPage() {
  const [state, formAction, isPending] = useActionState(signInAction, initialState);

  return (
    <AuthShell
      title="Giriş Yap"
      subtitle="Hesabınıza erişmek için bilgilerinizi girin."
      footer={
        <>
          Hesabınız yok mu?{" "}
          <Link href="/kayit" className="font-semibold text-blue hover:text-green">
            Üye Ol
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
        <div>
          <Label htmlFor="email">E-posta</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required error={state.fieldErrors?.email?.[0]} />
          <FieldError id="email" message={state.fieldErrors?.email?.[0]} />
        </div>
        <div>
          <Label htmlFor="password">Şifre</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required error={state.fieldErrors?.password?.[0]} />
          <FieldError id="password" message={state.fieldErrors?.password?.[0]} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink-muted">
            <input type="checkbox" name="rememberMe" className="accent-green" />
            Beni hatırla
          </label>
          <Link href="/sifremi-unuttum" className="font-semibold text-blue hover:text-green">
            Şifremi Unuttum
          </Link>
        </div>
        <Button type="submit" className="w-full justify-center" disabled={isPending}>
          {isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>
    </AuthShell>
  );
}
