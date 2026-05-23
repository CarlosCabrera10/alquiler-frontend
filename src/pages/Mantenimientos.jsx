import { Calendar, Car, DollarSign, Edit3, FileText, Plus, Trash2, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const formVacio = { vehiculo_id: '', fecha: '', descripcion: '', costo: '', tecnico_responsable: '' };

export default function Mantenimientos() {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [vehiculos, setVehiculos]           = useState([]);
  const [form, setForm]                     = useState(formVacio);
  const [editId, setEditId]                 = useState(null);
  const [showForm, setShowForm]             = useState(false);

  const cargar = () => Promise.all([api.get('/mantenimientos'), api.get('/vehiculos')])
    .then(([m, v]) => { setMantenimientos(m.data); setVehiculos(v.data); });

  useEffect(() => { cargar(); }, []);

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/mantenimientos/${editId}`, form);
    else        await api.post('/mantenimientos', form);
    setForm(formVacio);
    setEditId(null);
    setShowForm(false);
    cargar();
  };

  const handleEdit = (m) => {
    setForm({
      vehiculo_id: String(m.vehiculo_id),
      fecha: m.fecha,
      descripcion: m.descripcion,
      costo: m.costo,
      tecnico_responsable: m.tecnico_responsable || '',
    });
    setEditId(m.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este mantenimiento?')) {
      await api.delete(`/mantenimientos/${id}`);
      cargar();
    }
  };

  const costoTotal = mantenimientos.reduce((s, m) => s + parseFloat(m.costo || 0), 0);

  return (
    <div className="p-6 lg:p-10 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">Mantenimientos</h1>
          <p className="text-ink-500 mt-1">
            {mantenimientos.length} registros · Costo total: <span className="font-semibold text-ink-700">${costoTotal.toFixed(2)}</span>
          </p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(formVacio); }}
          className={showForm ? 'btn-secondary' : 'btn-primary'}>
          {showForm ? <><X className="w-4 h-4" /> Cancelar</> : <><Plus className="w-4 h-4" /> Nuevo mantenimiento</>}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card p-6 lg:p-8 animate-scale-in">
          <h2 className="font-display text-xl font-bold text-ink-900 mb-6">
            {editId ? 'Editar mantenimiento' : 'Registrar mantenimiento'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-1.5"><Car className="w-3.5 h-3.5" /> Vehículo</label>
                <select className="input" value={form.vehiculo_id} onChange={set('vehiculo_id')} required>
                  <option value="">Seleccionar...</option>
                  {vehiculos.map((v) => (
                    <option key={v.id} value={v.id}>{v.marca} {v.modelo} ({v.placa})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Fecha</label>
                <input type="date" className="input" value={form.fecha} onChange={set('fecha')} required />
              </div>
              <div className="sm:col-span-2">
                <label className="label flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Descripción</label>
                <textarea className="input min-h-[80px] resize-none" value={form.descripcion} onChange={set('descripcion')} required
                  placeholder="Cambio de aceite, revisión de frenos, etc." />
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Costo</label>
                <input type="number" step="0.01" className="input" value={form.costo} onChange={set('costo')} />
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Técnico responsable</label>
                <input className="input" value={form.tecnico_responsable} onChange={set('tecnico_responsable')}
                  placeholder="Nombre del técnico" />
              </div>
            </div>
            <button type="submit" className="btn-primary">
              {editId ? 'Actualizar' : 'Guardar mantenimiento'}
            </button>
          </form>
        </div>
      )}

      {/* Tabla */}
      <div className="card overflow-hidden animate-slide-up [animation-delay:100ms]">
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Vehículo</th>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Costo</th>
                <th>Técnico</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mantenimientos.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="font-medium text-ink-900">{m.vehiculo?.marca} {m.vehiculo?.modelo}</div>
                    <div className="text-xs text-ink-500 font-mono">{m.vehiculo?.placa}</div>
                  </td>
                  <td className="text-sm text-ink-600">{m.fecha}</td>
                  <td className="text-sm text-ink-700 max-w-xs truncate">{m.descripcion}</td>
                  <td className="font-bold text-ink-900">${m.costo}</td>
                  <td className="text-sm text-ink-700">{m.tecnico_responsable || '—'}</td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(m)}
                        className="p-2 rounded-lg text-ink-500 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(m.id)}
                        className="p-2 rounded-lg text-ink-400 hover:text-accent-600 hover:bg-accent-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {mantenimientos.length === 0 && (
                <tr><td colSpan={6} className="text-center text-ink-400 py-10">No hay mantenimientos registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
