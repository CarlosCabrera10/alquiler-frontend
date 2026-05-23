import { Bell, CheckCircle2, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificaciones } from '../hooks/useNotificaciones';

export default function Notificaciones() {
  const { notificaciones, marcarVistas } = useNotificaciones();
  const navigate = useNavigate();

  useEffect(() => {
    marcarVistas();
  }, [notificaciones.length]);

  return (
    <div className="min-h-screen bg-mesh-light py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-ink-900">Notificaciones</h1>
            <p className="text-sm text-ink-500">Estado de tus reservas</p>
          </div>
        </div>

        {notificaciones.length === 0 ? (
          <div className="card p-14 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-ink-100 flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-ink-400" />
            </div>
            <h3 className="font-display text-lg font-bold text-ink-900 mb-1">Sin notificaciones</h3>
            <p className="text-sm text-ink-500">Aquí verás cuando tus reservas sean aprobadas o rechazadas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notificaciones.map(n => {
              const aprobado = n.estado === 'activo';
              return (
                <div key={n.id}
                  className={`card p-5 flex items-start gap-4 border-l-4 ${aprobado ? 'border-emerald-400' : 'border-red-300'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${aprobado ? 'bg-emerald-100' : 'bg-red-100'}`}>
                    {aprobado
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      : <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${aprobado ? 'text-emerald-800' : 'text-red-700'}`}>
                      {aprobado ? '¡Tu reserva fue aprobada!' : 'Tu reserva fue cancelada'}
                    </p>
                    <p className="text-ink-700 font-medium mt-0.5">
                      {n.vehiculo?.marca} {n.vehiculo?.modelo}
                    </p>
                    <p className="text-xs text-ink-500 mt-1">
                      {n.fecha_inicio} → {n.fecha_fin} · ${n.total}
                    </p>
                    {aprobado && (
                      <p className="text-xs text-emerald-700 mt-2 font-medium">
                        Ya puedes acercarte a recoger el vehículo en las fechas indicadas.
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-ink-400 shrink-0">
                    {new Date(n.updated_at).toLocaleDateString('es-SV', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button onClick={() => navigate('/mis-alquileres')} className="btn-secondary mt-6">
          Ver todos mis alquileres
        </button>
      </div>
    </div>
  );
}
