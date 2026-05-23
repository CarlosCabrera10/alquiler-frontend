import { Bell, Calendar, CalendarDays, Car, CheckCircle2, CircleDot, Clock, CreditCard, Plus, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const estadoConfig = {
  pendiente:  { badge: 'badge-warning', icon: Clock,        label: 'Pendiente de aprobación' },
  activo:     { badge: 'badge-success', icon: CircleDot,    label: 'Aprobado · En curso' },
  finalizado: { badge: 'badge-info',    icon: CheckCircle2, label: 'Finalizado' },
  cancelado:  { badge: 'badge-danger',  icon: XCircle,      label: 'Cancelado' },
};

export default function MisAlquileres() {
  const [alquileres, setAlquileres] = useState([]);
  const [loading, setLoading]       = useState(true);
  const navigate                    = useNavigate();
  const { user }                    = useAuth();

  useEffect(() => {
    if (!user?.cliente?.id) { setLoading(false); return; }
    api.get(`/mis-alquileres?cliente_id=${user.cliente.id}`)
      .then((r) => setAlquileres(r.data))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen bg-mesh-light py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-ink-900">Mis alquileres</h1>
            <p className="text-ink-500 mt-1">Historial completo de tus reservas.</p>
          </div>
          <button onClick={() => navigate('/')} className="btn-primary">
            <Plus className="w-4 h-4" /> Alquilar vehículo
          </button>
        </div>

        {/* Notificación de aprobación */}
        {alquileres.some(a => a.estado === 'activo') && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 animate-fade-in">
            <Bell className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">¡Tienes alquileres aprobados!</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                {alquileres.filter(a => a.estado === 'activo').length === 1
                  ? 'Tu reserva fue aprobada. Ya puedes recoger el vehículo.'
                  : `${alquileres.filter(a => a.estado === 'activo').length} reservas fueron aprobadas. Ya puedes recoger los vehículos.`}
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        {alquileres.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-8 animate-fade-in">
            <StatMini label="Total"      value={alquileres.length} color="brand" />
            <StatMini label="Pendientes" value={alquileres.filter((a) => a.estado === 'pendiente').length} color="amber" />
            <StatMini label="Activos"    value={alquileres.filter((a) => a.estado === 'activo').length} color="emerald" />
            <StatMini label="Finalizados" value={alquileres.filter((a) => a.estado === 'finalizado').length} color="sky" />
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse h-32 bg-gradient-to-r from-ink-100 via-ink-50 to-ink-100 bg-[length:200%_100%] animate-shimmer" />
            ))}
          </div>
        ) : alquileres.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center mb-4">
              <Car className="w-10 h-10 text-brand-600" />
            </div>
            <h3 className="font-display text-xl font-bold text-ink-900 mb-2">Aún no tienes alquileres</h3>
            <p className="text-ink-500 mb-6">Explora nuestro catálogo y alquila tu primer vehículo.</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Ver catálogo
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {alquileres.map((a) => {
              const cfg = estadoConfig[a.estado] || estadoConfig.pendiente;
              const Icon = cfg.icon;
              const foto = a.vehiculo?.imagenes?.[0] || a.vehiculo?.imagen;
              return (
                <div key={a.id} className="card-hover overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-0">
                    {/* Imagen */}
                    <div className="relative h-44 sm:h-auto bg-ink-950">
                      {foto ? (
                        <img src={foto} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30">
                          <Car className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <h3 className="font-display text-xl font-bold text-ink-900">
                            {a.vehiculo?.marca} {a.vehiculo?.modelo}
                          </h3>
                          <p className="text-sm text-ink-500 mt-0.5">
                            Placa {a.vehiculo?.placa} · {a.vehiculo?.categoria?.nombre}
                          </p>
                        </div>
                        <span className={cfg.badge}>
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-ink-100">
                        <Meta icon={Calendar}     label="Desde"  value={a.fecha_inicio} />
                        <Meta icon={CalendarDays} label="Hasta"  value={a.fecha_fin} />
                        <Meta icon={CreditCard}   label="Pago"
                          value={a.pago ? <span className={a.pago.estado === 'pagado' ? 'text-emerald-600' : 'text-amber-600'}>{a.pago.estado}</span> : <span className="text-amber-600">Pendiente</span>} />
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-ink-400 mb-1">Total</div>
                          <div className="font-display text-lg font-extrabold text-gradient">${a.total}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatMini({ label, value, color }) {
  const colors = {
    brand:   'from-brand-500 to-brand-700',
    amber:   'from-amber-500 to-amber-700',
    emerald: 'from-emerald-500 to-emerald-700',
    sky:     'from-sky-500 to-sky-700',
  };
  return (
    <div className="card p-4">
      <div className="text-xs text-ink-500 mb-1">{label}</div>
      <div className={`font-display text-2xl font-extrabold bg-gradient-to-br ${colors[color]} bg-clip-text text-transparent`}>
        {value}
      </div>
    </div>
  );
}

function Meta({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-ink-400 mb-1 flex items-center gap-1">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <div className="text-sm font-medium text-ink-700 capitalize">{value}</div>
    </div>
  );
}
