import { useState } from "react";
import DeleteConfirm from "./DeleteConfirm";

/** Format an ISO date string to a readable short date */
function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Convert ISO date to yyyy-mm-dd for <input type="date"> */
function toInputDate(iso) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

const inputStyle = {
  width: "100%",
  padding: "5px 8px",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  fontFamily: "var(--font-sans)",
  fontSize: "0.875rem",
  color: "var(--ink)",
  background: "var(--white)",
  outline: "none",
};

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || "");
  const [editDue, setEditDue] = useState(toInputDate(task.dueDate));
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const isOverdue = task.isOverdue;

  const startEdit = () => {
    setEditTitle(task.title);
    setEditDesc(task.description || "");
    setEditDue(toInputDate(task.dueDate));
    setEditError("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditError("");
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      setEditError("Title is required.");
      return;
    }
    setSaving(true);
    try {
      await onEdit(task._id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
        dueDate: editDue || null,
      });
      setEditing(false);
    } catch (err) {
      setEditError(err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") cancelEdit();
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    await onDelete(task._id);
  };

  // ── Row wrapper style ─────────────────────────────────
  const rowStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "var(--radius)",
    background: "var(--white)",
    border: "1px solid var(--border)",
    transition: "border-color 0.15s, box-shadow 0.15s",
    position: "relative",
  };

  if (isOverdue) {
    rowStyle.borderLeft = "3px solid var(--overdue)";
  }

  if (task.completed) {
    rowStyle.opacity = 0.55;
  }

  // ── Checkbox ──────────────────────────────────────────
  const Checkbox = () => (
    <button
      onClick={() => onToggle(task._id)}
      aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      style={{
        flexShrink: 0,
        marginTop: "2px",
        width: "18px",
        height: "18px",
        border: `1.5px solid ${task.completed ? "var(--charcoal)" : "var(--border)"}`,
        borderRadius: "4px",
        background: task.completed ? "var(--charcoal)" : "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s",
        color: "var(--white)",
        fontSize: "0.65rem",
      }}
    >
      {task.completed ? "✓" : ""}
    </button>
  );

  // ── Action buttons ────────────────────────────────────
  const ActionButtons = () => (
    <div
      className="task-actions"
      style={{
        display: "flex",
        gap: "4px",
        flexShrink: 0,
        opacity: 0,
        transition: "opacity 0.15s",
      }}
    >
      <button
        onClick={startEdit}
        aria-label="Edit task"
        style={{
          width: "26px",
          height: "26px",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          background: "transparent",
          color: "var(--mid)",
          cursor: "pointer",
          fontSize: "0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Edit"
      >
        ✎
      </button>
      <button
        onClick={() => setShowConfirm(true)}
        aria-label="Delete task"
        style={{
          width: "26px",
          height: "26px",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          background: "transparent",
          color: "var(--mid)",
          cursor: "pointer",
          fontSize: "0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Delete"
      >
        ✕
      </button>
    </div>
  );

  // ── EDIT MODE ─────────────────────────────────────────
  if (editing) {
    return (
      <div
        style={{
          ...rowStyle,
          border: "1.5px solid var(--charcoal)",
          flexDirection: "column",
          gap: "10px",
          alignItems: "stretch",
          opacity: 1,
        }}
      >
        {/* Title */}
        <input
          autoFocus
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "var(--charcoal)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
        {editError && (
          <p style={{ color: "var(--danger)", fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>
            {editError}
          </p>
        )}

        {/* Description */}
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="Description (optional)"
          style={{ ...inputStyle, resize: "vertical", lineHeight: "1.5" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--charcoal)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />

        {/* Due date + actions row */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="date"
            value={editDue}
            onChange={(e) => setEditDue(e.target.value)}
            style={{ ...inputStyle, width: "auto", flex: "0 0 auto" }}
          />
          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            <button
              onClick={cancelEdit}
              style={{
                padding: "5px 12px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                background: "transparent",
                color: "var(--mid)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.78rem",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "5px 14px",
                border: "none",
                borderRadius: "var(--radius)",
                background: "var(--black)",
                color: "var(--white)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.78rem",
                fontWeight: 500,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── READ MODE ─────────────────────────────────────────
  return (
    <>
      <div
        className="task-row"
        style={rowStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--charcoal)";
          const actions = e.currentTarget.querySelector(".task-actions");
          if (actions) actions.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = isOverdue
            ? "var(--overdue)"
            : "var(--border)";
          if (isOverdue) e.currentTarget.style.borderLeft = "3px solid var(--overdue)";
          const actions = e.currentTarget.querySelector(".task-actions");
          if (actions) actions.style.opacity = "0";
        }}
      >
        <Checkbox />

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              color: task.completed ? "var(--subtle)" : "var(--ink)",
              textDecoration: task.completed ? "line-through" : "none",
              wordBreak: "break-word",
              lineHeight: 1.5,
            }}
          >
            {task.title}
          </p>

          {task.description && (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.78rem",
                color: "var(--mid)",
                marginTop: "3px",
                lineHeight: 1.45,
                wordBreak: "break-word",
              }}
            >
              {task.description}
            </p>
          )}

          {/* Due date badge */}
          {task.dueDate && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "6px",
                padding: "2px 7px",
                borderRadius: "99px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                background: isOverdue ? "#fff3e0" : "var(--surface)",
                color: isOverdue ? "var(--overdue)" : "var(--mid)",
                border: `1px solid ${isOverdue ? "#ffd699" : "var(--border)"}`,
              }}
            >
              {isOverdue ? "⚠ overdue · " : ""}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        <ActionButtons />
      </div>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <DeleteConfirm
          taskTitle={task.title}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
