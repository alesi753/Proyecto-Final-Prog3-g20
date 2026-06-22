import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const LINKS = [
  { to: '/builder', label: 'Armá tu PC!' },
  { to: '/productos', label: 'Productos' },
  { to: '/carrito', label: 'Carrito' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  function handleLogout() {
    logout();
    toast.success('Sesión cerrada.');
    navigate('/');
  }

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        <span className={styles.brandMark}>PC</span>
        <span className={styles.brandName}>[BUILD IT]</span>
      </Link>

      <nav className={styles.nav}>
        {LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`${styles.link} ${pathname === to ? styles.linkActive : ''}`}
          >
            {label}
          </Link>
        ))}

        {isAuthenticated ? (
          <div className={styles.authArea}>
            <span className={styles.user}>Hola, {user.nombre}</span>
            <button className={styles.logout} onClick={handleLogout}>Salir</button>
          </div>
        ) : (
          <Link
            to="/login"
            className={`${styles.link} ${pathname === '/login' ? styles.linkActive : ''}`}
          >
            Ingresar
          </Link>
        )}
      </nav>
    </header>
  );
}
