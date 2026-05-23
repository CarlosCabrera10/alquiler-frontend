import { ChevronLeft, ChevronRight, Edit3, Image as ImageIcon, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const estadoStyles = {
  disponible:    'badge-success',
  alquilado:     'badge-warning',
  mantenimiento: 'badge-danger',
};

const formVacio = {
  categoria_id: '', marca: '', modelo: '', anio: '',
  placa: '', color: '', precio_dia: '', estado: 'disponible',
  imagenesTexto: '',
};

export default function VehiculosAdmin() {
  const [vehiculos, setVehiculos]   = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [editId, setEditId]         = useState(null);
  const [verFotos, setVerFotos]     = useState(null);
  const [form, setForm]             = useState(formVacio);

  const cargar = () => Promise.all([api.get('/vehiculos'), api.get('/categorias-vehiculo')])
    .then(([v, c]) => { setVehiculos(v.data); setCategorias(c.data); });

  useEffect(() => { cargar(); }, []);

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imagenes = form.imagenesTexto.split('\n').map((u) => u.trim()).filter(Boolean);
    const payload  = { ...form, imagenes, imagen: imagenes[0] || '' };
    delete payload.imagenesTexto;

    if (editId) await api.put(`/vehiculos/${editId}`, payload);
    else        await api.post('/vehiculos', payload);

    setForm(formVacio);
    setEditId(null);
    setShowForm(false);
    cargar();
  };

  const handleEdit = (v) => {
    setForm({
      categoria_id:  String(v.categoria_id),
      marca:         v.marca,
      modelo:        v.modelo,
      anio:          String(v.anio),
      placa:         v.placa,
      color:         v.color,
      precio_dia:    String(v.precio_dia),
      estado:        v.estado,
      imagenesTexto: (v.imagenes || []).join('\n'),
    });
    setEditId(v.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este vehículo?')) {
      await api.delete(`/vehiculos/${id}`);
      cargar();
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">Vehículos</h1>
          <p className="text-ink-500 mt-1">{vehiculos.length} en la flota · {vehiculos.filter(v => v.estado === 'disponible').length} disponibles</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(formVacio); }}
          className={showForm ? 'btn-secondary' : 'btn-primary'}>
          {showForm ? <><X className="w-4 h-4" /> Cancelar</> : <><Plus className="w-4 h-4" /> Nuevo vehículo</>}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card p-6 lg:p-8 animate-scale-in">
          <h2 className="font-display text-xl font-bold text-ink-900 mb-6">
            {editId ? 'Editar vehículo' : 'Registrar nuevo vehículo'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Categoría</label>
                <select className="input" value={form.categoria_id} onChange={set('categoria_id')} required>
                  <option value="">Seleccionar...</option>
                  {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Marca</label>
                <input className="input" value={form.marca} onChange={set('marca')} required placeholder="Ford" />
              </div>
              <div>
                <label className="label">Modelo</label>
                <input className="input" value={form.modelo} onChange={set('modelo')} required placeholder="Mustang GT" />
              </div>
              <div>
                <label className="label">Año</label>
                <input className="input" type="number" min="1990" max="2030" value={form.anio} onChange={set('anio')} required />
              </div>
              <div>
                <label className="label">Placa</label>
                <input className="input" value={form.placa} onChange={set('placa')} required placeholder="P-XXX-XX" />
              </div>
              <div>
                <label className="label">Color</label>
                <input className="input" value={form.color} onChange={set('color')} required placeholder="Rojo" />
              </div>
              <div>
                <label className="label">Precio por día ($)</label>
                <input className="input" type="number" step="0.01" value={form.precio_dia} onChange={set('precio_dia')} required />
              </div>
              <div>
                <label className="label">Estado</label>
                <select className="input" value={form.estado} onChange={set('estado')}>
                  <option value="disponible">Disponible</option>
                  <option value="alquilado">Alquilado</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                URLs de fotos
                <span className="text-ink-400 font-normal">(una por línea, la primera es la principal)</span>
              </label>
              <textarea
                className="input min-h-[100px] resize-none font-mono text-xs"
                placeholder="https://images.unsplash.com/..."
                value={form.imagenesTexto}
                onChange={set('imagenesTexto')}
              />
              {form.imagenesTexto.trim().split('\n').filter(Boolean).length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-2">
                  {form.imagenesTexto.trim().split('\n').filter(Boolean).slice(0, 6).map((url, i) => (
                    <img key={i} src={url} alt=""
                      className="w-24 h-16 object-cover rounded-lg shrink-0 ring-1 ring-ink-200"
                      onError={(e) => { e.target.style.display = 'none'; }} />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(formVacio); }} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-primary flex-1 sm:flex-none">
                {editId ? 'Actualizar vehículo' : 'Guardar vehículo'}
              </button>
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
                <th>Foto</th>
                <th>Vehículo</th>
                <th>Placa</th>
                <th>Categoría</th>
                <th>Precio/día</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map((v) => (
                <tr key={v.id}>
                  <td>
                    {v.imagen ? (
                      <button onClick={() => setVerFotos(v)} className="block group">
                        <img src={v.imagen} alt=""
                          className="w-16 h-12 object-cover rounded-lg ring-1 ring-ink-200 group-hover:ring-brand-400 transition-all"
                          onError={(e) => { e.target.style.display = 'none'; }} />
                      </button>
                    ) : (
                      <div className="w-16 h-12 rounded-lg bg-ink-100 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-ink-400" />
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="font-semibold text-ink-900">{v.marca} {v.modelo}</div>
                    <div className="text-xs text-ink-500">{v.anio} · {v.color}</div>
                  </td>
                  <td className="font-mono text-xs">{v.placa}</td>
                  <td><span className="badge-brand">{v.categoria?.nombre}</span></td>
                  <td className="font-bold">${v.precio_dia}</td>
                  <td><span className={estadoStyles[v.estado] + ' capitalize'}>{v.estado}</span></td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(v)}
                        className="p-2 rounded-lg text-ink-500 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(v.id)}
                        className="p-2 rounded-lg text-ink-500 hover:text-accent-600 hover:bg-accent-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {vehiculos.length === 0 && (
                <tr><td colSpan={7} className="text-center text-ink-400 py-10">No hay vehículos registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {verFotos && <GaleriaModal vehiculo={verFotos} onClose={() => setVerFotos(null)} />}
    </div>
  );
}

function GaleriaModal({ vehiculo, onClose }) {
  const fotos = vehiculo.imagenes || (vehiculo.imagen ? [vehiculo.imagen] : []);
  const [idx, setIdx] = useState(0);

  return (
    <div className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-ink-950 rounded-2xl overflow-hidden max-w-4xl w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <img src={fotos[idx]} alt="" className="w-full h-[60vh] object-cover" />
          {fotos.length > 1 && (
            <>
              <button onClick={() => setIdx((idx - 1 + fotos.length) % fotos.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setIdx((idx + 1) % fotos.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-ink-950/60 hover:bg-ink-950/80 text-white flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-ink-950/60 text-white text-xs">
            {idx + 1} / {fotos.length}
          </div>
        </div>
        <div className="p-5">
          <div className="font-display text-lg font-bold text-white">{vehiculo.marca} {vehiculo.modelo}</div>
          <div className="text-sm text-white/60">{vehiculo.anio} · {vehiculo.color}</div>
          {fotos.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
              {fotos.map((f, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden ring-2 transition-all ${i === idx ? 'ring-brand-400' : 'ring-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={f} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
