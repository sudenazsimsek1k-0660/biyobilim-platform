"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

export async function updateMembershipStatus(formData: FormData) {
  const id = formData.get("id");
  const status = formData.get("status");

  if (typeof id !== "string") {
    throw new Error("Başvuru ID bulunamadı.");
  }

  if (status !== "approved" && status !== "rejected") {
    throw new Error("Geçersiz başvuru durumu.");
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("membership_applications")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
  console.error("Üyelik durumu güncellenemedi:", error);
  throw new Error(
    `Supabase hatası: ${error.message}`
  );
}

  revalidatePath("/admin/uyeler");
}