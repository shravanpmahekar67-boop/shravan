import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Activity, Map as MapIcon, Users, Home, LayoutDashboard, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import CommandCenter from './components/CommandCenter';
import LiveMap from './components/LiveMap';
import CitizenPortal from './components/CitizenPortal';
import CitizenDashboard from './components/CitizenDashboard';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import { useNetworkStore } from './store/useNetworkStore';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isOnline, isSyncing, pendingCount, toggleOnlineMode, triggerSync } = useNetworkStore();
  const location = useLocation();

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <Link to="/" className="p-4 border-b border-slate-800 flex items-center gap-3 hover:bg-slate-850 transition-colors">
          <ShieldAlert className="w-8 h-8 text-red-500" />
          <div>
            <h1 className="text-xl font-bold tracking-wider">ResQAI</h1>
            <p className="text-[10px] text-slate-400 font-mono">CRISIS SYSTEM</p>
          </div>
        </Link>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              location.pathname === '/' ? 'bg-slate-800 text-slate-100 shadow-md' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5 text-slate-400" />
            <span>Home Landing</span>
          </Link>

          <Link
            to="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              location.pathname === '/admin' ? 'bg-slate-800 text-blue-400 shadow-md' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 text-blue-400" />
            <span>Admin Dashboard</span>
          </Link>

          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              location.pathname === '/dashboard' || location.pathname === '/command-center' ? 'bg-slate-800 text-red-400 shadow-md' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Activity className="w-5 h-5 text-red-500" />
            <span>Command Center</span>
          </Link>

          <Link
            to="/map"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              location.pathname === '/map' ? 'bg-slate-800 text-emerald-400 shadow-md' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <MapIcon className="w-5 h-5 text-emerald-400" />
            <span>Live Weather Map</span>
          </Link>

          <Link
            to="/report"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              location.pathname === '/report' ? 'bg-slate-800 text-amber-400 shadow-md' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Users className="w-5 h-5 text-amber-400" />
            <span>Citizen Portal</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative">
        <header className="h-16 border-b border-slate-800 flex items-center px-6 justify-between bg-slate-900/50 backdrop-blur-md">
          <h2 className="text-lg font-medium text-slate-200">
            {location.pathname === '/admin' ? 'Admin Control Dashboard' : location.pathname === '/map' ? 'Subcontinent Live Weather Map' : 'Command Centre Console'}
          </h2>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full text-xs font-bold animate-pulse">
                {pendingCount} Pending Sync
              </span>
            )}

            {isOnline && (
              <button
                onClick={() => triggerSync()}
                disabled={isSyncing}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Sync offline incidents with server"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            )}

            <button
              onClick={() => toggleOnlineMode()}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-sm cursor-pointer ${
                isOnline
                  ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              }`}
              title="Click to toggle between Online API mode and Offline IndexedDB mode"
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-green-400" />
                  <span>🟢 Online Mode</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>🟠 Offline Mode</span>
                </>
              )}
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
        <Route path="/dashboard" element={<DashboardLayout><CommandCenter /></DashboardLayout>} />
        <Route path="/command-center" element={<DashboardLayout><CommandCenter /></DashboardLayout>} />
        <Route path="/map" element={<DashboardLayout><LiveMap /></DashboardLayout>} />
        <Route path="/report" element={<CitizenPortal />} />
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;

