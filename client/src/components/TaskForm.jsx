import { useState } from "react";

const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  fontFamily: "var(--font-sans)",
  fontSize: "0.875rem",
  color: "var(--ink)",
  background: "var(--white)",
  outline: "none",
  transition: "border-color 0.15s",
};

const labelStyle = {
  display: "block",
  fontFamily: "var(--font-mono)",
  fontSize: "0.7rem",
  color: "var(--mid)",
  marginBottom: "5px",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

/**
 * TaskForm
 *
 * Collapsible form to add a new task.
 * Title is required; description and dueDate are optional.
 */
export default function TaskForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setError("");
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onAdd({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
      });
      reset();
    } catch (err) {
      setError(err.message || "Failed to add task.");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") reset();
  };

  // ── Collapsed state — just a button ──────────────────
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          padding: "11px 14px",
          border: "1.5px dashed var(--border)",
          borderRadius: "var(--radius)",
          background: "transparent",
          color: "var(--subtle)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.875rem",
          cursor: "pointer",
          transition: "border-color 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--charcoal)";
          e.currentTarget.style.color = "var(--charcoal)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.color = "var(--subtle)";
        }}
      >
        <span style={{ fontSize: "1rem", lineHeight: 1 }}>+</span>
        New task
      </button>
    );
  }

  // ── Expanded form ─────────────────────────────────────
  return (
    <div
      style={{
        border: "1.5px solid var(--charcoal)",
        borderRadius: "var(--radius)",
        background: "var(--white)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Title */}
      <div>
        <label style={labelStyle}>Title *</label>
        <input
          autoFocus
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "var(--charcoal)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
        {error && (
          <p
            style={{
              color: "var(--danger)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              marginTop: "4px",
            }}
          >
            {error}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          placeholder="Optional notes…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          style={{
            ...inputStyle,
            resize: "vertical",
            lineHeight: "1.5",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--charcoal)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Due date */}
      <div>
        <label style={labelStyle}>Due date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ ...inputStyle, width: "auto" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--charcoal)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <button
          onClick={reset}
          disabled={saving}
          style={{
            padding: "7px 14px",
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
          onClick={handleSubmit}
          disabled={saving}
          style={{
            padding: "7px 16px",
            border: "none",
            borderRadius: "var(--radius)",
            background: saving ? "var(--charcoal)" : "var(--black)",
            color: "var(--white)",
            fontFamily: "var(--font-sans)",
            fontSize: "0.8rem",
            fontWeight: 500,
            cursor: saving ? "not-allowed" : "pointer",
            transition: "background 0.15s",
          }}
        >
          {saving ? "Adding…" : "Add task"}
        </button>
      </div>
    </div>
  );
}
