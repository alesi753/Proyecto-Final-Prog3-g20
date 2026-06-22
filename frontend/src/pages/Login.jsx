import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

// Combined login / register screen. The backend register returns a token and
// auto-logs-in, so both modes land the user authenticated and bounce back to
// wherever they came from (the cart, when triggered by BUY).
export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const isRegister = mode === 'register';
  const { login, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? '/';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  async function onSubmit(values) {
    try {
      if (isRegister) {
        await registerUser({
          nombre: values.nombre,
          apellido: values.apellido,
          correo: values.correo,
          password: values.password,
        });
        toast.success('Cuenta creada. ¡Bienvenido!');
      } else {
        await login(values.correo, values.password);
        toast.success('Sesión iniciada.');
      }
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'No se pudo completar la operación.');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>{isRegister ? 'Crear cuenta' : 'Ingresar'}</p>
        <h1 className={styles.title}>{isRegister ? 'Registrate' : 'Iniciá sesión'}</h1>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          {isRegister && (
            <div className={styles.row}>
              <label className={styles.field}>
                <span className={styles.label}>Nombre</span>
                <input className={styles.input} {...register('nombre', { required: true })} />
                {errors.nombre && <span className={styles.error}>Requerido</span>}
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Apellido</span>
                <input className={styles.input} {...register('apellido', { required: true })} />
                {errors.apellido && <span className={styles.error}>Requerido</span>}
              </label>
            </div>
          )}

          <label className={styles.field}>
            <span className={styles.label}>Correo</span>
            <input
              className={styles.input}
              type="email"
              autoComplete="email"
              {...register('correo', { required: true })}
            />
            {errors.correo && <span className={styles.error}>Requerido</span>}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Contraseña</span>
            <input
              className={styles.input}
              type="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              {...register('password', { required: true, minLength: 6 })}
            />
            {errors.password && <span className={styles.error}>Mínimo 6 caracteres</span>}
          </label>

          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Procesando…' : isRegister ? 'Crear cuenta' : 'Ingresar'}
          </button>
        </form>

        <p className={styles.switch}>
          {isRegister ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}{' '}
          <button
            type="button"
            className={styles.switchBtn}
            onClick={() => setMode(isRegister ? 'login' : 'register')}
          >
            {isRegister ? 'Ingresá' : 'Registrate'}
          </button>
        </p>

        <Link to="/" className={styles.back}>← Volver al inicio</Link>
      </div>
    </div>
  );
}
