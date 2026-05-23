import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm]         = useState({ usuario_id: '', dui: '', licencia_conducir: '', telefono: '', direccion: '', fecha_nacimiento: '' });
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);

  const cargar = () => Promise.all([api.get('/clientes'), api.get('/me')])
    .then(([c]) => setClientes(c.data));

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/clientes/${editId}`, form);
    } else {
      await api.post('/clientes', form);
    }
    setForm({ usuario_id: '', dui: '', licencia_conducir: '', telefono: '', direccion: '', fecha_nacimiento: '' });
    setEditId(null);
    setShowForm(false);
    cargar();
  };

  const handleEdit = (c) => {
    setForm({ usuario_id: c.usuario_id, dui: c.dui, licencia_conducir: c.licencia_conducir, telefono: c.telefono || '', direccion: c.direccion || '', fecha_nacimiento: c.fecha_nacimiento || '' });
    setEditId(c.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Eliminar cliente?')) {
      await api.delete(`/clientes/${id}`);
      cargar();
    }
  };

  const campos = [
    { key: 'usuario_id', label: 'ID Usuario', type: 'number' },
    { key: 'dui', label: 'DUI', type: 'text' },
    { key: 'licencia_conducir', label: 'Licencia', type: 'text' },
    { key: 'telefono', label: 'Telefono', type: 'text' },
    { key: 'direccion', label: 'Direccion', type: 'text' },
    { key: 'fecha_nacimiento', label: 'Fecha nacimiento', type: 'date' },
  ];

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ color: '#1a1a2e' }}>Clientes</h2>
        <button style={btnStyle} onClick={() => { setShowForm(!showForm); setEditId(null); }}>
          {showForm ? 'Cancelar' : '+ Nuevo'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={formStyle}>
          {campos.map(({ key, label, type }) => (
            <input key={key} style={inputStyle} placeholder={label} type={type} value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required={['usuario_id', 'dui', 'licencia_conducir'].includes(key)} />
          ))}
          <button style={btnStyle} type="submit">{editId ? 'Actualizar' : 'Guardar'}</button>
        </form>
      )}

      <table style={tableStyle}>
        <thead>
          <tr style={{ background: '#1a1a2e', color: '#fff' }}>
            {['Nombre', 'Email', 'DUI', 'Licencia', 'Telefono', 'Direccion', 'Acciones'].map((h) => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{c.usuario?.name}</td>
              <td style={tdStyle}>{c.usuario?.email}</td>
              <td style={tdStyle}>{c.dui}</td>
              <td style={tdStyle}>{c.licencia_conducir}</td>
              <td style={tdStyle}>{c.telefono}</td>
              <td style={tdStyle}>{c.direccion}</td>
              <td style={tdStyle}>
                <button style={{ ...btnStyle, marginRight: '6px', background: '#0f3460' }} onClick={() => handleEdit(c)}>Editar</button>
                <button style={{ ...btnStyle, background: '#e74c3c' }} onClick={() => handleDelete(c.id)}>Eliminar</button>
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
