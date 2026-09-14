/**
 * Türkçe yerelleştirme (tr-TR) ile tarih/sayı biçimlendirme yardımcıları.
 * Bileşenlerde `new Date(...).toLocaleDateString()` gibi tekrarlanan
 * ifadeler yerine bu fonksiyonlar kullanılmalıdır.
 */

export function formatDate(input: string | Date, options?: Intl.DateTimeFormatOptions) {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(date);
}

export function formatDateTime(input: string | Date) {
  return formatDate(input, { hour: "2-digit", minute: "2-digit" });
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("tr-TR").format(value);
}

/** "42 dk 18 sn" gibi bir podcast süresi biçimi üretir. */
export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds > 0 ? `${minutes} dk ${seconds} sn` : `${minutes} dk`;
}

/** Bir metinden Türkçe karakterlere duyarlı, URL-uyumlu bir slug üretir. */
export function slugify(input: string) {
  const map: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return input
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function truncate(text: string, maxLength: number) {
  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text;
}
