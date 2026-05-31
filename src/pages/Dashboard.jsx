import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import client from '../api/client';
import StatCard from '../components/StatCard';

function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '28px' }}>
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
        {title}
      </h1>
      {subtitle && (
        <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '12px' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function groupByDate(violations) {
  const counts = {};
  violations.forEach((v) => {
    const d = v.received_at ? v.received_at.slice(0, 10) : null;
    if (!d) return;
    counts[d] = (counts[d] || 0) + 1;
  });
  // Last 7 days
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key.slice(5), count: counts[key] || 0 });
  }
  return result;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-bright)',
          borderRadius: '6px',
          padding: '8px 14px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          color: 'var(--text-primary)',
        }}
      >
        <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
        <div style={{ color: '#ff4444' }}>{payload[0].value} violations</div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      client.get('/dashboard'),
      client.get('/violations?limit=200'),
    ])
      .then(([statsRes, viRes]) => {
        setStats(statsRes.data);
        setChartData(groupByDate(viRes.data.violations || []));
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div
        style={{
          background: 'rgba(255,68,68,0.08)',
          border: '1px solid rgba(255,68,68,0.3)',
          borderRadius: '10px',
          padding: '20px 24px',
          color: '#ff4444',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
        }}
      >
        ⚠ BACKEND UNREACHABLE — {error}
        <div style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '11px' }}>
          Make sure backend is running: uvicorn main:app --host 0.0.0.0 --port 8080 --reload
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <PageHeader
        title="/ DASHBOARD"
        subtitle={`Last updated ${new Date().toLocaleTimeString()}`}
      />

      {/* Stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <StatCard title="Total Devices"    value={stats?.total_devices}         color="blue"   />
        <StatCard title="Active Today"     value={stats?.active_devices_today}  color="green"  />
        <StatCard title="Total Drivers"    value={stats?.total_drivers}         color="purple" />
        <StatCard title="Violations Today" value={stats?.violations_today}      color="amber"  />
        <StatCard
          title="Pending Fines"
          value={stats ? `${stats.total_fines_egp?.toFixed(0)} LE` : null}
          color="red"
        />
      </div>

      {/* Chart */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '24px',
        }}
      >
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          Violations — Last 7 Days
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={28}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,68,68,0.06)' }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={_ .count > 0 ? '#ff4444' : 'var(--border-bright)'}
                  opacity={_.count > 0 ? 0.85 : 0.3}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
