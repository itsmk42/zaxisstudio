"use client";
import { useEffect } from "react";

export default function ConfirmDialog({ open, title, message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onCancel?.();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal">
        <h3 id="confirm-title" className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="btn" onClick={onCancel}>{cancelText}</button>
          <button className="btn danger" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

