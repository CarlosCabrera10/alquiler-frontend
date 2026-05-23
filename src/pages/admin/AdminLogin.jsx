import { ArrowRight, Car, Eye, EyeOff, Lock, Mail, Shield, User, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [modo, setModo]     = useState('login'); // 'login' | 'registro'
  const [error, setError]   = useState('');
  const [exito, setExito]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm]     = useState({
    name: '', email: '', password: '', password_confirmation: '', rol: 'empleado',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    setLoading(true);
    try {
      const user = await login(loginForm.email, loginForm.password);
      if (user.rol === 'cliente') {
        setError('Esta cuenta es de cliente. Usa el acceso de clientes.');
        return;
      }
      navigate('/admin');
    } catch {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');
    if (regForm.password !== regForm.password_confirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/register-admin', regForm);
      setLoginForm({ email: regForm.email, password: '' });
      setModo('login');
      setExito('Usuario creado exitosamente. Inicia sesión para continuar.');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0]?.[0];
        setError(first || 'Error de validación.');
      } else {
        setError(err.response?.data?.message || 'Error al crear el usuario.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-ink-950 via-ink-900 to-brand-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-600/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent-500/20 via-transparent to-transparent" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between p-12 text-white w-full">
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl">AutoAlquiler</span>
          </Link>

          <div className="max-w-md animate-slide-up">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-brand-300" />
            </div>
            <h2 className="font-display text-4xl font-extrabold leading-tight mb-4">
              Panel de{' '}
              <span className="bg-gradient-to-r from-brand-300 to-accent-300 bg-clip-text text-transparent">
                Administración
              </span>
            </h2>
            <p className="text-white/70 text-lg">
              Acceso exclusivo para administradores y empleados del sistema de alquiler.
            </p>

            <div className="mt-8 space-y-3">
              {[
                'Gestión de vehículos y flota',
                'Control de alquileres y pagos',
                'Registro de mantenimientos',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-white/60 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-white/40">
            © {new Date().getFullYear()} AutoAlquiler · Sistema interno
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-ink-50">
        <div className="w-full max-w-md animate-scale-in">

          {/* Toggle login/registro */}
          <div className="flex bg-ink-100 rounded-2xl p-1 mb-8">
            <button
              onClick={() => { setModo('login'); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                modo === 'login'
                  ? 'bg-white text-ink-900 shadow-sm'
                  : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => { setModo('registro'); setError(''); setExito(''); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                modo === 'registro'
                  ? 'bg-white text-ink-900 shadow-sm'
                  : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              Crear usuario
            </button>
          </div>

          {modo === 'login' ? (
            <>
              <h1 className="font-display text-3xl font-extrabold text-ink-900 mb-2">Bienvenido</h1>
              <p className="text-ink-500 mb-8">Ingresa tus credenciales de sistema.</p>

              {exito && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm animate-fade-in">
                  {exito}
                </div>
              )}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-accent-50 border border-accent-100 text-accent-700 text-sm animate-fade-in">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="label">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                    <input type="email" className="input !pl-10"
                      placeholder="admin@autoalquiler.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required autoFocus />
                  </div>
                </div>
                <div>
                  <label className="label">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                    <input type={showPwd ? 'text' : 'password'} className="input !pl-10 !pr-10"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full !py-3 !text-base group">
                  {loading ? 'Verificando...' : (
                    <>Ingresar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl font-extrabold text-ink-900 mb-2">Crear usuario</h1>
              <p className="text-ink-500 mb-8">Registra un nuevo administrador o empleado.</p>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-accent-50 border border-accent-100 text-accent-700 text-sm animate-fade-in">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegistro} className="space-y-4">
                <div>
                  <label className="label">Nombre completo</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                    <input className="input !pl-10" placeholder="Juan Pérez"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      required />
                  </div>
                </div>
                <div>
                  <label className="label">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                    <input type="email" className="input !pl-10" placeholder="usuario@autoalquiler.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      required />
                  </div>
                </div>
                <div>
                  <label className="label">Rol</label>
                  <select className="input" value={regForm.rol}
                    onChange={(e) => setRegForm({ ...regForm, rol: e.target.value })}>
                    <option value="empleado">Empleado</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="label">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                    <input type={showPwd ? 'text' : 'password'} className="input !pl-10 !pr-10"
                      placeholder="Mín. 6 caracteres"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      required minLength={6} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label">Confirmar contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                    <input type={showPwd ? 'text' : 'password'} className="input !pl-10"
                      placeholder="Repite la contraseña"
                      value={regForm.password_confirmation}
                      onChange={(e) => setRegForm({ ...regForm, password_confirmation: e.target.value })}
                      required />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full !py-3 !text-base group">
                  {loading ? 'Creando...' : (
                    <><UserPlus className="w-4 h-4" /> Crear usuario</>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-ink-200 text-center">
            <Link to="/" className="text-sm text-ink-500 hover:text-ink-700 transition-colors">
              ← Volver al catálogo de vehículos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
