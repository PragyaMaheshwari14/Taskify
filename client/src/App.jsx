import { useState } from "react";
import { useTasks } from "./hooks/useTasks";


export default function App() {
  const [status, setStatus] = useState("all");   // "all" | "active" | "completed"
  const [search, setSearch] = useState("");       // search query string

  const {
    tasks,
    meta,
    loading,
    error,
    addTask,
    editTask,
    toggleTask,
    removeTask,
  } = useTasks({ status, search });

  return (
    <div className="min-h-screen" style={{ background: "var(--surface)" }}>
      {/* ── Header ─────────────────────────────────────── */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--white)",
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "20px 24px",
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "var(--black)",
              letterSpacing: "-0.02em",
            }}
          >
            taskflow
          </h1>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--subtle)",
            }}
          >
            {meta.totalActive} active · {meta.totalCompleted} done
          </span>
        </div>
      </header>

      {/* ── Main content ───────────────────────────────── */}
      <main
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "32px 24px",
        }}
      >
        {/* Loading */}
        {loading && (
          <p style={{ color: "var(--subtle)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
            Loading…
          </p>
        )}

        {/* Error */}
        {error && (
          <p style={{ color: "var(--danger)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
            {error}
          </p>
        )}

        {/* Placeholder — components arrive in Part 3 */}
        {!loading && !error && (
          <p style={{ color: "var(--mid)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
            {tasks.length === 0
              ? "add the full UI."
              : `${tasks.length} task(s) loaded — UI .`}
          </p>
        )}
      </main>
    </div>
  );
}
