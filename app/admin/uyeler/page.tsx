import { createClient } from "@/lib/supabase/server";
import { updateMembershipStatus } from "./actions";

export default async function UyelerPage() {
  const supabase = (await createClient()) as any;

  const { data: applications, error } = await supabase
    .from("membership_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-[#f5f8f6] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-[#163b2a]">
            Üyelik Başvuruları
          </h1>

          <p className="mt-4 text-red-600">
            Başvurular yüklenirken bir hata oluştu.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f8f6] px-6 py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#287fea]">
            Biyobilim Yönetim Paneli
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#163b2a]">
            Üyelik Başvuruları
          </h1>

          <p className="mt-2 text-[#65726d]">
            Topluluğa yapılan üyelik başvurularını buradan
            görüntüleyebilirsiniz.
          </p>
        </div>

        {applications && applications.length > 0 ? (
          <div className="space-y-4">

            {applications.map((application: any) => (
              <div
                key={application.id}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e1e9e4]"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                  {/* BİLGİLER */}
                  <div>
                    <h2 className="text-xl font-bold text-[#163b2a]">
                      {application.first_name} {application.last_name}
                    </h2>

                    <div className="mt-3 space-y-1 text-sm text-[#65726d]">
                      <p>
                        <strong>E-posta:</strong>{" "}
                        {application.email}
                      </p>

                      <p>
                        <strong>Telefon:</strong>{" "}
                        {application.phone || "Belirtilmemiş"}
                      </p>

                      <p>
                        <strong>Üniversite:</strong>{" "}
                        {application.university || "Belirtilmemiş"}
                      </p>

                      <p>
                        <strong>Bölüm:</strong>{" "}
                        {application.department || "Belirtilmemiş"}
                      </p>

                      <p>
                        <strong>Sınıf:</strong>{" "}
                        {application.class_year || "Belirtilmemiş"}
                      </p>
                    </div>
                  </div>

                  {/* DURUM + BUTONLAR */}
                  <div className="flex flex-col items-start gap-3 md:items-end">

                    {/* DURUM */}
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        application.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : application.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {application.status === "pending"
                        ? "Beklemede"
                        : application.status === "approved"
                        ? "Onaylandı"
                        : application.status === "rejected"
                        ? "Reddedildi"
                        : application.status}
                    </span>

                    {/* SADECE BEKLEYEN BAŞVURULARDA BUTONLAR */}
                    {application.status === "pending" && (
  <div className="flex gap-2">

    {/* ONAYLA */}
    <form action={updateMembershipStatus}>
      <input
        type="hidden"
        name="id"
        value={application.id}
      />

      <input
        type="hidden"
        name="status"
        value="approved"
      />

      <button
        type="submit"
        className="rounded-xl bg-[#278052] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#216c45]"
      >
        Onayla
      </button>
    </form>

    {/* REDDET */}
    <form action={updateMembershipStatus}>
      <input
        type="hidden"
        name="id"
        value={application.id}
      />

      <input
        type="hidden"
        name="status"
        value="rejected"
      />

      <button
        type="submit"
        className="rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
      >
        Reddet
      </button>
    </form>

  </div>
)}

                  </div>

                </div>
              </div>
            ))}

          </div>
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-[#e1e9e4]">
            <p className="text-[#65726d]">
              Henüz üyelik başvurusu bulunmuyor.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}