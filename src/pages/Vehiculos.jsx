import { useEffect, useState } from 'react';
import api from '../api/axios';

const estadoBadge = { disponible: '#27ae60', alquilado: '#e67e22', mantenimiento: '#e74c3c' };

export default function Vehiculos() {
  const [vehiculos, setVehiculos]   = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm]             = useState({ categoria_id: '', marca: '', modelo: '', anio: '', placa: '', color: '', precio_dia: '', estado: 'disponible' });
  const [editId, setEditId]         = useState(null);
  const [showForm, setShowForm]     = useState(false);

  const cargar = () => Promise.all([api.get('/vehiculos'), api.get('/categorias-vehiculo')])
    .then(([v, c]) => { setVehiculos(v.data); setCategorias(c.data); });

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/vehiculos/${editId}`, form);
    } else {
      await api.post('/vehiculos', form);
    }
    setForm({ categoria_id: '', marca: '', modelo: '', anio: '', placa: '', color: '', precio_dia: '', estado: 'disponible' });
    setEditId(null);
    setShowForm(false);
    cargar();
  };

  const handleEdit = (v) => {
    setForm({ categoria_id: v.categoria_id, marca: v.marca, modelo: v.modelo, anio: v.anio, placa: v.placa, color: v.color, precio_dia: v.precio_dia, estado: v.estado });
    setEditId(v.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Eliminar vehiculo?')) {
      await api.delete(`/vehiculos/${id}`);
      cargar();
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1a1a2e' }}>Vehiculos</h2>
        <button style={btnStyle} onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ categoria_id: '', marca: '', modelo: '', anio: '', placa: '', color: '', precio_dia: '', estado: 'disponible' }); }}>
          {showForm ? 'Cancelar' : '+ Nuevo'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <select style={inputStyle} value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })} required>
            <option value="">-- Categoria --</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          {['marca', 'modelo', 'anio', 'placa', 'color', 'precio_dia'].map((f) => (
            <input key={f} style={inputStyle} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} value={form[f]}
              onChange={(e) => setForm({ ...form, [f]: e.target.value })} required />
          ))}
          <select style={inputStyle} value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
            <option value="disponible">Disponible</option>
            <option value="alquilado">Alquilado</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
          <button style={btnStyle} type="submit">{editId ? 'Actualizar' : 'Guardar'}</button>
        </form>
      )}

      <table style={tableStyle}>
        <thead>
          <tr style={{ background: '#1a1a2e', color: '#fff' }}>
            {['Placa', 'Marca', 'Modelo', 'Ano', 'Color', 'Categoria', 'Precio/dia', 'Estado', 'Acciones'].map((h) => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v) => (
            <tr key={v.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{v.placa}</td>
              <td style={tdStyle}>{v.marca}</td>
              <td style={tdStyle}>{v.modelo}</td>
              <td style={tdStyle}>{v.anio}</td>
              <td style={tdStyle}>{v.color}</td>
              <td style={tdStyle}>{v.categoria?.nombre}</td>
              <td style={tdStyle}>${v.precio_dia}</td>
              <td style={tdStyle}>
                <span style={{ background: estadoBadge[v.estado], color: '#fff', padding: '2px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>
                  {v.estado}
                </span>
              </td>
              <td style={tdStyle}>
                <button style={{ ...btnStyle, marginRight: '6px', background: '#0f3460' }} onClick={() => handleEdit(v)}>Editar</button>
                <button style={{ ...btnStyle, background: '#e74c3c' }} onClick={() => handleDelete(v.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const btnStyle   = { background: '#e94560', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' };
const inputStyle = { padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '140px' };
const formStyle  = { display: 'flex', flexWrap: 'wrap', gap: '10px', background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '24px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle    = { padding: '12px', textAlign: 'left' };
const tdStyle    = { padding: '10px 12px' };
