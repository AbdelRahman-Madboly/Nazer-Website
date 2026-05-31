const badgeStyles = {
  pending:   { bg: 'rgba(255,171,0,0.12)',  border: 'rgba(255,171,0,0.35)',  color: '#ffab00', label: 'PENDING',   pulse: true  },
  paid:      { bg: 'rgba(0,230,118,0.12)',  border: 'rgba(0,230,118,0.35)', color: '#00e676', label: 'PAID',      pulse: false },
  cancelled: { bg: 'rgba(100,120,140,0.1)', border: 'rgba(100,120,140,0.3)', color: '#7a9ab8', label: 'CANCELLED', pulse: false },
  disputed:  { bg: 'rgba(255,68,68,0.12)',  border: 'rgba(255,68,68,0.35)', color: '#ff4444', label: 'DISPUTED',  pulse: false },
};

export default function StatusBadge({ status }) {
  const s = badgeStyles[status] || badgeStyles.pending;

  return (
    <span
      className={s.pulse ? 'badge-pulse' : ''}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 9px',
        borderRadius: '4px',
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.08em',
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: s.color,
          flexShrink: 0,
        }}
      />
      {s.label}
    </span>
  );
}
