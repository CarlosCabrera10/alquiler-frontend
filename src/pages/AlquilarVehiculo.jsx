import { ArrowLeft, Calendar, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AlquilarVehiculo() {
  const { id }    = useParams();
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [vehiculo, setVehiculo] = useState(null);
  const [form, setForm]         = useState({ fecha_inicio: '', fecha_fin: '' });
  const [total, setTotal]       = useState(null);
  const [dias, setDias]         = useState(0);
  const [error, setError]       = useState('');
  const [exito, setExito]       = useState(false);
  const [loading, setLoading]   = useState(false);
  const [fotoIdx, setFotoIdx]   = useState(0);

  useEffect(() => {
    api.get(`/vehiculos/${id}`).then((r) => setVehiculo(r.data));
  }, [id]);

  useEffect(() => {
    if (form.fecha_inicio && form.fecha_fin && vehiculo) {
      const d = Math.max(0, (new Date(form.fecha_fin) - new Date(form.fecha_inicio)) / 86400000);
      setDias(d);
      setTotal(d > 0 ? (d * vehiculo.precio_dia).toFixed(2) : null);
    } else {
      setTotal(null);
      setDias(0);
    }
  }, [form.fecha_inicio, form.fecha_fin, vehiculo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/alquileres', {
        cliente_id:   user.cliente.id,
        vehiculo_id:  vehiculo.id,
        fecha_inicio: form.fecha_inicio,
        fecha_fin:    form.fecha_fin,
      });
      setExito(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el alquiler.');
    } finally {
      setLoading(false);
    }
  };

  if (!vehiculo) {
    return <div className="min-h-screen flex items-center justify-center text-ink-500">Cargando...</div>;
  }

  const fotos = vehiculo.imagenes?.length ? vehiculo.imagenes : (vehiculo.imagen ? [vehiculo.imagen] : []);

  if (exito) {
    return (
      <div className="min-h-screen bg-mesh-light flex items-center justify-center p-6">
        <div className="card p-10 max-w-md w-full text-center animate-scale-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" strokeWidth={2.5} />
          </div>
          <h2 className="font-display text-2xl font-extrabold text-ink-900 mb-2">¡Reserva enviada!</h2>
          <p className="text-ink-600 mb-6">
            Tu reserva del <strong>{vehiculo.marca} {vehiculo.modelo}</strong> está pendiente de aprobación. Te notificaremos cuando sea confirmada.
          </p>
          <div className="bg-gradient-to-br from-brand-50 to-accent-50 rounded-2xl p-5 mb-6">
            <div className="text-xs uppercase tracking-widest text-ink-500 mb-1">Total a pagar</div>
            <div className="font-display text-4xl font-extrabold text-gradient">${total}</div>
            <div className="text-xs text-ink-500 mt-1">{dias} {dias === 1 ? 'día' : 'días'} de alquiler</div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/')} className="btn-secondary flex-1">Ver más vehículos</button>
            <button onClick={() => navigate('/mis-alquileres')} className="btn-primary flex-1">Mis alquileres</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh-light py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Galería + info vehículo */}
          <div className="lg:col-span-3 space-y-4 animate-slide-up">
            <div className="card overflow-hidden">
              <div className="relative aspect-[16/10] bg-ink-950">
                {fotos[fotoIdx] ? (
                  <img src={fotos[fotoIdx]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30">
                    <Sparkles className="w-12 h-12" />
                  </div>
                )}
                {fotos.length > 1 && (
                  <>
                    <button onClick={() => setFotoIdx((fotoIdx - 1 + fotos.length) % fotos.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setFotoIdx((fotoIdx + 1) % fotos.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              {fotos.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
                  {fotos.map((f, i) => (
                    <button key={i} onClick={() => setFotoIdx(i)}
                      className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden ring-2 transition-all ${i === fotoIdx ? 'ring-brand-500' : 'ring-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={f} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-ink-900">{vehiculo.marca} {vehiculo.modelo}</h1>
                  <p className="text-sm text-ink-500 mt-1">{vehiculo.anio} · {vehiculo.color} · Placa {vehiculo.placa}</p>
                </div>
                {vehiculo.categoria?.nombre && (
                  <span className="badge-brand">{vehiculo.categoria.nombre}</span>
                )}
              </div>
              <div className="flex items-baseline gap-1.5 pt-4 border-t border-ink-100">
                <span className="font-display text-3xl font-extrabold text-gradient">
                  ${parseFloat(vehiculo.precio_dia).toFixed(2)}
                </span>
                <span className="text-sm text-ink-500">/ día</span>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-2 animate-slide-up [animation-delay:100ms]">
            <div className="card p-6 lg:sticky lg:top-6">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-brand-600" />
                <span className="text-xs uppercase tracking-widest text-ink-500 font-semibold">Cliente</span>
              </div>
              <div className="text-sm font-semibold text-ink-900 mb-5">{user?.name}</div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-accent-50 border border-accent-100 text-accent-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Fecha de inicio</label>
                  <input type="date" className="input" min={new Date().toISOString().split('T')[0]}
                    value={form.fecha_inicio}
                    onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} required />
                </div>
                <div>
                  <label className="label flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Fecha de devolución</label>
                  <input type="date" className="input"
                    min={form.fecha_inicio || new Date().toISOString().split('T')[0]}
                    value={form.fecha_fin}
                    onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })} required />
                </div>
                {total && (
                  <div className="bg-gradient-to-br from-brand-50 to-accent-50 rounded-2xl p-5 text-center animate-fade-in">
                    <div className="text-xs uppercase tracking-widest text-ink-500 mb-1">Total estimado</div>
                    <div className="font-display text-3xl font-extrabold text-gradient">${total}</div>
                    <div className="text-xs text-ink-500 mt-1">
                      {dias} {dias === 1 ? 'día' : 'días'} × ${vehiculo.precio_dia}
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading || !total} className="btn-accent w-full !py-3">
                  {loading ? 'Procesando...' : 'Confirmar alquiler'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
