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

  const supabase = (await createClient()) as any;

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
  redirect("/hesabim" as any);
}

/** Yeni kullanıcı kaydı oluşturur. */
export async function signUpAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    university: formData.get("university"),
    department: formData.get("department"),
    classYear: formData.get("classYear"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
    termsAccepted: formData.get("termsAccepted") === "on",
  });

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        university: parsed.data.university,
        department: parsed.data.department,
        class_year: parsed.data.classYear,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message:
        error.message === "User already registered"
          ? "Bu e-posta adresi zaten kayıtlı."
          : "Kayıt oluşturulamadı. Lütfen tekrar deneyin.",
    };
  }

  return {
    success: true,
    message:
      "Kaydınız oluşturuldu. E-posta adresinizi doğruladıktan sonra giriş yapabilirsiniz.",
  };
}

/** Kullanıcıya şifre sıfırlama bağlantısı gönderir. */
export async function forgotPasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${siteUrl}/sifre-sifirla`,
    }
  );

  if (error) {
    return {
      success: false,
      message: "Şifre sıfırlama bağlantısı gönderilemedi. Lütfen tekrar deneyin.",
    };
  }

  return {
    success: true,
    message:
      "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Gelen kutunuzu ve spam klasörünü kontrol edin.",
  };
}

/** Yeni şifreyi kaydeder. */
export async function resetPasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      message: "Şifre güncellenemedi. Lütfen şifre sıfırlama bağlantısını yeniden isteyin.",
    };
  }

  return {
    success: true,
    message: "Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.",
  };
}