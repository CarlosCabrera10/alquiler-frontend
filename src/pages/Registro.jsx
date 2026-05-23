import { ArrowLeft, ArrowRight, Calendar, Car, CreditCard, Lock, Mail, MapPin, Phone, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Field({ field, label, icon: Icon, type = 'text', required, placeholder, value, onChange, error }) {
  return (
    <div>
      <label className="label">{label}{required && <span className="text-accent-500 ml-0.5">*</span>}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />}
        <input
          type={type}
          className={`input ${Icon ? '!pl-10' : ''} ${error ? '!border-accent-400 !ring-accent-400/10' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-accent-600">{error[0]}</p>}
    </div>
  );
}

export default function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '',
    dui: '', licencia_conducir: '', telefono: '', fecha_nacimiento: '', direccion: '',
  });
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores({});
    setLoading(true);
    try {
      const res = await api.post('/register', form);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const redirect = sessionStorage.getItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin');
      window.location.href = redirect || '/';
    } catch (err) {
      if (err.response?.status === 422) setErrores(err.response.data.errors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 bg-mesh-light py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>

        <div className="card p-8 sm:p-10 animate-scale-in">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow">
              <Car className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold text-ink-900">Crea tu cuenta</h1>
              <p className="text-sm text-ink-500">Registrarte como cliente toma menos de un minuto.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección: Acceso */}
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-4 pb-2 border-b border-brand-100 w-full">
                Datos de acceso
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field field="name"  label="Nombre completo" icon={User}  required placeholder="Juan Pérez"    value={form.name}  onChange={set('name')}  error={errores.name} />
                <Field field="email" label="Correo"          icon={Mail}  required type="email" placeholder="tu@correo.com" value={form.email} onChange={set('email')} error={errores.email} />
                <Field field="password"              label="Contraseña"           icon={Lock} required type="password" placeholder="••••••••" value={form.password}              onChange={set('password')}              error={errores.password} />
                <Field field="password_confirmation" label="Confirmar contraseña" icon={Lock} required type="password" placeholder="••••••••" value={form.password_confirmation} onChange={set('password_confirmation')} error={errores.password_confirmation} />
              </div>
            </fieldset>

            {/* Sección: Cliente */}
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-4 pb-2 border-b border-brand-100 w-full">
                Datos del cliente
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field field="dui"               label="DUI"                 icon={CreditCard} required placeholder="12345678-9"  value={form.dui}               onChange={set('dui')}               error={errores.dui} />
                <Field field="licencia_conducir" label="N° licencia"         icon={CreditCard} required placeholder="L-123456"    value={form.licencia_conducir} onChange={set('licencia_conducir')} error={errores.licencia_conducir} />
                <Field field="telefono"          label="Teléfono"            icon={Phone}               placeholder="7XXX-XXXX"   value={form.telefono}          onChange={set('telefono')}          error={errores.telefono} />
                <Field field="fecha_nacimiento"  label="Fecha de nacimiento" icon={Calendar}   type="date"                        value={form.fecha_nacimiento}  onChange={set('fecha_nacimiento')}  error={errores.fecha_nacimiento} />
                <div className="sm:col-span-2">
                  <Field field="direccion" label="Dirección" icon={MapPin} placeholder="Colonia, ciudad..." value={form.direccion} onChange={set('direccion')} error={errores.direccion} />
                </div>
              </div>
            </fieldset>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3 !text-base group">
              {loading ? 'Creando cuenta...' : (
                <>
                  Crear cuenta y continuar
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-ink-100 text-center">
            <p className="text-sm text-ink-500">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
