import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/',           label: 'Dashboard',  icon: '◈' },
  { to: '/devices',    label: 'Devices',    icon: '⬡' },
  { to: '/drivers',    label: 'Drivers',    icon: '◎' },
  { to: '/violations', label: 'Violations', icon: '⚠' },
  { to: '/telemetry',  label: 'Telemetry',  icon: '〜' },
];

export default function Navbar() {
  return (
    <nav
      className="scanlines"
      style={{
        background: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          height: '56px',
          gap: '32px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              background: 'var(--cyan)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '13px',
              color: '#000',
              boxShadow: '0 0 16px var(--cyan-glow)',
            }}
          >
            N
          </div>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 700,
              fontSize: '15px',
              letterSpacing: '0.2em',
              color: 'var(--cyan)',
              textShadow: '0 0 12px rgba(0,212,255,0.5)',
            }}
          >
            NAZER
          </span>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              marginLeft: '2px',
            }}
          >
            ADMIN
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontFamily: 'Sora, sans-serif',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--cyan)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                border: isActive ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
                transition: 'all 0.15s',
                cursor: 'pointer',
              })}
            >
              <span style={{ fontSize: '11px', opacity: 0.8 }}>{tab.icon}</span>
              {tab.label}
            </NavLink>
          ))}
        </div>

        {/* Right side — status */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--green)',
              boxShadow: '0 0 8px rgba(0,230,118,0.7)',
              animation: 'badge-pulse 2s ease infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
            }}
          >
            :8080 ONLINE
          </span>
        </div>
      </div>
    </nav>
  );
}
