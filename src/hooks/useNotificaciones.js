import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SEEN_KEY = 'notif_vistas';
const POLL_MS  = 20000;

function getVistas() {
  try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch { return []; }
}

export function useNotificaciones() {
  const { user } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [sinVer, setSinVer]                 = useState(0);
  const intervalRef                         = useRef(null);

  const fetchNotifs = (clienteId) => {
    api.get(`/mis-alquileres?cliente_id=${clienteId}`).then(r => {
      const notifs = r.data
        .filter(a => a.estado === 'activo' || a.estado === 'cancelado')
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      setNotificaciones(notifs);
      const vistas = getVistas();
      setSinVer(notifs.filter(n => !vistas.includes(n.id)).length);
    }).catch(() => {});
  };

  useEffect(() => {
    if (user?.rol !== 'cliente' || !user?.cliente?.id) return;
    const id = user.cliente.id;
    fetchNotifs(id);
    intervalRef.current = setInterval(() => fetchNotifs(id), POLL_MS);
    return () => clearInterval(intervalRef.current);
  }, [user]);

  const marcarVistas = () => {
    localStorage.setItem(SEEN_KEY, JSON.stringify(notificaciones.map(n => n.id)));
    setSinVer(0);
  };

  return { notificaciones, sinVer, marcarVistas };
}
