import { CheckCircle2, Mail, Plus, Shield, ShieldCheck, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errores, setErrores]   = useState({});
  const [exito, setExito]       = useState('');

  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '', rol: 'empleado',
  });

  const cargar = () => api.get('/clientes').then((r) => {
    setUsuarios(r.data.map((c) => c.usuario).filter(Boolean));
  });

  useEffect(() => { cargar(); }, []);

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores({});
    setExito('');
    setLoading(true);
    try {
      await api.post('/register-admin', form);
      setExito(`${form.name} fue creado como ${form.rol}.`);
      setForm({ name: '', email: '', password: '', password_confirmation: '', rol: 'empleado' });
      setShowForm(false);
      cargar();
      setTimeout(() => setExito(''), 4000);
    } catch (err) {
      if (err.response?.status === 422) setErrores(err.response.data.errors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">Gestión de usuarios</h1>
          <p className="text-ink-500 mt-1">Crea cuentas de administradores y empleados del sistema.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setErrores({}); setExito(''); }}
          className={showForm ? 'btn-secondary' : 'btn-primary'}>
          {showForm ? <><X className="w-4 h-4" /> Cancelar</> : <><Plus className="w-4 h-4" /> Nuevo usuario</>}
        </button>
      </div>

      {/* Mensaje de éxito */}
      {exito && (
        <div className="card p-4 bg-emerald-50/50 border-emerald-200 flex items-center gap-3 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-sm text-emerald-700 font-medium">{exito}</span>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="card p-6 lg:p-8 animate-scale-in">
          <h2 className="font-display text-xl font-bold text-ink-900 mb-6">Crear cuenta de sistema</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Nombre completo</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input className={`input !pl-10 ${errores.name ? '!border-accent-400' : ''}`}
                    value={form.name} onChange={set('name')} required />
                </div>
                {errores.name && <p className="mt-1.5 text-xs text-accent-600">{errores.name[0]}</p>}
              </div>
              <div>
                <label className="label">Correo electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input type="email" className={`input !pl-10 ${errores.email ? '!border-accent-400' : ''}`}
                    value={form.email} onChange={set('email')} required />
                </div>
                {errores.email && <p className="mt-1.5 text-xs text-accent-600">{errores.email[0]}</p>}
              </div>
              <div>
                <label className="label">Contraseña</label>
                <input type="password" className="input" value={form.password} onChange={set('password')} required />
                {errores.password && <p className="mt-1.5 text-xs text-accent-600">{errores.password[0]}</p>}
              </div>
              <div>
                <label className="label">Confirmar contraseña</label>
                <input type="password" className="input"
                  value={form.password_confirmation} onChange={set('password_confirmation')} required />
              </div>
            </div>

            {/* Selector de rol */}
            <div>
              <label className="label">Rol en el sistema</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {[
                  { value: 'empleado', label: 'Empleado',      desc: 'Operaciones diarias', icon: Shield },
                  { value: 'admin',    label: 'Administrador', desc: 'Acceso completo',     icon: ShieldCheck },
                ].map((r) => {
                  const Icon = r.icon;
                  const active = form.rol === r.value;
                  return (
                    <label key={r.value}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all
                        ${active ? 'border-brand-500 bg-brand-50/50 shadow-glow' : 'border-ink-200 bg-white hover:border-ink-300'}`}>
                      <input type="radio" name="rol" value={r.value} checked={active}
                        onChange={set('rol')} className="sr-only" />
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className={`font-semibold ${active ? 'text-brand-700' : 'text-ink-900'}`}>{r.label}</div>
                          <div className="text-xs text-ink-500 mt-0.5">{r.desc}</div>
                        </div>
                        {active && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto !px-8">
              {loading ? 'Creando...' : 'Crear usuario'}
            </button>
          </form>
        </div>
      )}

      {/* Lista de clientes */}
      <div className="card overflow-hidden animate-slide-up [animation-delay:100ms]">
        <div className="p-6 border-b border-ink-100">
          <h2 className="font-display text-lg font-bold text-ink-900">Clientes registrados</h2>
          <p className="text-xs text-ink-500 mt-0.5">Usuarios con rol cliente</p>
        </div>
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-ink-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-ink-600">{u.email}</td>
                  <td><span className="badge-success capitalize">{u.rol}</span></td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr><td colSpan={3} className="text-center text-ink-400 py-10">No hay clientes registrados aún.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
