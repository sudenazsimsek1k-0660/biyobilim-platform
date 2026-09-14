"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth.schema";

export type ActionState = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

/** E-posta + şifre ile giriş yapar. */
export async function signInAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on",
  });

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  // Giriş başarısızsa önce hatayı göster
  if (error) {
    return {
      success: false,
      message:
        error.message === "Invalid login credentials"
          ? "E-posta veya şifre hatalı."
          : "Giriş yapılamadı. Lütfen tekrar deneyin.",
    };
  }

  // Giriş başarılı → kullanıcının rolünü kontrol et
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Oturum oluşturulamadı. Lütfen tekrar deneyin.",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  revalidatePath("/", "layout");

  // Admin → yönetim paneli
  if (profile?.role === "admin") {
    redirect("/admin");
  }

  // Normal üye → hesap sayfası
  redirect("/hesabim");
}