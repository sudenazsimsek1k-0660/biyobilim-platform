"use client";

import { useCallback, useState } from "react";

export interface ToastMessage {
  id: string;
  message: string;
  tone: "success" | "error" | "info";
}

/**
 * Hafif, bağımlılıksız toast (bildirim) durumu yönetimi.
 * `<ToastViewport toasts={toasts} />` gibi bir sunum bileşeniyle birlikte kullanılmak üzere tasarlanmıştır.
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, tone: ToastMessage["tone"] = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return { toasts, showToast };
}
