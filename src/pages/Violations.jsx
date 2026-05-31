import { useEffect, useState, useCallback } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
}

function inputStyle(extra = {}) {
  return {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-bright)',
    borderRadius: '6px',
    padding: '7px 12px',
    color: 'var(--text-primary)',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '12px',
    outline: 'none',
    ...extra,
  };
}

export default function Violations() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // violation_id being acted on

  // Filter state
  const [status, setStatus] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 50, offset: 0 });
    if (status)   params.set('status', status);
    if (deviceId) params.set('device_id', deviceId);
    if (fromDate) params.set('from_date', fromDate);
    if (toDate)   params.set('to_date', toDate);

    client.get(`/violations?${params.toString()}`)
      .then((r) => {
        setData(r.data.violations || []);
        setTotal(r.data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [status, deviceId, fromDate, toDate]);

  useEffect(() => { fetchData(); }, []);

  async function updateStatus(violationId, newStatus) {
    setActionLoading(violationId);
    try {
      await client.put(`/violations/${violationId}/status`, { status: newStatus });
      fetchData();
    } catch (e) {
      console.error('Status update failed', e);
    } finally {
      setActionLoading(null);
    }
  }

  const columns = [
    { key: 'violation_id', label: 'Violation ID', mono: true, dim: true,
      render: (v) => <span style={{ fontSize: '10px' }}>{v}</span> },
    { key: 'device_id',    label: 'Device',       mono: true },
    { key: 'speed_kmh',    label: 'Speed',        mono: true,
      render: (v) => <span style={{ color: '#ff4444', fontWeight: 600 }}>{v} km/h</span> },
    { key: 'speed_limit_kmh', label: 'Limit',     mono: true,
      render: (v) => `${v} km/h` },
    { key: 'excess_kmh',   label: 'Excess',       mono: true,
      render: (v) => <span style={{ color: '#ffab00' }}>+{v} km/h</span> },
    { key: 'fine_amount_egp', label: 'Fine',      mono: true,
      render: (v) => `${v} EGP` },
    { key: 'fine_status',  label: 'Status',
      render: (v) => <StatusBadge status={v} /> },
    { key: 'duration_sec', label: 'Duration',     mono: true, dim: true,
      render: (v) => v != null ? `${v}s` : '—' },
    { key: 'received_at',  label: 'Received At',  mono: true, dim: true,
      render: fmt },
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
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
          / VIOLATIONS
        </h1>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: '#ffab00',
            background: 'rgba(255,171,0,0.08)',
            border: '1px solid rgba(255,171,0,0.2)',
            borderRadius: '4px',
            padding: '2px 8px',
          }}
        >
          {total} records
        </span>
      </div>

      {/* Filter bar */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '16px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            STATUS
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ ...inputStyle({ cursor: 'pointer', minWidth: '130px' }) }}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            DEVICE ID
          </label>
          <input
            type="text"
            placeholder="NAZER_XXXXXXXX"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            style={{ ...inputStyle({ minWidth: '180px' }) }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            FROM DATE
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{ ...inputStyle({ colorScheme: 'dark' }) }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            TO DATE
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{ ...inputStyle({ colorScheme: 'dark' }) }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'auto' }}>
          <div style={{ height: '14px' }} />
          <button
            onClick={fetchData}
            style={{
              background: 'var(--cyan)',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              padding: '7px 20px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            SEARCH
          </button>
        </div>

        {(status || deviceId || fromDate || toDate) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'auto' }}>
            <div style={{ height: '14px' }} />
            <button
              onClick={() => {
                setStatus(''); setDeviceId(''); setFromDate(''); setToDate('');
                setTimeout(fetchData, 0);
              }}
              style={{
                background: 'transparent',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-bright)',
                borderRadius: '6px',
                padding: '7px 14px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              CLEAR
            </button>
          </div>
        )}
      </div>

      {/* Table with action column */}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        actions={(row) => {
          if (row.fine_status !== 'pending') return <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>—</span>;
          const busy = actionLoading === row.violation_id;
          return (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                disabled={busy}
                onClick={() => updateStatus(row.violation_id, 'paid')}
                style={{
                  background: 'rgba(0,230,118,0.1)',
                  border: '1px solid rgba(0,230,118,0.3)',
                  color: '#00e676',
                  borderRadius: '5px',
                  padding: '4px 10px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: busy ? 'wait' : 'pointer',
                  opacity: busy ? 0.5 : 1,
                  letterSpacing: '0.05em',
                }}
              >
                PAID
              </button>
              <button
                disabled={busy}
                onClick={() => updateStatus(row.violation_id, 'cancelled')}
                style={{
                  background: 'rgba(120,140,160,0.1)',
                  border: '1px solid rgba(120,140,160,0.3)',
                  color: 'var(--text-secondary)',
                  borderRadius: '5px',
                  padding: '4px 10px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: busy ? 'wait' : 'pointer',
                  opacity: busy ? 0.5 : 1,
                  letterSpacing: '0.05em',
                }}
              >
                CANCEL
              </button>
            </div>
          );
        }}
      />
    </div>
  );
}
