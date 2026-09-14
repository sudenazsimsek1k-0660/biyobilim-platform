import { z } from "zod";

/** Ortak alan doğrulamaları — hata mesajları Türkçe ve kullanıcı dostu olmalıdır. */
const email = z.string().min(1, "E-posta adresi zorunludur.").email("Geçerli bir e-posta adresi girin.");
const password = z
  .string()
  .min(8, "Şifre en az 8 karakter olmalıdır.")
  .regex(/[A-Z]/, "Şifre en az bir büyük harf içermelidir.")
  .regex(/[0-9]/, "Şifre en az bir rakam içermelidir.");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Şifre zorunludur."),
  rememberMe: z.boolean().optional().default(false),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır."),
    lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır."),
    university: z.string().min(2, "Üniversite alanı zorunludur."),
    department: z.string().min(2, "Bölüm alanı zorunludur."),
    classYear: z.string().min(1, "Sınıf seçimi zorunludur."),
    email,
    password,
    passwordConfirm: z.string(),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: "Devam etmek için Kullanım Koşullarını kabul etmelisiniz." }),
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Şifreler eşleşmiyor.",
    path: ["passwordConfirm"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password,
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Şifreler eşleşmiyor.",
    path: ["passwordConfirm"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
