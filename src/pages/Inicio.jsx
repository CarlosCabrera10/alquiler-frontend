import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Gauge,
  MapPin,
  Search,
  Shield,
  Sparkles,
  Tag,
  X,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const estadoStyles = {
  disponible:    'badge-success',
  alquilado:     'badge-warning',
  mantenimiento: 'badge-danger',
};

function ImageSlider({ imagenes, alt }) {
  const fotos = imagenes?.length ? imagenes : [];
  const [idx, setIdx] = useState(0);

  if (!fotos.length) {
    return (
      <div className="aspect-[16/10] bg-gradient-to-br from-brand-700 via-brand-800 to-ink-900 flex items-center justify-center">
        <Zap className="w-12 h-12 text-white/30" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-ink-950 group/slider">
      <img
        src={fotos[idx]}
        alt={alt}
        className="w-full h-full object-cover transition-opacity duration-300"
        onError={(e) => { e.target.style.opacity = '0'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent pointer-events-none" />

      {fotos.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); setIdx((idx - 1 + fotos.length) % fotos.length); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIdx((idx + 1) % fotos.length); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {fotos.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                className={`h-1.5 rounded-full transition-all ${i === idx ? 'bg-white w-6' : 'bg-white/50 w-1.5 hover:bg-white/80'}`} />
            ))}
          </div>

          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-ink-950/60 backdrop-blur-sm text-white text-[10px] font-medium">
            {idx + 1}/{fotos.length}
          </div>
        </>
      )}
    </div>
  );
}

