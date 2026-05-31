import { useEffect, useState } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';

function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
}

const columns = [
  { key: 'id',            label: 'ID',            mono: true, dim: true },
  { key: 'full_name',     label: 'Full Name' },
  { key: 'national_id',   label: 'National ID',   mono: true },
  { key: 'car_plate',     label: 'Car Plate',     mono: true },
  { key: 'phone',         label: 'Phone',         mono: true, dim: true },
  {
    key: 'total_fines_egp',
    label: 'Total Fines',
    render: (v) => (
      <span
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          color: v > 0 ? '#ff4444' : 'var(--text-muted)',
          fontWeight: v > 0 ? 600 : 400,
        }}
      >
        {v != null ? `${Number(v).toFixed(0)} EGP` : '0 EGP'}
      </span>
    ),
  },
  { key: 'registered_at', label: 'Registered', mono: true, dim: true, render: fmt },
  {
    key: 'is_active',
    label: 'Status',
    render: (v) =>
      v ? (
        <span style={{ color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>● ACTIVE</span>
      ) : (
        <span style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>○ INACTIVE</span>
      ),
  },
];

export default function Drivers() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    client.get('/drivers?limit=50&offset=0')
      .then((r) => {
        setData(r.data.drivers || []);
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
          / DRIVERS
        </h1>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: 'var(--purple)',
            background: 'rgba(176,108,255,0.08)',
            border: '1px solid rgba(176,108,255,0.2)',
            borderRadius: '4px',
            padding: '2px 8px',
          }}
        >
          {total} registered
        </span>
      </div>

      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
