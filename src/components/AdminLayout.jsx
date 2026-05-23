import {
  CalendarDays,
  Car,
  CreditCard,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Menu,
  ShieldCheck,
  UserCog,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/admin',                label: 'Panel',          icon: LayoutDashboard },
  { to: '/admin/vehiculos',      label: 'Vehículos',      icon: Car },
  { to: '/admin/clientes',       label: 'Clientes',       icon: Users },
  { to: '/admin/alquileres',     label: 'Alquileres',     icon: CalendarDays },
  { to: '/admin/pagos',          label: 'Pagos',          icon: CreditCard },
  { to: '/admin/mantenimientos', label: 'Mantenimientos', icon: Wrench },
  { to: '/admin/categorias',     label: 'Categorías',     icon: LayoutGrid },
  { to: '/admin/usuarios',       label: 'Usuarios',       icon: UserCog },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const location         = useLocation();
  const [open, setOpen]  = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (to) => location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 fixed inset-y-0 bg-white border-r border-ink-100">
        <SidebarContent nav={nav} user={user} onLogout={handleLogout} isActive={isActive} />
      </aside>

      {/* Sidebar Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-ink-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}>
          <aside className="absolute inset-y-0 left-0 w-72 bg-white animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <SidebarContent nav={nav} user={user} onLogout={handleLogout} isActive={isActive} onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:pl-72">
        {/* Topbar mobile */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-ink-100 px-4 py-3">
          <button onClick={() => setOpen(true)} className="btn-ghost !p-2">
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/admin" className="font-display font-bold text-ink-900">AutoAlquiler</Link>
          <div className="w-9" />
        </header>

        <main className="min-h-screen animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ nav, user, onLogout, isActive, onClose }) {
  return (
    <>
      {/* Brand */}
      <div className="flex items-center justify-between p-6 border-b border-ink-100">
        <Link to="/admin" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-ink-900 leading-tight">AutoAlquiler</div>
            <div className="text-[10px] text-ink-400 uppercase tracking-widest leading-tight">Panel admin</div>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="btn-ghost !p-2 lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {nav.map((item) => {
          const Icon   = item.icon;
          const active = isActive(item.to);
          return (
            <Link key={item.to} to={item.to} onClick={onClose}
              className={[
                'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-glow'
                  : 'text-ink-600 hover:text-ink-900 hover:bg-ink-100/70',
              ].join(' ')}
            >
              <Icon className={['w-5 h-5 transition-transform group-hover:scale-110', active ? 'text-white' : 'text-ink-400 group-hover:text-brand-600'].join(' ')} />
              <span>{item.label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="border-t border-ink-100 p-4">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-ink-50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-ink-900 truncate">{user?.name}</div>
            <div className="flex items-center gap-1 text-xs text-ink-500">
              <ShieldCheck className="w-3 h-3" />
              <span className="capitalize">{user?.rol}</span>
            </div>
          </div>
          <button onClick={onLogout}
            title="Cerrar sesión"
            className="p-2 rounded-lg text-ink-400 hover:text-accent-600 hover:bg-white transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
