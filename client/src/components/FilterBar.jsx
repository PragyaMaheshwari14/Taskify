import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";

export default function FilterBar({ status, onStatusChange, search, onSearchChange }) {

  const [localSearch, setLocalSearch] = useState(search);

  const debouncedSearch = useDebounce(localSearch, 350);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (search === "") setLocalSearch("");
  }, [search]);

  const tabs = [
    { value: "all",       label: "All" },
    { value: "active",    label: "Active" },
    { value: "completed", label: "Completed" },
  ];

    const handleClear = () => {
    setLocalSearch("");
    onSearchChange("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginBottom: "20px",
      }}
    >
      {/* ── Status tabs ──────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: "2px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "3px",
          width: "fit-content",
        }}
      >
        {tabs.map((tab) => {
          const active = status === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onStatusChange(tab.value)}
              style={{
                padding: "5px 14px",
                borderRadius: "4px",
                border: "none",
                fontFamily: "var(--font-sans)",
                fontSize: "0.8rem",
                fontWeight: active ? 500 : 400,
                color: active ? "var(--black)" : "var(--mid)",
                background: active ? "var(--white)" : "transparent",
                boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                cursor: "pointer",
                transition: "all 0.15s",
                minHeight: "32px",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Search input ─────────────────────────────── */}
      <div style={{ position: "relative", width: "100%", maxWidth: "320px" }}>
        {/* Search icon */}
        <span
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--subtle)",
            fontSize: "0.8rem",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          ⌕
        </span>
        <input
          type="text"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: "100%",
            padding: "7px 10px 7px 28px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            fontFamily: "var(--font-sans)",
            fontSize: "0.82rem",
            color: "var(--ink)",
            background: "var(--white)",
            outline: "none",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--charcoal)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
          {localSearch && (
          <button
            onClick={handleClear}
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              color: "var(--subtle)",
              cursor: "pointer",
              fontSize: "0.75rem",
              lineHeight: 1,
              padding: "4px",
              // Bigger tap target
              minWidth: "24px",
              minHeight: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
