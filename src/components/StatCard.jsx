const colorMap = {
  blue:   { accent: '#00d4ff', glow: 'rgba(0,212,255,0.12)',   border: 'rgba(0,212,255,0.2)' },
  green:  { accent: '#00e676', glow: 'rgba(0,230,118,0.12)',   border: 'rgba(0,230,118,0.2)' },
  purple: { accent: '#b06cff', glow: 'rgba(176,108,255,0.12)', border: 'rgba(176,108,255,0.2)' },
  amber:  { accent: '#ffab00', glow: 'rgba(255,171,0,0.12)',   border: 'rgba(255,171,0,0.2)' },
  red:    { accent: '#ff4444', glow: 'rgba(255,68,68,0.12)',   border: 'rgba(255,68,68,0.2)' },
};

export default function StatCard({ title, value, color = 'blue', subtitle }) {
  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      className="fade-in"
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${c.border}`,
        borderRadius: '10px',
        padding: '20px 24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 0 30px ${c.glow}`,
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${c.accent}, transparent)`,
        }}
      />
      {/* Corner glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: c.glow,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '11px',
          fontWeight: 500,
          color: 'var(--text-muted)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '32px',
          fontWeight: 700,
          color: c.accent,
          lineHeight: 1,
          textShadow: `0 0 20px ${c.glow}`,
        }}
      >
        {value ?? '—'}
      </div>

      {subtitle && (
        <div
          style={{
            marginTop: '8px',
            fontFamily: 'Sora, sans-serif',
            fontSize: '11px',
            color: 'var(--text-muted)',
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}
