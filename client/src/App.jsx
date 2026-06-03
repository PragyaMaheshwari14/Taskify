import { useCallback, useState } from "react";
import { useTasks } from "./hooks/useTasks";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterBar from "./components/FilterBar";
import TaskCounter from "./components/TaskCounter";

export default function App() {
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState("all"); // "all" | "active" | "completed"
  // eslint-disable-next-line no-unused-vars
  const [search, setSearch] = useState(""); // search query string

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

  const handleSearchChange = useCallback((val) => {
    setSearch(val);
  }, []);

  const handleStatusChange = useCallback((val) => {
    setStatus(val);
    setSearch(""); // clear search when switching tabs
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)" }}>
      {/* ── Header ─────────────────────────────────────── */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--white)",
          position: "sticky",
          top: 0,
          zIndex: 10,
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
          padding: "32px 24px 80px",
        }}
      >
        {/* Add task form */}
        <div style={{ marginBottom: "28px" }}>
          <TaskForm onAdd={addTask} />
        </div>

        {/* Counter strip — active vs completed progress */}
        <TaskCounter
          totalActive={meta.totalActive}
          totalCompleted={meta.totalCompleted}
        />

        {/* Filter bar — tabs + search */}
        <FilterBar
          status={status}
          onStatusChange={handleStatusChange}
          search={search}
          onSearchChange={handleSearchChange}
        />

        {/* Error banner */}
        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius)",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "var(--danger)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        {/* Section label */}
        {!loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                color: "var(--subtle)",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
               {status === "all" ? "Tasks" : status}
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "var(--border)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                color: "var(--subtle)",
              }}
            >
              {tasks.length}
            </span>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: "52px",
                  borderRadius: "var(--radius)",
                  background: "var(--border)",
                  opacity: 1 - i * 0.2,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 0.3; }
              }
            `}</style>
          </div>
        )}

        {/* Task list */}
        {!loading && (
          <TaskList
            tasks={tasks}
            filter={status}
            onToggle={toggleTask}
            onEdit={editTask}
            onDelete={removeTask}
          />
        )}
      </main>
    </div>
  );
}
