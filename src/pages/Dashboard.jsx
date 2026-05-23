import { ArrowUpRight, Calendar, CalendarDays, Car, CreditCard, TrendingUp, Users, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats]           = useState(null);
  const [alquileres, setAlquileres] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/vehiculos'),
      api.get('/clientes'),
      api.get('/alquileres'),
      api.get('/pagos'),
      api.get('/mantenimientos'),
    ]).then(([v, c, a, p, m]) => {
      const ingresos = p.data
        .filter((x) => x.estado === 'pagado')
        .reduce((sum, x) => sum + parseFloat(x.monto), 0);

      setStats({
        vehiculos:      v.data.length,
        disponibles:    v.data.filter((x) => x.estado === 'disponible').length,
        clientes:       c.data.length,
        alquileres:     a.data.length,
        activos:        a.data.filter((x) => x.estado === 'activo').length,
        pagos:          p.data.length,
        ingresos,
        mantenimientos: m.data.length,
      });
      setAlquileres(a.data.slice(0, 5));
    }).catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card h-32 animate-shimmer bg-gradient-to-r from-ink-100 via-ink-50 to-ink-100 bg-[length:200%_100%]" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl space-y-8">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="font-display text-3xl font-extrabold text-ink-900">Panel de control</h1>
        <p className="text-ink-500 mt-1">Visión general del negocio en tiempo real.</p>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-slide-up [animation-delay:50ms]">
        <StatCard
          to="/admin/vehiculos"
          icon={Car}
          label="Vehículos"
          value={stats.vehiculos}
          sub={`${stats.disponibles} disponibles`}
          gradient="from-brand-500 to-brand-700"
        />
        <StatCard
          to="/admin/clientes"
          icon={Users}
          label="Clientes"
          value={stats.clientes}
          sub="registrados"
          gradient="from-sky-500 to-sky-700"
        />
        <StatCard
          to="/admin/alquileres"
          icon={CalendarDays}
          label="Alquileres"
          value={stats.alquileres}
          sub={`${stats.activos} activos`}
          gradient="from-accent-500 to-accent-700"
        />
        <StatCard
          to="/admin/pagos"
          icon={CreditCard}
          label="Ingresos"
          value={`$${stats.ingresos.toFixed(0)}`}
          sub={`${stats.pagos} pagos`}
          gradient="from-emerald-500 to-emerald-700"
        />
      </div>

      {/* Grid secundario */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alquileres recientes */}
        <div className="lg:col-span-2 card p-6 animate-slide-up [animation-delay:100ms]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-ink-900">Alquileres recientes</h2>
            <Link to="/admin/alquileres" className="text-sm text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1">
              Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {alquileres.length === 0 ? (
            <p className="text-sm text-ink-500 py-8 text-center">No hay alquileres registrados aún.</p>
          ) : (
            <div className="space-y-3">
              {alquileres.map((a) => (
                <div key={a.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-ink-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-ink-900 truncate">
                      {a.vehiculo?.marca} {a.vehiculo?.modelo}
                    </div>
                    <div className="text-xs text-ink-500">
                      {a.cliente?.usuario?.name} · {a.fecha_inicio} → {a.fecha_fin}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-ink-900">${a.total}</div>
                    <span className={`badge ${
                      a.estado === 'activo'     ? 'badge-success' :
                      a.estado === 'finalizado' ? 'badge-info'    : 'badge-danger'
                    } capitalize`}>
                      {a.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mini stats laterales */}
        <div className="space-y-4 animate-slide-up [animation-delay:150ms]">
          <SideStat icon={TrendingUp} label="Tasa de ocupación"
            value={`${stats.vehiculos ? Math.round(((stats.vehiculos - stats.disponibles) / stats.vehiculos) * 100) : 0}%`}
            gradient="from-violet-500 to-violet-700" />
          <SideStat icon={Wrench}  label="Mantenimientos" value={stats.mantenimientos} gradient="from-amber-500 to-amber-700" />
          <SideStat icon={Calendar} label="Activos hoy"   value={stats.activos}        gradient="from-rose-500 to-rose-700" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ to, icon: Icon, label, value, sub, gradient }) {
  return (
    <Link to={to} className="card-hover p-6 group block">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <ArrowUpRight className="w-4 h-4 text-ink-300 group-hover:text-brand-600 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
      </div>
      <div className="text-sm text-ink-500 font-medium">{label}</div>
      <div className="font-display text-3xl font-extrabold text-ink-900 mt-1">{value}</div>
      <div className="text-xs text-ink-400 mt-1">{sub}</div>
    </Link>
  );
}

function SideStat({ icon: Icon, label, value, gradient }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-sm`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-ink-500">{label}</div>
        <div className="font-display text-2xl font-extrabold text-ink-900 leading-tight">{value}</div>
      </div>
    </div>
  );
}
