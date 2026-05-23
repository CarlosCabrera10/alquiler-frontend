import { Bell, Car, LogIn, LogOut, Menu, UserPlus, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotificaciones } from '../hooks/useNotificaciones';

export default function Navbar() {
  const { user, logout }    = useAuth();
  const navigate            = useNavigate();
  const [open, setOpen]     = useState(false);
  const { sinVer }          = useNotificaciones();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-ink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Car className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg text-ink-900">AutoAlquiler</span>
          </Link>

          {/* Desktop */}
          <nav className="hidden md:flex items-center gap-2">
            <Link to="/" className="px-4 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 rounded-xl hover:bg-ink-100 transition-colors">
              Catálogo
            </Link>

            {!user && (
              <>
                <Link to="/admin/login" className="px-4 py-2 text-xs font-medium text-ink-400 hover:text-ink-600 rounded-xl hover:bg-ink-100 transition-colors">
                  Acceso sistema
                </Link>
                <Link to="/login" className="btn-ghost">
                  <LogIn className="w-4 h-4" />
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="btn-primary">
                  <UserPlus className="w-4 h-4" />
                  Crear cuenta
                </Link>
              </>
            )}

            {user?.rol === 'cliente' && (
              <>
                <Link to="/mis-alquileres" className="px-4 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 rounded-xl hover:bg-ink-100 transition-colors">
                  Mis alquileres
                </Link>
                <Link to="/notificaciones" className="relative p-2 rounded-xl text-ink-500 hover:text-ink-900 hover:bg-ink-100 transition-colors">
                  <Bell className="w-5 h-5" />
                  {sinVer > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {sinVer}
                    </span>
                  )}
                </Link>
                <UserMenu user={user} onLogout={handleLogout} />
              </>
            )}

            {(user?.rol === 'admin' || user?.rol === 'empleado') && (
              <>
                <Link to="/admin" className="btn-primary">
                  Panel admin
                </Link>
                <UserMenu user={user} onLogout={handleLogout} />
              </>
            )}
          </nav>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden btn-ghost !p-2">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-ink-100 bg-white animate-slide-up">
          <div className="px-4 py-4 space-y-1">
            <Link to="/" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-ink-700 hover:bg-ink-100">Catálogo</Link>
            {!user && (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-ink-700 hover:bg-ink-100">Iniciar sesión</Link>
                <Link to="/registro" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600">Crear cuenta</Link>
                <Link to="/admin/login" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-xl text-xs font-medium text-ink-400 hover:bg-ink-100">Acceso sistema</Link>
              </>
            )}
            {user?.rol === 'cliente' && (
              <>
                <Link to="/mis-alquileres" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-ink-700 hover:bg-ink-100">Mis alquileres</Link>
                <Link to="/notificaciones" onClick={() => setOpen(false)} className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-ink-700 hover:bg-ink-100">
                  <span className="flex items-center gap-2"><Bell className="w-4 h-4" /> Notificaciones</span>
                  {sinVer > 0 && <span className="w-5 h-5 rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center">{sinVer}</span>}
                </Link>
              </>
            )}
            {(user?.rol === 'admin' || user?.rol === 'empleado') && (
              <Link to="/admin" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-ink-700 hover:bg-ink-100">Panel admin</Link>
            )}
            {user && (
              <button onClick={() => { setOpen(false); handleLogout(); }} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-accent-600 hover:bg-accent-50">
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function UserMenu({ user, onLogout }) {
  return (
    <div className="flex items-center gap-2 ml-2 pl-4 border-l border-ink-200">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div className="hidden lg:block">
        <div className="text-sm font-semibold text-ink-900 leading-tight">{user.name}</div>
        <div className="text-xs text-ink-500 capitalize leading-tight">{user.rol}</div>
      </div>
      <button onClick={onLogout} title="Cerrar sesión"
        className="p-2 rounded-lg text-ink-400 hover:text-accent-600 hover:bg-accent-50 transition-colors">
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
