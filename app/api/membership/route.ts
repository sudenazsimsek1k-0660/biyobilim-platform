import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      university,
      department,
      class_year,
      message,
    } = body;

    // Ad soyadı ayır
    const nameParts = name.trim().split(/\s+/);
    const first_name = nameParts.shift() || "";
    const last_name = nameParts.join(" ") || "";

    const supabase = (await createClient()) as any;

    const { error } = await supabase
      .from("membership_applications")
     .insert({
  first_name,
  last_name,
  university: university || "Niğde Ömer Halisdemir Üniversitesi",
  department: department || null,
  class_year: class_year || null,
  email,
  phone,
  status: "pending",
});

    if (error) {
      console.error("Üyelik başvurusu hatası:", error);

      return NextResponse.json(
        { error: "Başvuru kaydedilemedi." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("API hatası:", error);

    return NextResponse.json(
      { error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}