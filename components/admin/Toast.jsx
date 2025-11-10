"use client";
import { useEffect, useState, useCallback } from "react";

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function handler(e) {
      const detail = e.detail || {};
      const id = detail.id || String(Date.now());
      setToasts((prev) => [...prev, { id, ...detail }]);
      const timeout = detail.timeout ?? 3000;
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), timeout);
    }
    window.addEventListener("toast", handler);
    return () => window.removeEventListener("toast", handler);
  }, []);

  const dismiss = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type || "info"}`} role="status">
          <span>{t.message}</span>
          <button className="toast-dismiss" onClick={() => dismiss(t.id)} aria-label="Dismiss notification">×</button>
        </div>
      ))}
    </div>
  );
}

export function notify(message, type = "info", timeout = 3000) {
  const event = new CustomEvent("toast", { detail: { message, type, timeout } });
  window.dispatchEvent(event);
}

