"use client";

import { useActionState } from "react";
import { resetPasswordAction, type ActionState } from "@/features/auth/actions/auth.actions";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Button, Input, Label, FieldError } from "@/components/ui";

const initialState: ActionState = { success: false };

export default function SifreSifirlaPage() {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState);

  return (
    <AuthShell title="Yeni Şifre Belirle" subtitle="Hesabınız için yeni bir şifre oluşturun.">
      <form action={formAction} noValidate className="space-y-4">
        {state.message && (
          <p role="alert" className="bg-red/10 px-3.5 py-2.5 text-sm text-red">
            {state.message}
          </p>
        )}
        <div>
          <Label htmlFor="password">Yeni Şifre</Label>
          <Input id="password" name="password" type="password" required error={state.fieldErrors?.password?.[0]} />
          <FieldError id="password" message={state.fieldErrors?.password?.[0]} />
        </div>
        <div>
          <Label htmlFor="passwordConfirm">Yeni Şifre (Tekrar)</Label>
          <Input id="passwordConfirm" name="passwordConfirm" type="password" required error={state.fieldErrors?.passwordConfirm?.[0]} />
          <FieldError id="passwordConfirm" message={state.fieldErrors?.passwordConfirm?.[0]} />
        </div>
        <Button type="submit" className="w-full justify-center" disabled={isPending}>
          {isPending ? "Kaydediliyor..." : "Şifreyi Güncelle"}
        </Button>
      </form>
    </AuthShell>
  );
}
