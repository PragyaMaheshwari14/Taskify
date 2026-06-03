export default function TaskCounter({ totalActive, totalCompleted }) {
  const total = totalActive + totalCompleted;
  const percent = total === 0 ? 0 : Math.round((totalCompleted / total) * 100);

  if (total === 0) return null;

  return (
    <div
      style={{
        background: "var(--white)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "12px 16px",
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {/* Counts row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Active */}
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--ink)",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "var(--charcoal)",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          {totalActive} active
        </span>

        {/* Divider */}
        <span style={{ color: "var(--border)", fontSize: "0.7rem" }}>|</span>

        {/* Completed */}
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--mid)",
          }}
        >
          <span style={{ fontSize: "0.65rem" }}>✓</span>
          {totalCompleted} done
        </span>

        {/* Percent — pushed to right */}
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: percent === 100 ? "var(--charcoal)" : "var(--subtle)",
            fontWeight: percent === 100 ? 500 : 400,
          }}
        >
          {percent === 100 ? "all done ✦" : `${percent}%`}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: "3px",
          borderRadius: "99px",
          background: "var(--border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            borderRadius: "99px",
            background: percent === 100 ? "var(--charcoal)" : "var(--ink)",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
