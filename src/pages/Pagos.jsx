import { Banknote, CreditCard, Plus, Trash2, Wallet, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const metodoIcon = { efectivo: Banknote, tarjeta: CreditCard, transferencia: Wallet };

export default function Pagos() {
  const [pagos, setPagos]         = useState([]);
  const [alquileres, setAlquileres] = useState([]);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ alquiler_id: '', monto: '', metodo_pago: 'efectivo', estado: 'pagado' });

  const cargar = () => Promise.all([api.get('/pagos'), api.get('/alquileres')])
    .then(([p, a]) => { setPagos(p.data); setAlquileres(a.data); });

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/pagos', form);
    setForm({ alquiler_id: '', monto: '', metodo_pago: 'efectivo', estado: 'pagado' });
    setShowForm(false);
    cargar();
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este pago?')) {
      await api.delete(`/pagos/${id}`);
      cargar();
    }
  };

  const totalPagado = pagos.filter((p) => p.estado === 'pagado').reduce((s, p) => s + parseFloat(p.monto), 0);

  return (
    <div className="p-6 lg:p-10 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">Pagos</h1>
          <p className="text-ink-500 mt-1">{pagos.length} transacciones registradas</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={showForm ? 'btn-secondary' : 'btn-primary'}>
          {showForm ? <><X className="w-4 h-4" /> Cancelar</> : <><Plus className="w-4 h-4" /> Registrar pago</>}
        </button>
      </div>

      {/* Total */}
      <div className="card p-6 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-0 animate-fade-in">
        <div className="text-sm text-white/80">Ingresos totales confirmados</div>
        <div className="font-display text-4xl font-extrabold mt-1">${totalPagado.toFixed(2)}</div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card p-6 lg:p-8 animate-scale-in">
          <h2 className="font-display text-xl font-bold text-ink-900 mb-6">Registrar pago</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Alquiler</label>
              <select className="input" value={form.alquiler_id} onChange={(e) => setForm({ ...form, alquiler_id: e.target.value })} required>
                <option value="">Seleccionar alquiler...</option>
                {alquileres.map((a) => (
                  <option key={a.id} value={a.id}>#{a.id} — {a.cliente?.usuario?.name} (${a.total})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Monto ($)</label>
              <input type="number" step="0.01" className="input" value={form.monto}
                onChange={(e) => setForm({ ...form, monto: e.target.value })} required />
            </div>
            <div>
              <label className="label">Método de pago</label>
              <select className="input" value={form.metodo_pago} onChange={(e) => setForm({ ...form, metodo_pago: e.target.value })}>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
            <div>
              <label className="label">Estado</label>
              <select className="input" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                <option value="pagado">Pagado</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary">Registrar pago</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla */}
      <div className="card overflow-hidden animate-slide-up [animation-delay:100ms]">
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>#</th>
                <th>Alquiler</th>
                <th>Cliente</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((p) => {
                const Icon = metodoIcon[p.metodo_pago];
                return (
                  <tr key={p.id}>
                    <td className="font-mono text-xs text-ink-400">#{p.id}</td>
                    <td className="font-mono text-xs">#{p.alquiler_id}</td>
                    <td className="text-ink-700">{p.alquiler?.cliente?.usuario?.name}</td>
                    <td className="font-bold text-ink-900">${p.monto}</td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 text-ink-700 text-sm capitalize">
                        {Icon && <Icon className="w-4 h-4 text-ink-400" />}
                        {p.metodo_pago}
                      </span>
                    </td>
                    <td className="text-xs text-ink-500">{p.fecha_pago?.slice(0, 10)}</td>
                    <td>
                      <span className={(p.estado === 'pagado' ? 'badge-success' : 'badge-warning') + ' capitalize'}>
                        {p.estado}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end">
                        <button onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-lg text-ink-400 hover:text-accent-600 hover:bg-accent-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pagos.length === 0 && (
                <tr><td colSpan={8} className="text-center text-ink-400 py-10">No hay pagos registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
