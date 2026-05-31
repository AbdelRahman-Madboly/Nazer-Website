# NAZER — Admin Website

React + Vite + Tailwind admin panel for the NAZER vehicle speed monitoring system.

## Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Dev server & bundler |
| Tailwind CSS 3 | Utility styling |
| Axios | HTTP client |
| React Router 6 | Client-side routing |
| Recharts | Charts (violations bar chart) |

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | KPI cards + 7-day violations bar chart |
| `/devices` | Devices | Registered ESP32 devices table |
| `/drivers` | Drivers | Registered drivers + fines summary |
| `/violations` | Violations | Filterable violations table + mark as paid/cancelled |
| `/telemetry` | Telemetry | Raw telemetry records per device |

## Requirements

- Node.js 18+
- NAZER Backend running at `http://localhost:8080` (Phase 8)

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Build for production
npm run build
```

## Backend Connection

All API calls go to `http://localhost:8080/v1/admin/*`.  
Configure in `src/api/client.js` if the backend runs on a different host/port.

The backend must have CORS configured to allow `http://localhost:5173`  
(already done in Phase 8 — see `config.py → CORS_ORIGINS`).

## Project Structure

```
src/
├── api/
│   └── client.js          # Axios instance → localhost:8080/v1/admin
├── components/
│   ├── Navbar.jsx          # Sticky top nav with route tabs
│   ├── StatCard.jsx        # KPI card with colored accent
│   ├── DataTable.jsx       # Reusable dark-themed table
│   └── StatusBadge.jsx     # Fine status pill (pending/paid/cancelled/disputed)
├── pages/
│   ├── Dashboard.jsx       # Stats + bar chart
│   ├── Devices.jsx         # Device registry table
│   ├── Drivers.jsx         # Driver registry table
│   ├── Violations.jsx      # Violations with filter bar + action buttons
│   └── Telemetry.jsx       # Raw telemetry loader
├── App.jsx                 # BrowserRouter + Routes
├── main.jsx                # React entry point
└── index.css               # Global styles + CSS variables
```

## Part of

```
NAZER System
├── Firmware  C:\Dan_WS\Nazer-Firmware   (C++ / PlatformIO)   ✅ Phase 1–5
├── App       C:\Dan_WS\Nazer-app        (Dart / Flutter)      ✅ Phase 6H
├── Backend   C:\Dan_WS\Nazer-Backend    (Python / FastAPI)    ✅ Phase 8
└── Website   C:\Dan_WS\Nazer-Website    (React / Vite)        ✅ Phase 9
```
