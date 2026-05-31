import { useState } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';

function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
}

const columns = [
  { key: 'received_at',   label: 'Received At',   mono: true, dim: true, render: fmt },
  { key: 'speed_kmh',     label: 'Speed (km/h)',  mono: true,
    render: (v) => <span style={{ color: '#00d4ff', fontWeight: 600 }}>{v}</span> },
  { key: 'speed_gps_kmh', label: 'GPS Speed',     mono: true, dim: true },
  { key: 'speed_imu_kmh', label: 'IMU Speed',     mono: true, dim: true },
  { key: 'satellites',    label: 'Satellites',    mono: true,
    render: (v) => <span style={{ color: v >= 6 ? '#00e676' : '#ffab00' }}>{v}</span> },
  { key: 'hdop',          label: 'HDOP',          mono: true, dim: true },
  { key: 'battery_pct',   label: 'Battery %',     mono: true,
    render: (v) => (
      <span style={{ color: v > 20 ? '#00e676' : '#ff4444', fontWeight: 600 }}>
        {v}%
      </span>
    ),
  },
  { key: 'gsm_signal',    label: 'GSM Signal',    mono: true, dim: true },
  { key: 'is_stationary', label: 'Stationary',
    render: (v) =>
      v ? (
        <span style={{ color: '#ffab00', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>■ YES</span>
      ) : (
        <span style={{ color: 'var(--cyan)', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>▶ MOVING</span>
      ),
  },
];

export default function Telemetry() {
  const [deviceId, setDeviceId] = useState('NAZER_0B49EFD0');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  function load() {
    if (!deviceId.trim()) return;
    setLoading(true);
    setError(null);
    client.get(`/telemetry?device_id=${deviceId.trim()}&limit=100`)
      .then((r) => {
        setData(r.data.records || []);
        setLoaded(true);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            margin: '0 0 4px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '0.05em',
          }}
        >
          / TELEMETRY
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '12px' }}>
          Raw device telemetry — last 100 records for a device
        </p>
      </div>

      {/* Device selector */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
            }}
          >
            DEVICE ID
          </label>
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="NAZER_0B49EFD0"
            style={{
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-bright)',
              borderRadius: '6px',
              padding: '7px 12px',
              color: 'var(--cyan)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
              outline: 'none',
              minWidth: '220px',
            }}
          />
        </div>

        <button
          onClick={load}
          disabled={loading}
          style={{
            background: 'var(--cyan)',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 24px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {loading ? 'LOADING...' : 'LOAD'}
        </button>

        {loaded && !loading && (
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginLeft: '4px',
            }}
          >
            {data.length} records
          </span>
        )}
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(255,68,68,0.08)',
            border: '1px solid rgba(255,68,68,0.3)',
            borderRadius: '8px',
            padding: '14px 18px',
            color: '#ff4444',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            marginBottom: '16px',
          }}
        >
          ⚠ {error}
        </div>
      )}

      {loaded || loading ? (
        <DataTable columns={columns} data={data} loading={loading} />
      ) : (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px dashed var(--border)',
            borderRadius: '10px',
            padding: '60px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            letterSpacing: '0.1em',
          }}
        >
          <div style={{ fontSize: '28px', marginBottom: '12px', opacity: 0.3 }}>〜</div>
          ENTER A DEVICE ID AND CLICK LOAD
        </div>
      )}
    </div>
  );
}
