import { useEffect } from "react";

export default function DeleteConfirm({ taskTitle, onConfirm, onCancel }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    // Backdrop
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "24px",
      }}
    >
      {/* Modal card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--white)",
          borderRadius: "var(--radius-lg)",
          padding: "28px 28px 24px",
          maxWidth: "380px",
          width: "100%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            background: "#fef2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "14px",
            fontSize: "1.1rem",
          }}
        >
          🗑
        </div>

        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "var(--black)",
            marginBottom: "6px",
          }}
        >
          Delete task?
        </h2>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.83rem",
            color: "var(--mid)",
            lineHeight: 1.5,
            marginBottom: "22px",
          }}
        >
          <span style={{ color: "var(--ink)", fontWeight: 500 }}>
            "{taskTitle}"
          </span>{" "}
          will be permanently removed. This cannot be undone.
        </p>

        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "7px 16px",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              background: "transparent",
              color: "var(--mid)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "7px 16px",
              border: "none",
              borderRadius: "var(--radius)",
              background: "var(--danger)",
              color: "var(--white)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
