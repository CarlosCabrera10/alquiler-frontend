import { Edit3, LayoutGrid, Plus, Tag, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [form, setForm]             = useState({ nombre: '', descripcion: '' });
  const [editId, setEditId]         = useState(null);
  const [showForm, setShowForm]     = useState(false);

  const cargar = () => api.get('/categorias-vehiculo').then((r) => setCategorias(r.data));
  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/categorias-vehiculo/${editId}`, form);
    else        await api.post('/categorias-vehiculo', form);
    setForm({ nombre: '', descripcion: '' });
    setEditId(null);
    setShowForm(false);
    cargar();
  };

  const handleEdit = (c) => {
    setForm({ nombre: c.nombre, descripcion: c.descripcion || '' });
    setEditId(c.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta categoría?')) {
      await api.delete(`/categorias-vehiculo/${id}`);
      cargar();
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">Categorías</h1>
          <p className="text-ink-500 mt-1">{categorias.length} categorías de vehículos</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ nombre: '', descripcion: '' }); }}
          className={showForm ? 'btn-secondary' : 'btn-primary'}>
          {showForm ? <><X className="w-4 h-4" /> Cancelar</> : <><Plus className="w-4 h-4" /> Nueva categoría</>}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card p-6 lg:p-8 animate-scale-in">
          <h2 className="font-display text-xl font-bold text-ink-900 mb-6">
            {editId ? 'Editar categoría' : 'Nueva categoría'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Nombre</label>
              <input className="input" value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })} required
                placeholder="SUV, Sedán, Deportivo..." />
            </div>
            <div>
              <label className="label">Descripción</label>
              <textarea className="input min-h-[80px] resize-none" value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Breve descripción de la categoría..." />
            </div>
            <button type="submit" className="btn-primary">
              {editId ? 'Actualizar' : 'Crear categoría'}
            </button>
          </form>
        </div>
      )}

      {/* Grid de categorías */}
      {categorias.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-ink-100 flex items-center justify-center mb-4">
            <LayoutGrid className="w-7 h-7 text-ink-400" />
          </div>
          <h3 className="font-display text-lg font-bold text-ink-900 mb-1">Aún no hay categorías</h3>
          <p className="text-sm text-ink-500">Crea la primera para organizar tu flota.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {categorias.map((c) => (
            <div key={c.id} className="card-hover p-5 group">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
                  <LayoutGrid className="w-5 h-5 text-white" />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <button onClick={() => handleEdit(c)}
                    className="p-1.5 rounded-lg text-ink-500 hover:text-brand-600 hover:bg-brand-50">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded-lg text-ink-500 hover:text-accent-600 hover:bg-accent-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="font-display font-bold text-lg text-ink-900">{c.nombre}</h3>
              <p className="text-sm text-ink-500 mt-1 line-clamp-2">{c.descripcion || 'Sin descripción'}</p>
              {c.vehiculos_count !== undefined && (
                <div className="mt-4 pt-4 border-t border-ink-100 flex items-center justify-between">
                  <span className="text-xs text-ink-500">Vehículos</span>
                  <span className="badge-brand">{c.vehiculos_count}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
