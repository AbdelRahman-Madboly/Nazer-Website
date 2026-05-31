import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import Drivers from './pages/Drivers';
import Violations from './pages/Violations';
import Telemetry from './pages/Telemetry';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
        <Navbar />
        <main style={{ padding: '28px 32px', maxWidth: '1400px', margin: '0 auto' }}>
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/devices"    element={<Devices />} />
            <Route path="/drivers"    element={<Drivers />} />
            <Route path="/violations" element={<Violations />} />
            <Route path="/telemetry"  element={<Telemetry />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
