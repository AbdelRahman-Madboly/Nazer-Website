import { useEffect, useState } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';

function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
}

const columns = [
  { key: 'device_id',        label: 'Device ID',       mono: true },
  { key: 'driver_id',        label: 'Driver ID',       mono: true, dim: true,
    render: (v) => v ?? <span style={{ color: 'var(--text-muted)' }}>unlinked</span> },
  { key: 'last_seen',        label: 'Last Seen',       mono: true, dim: true,
    render: (v) => fmt(v) },
  { key: 'registered_at',   label: 'Registered',      mono: true, dim: true,
    render: (v) => fmt(v) },
  { key: 'firmware_version', label: 'Firmware',        mono: true,
    render: (v) => v ?? <span style={{ color: 'var(--text-muted)' }}>unknown</span> },
  { key: 'is_active',        label: 'Status',
    render: (v) =>
      v ? (
        <span style={{ color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>● ACTIVE</span>
      ) : (
        <span style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>○ INACTIVE</span>
      ),
  },
  { key: 'device_secret', label: 'Secret Key', mono: true, dim: true,
    render: (v) => (
      <span
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: 'var(--text-muted)',
          filter: 'blur(4px)',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'filter 0.2s',
        }}
        title={v}
        onMouseEnter={(e) => (e.target.style.filter = 'none')}
        onMouseLeave={(e) => (e.target.style.filter = 'blur(4px)')}
      >
        {v}
      </span>
    ),
  },
];

export default function Devices() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    client.get('/devices?limit=50&offset=0')
      .then((r) => {
        setData(r.data.devices || []);
        setTotal(r.data.total || 0);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
        <h1
          style={{
            margin: 0,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '0.05em',
          }}
        >
          / DEVICES
        </h1>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: 'var(--cyan)',
            background: 'rgba(0,212,255,0.08)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '4px',
            padding: '2px 8px',
          }}
        >
          {total} total
        </span>
      </div>

      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
