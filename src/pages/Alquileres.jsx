import { Calendar, Car, CheckCircle2, Plus, Trash2, User, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';

const estadoStyles = {
  pendiente:  'badge-warning',
  activo:     'badge-success',
  finalizado: 'badge-info',
  cancelado:  'badge-danger',
};

export default function Alquileres() {
  const location                    = useLocation();
  const [alquileres, setAlquileres] = useState([]);
  const [clientes, setClientes]     = useState([]);
  const [vehiculos, setVehiculos]   = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [apiError, setApiError]     = useState('');
  const [form, setForm]             = useState({
    cliente_id: '', vehiculo_id: '', fecha_inicio: '', fecha_fin: '', observaciones: '',
  });

  const cargar = () => Promise.all([
    api.get('/alquileres'),
    api.get('/clientes'),
    api.get('/vehiculos?estado=disponible'),
  ]).then(([a, c, v]) => {
    setAlquileres(a.data);
    setClientes(c.data);
    setVehiculos(v.data);
  });

  useEffect(() => { cargar(); }, []);

  // Cliente preseleccionado desde la página de clientes
  useEffect(() => {
    if (location.state?.clientePreseleccionado) {
      setForm((f) => ({ ...f, cliente_id: String(location.state.clientePreseleccionado.id) }));
      setShowForm(true);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/alquileres', form);
    setForm({ cliente_id: '', vehiculo_id: '', fecha_inicio: '', fecha_fin: '', observaciones: '' });
    setShowForm(false);
    cargar();
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    setApiError('');
    try {
      await api.put(`/alquileres/${id}`, { estado: nuevoEstado });
      setAlquileres(prev => prev.map(a => a.id === id ? { ...a, estado: nuevoEstado } : a));
    } catch (err) {
      const errors = err.response?.data?.errors;
      const msg = err.response?.data?.message
        || (errors ? Object.values(errors)[0]?.[0] : null)
        || `Error ${err.response?.status ?? 'de red'}`;
      setApiError(msg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este alquiler?')) {
      await api.delete(`/alquileres/${id}`);
      cargar();
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">Alquileres</h1>
          <p className="text-ink-500 mt-1">
            {alquileres.length} total · {alquileres.filter(a => a.estado === 'pendiente').length} pendientes · {alquileres.filter(a => a.estado === 'activo').length} activos
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={showForm ? 'btn-secondary' : 'btn-primary'}>
          {showForm ? <><X className="w-4 h-4" /> Cancelar</> : <><Plus className="w-4 h-4" /> Nuevo alquiler</>}
        </button>
      </div>

      {/* Error banner */}
      {apiError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm animate-fade-in flex items-start justify-between gap-3">
          <span>{apiError}</span>
          <button onClick={() => setApiError('')} className="shrink-0 text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="card p-6 lg:p-8 animate-scale-in">
          <h2 className="font-display text-xl font-bold text-ink-900 mb-6">Registrar nuevo alquiler</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Cliente</label>
                <select className="input" value={form.cliente_id} onChange={(e) => setForm({ ...form, cliente_id: e.target.value })} required>
                  <option value="">Seleccionar cliente...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.usuario?.name} — {c.dui}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><Car className="w-3.5 h-3.5" /> Vehículo disponible</label>
                <select className="input" value={form.vehiculo_id} onChange={(e) => setForm({ ...form, vehiculo_id: e.target.value })} required>
                  <option value="">Seleccionar vehículo...</option>
                  {vehiculos.map((v) => (
                    <option key={v.id} value={v.id}>{v.marca} {v.modelo} ({v.placa}) — ${v.precio_dia}/día</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Fecha de inicio</label>
                <input type="date" className="input" value={form.fecha_inicio}
                  onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} required />
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Fecha de fin</label>
                <input type="date" className="input" value={form.fecha_fin}
                  onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })} required />
              </div>
              <div className="lg:col-span-2">
                <label className="label">Observaciones</label>
                <textarea className="input min-h-[80px] resize-none"
                  value={form.observaciones}
                  onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                  placeholder="Indicaciones especiales, destino..." />
              </div>
            </div>
            <button type="submit" className="btn-primary">Guardar alquiler</button>
          </form>
        </div>
      )}

      {/* Lista */}
      <div className="card overflow-hidden animate-slide-up [animation-delay:100ms]">
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Período</th>
                <th>Total</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alquileres.map((a) => (
                <tr key={a.id}>
                  <td className="font-mono text-xs text-ink-400">#{a.id}</td>
                  <td>
                    <div className="font-medium text-ink-900">{a.cliente?.usuario?.name}</div>
                    <div className="text-xs text-ink-500">{a.cliente?.dui}</div>
                  </td>
                  <td>
                    <div className="font-medium text-ink-900">{a.vehiculo?.marca} {a.vehiculo?.modelo}</div>
                    <div className="text-xs text-ink-500 font-mono">{a.vehiculo?.placa}</div>
                  </td>
                  <td className="text-xs text-ink-600">
                    {a.fecha_inicio} <span className="text-ink-300">→</span> {a.fecha_fin}
                  </td>
                  <td className="font-bold text-ink-900">${a.total}</td>
                  <td><span className={estadoStyles[a.estado] + ' capitalize'}>{a.estado}</span></td>
                  <td>
                    <div className="flex items-center justify-end gap-1.5">
                      {a.estado === 'pendiente' && (
                        <>
                          <button onClick={() => cambiarEstado(a.id, 'activo')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Aprobar
                          </button>
                          <button onClick={() => cambiarEstado(a.id, 'cancelado')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                            <XCircle className="w-3.5 h-3.5" /> Rechazar
                          </button>
                        </>
                      )}
                      {a.estado === 'activo' && (
                        <>
                          <button onClick={() => cambiarEstado(a.id, 'finalizado')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Finalizar
                          </button>
                          <button onClick={() => cambiarEstado(a.id, 'cancelado')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors">
                            <XCircle className="w-3.5 h-3.5" /> Cancelar
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(a.id)}
                        title="Eliminar"
                        className="p-1.5 rounded-lg text-ink-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {alquileres.length === 0 && (
                <tr><td colSpan={7} className="text-center text-ink-400 py-10">No hay alquileres registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
