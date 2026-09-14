import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind sınıflarını çakışma olmadan birleştirir (koşullu sınıflar için). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