export default function Inicio() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [vehiculos, setVehiculos]   = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [filtros, setFiltros]       = useState({ categoria_id: '', precioMax: '', busqueda: '' });

  useEffect(() => {
    Promise.all([api.get('/vehiculos'), api.get('/categorias-vehiculo')])
      .then(([v, c]) => { setVehiculos(v.data); setCategorias(c.data); })
      .catch((err) => setError(err.message || 'Error al conectar con el servidor'))
      .finally(() => setLoading(false));
  }, []);

  const handleAlquilar = (vehiculo) => {
    if (!user) {
      sessionStorage.setItem('redirectAfterLogin', `/alquilar/${vehiculo.id}`);
      navigate('/login');
      return;
    }
    if (user.rol !== 'cliente') {
      alert('Solo los clientes pueden alquilar. Usa el panel de administración.');
      return;
    }
    navigate(`/alquilar/${vehiculo.id}`);
  };

  const vehiculosFiltrados = vehiculos.filter((v) => {
    if (filtros.categoria_id && String(v.categoria_id) !== filtros.categoria_id) return false;
    if (filtros.precioMax && parseFloat(v.precio_dia) > parseFloat(filtros.precioMax)) return false;
    if (filtros.busqueda) {
      const q = filtros.busqueda.toLowerCase();
      if (!`${v.marca} ${v.modelo} ${v.placa} ${v.color}`.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const disponibles = vehiculosFiltrados.filter((v) => v.estado === 'disponible').length;
  const hayFiltros  = filtros.busqueda || filtros.categoria_id || filtros.precioMax;

  return (
    <div className="min-h-screen bg-mesh-light">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-brand-950 to-ink-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-500/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-500/30 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              <span className="text-xs font-medium text-white/90">Flota premium • Reserva en minutos</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] mb-6 animate-slide-up">
              Conduce el coche{' '}
              <span className="bg-gradient-to-r from-accent-400 via-accent-300 to-brand-300 bg-clip-text text-transparent">
                de tus sueños
              </span>
            </h1>

            <p className="text-lg text-white/70 mb-8 max-w-xl animate-slide-up [animation-delay:100ms]">
              Selecciona entre nuestra flota exclusiva de deportivos, SUVs y sedanes. Precios transparentes, reserva instantánea, sin sorpresas.
            </p>

            {!user && (
              <div className="flex flex-wrap gap-3 animate-slide-up [animation-delay:200ms]">
                <button onClick={() => navigate('/registro')} className="btn-accent !px-6 !py-3">
                  Crear cuenta gratis
                </button>
                <button onClick={() => navigate('/login')}
                  className="btn !px-6 !py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20">
                  Iniciar sesión
                </button>
              </div>
            )}

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 mt-10 animate-slide-up [animation-delay:300ms]">
              {[
                { icon: Shield,   label: 'Vehículos verificados' },
                { icon: Gauge,    label: 'Reserva en 2 minutos' },
                { icon: MapPin,   label: 'Entrega flexible' },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2 text-white/70 text-sm">
                  <t.icon className="w-4 h-4 text-accent-400" />
                  {t.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative gradient blur */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent-500/30 blur-3xl" />
      </section>

      {/* FILTROS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="glass rounded-2xl p-4 shadow-card animate-scale-in">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                className="input !pl-10"
                placeholder="Buscar marca, modelo, color..."
                value={filtros.busqueda}
                onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
              />
            </div>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
              <select className="input !pl-10 !pr-10 appearance-none cursor-pointer min-w-[180px]"
                value={filtros.categoria_id}
                onChange={(e) => setFiltros({ ...filtros, categoria_id: e.target.value })}>
                <option value="">Todas las categorías</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <input
              className="input max-w-[180px]"
              type="number"
              placeholder="Precio máx/día ($)"
              value={filtros.precioMax}
              onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
            />
            {hayFiltros && (
              <button onClick={() => setFiltros({ categoria_id: '', precioMax: '', busqueda: '' })}
                className="btn-ghost text-accent-600 hover:text-accent-700 hover:bg-accent-50">
                <X className="w-4 h-4" /> Limpiar
              </button>
            )}
            <div className="ml-auto flex items-center gap-2 text-sm text-ink-500">
              <Filter className="w-4 h-4" />
              <span className="font-semibold text-ink-700">{disponibles}</span> disponible{disponibles !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-red-100">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <X className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-ink-900 mb-1">No se pudo conectar con el servidor</h3>
            <p className="text-sm text-ink-500 mb-2">{error}</p>
            <p className="text-xs text-ink-400">Verifica que el servidor Laravel esté corriendo en <code className="bg-ink-100 px-1 rounded">http://localhost:8000</code></p>
          </div>
        ) : vehiculosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-ink-100">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-ink-100 flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-ink-400" />
            </div>
            <h3 className="text-lg font-semibold text-ink-900 mb-1">No encontramos vehículos</h3>
            <p className="text-sm text-ink-500">Prueba ajustando los filtros o limpiándolos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {vehiculosFiltrados.map((v) => {
              const fotos = v.imagenes?.length ? v.imagenes : (v.imagen ? [v.imagen] : []);
              const disponible = v.estado === 'disponible';
              return (
                <article key={v.id} className="card-hover overflow-hidden group">
                  <div className="relative">
                    <ImageSlider imagenes={fotos} alt={`${v.marca} ${v.modelo}`} />
                    <div className="absolute top-3 left-3">
                      <span className={estadoStyles[v.estado] + ' shadow-sm capitalize'}>
                        <span className={`w-1.5 h-1.5 rounded-full ${disponible ? 'bg-emerald-500' : 'bg-current'}`} />
                        {v.estado}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <h3 className="font-display font-bold text-lg text-ink-900 truncate">{v.marca} {v.modelo}</h3>
                        <p className="text-sm text-ink-500">{v.anio} · {v.color}</p>
                      </div>
                      {v.categoria?.nombre && (
                        <span className="badge-brand whitespace-nowrap">{v.categoria.nombre}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-ink-500 mb-4 pb-4 border-b border-ink-100">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {v.anio}
                      </span>
                      <span>·</span>
                      <span>Placa {v.placa}</span>
                    </div>

                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <div className="text-2xl font-display font-extrabold text-ink-900 leading-none">
                          ${parseFloat(v.precio_dia).toFixed(2)}
                        </div>
                        <div className="text-xs text-ink-400 mt-0.5">por día</div>
                      </div>
                      <button
                        disabled={!disponible}
                        onClick={() => handleAlquilar(v)}
                        className={disponible
                          ? 'btn-accent !rounded-xl !px-5'
                          : 'btn !rounded-xl !px-5 bg-ink-100 text-ink-400 cursor-not-allowed'
                        }
                      >
                        {disponible ? (user ? 'Alquilar' : 'Reservar') : 'No disponible'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[16/10] bg-gradient-to-r from-ink-100 via-ink-200 to-ink-100 bg-[length:200%_100%] animate-shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-ink-100 rounded w-2/3 animate-shimmer bg-gradient-to-r from-ink-100 via-ink-200 to-ink-100 bg-[length:200%_100%]" />
        <div className="h-4 bg-ink-100 rounded w-1/3 animate-shimmer bg-gradient-to-r from-ink-100 via-ink-200 to-ink-100 bg-[length:200%_100%]" />
        <div className="h-10 bg-ink-100 rounded-xl mt-4 animate-shimmer bg-gradient-to-r from-ink-100 via-ink-200 to-ink-100 bg-[length:200%_100%]" />
      </div>
    </div>
  );
}
