import { ArrowLeft, ArrowRight, Car, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]         = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const redirect = sessionStorage.getItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin');

      if (redirect) {
        navigate(redirect);
      } else if (user.rol === 'admin' || user.rol === 'empleado') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo (visual) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-ink-950 via-brand-950 to-ink-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-500/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-500/30 via-transparent to-transparent" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent-500/20 blur-3xl" />

        <div className="relative flex flex-col justify-between p-12 text-white w-full">
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl">AutoAlquiler</span>
          </Link>

          <div className="max-w-md animate-slide-up">
            <h2 className="font-display text-4xl font-extrabold leading-tight mb-4">
              Tu próximo viaje{' '}
              <span className="bg-gradient-to-r from-accent-300 to-brand-300 bg-clip-text text-transparent">
                comienza aquí
              </span>
            </h2>
            <p className="text-white/70 text-lg">
              Accede a tu cuenta para gestionar tus alquileres y reservar el vehículo perfecto.
            </p>
          </div>

          <div className="text-sm text-white/50">
            © {new Date().getFullYear()} AutoAlquiler. Proyecto universitario.
          </div>
        </div>
      </div>

      {/* Panel derecho (form) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-ink-50">
        <div className="w-full max-w-md animate-scale-in">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al catálogo
          </Link>

          <h1 className="font-display text-3xl font-extrabold text-ink-900 mb-2">Bienvenido de vuelta</h1>
          <p className="text-ink-500 mb-8">Ingresa tus credenciales para continuar.</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-accent-50 border border-accent-100 text-accent-700 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="email"
                  className="input !pl-10"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="label">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="input !pl-10 !pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full !py-3 !text-base group">
              {loading ? 'Verificando...' : (
                <>
                  Ingresar
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-ink-200 text-center">
            <p className="text-sm text-ink-500">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-brand-600 font-semibold hover:text-brand-700">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
