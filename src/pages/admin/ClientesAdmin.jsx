import { Car, CreditCard, Mail, Phone, Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function ClientesAdmin() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate                = useNavigate();

  useEffect(() => {
    api.get('/clientes').then((r) => setClientes(r.data));
  }, []);

  const filtrados = clientes.filter((c) => {
    const q = busqueda.toLowerCase();
    return !q || (
      c.usuario?.name?.toLowerCase().includes(q) ||
      c.dui?.includes(q) ||
      c.licencia_conducir?.includes(q) ||
      c.usuario?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">Clientes</h1>
          <p className="text-ink-500 mt-1">{clientes.length} clientes registrados en el sistema</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input className="input !pl-10"
            placeholder="Buscar por nombre, DUI, email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)} />
        </div>
      </div>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-ink-100 flex items-center justify-center mb-4">
            <User className="w-7 h-7 text-ink-400" />
          </div>
          <h3 className="font-display text-lg font-bold text-ink-900 mb-1">
            {busqueda ? 'Sin resultados' : 'Aún no hay clientes registrados'}
          </h3>
          <p className="text-sm text-ink-500">
            {busqueda ? 'Prueba con otros términos de búsqueda.' : 'Los clientes se registran desde la página pública.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {filtrados.map((c) => (
            <div key={c.id} className="card-hover p-5 group">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-glow shrink-0">
                  {c.usuario?.name?.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-ink-900 truncate">{c.usuario?.name}</div>
                  <div className="flex items-center gap-1 text-xs text-ink-500 mt-0.5">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{c.usuario?.email}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-ink-100">
                    <Field icon={CreditCard} label="DUI"      value={c.dui} />
                    <Field icon={CreditCard} label="Licencia" value={c.licencia_conducir} />
                    {c.telefono && <Field icon={Phone} label="Teléfono" value={c.telefono} />}
                  </div>

                  <button
                    onClick={() => navigate('/admin/alquileres', { state: { clientePreseleccionado: c } })}
                    className="btn-accent w-full mt-4 group-hover:shadow-card-hover">
                    <Car className="w-4 h-4" /> Crear alquiler
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-ink-400 mb-0.5 flex items-center gap-1">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <div className="text-sm font-medium text-ink-700 truncate">{value}</div>
    </div>
  );
}
