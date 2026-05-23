import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';

// Páginas públicas
import Inicio   from './pages/Inicio';
import Login    from './pages/Login';
import Registro from './pages/Registro';

// Páginas de cliente
import AlquilarVehiculo from './pages/AlquilarVehiculo';
import MisAlquileres    from './pages/MisAlquileres';
import Notificaciones   from './pages/Notificaciones';

// Páginas de admin/empleado
import Alquileres     from './pages/Alquileres';
import Categorias     from './pages/Categorias';
import Dashboard      from './pages/Dashboard';
import Mantenimientos from './pages/Mantenimientos';
import Pagos          from './pages/Pagos';
import AdminLogin     from './pages/admin/AdminLogin';
import ClientesAdmin  from './pages/admin/ClientesAdmin';
import Usuarios       from './pages/admin/Usuarios';
import VehiculosAdmin from './pages/admin/VehiculosAdmin';

function SoloCliente({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Cargando />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.rol !== 'cliente') return <Navigate to="/" replace />;
  return children;
}

function SoloAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Cargando />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.rol === 'cliente') return <Navigate to="/" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

function Cargando() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50">
      <div className="text-ink-500 text-sm">Cargando...</div>
    </div>
  );
}

function PublicLayout({ children }) {
  const location = useLocation();
  // El Navbar público no se muestra en login/registro (full-screen) ni en admin (tiene sidebar propio)
  const noNavbar = ['/login', '/registro'].includes(location.pathname)
    || location.pathname.startsWith('/admin');
  return (
    <>
      {!noNavbar && <Navbar />}
      {children}
    </>
  );
}

function AppRoutes() {
  return (
    <PublicLayout>
      <Routes>
        {/* Públicas */}
        <Route path="/"         element={<Inicio />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Cliente */}
        <Route path="/alquilar/:id"    element={<SoloCliente><AlquilarVehiculo /></SoloCliente>} />
        <Route path="/mis-alquileres"  element={<SoloCliente><MisAlquileres /></SoloCliente>} />
        <Route path="/notificaciones"  element={<SoloCliente><Notificaciones /></SoloCliente>} />

        {/* Admin / Empleado */}
        <Route path="/admin/login"          element={<AdminLogin />} />
        <Route path="/admin"                element={<SoloAdmin><Dashboard /></SoloAdmin>} />
        <Route path="/admin/vehiculos"      element={<SoloAdmin><VehiculosAdmin /></SoloAdmin>} />
        <Route path="/admin/clientes"       element={<SoloAdmin><ClientesAdmin /></SoloAdmin>} />
        <Route path="/admin/alquileres"     element={<SoloAdmin><Alquileres /></SoloAdmin>} />
        <Route path="/admin/pagos"          element={<SoloAdmin><Pagos /></SoloAdmin>} />
        <Route path="/admin/mantenimientos" element={<SoloAdmin><Mantenimientos /></SoloAdmin>} />
        <Route path="/admin/categorias"     element={<SoloAdmin><Categorias /></SoloAdmin>} />
        <Route path="/admin/usuarios"       element={<SoloAdmin><Usuarios /></SoloAdmin>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PublicLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
