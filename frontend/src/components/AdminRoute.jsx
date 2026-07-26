import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Deja pasar sólo a un admin logueado; el resto va a Home.
export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
