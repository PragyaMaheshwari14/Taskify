
export default function EmptyState({ filter }) {
  const isFiltered = filter && filter !== "all";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        gap: "10px",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "2rem", opacity: 0.35 }}>
        {isFiltered ? "🔍" : "✦"}
      </span>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.82rem",
          color: "var(--subtle)",
          letterSpacing: "0.01em",
        }}
      >
        {isFiltered
          ? `No ${filter} tasks found.`
          : "No tasks yet. Add one above."}
      </p>
    </div>
  );
}
