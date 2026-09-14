"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction, type ActionState } from "@/features/auth/actions/auth.actions";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Button, Input, Label, FieldError } from "@/components/ui";

const initialState: ActionState = { success: false };

export default function SifremiUnuttumPage() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialState);

  return (
    <AuthShell
      title="Şifremi Unuttum"
      subtitle="Kayıtlı e-posta adresinizi girin, size bir sıfırlama bağlantısı gönderelim."
      footer={
        <Link href="/giris" className="font-semibold text-blue hover:text-green">
          ← Giriş sayfasına dön
        </Link>
      }
    >
      {state.success ? (
        <p className="bg-green/10 px-4 py-3.5 text-sm text-green">{state.message}</p>
      ) : (
        <form action={formAction} noValidate className="space-y-4">
          <div>
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" name="email" type="email" required error={state.fieldErrors?.email?.[0]} />
            <FieldError id="email" message={state.fieldErrors?.email?.[0]} />
          </div>
          <Button type="submit" className="w-full justify-center" disabled={isPending}>
            {isPending ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
